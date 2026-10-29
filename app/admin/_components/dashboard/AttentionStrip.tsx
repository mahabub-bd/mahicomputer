import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export interface AttentionItem {
  label: string;
  count: number;
  href: string;
  Icon: LucideIcon;
  /** Tinted tile classes, e.g. `border-amber-200/70 bg-amber-50/70 text-amber-900`. */
  wrap: string;
  /** Icon chip classes, e.g. `bg-amber-100 text-amber-700`. */
  chip: string;
}

/**
 * "Needs attention" strip — the counters that ask for an action rather than
 * describing inventory. Zero-count items are dropped so the row never shows
 * busy-work; when everything is clear a single calm confirmation is shown.
 */
const AttentionStrip = ({ items }: { items: AttentionItem[] }) => {
  const active = items.filter((item) => item.count > 0);

  if (active.length === 0) {
    return (
      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 size={16} className="shrink-0" aria-hidden />
        All caught up — no pending admissions, unread messages or hidden courses.
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {active.map(({ label, count, href, Icon, wrap, chip }) => (
        <Link
          key={label}
          href={href}
          className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${wrap}`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${chip}`}
          >
            <Icon size={16} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold leading-none tabular-nums">
              {count}
            </span>
            <span className="mt-1 block truncate text-xs font-medium opacity-80">
              {label}
            </span>
          </span>
          <ArrowRight
            size={15}
            className="shrink-0 opacity-50 transition duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden
          />
        </Link>
      ))}
    </div>
  );
};

export default AttentionStrip;
