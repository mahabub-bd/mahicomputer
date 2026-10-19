import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface QuickAction {
  label: string;
  href: string;
  Icon: LucideIcon;
}

/** Compact row-style shortcuts to the admin list pages. */
const QuickActions = ({ actions }: { actions: QuickAction[] }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
    <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
      Quick actions
    </h2>
    <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
      {actions.map(({ label, href, Icon }) => (
        <Link
          key={label}
          href={href}
          className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-blue-200 hover:bg-slate-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <Icon size={16} />
          </span>
          <span className="min-w-0 truncate text-[13px] font-medium text-slate-700 transition group-hover:text-blue-700">
            {label}
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default QuickActions;
