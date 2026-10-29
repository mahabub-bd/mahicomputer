import { prisma } from "@/lib/prisma";
import { SITE_TIME_ZONE } from "@/lib/site";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { btnIcon } from "@/components/form/buttonStyles";
import PageHeader from "../../_components/PageHeader";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ entity?: string; page?: string }> };

const PAGE_SIZE = 20;

const ACTION_BADGE: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  UPDATE: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  DELETE: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const pagerBtnCls =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-[13px] font-semibold text-slate-600 transition duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900";
const pagerActiveCls =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-2 text-[13px] font-semibold text-white";
const pagerDisabledCls =
  "inline-flex h-8 min-w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-100 bg-slate-50 px-2 text-[13px] font-semibold text-slate-300";

/**
 * Page numbers to render: first, last and a window around the current page,
 * with `"gap"` standing in for the skipped ranges.
 */
const pageItems = (current: number, total: number): (number | "gap")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  const items: (number | "gap")[] = [1];
  if (start > 2) items.push("gap");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("gap");
  items.push(total);
  return items;
};

/** Arrow button that degrades to a disabled glyph at either end of the range. */
const PagerArrow = ({
  href,
  label,
  disabled,
  children,
}: {
  href: string;
  label: string;
  disabled: boolean;
  children: React.ReactNode;
}) =>
  disabled ? (
    <span className={pagerDisabledCls} aria-hidden="true">
      {children}
    </span>
  ) : (
    <Link href={href} aria-label={label} className={pagerBtnCls}>
      {children}
    </Link>
  );

const AuditLogPage = async ({ searchParams }: Props) => {
  const { entity: entityFilter, page: pageParam } = await searchParams;
  const entity = entityFilter ?? "ALL";

  // Count first so an out-of-range `?page=` (deep link, or a filter that shrank
  // the result set) is clamped instead of rendering an empty table.
  const where = entity === "ALL" ? {} : { entity };
  const total = await prisma.auditLog.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    include: { user: { select: { name: true, email: true } } },
  });

  /** Keeps the active entity filter when moving between pages. */
  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (entity !== "ALL") params.set("entity", entity);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/admin/audit-log?${qs}` : "/admin/audit-log";
  };
  const firstRow = (page - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(page * PAGE_SIZE, total);

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
                <th className="w-32 px-4 py-2.5 font-semibold">Serial</th>
                <th className="px-4 py-2.5 font-semibold">When</th>
                <th className="px-4 py-2.5 font-semibold">Admin</th>
                <th className="px-4 py-2.5 font-semibold">Action</th>
                <th className="px-4 py-2.5 font-semibold">What changed</th>
                <th className="px-4 py-2.5 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => {
                const badge = ACTION_BADGE[log.action] ?? "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
                return (
                  <tr key={log.id} className="align-top transition-colors hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[13px] tabular-nums text-slate-500">
                      {log.serial}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
                      {new Date(log.createdAt).toLocaleString("en-GB", {
                        timeZone: SITE_TIME_ZONE,
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
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/audit-log/${log.id}`}
                          title="View details"
                          aria-label={`View details — ${log.summary || log.entity}`}
                          className={btnIcon("secondary")}
                        >
                          <Eye size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {firstRow}–{lastRow}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{total}</span> entries
          </p>

          {totalPages > 1 && (
            <nav
              aria-label="Audit log pagination"
              className="flex flex-wrap items-center justify-center gap-1"
            >
              <PagerArrow href={pageHref(page - 1)} label="Previous page" disabled={page === 1}>
                <ChevronLeft size={15} />
              </PagerArrow>

              {pageItems(page, totalPages).map((item, index) =>
                item === "gap" ? (
                  <span
                    key={`gap-${index}`}
                    aria-hidden="true"
                    className="px-1 text-xs text-slate-400"
                  >
                    …
                  </span>
                ) : item === page ? (
                  <span key={item} aria-current="page" className={pagerActiveCls}>
                    {item}
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={pageHref(item)}
                    aria-label={`Page ${item}`}
                    className={pagerBtnCls}
                  >
                    {item}
                  </Link>
                ),
              )}

              <PagerArrow
                href={pageHref(page + 1)}
                label="Next page"
                disabled={page === totalPages}
              >
                <ChevronRight size={15} />
              </PagerArrow>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
