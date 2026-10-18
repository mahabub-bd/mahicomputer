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

/** Primary count cards (link to their admin page) + the secondary stats strip. */
const StatCards = ({ cards, stats }: StatCardsProps) => (
  <>
    {/* Primary stats — 2 per row on mobile */}
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, hint, href, Icon }) => (
        <Link
          key={label}
          href={href}
          className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md sm:p-5 sm:gap-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
            <Icon size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-semibold text-blue-700 sm:text-2xl">{value}</span>
            <span className="block truncate text-sm text-slate-500">{label}</span>
            <span className="mt-0.5 block truncate text-xs text-slate-400">{hint}</span>
          </span>
        </Link>
      ))}
    </div>

    {/* Secondary stats — 2 per row on mobile */}
    <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, Icon, tone }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
        >
          <Icon size={18} className={tone} />
          <span className="text-sm text-slate-500">{label}</span>
          <span className="ml-auto text-sm font-semibold text-slate-900">{value}</span>
        </div>
      ))}
    </div>
  </>
);

export default StatCards;
