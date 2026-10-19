import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface StatCard {
  label: string;
  value: number;
  hint: string;
  href: string;
  Icon: LucideIcon;
}

export interface SecondaryStat {
  label: string;
  value: number;
  Icon: LucideIcon;
  tone: string;
}

interface StatCardsProps {
  cards: StatCard[];
  stats: SecondaryStat[];
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

/** Primary count cards (link to their admin page) + the secondary stats strip. */
const StatCards = ({ cards, stats }: StatCardsProps) => (
  <>
    {/* Primary stats — 2 per row on mobile, 4 from sm up */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {cards.map(({ label, value, hint, href, Icon }, i) => (
        <Link
          key={label}
          href={href}
          className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-5 sm:gap-4"
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition sm:h-12 sm:w-12 ${
              tones[i % tones.length]
            }`}
          >
            <Icon size={21} />
          </span>
          <span className="min-w-0">
            <span className="block text-xl font-bold leading-6 text-slate-900 sm:text-2xl">
              {value}
            </span>
            <span className="mt-0.5 block truncate text-[13px] font-medium text-slate-500">
              {label}
            </span>
            <span className="mt-0.5 block truncate text-xs text-slate-400 transition group-hover:text-blue-600">
              {hint}
            </span>
          </span>
        </Link>
      ))}
    </div>

    {/* Secondary stats — 2 per row on mobile */}
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map(({ label, value, Icon, tone }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-4 py-3"
        >
          <Icon size={17} className={`shrink-0 ${tone}`} />
          <span className="truncate text-[13px] text-slate-500">{label}</span>
          <span className="ml-auto text-sm font-bold text-slate-900">{value}</span>
        </div>
      ))}
    </div>
  </>
);

export default StatCards;
