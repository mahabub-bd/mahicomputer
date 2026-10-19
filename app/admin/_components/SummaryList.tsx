import type { ReactNode } from "react";

export interface SummaryItem {
  label: string;
  value: ReactNode;
}

interface SummaryListProps {
  items: SummaryItem[];
  className?: string;
}

/** Shared label/value list used in the summary column of detail pages. */
const SummaryList = ({ items, className = "" }: SummaryListProps) => (
  <dl className={`divide-y divide-slate-100 ${className}`}>
    {items.map((item) => (
      <div key={item.label} className="flex justify-between gap-3 py-2 text-sm">
        <dt className="shrink-0 text-slate-500">{item.label}</dt>
        <dd className="min-w-0 break-all text-right font-medium text-slate-900">
          {item.value}
        </dd>
      </div>
    ))}
  </dl>
);

export default SummaryList;
