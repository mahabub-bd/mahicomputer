import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

/** Best-effort human label for an audited row (title, name, question, email…). */
export function auditLabel(row: unknown): string {
  const r = row as Record<string, unknown> | null;
  if (!r) return "";
  const value = r.title ?? r.name ?? r.question ?? r.alt ?? r.link ?? r.email;
  return typeof value === "string" && value !== "" ? value : String(r.id ?? "");
}

interface AuditInput {
  action: AuditAction;
  /** Entity name, e.g. "Enrollment" | "Payment" | "Batch" | "BatchStudent" | "ClassSession" | "Attendance". */
  entity: string;
  entityId?: string;
  /** Human-readable one-liner shown in the log, e.g. "Approved admission — Rahim". */
  summary: string;
  /** Small structured payload (changed fields, amounts…). Keep it small. */
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
  detail,
}: AuditInput): Promise<void> {
  try {
    const session = await getSession();
    await prisma.auditLog.create({
      data: {
        userId: session?.sub ?? null,
        action,
        entity,
        entityId,
        summary,
        ...(detail !== undefined ? { detail: detail as object } : {}),
      },
    });
  } catch {
    // Swallow: audit logging is best-effort.
  }
}
