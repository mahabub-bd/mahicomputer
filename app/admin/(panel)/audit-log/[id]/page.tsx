import {
  diffSnapshots,
  formatAuditJson,
  formatAuditValue,
  isComparableSnapshot,
} from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { SITE_TIME_ZONE } from "@/lib/site";
import { notFound } from "next/navigation";
import PageHeader from "../../../_components/PageHeader";
import SectionCard from "../../../_components/SectionCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const ACTION_BADGE: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  UPDATE: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  DELETE: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const formatWhen = (date: Date) =>
  new Date(date).toLocaleString("en-GB", {
    timeZone: SITE_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const Value = ({ value }: { value: unknown }) => {
  const text = formatAuditValue(value);
  return (
    <span className="block max-h-60 overflow-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-5">
      {text}
    </span>
  );
};

const AuditLogDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const log = await prisma.auditLog.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!log) notFound();

  const badge = ACTION_BADGE[log.action] ?? "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
  const comparable = isComparableSnapshot(log.oldValue, log.newValue);
  const changes = comparable ? diffSnapshots(log.oldValue, log.newValue) : [];
  const changedCount = changes.filter((c) => c.changed).length;

  const meta: { label: string; value: string }[] = [
    { label: "Serial", value: log.serial },
    { label: "When", value: formatWhen(log.createdAt) },
    { label: "Admin", value: log.user?.name ?? "Unknown" },
    { label: "Admin email", value: log.user?.email ?? "—" },
    { label: "Entity", value: log.entity },
    { label: "Entity ID", value: log.entityId || "—" },
    { label: "Entry ID", value: log.id },
  ];

  return (
    <div>
      <PageHeader
        title="Audit entry"
        badge={
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge}`}
          >
            {log.action}
          </span>
        }
        description={log.summary || "No summary recorded"}
        backHref="/admin/audit-log"
        backLabel="Back to audit log"
      />

      <div className="space-y-6">
        <SectionCard title="Entry">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {meta.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {item.label}
                </dt>
                <dd className="mt-0.5 break-words text-sm font-medium text-slate-800">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </SectionCard>

        {comparable ? (
          <SectionCard
            title="Changes"
            meta={
              changedCount === 0
                ? "(no field differences recorded)"
                : `(${changedCount} of ${changes.length} fields)`
            }
          >
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-2.5 font-semibold">Field</th>
                    <th className="px-4 py-2.5 font-semibold">Old value</th>
                    <th className="px-4 py-2.5 font-semibold">New value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {changes.map((change) => (
                    <tr
                      key={change.field}
                      className={change.changed ? "bg-amber-50/50" : "text-slate-500"}
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 align-top">
                        <span
                          className={
                            change.changed
                              ? "font-semibold text-slate-900"
                              : "font-medium text-slate-500"
                          }
                        >
                          {change.field}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 align-top text-slate-600">
                        <Value value={change.before} />
                      </td>
                      <td
                        className={`px-4 py-2.5 align-top ${
                          change.changed ? "text-slate-900" : "text-slate-600"
                        }`}
                      >
                        <Value value={change.after} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {log.oldValue !== null && log.oldValue !== undefined && (
              <SectionCard title={log.action === "DELETE" ? "Deleted values" : "Old value"}>
                <pre className="max-h-96 overflow-auto rounded-lg bg-slate-50 p-3 font-mono text-[12px] leading-5 text-slate-700">
                  {formatAuditJson(log.oldValue)}
                </pre>
              </SectionCard>
            )}
            {log.newValue !== null && log.newValue !== undefined && (
              <SectionCard title={log.action === "CREATE" ? "Created values" : "New value"}>
                <pre className="max-h-96 overflow-auto rounded-lg bg-slate-50 p-3 font-mono text-[12px] leading-5 text-slate-700">
                  {formatAuditJson(log.newValue)}
                </pre>
              </SectionCard>
            )}
          </div>
        )}

        {log.oldValue === null && log.newValue === null && (
          <SectionCard title="Values">
            <p className="text-sm text-slate-500">
              This entry was recorded before value snapshots were captured, so no old/new values
              are available.
            </p>
          </SectionCard>
        )}

        {log.detail !== null && log.detail !== undefined && (
          <SectionCard title="Additional detail">
            <pre className="max-h-96 overflow-auto rounded-lg bg-slate-50 p-3 font-mono text-[12px] leading-5 text-slate-700">
              {formatAuditJson(log.detail)}
            </pre>
          </SectionCard>
        )}
      </div>
    </div>
  );
};

export default AuditLogDetailPage;
