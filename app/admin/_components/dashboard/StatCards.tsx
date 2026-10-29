import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface StatCard {
  label: string;
  value: number;
  hint: string;
  href: string;
  Icon: LucideIcon;
}

/* Icon tile colors, cycled across the cards so the row doesn't read as
   eight identical blue squares. */
const tones = [
  "bg-blue-50 text-blue-600",
  "bg-emerald-50 text-emerald-600",
  "bg-violet-50 text-violet-600",
  "bg-amber-50 text-amber-600",
  "bg-sky-50 text-sky-600",
  "bg-rose-50 text-rose-600",
  "bg-indigo-50 text-indigo-600",
  "bg-teal-50 text-teal-600",
];

/**
 * Inventory counters as KPI tiles: label and value lead, the icon sits in the
 * top-right corner and the hint closes the card. 2 per row on phones, 3 on
 * tablets, 4 from lg up (4 columns at sm squeezed the label into an ellipsis
 * once the sidebar took its width).
 */
const StatCards = ({ cards }: { cards: StatCard[] }) => (
  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
    {cards.map(({ label, value, hint, href, Icon }, i) => (
      <Link
        key={label}
        href={href}
        className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              title={label}
              className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              {label}
            </p>
            <p className="mt-1.5 text-2xl font-bold leading-none tabular-nums text-slate-900">
              {value}
            </p>
          </div>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition duration-200 group-hover:scale-105 ${
              tones[i % tones.length]
            }`}
          >
            <Icon size={17} aria-hidden />
          </span>
        </div>
        <p
          title={hint}
          className="mt-3 truncate text-xs text-slate-400 transition group-hover:text-blue-600"
        >
          {hint}
        </p>
      </Link>
    ))}
  </div>
);

export default StatCards;
