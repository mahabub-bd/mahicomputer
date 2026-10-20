import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface QuickAction {
  label: string;
  href: string;
  Icon: LucideIcon;
}

/** Shortcuts to the admin list pages, laid out as a two-column card grid. */
const QuickActions = ({ actions }: { actions: QuickAction[] }) => (
  <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
    <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
      Quick actions
    </h2>
    {/* Always two columns. The label sits under the icon so it gets the
        full card width — as a side-by-side row it was clipped to an
        ellipsis inside the narrow right rail. */}
    <div className="mt-3 grid grid-cols-2 gap-2">
      {actions.map(({ label, href, Icon }) => (
        <Link
          key={label}
          href={href}
          className="group flex min-w-0 flex-col items-start gap-2 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-sm"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <Icon size={16} />
          </span>
          <span className="text-[13px] font-medium leading-tight text-slate-700 transition group-hover:text-blue-700">
            {label}
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default QuickActions;
