import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import SectionHeading from "./SectionHeading";

export interface QuickAction {
  label: string;
  href: string;
  Icon: LucideIcon;
}

/** Shortcuts to the admin list pages, laid out as a two-column card grid. */
const QuickActions = ({ actions }: { actions: QuickAction[] }) => (
  <div className="min-w-0">
    <SectionHeading title="Quick actions" />
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
      {/* Always two columns with the label under the icon, so the text gets
          the full tile width instead of being clipped to an ellipsis. */}
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ label, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex min-w-0 flex-col items-start gap-1.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-sm"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <Icon size={15} aria-hidden />
            </span>
            <span className="text-[12px] font-medium leading-tight text-slate-700 transition group-hover:text-blue-700">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default QuickActions;
