import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  /** Optional secondary line, e.g. how to create the first item. */
  description?: string;
  /** Optional CTA (button/link) rendered under the text. */
  action?: ReactNode;
  /** Extra classes for the outer card, e.g. `md:col-span-2` inside a grid. */
  className?: string;
}

/** Shared empty-state card used by every admin list when it has no rows. */
const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) => (
  <div
    className={`rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-10 text-center ${className}`}
  >
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
      <Icon className="h-6 w-6 text-slate-400" aria-hidden />
    </span>
    <p className="mt-3 text-sm font-medium text-slate-600">{title}</p>
    {description && (
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
