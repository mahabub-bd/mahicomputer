import Link from "next/link";
import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface QuickAction {
  label: string;
  href: string;
  Icon: LucideIcon;
}

/** Grid of shortcuts to the admin list pages. */
const QuickActions = ({ actions }: { actions: QuickAction[] }) => (
  <div>
    <h2 className="mb-3 text-lg font-semibold text-slate-900">Quick actions</h2>
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ label, href, Icon }) => (
        <Link
          key={label}
          href={href}
          className="flex flex-col gap-2 rounded-xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition hover:text-blue-600 hover:shadow-md"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon size={18} />
          </span>
          <span className="flex items-center gap-1">
            {label}
            <Plus size={13} className="text-slate-400" />
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default QuickActions;
