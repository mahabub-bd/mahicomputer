import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageHeader from "../../_components/PageHeader";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ entity?: string; page?: string }> };

const PAGE_SIZE = 50;

const ACTION_BADGE: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  UPDATE: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  DELETE: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const AuditLogPage = async ({ searchParams }: Props) => {
  const { entity: entityFilter, page: pageParam } = await searchParams;
  const entity = entityFilter ?? "ALL";
  const page = Math.max(1, Number(pageParam) || 1);

  const where = entity === "ALL" ? {} : { entity };
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const entities = [
    "ALL",
    "Enrollment",
    "Payment",
    "User",
    "SiteSetting",
    "BusinessSetting",
    "Course",
    "Category",
    "Batch",
    "BatchStudent",
    "ClassSession",
    "Attendance",
    "Blog post",
    "Notice",
    "Newsletter issue",
    "FAQ",
    "Instructor",
    "Review",
    "Gallery item",
    "Partner",
    "Social link",
    "Nav link",
    "FooterLinkGroup",
    "ContactMessage",
    "Subscriber",
    "Upload",
  ];

  return (
    <div>
      <PageHeader title="Audit log" description={`${total} recorded admin actions`} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {entities.map((e) => (
          <Link
            key={e}
            href={e === "ALL" ? "/admin/audit-log" : `/admin/audit-log?entity=${e}`}
            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[13px] font-semibold transition duration-150 ${
              entity === e
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {e === "ALL" ? "All" : e}
          </Link>
        ))}
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-slate-500">No audit entries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-2.5 font-semibold">When</th>
                <th className="px-4 py-2.5 font-semibold">Admin</th>
                <th className="px-4 py-2.5 font-semibold">Action</th>
                <th className="px-4 py-2.5 font-semibold">What changed</th>
                <th className="px-4 py-2.5 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => {
                const badge = ACTION_BADGE[log.action] ?? "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
                return (
                  <tr key={log.id} className="align-top transition-colors hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
                      {new Date(log.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                      {log.user?.name ?? "Unknown"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge}`}
                      >
                        {log.action}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">{log.entity}</span>
                    </td>
                    <td className="min-w-0 px-4 py-2.5 font-medium text-slate-800">
                      <Link href={`/admin/audit-log/${log.id}`} className="hover:text-blue-600">
                        {log.summary || "—"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right">
                      <Link
                        href={`/admin/audit-log/${log.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          {page > 1 && (
            <Link
              href={`/admin/audit-log?page=${page - 1}${entity !== "ALL" ? `&entity=${entity}` : ""}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Previous
            </Link>
          )}
          <span className="text-xs text-slate-400">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/admin/audit-log?page=${page + 1}${entity !== "ALL" ? `&entity=${entity}` : ""}`}>
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
