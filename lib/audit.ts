import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SITE_TIME_ZONE } from "@/lib/site";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

/** Best-effort human label for an audited row (title, name, question, email…). */
export function auditLabel(row: unknown): string {
  const r = row as Record<string, unknown> | null;
  if (!r) return "";
  const value = r.title ?? r.name ?? r.question ?? r.alt ?? r.link ?? r.email;
  return typeof value === "string" && value !== "" ? value : String(r.id ?? "");
}

/** Keys whose values must never reach the audit trail. */
const SECRET_KEY = /^(password|passwordhash|token|secret|apikey|accesstoken|refreshtoken)$/i;
const REDACTED = "••••••";

/**
 * Turns a Prisma row into a JSON-safe snapshot for an audit entry: `Date`s
 * become ISO strings, `undefined`/functions are dropped and secrets are
 * redacted. Returns `null` when there is nothing to store.
 */
export function auditSnapshot(value: unknown): object | null {
  if (value === null || value === undefined) return null;
  const json = JSON.stringify(value, (key, v) => {
    if (typeof v === "bigint") return v.toString();
    if (typeof v === "function") return undefined;
    if (key !== "" && SECRET_KEY.test(key)) return REDACTED;
    return v;
  });
  if (json === undefined) return null;
  const snapshot = JSON.parse(json) as unknown;
  return snapshot === null ? null : (snapshot as object);
}

/** Columns that always differ on an update and would only add noise. */
const IGNORED_FIELDS = new Set(["id", "createdAt", "updatedAt"]);

export interface AuditFieldChange {
  field: string;
  before: unknown;
  after: unknown;
  changed: boolean;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** True when both snapshots are plain objects and can be compared field by field. */
export function isComparableSnapshot(before: unknown, after: unknown): boolean {
  return asRecord(before) !== null && asRecord(after) !== null;
}

/**
 * Field-level comparison of two snapshots. Changed fields come first, then the
 * untouched ones alphabetically, so the detail page leads with what matters.
 */
export function diffSnapshots(before: unknown, after: unknown): AuditFieldChange[] {
  const b = asRecord(before) ?? {};
  const a = asRecord(after) ?? {};
  const fields = [...new Set([...Object.keys(b), ...Object.keys(a)])].filter(
    (field) => !IGNORED_FIELDS.has(field),
  );

  return fields
    .map((field) => {
      const beforeValue = b[field] ?? null;
      const afterValue = a[field] ?? null;
      return {
        field,
        before: beforeValue,
        after: afterValue,
        changed: JSON.stringify(beforeValue) !== JSON.stringify(afterValue),
      };
    })
    .sort((x, y) => Number(y.changed) - Number(x.changed) || x.field.localeCompare(y.field));
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/** Human-readable rendering of one snapshot value for the audit detail page. */
export function formatAuditValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") {
    if (value === "") return "(empty)";
    if (ISO_DATE.test(value)) {
      return new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return value;
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  return JSON.stringify(value, null, 2);
}

/** Pretty JSON for snapshots that cannot be compared field by field. */
export function formatAuditJson(value: unknown): string {
  if (value === null || value === undefined) return "—";
  return JSON.stringify(value, null, 2);
}

/** Digits appended after the date: 20261029 + 001. */
const SERIAL_SEQ_DIGITS = 3;

/** `YYYYMMDD` for the business day the entry belongs to (host-timezone independent). */
export function auditDayKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return parts.replace(/\D/g, "");
}

/**
 * Next free serial: `YYYYMMDD` + the entry's place in that business day
 * (e.g. 20261029001). Probes forward past numbers already taken, so removing a
 * row can never wedge the sequence on a duplicate.
 */
export async function nextAuditSerial(now: Date = new Date()): Promise<string> {
  const day = auditDayKey(now);
  const used = await prisma.auditLog.count({ where: { serial: { startsWith: day } } });
  let seq = used + 1;
  for (;;) {
    const candidate = `${day}${String(seq).padStart(SERIAL_SEQ_DIGITS, "0")}`;
    const taken = await prisma.auditLog.findUnique({
      where: { serial: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
    seq += 1;
  }
}

/** Prisma's unique-constraint violation (auditLog.serial raced another write). */
const isUniqueViolation = (error: unknown): boolean =>
  typeof error === "object" && error !== null && "code" in error && error.code === "P2002";

interface AuditInput {
  action: AuditAction;
  /** Entity name, e.g. "Enrollment" | "Payment" | "Batch" | "BusinessSetting". */
  entity: string;
  entityId?: string;
  /** Human-readable one-liner shown in the log, e.g. "Approved admission — Rahim". */
  summary: string;
  /** Row before the change (UPDATE / DELETE). */
  oldValue?: unknown;
  /** Row after the change (CREATE / UPDATE). */
  newValue?: unknown;
  /** Small structured payload, kept for entries written before snapshots existed. */
  detail?: unknown;
}

/**
 * Records one admin action. Resolves the acting admin from the session cookie
 * and never throws — a logging failure must not fail the request itself.
 */
export async function logAudit({
  action,
  entity,
  entityId = "",
  summary,
  oldValue,
  newValue,
  detail,
}: AuditInput): Promise<void> {
  try {
    const session = await getSession();
    const before = auditSnapshot(oldValue);
    const after = auditSnapshot(newValue);
    const extra = auditSnapshot(detail);
    // Two admins acting in the same instant can pick the same serial; the unique
    // index rejects the loser and the retry simply takes the next free number.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await prisma.auditLog.create({
          data: {
            serial: await nextAuditSerial(),
            userId: session?.sub ?? null,
            action,
            entity,
            entityId,
            summary,
            ...(before ? { oldValue: before } : {}),
            ...(after ? { newValue: after } : {}),
            ...(extra ? { detail: extra } : {}),
          },
        });
        return;
      } catch (error) {
        if (attempt === 2 || !isUniqueViolation(error)) throw error;
      }
    }
  } catch {
    // Swallow: audit logging is best-effort.
  }
}
