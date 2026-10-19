import type { ReactNode } from "react";

interface SectionCardProps {
  /** Card heading. Omit for a plain content card. */
  title?: string;
  /** Small note rendered after the title, e.g. `(${items.length})`. */
  meta?: ReactNode;
  /** Right-side header slot, e.g. a link or button. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Shared white section card used across the admin detail pages. */
const SectionCard = ({ title, meta, action, children, className = "" }: SectionCardProps) => (
  <section className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        {title && (
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
            {meta && (
              <span className="ml-1.5 text-sm font-normal text-slate-400">
                {meta}
              </span>
            )}
          </h2>
        )}
        {action}
      </div>
    )}
    {children}
  </section>
);

export default SectionCard;
