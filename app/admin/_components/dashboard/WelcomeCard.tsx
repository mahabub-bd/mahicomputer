import Link from "next/link";
import { Calendar, ExternalLink, Quote, Settings } from "lucide-react";

interface WelcomeCardProps {
  adminName: string;
  today: string;
  heroTitle?: string;
}

const chip =
  "inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-slate-200";
const ghostBtn =
  "inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-100 transition duration-200 hover:border-white/30 hover:bg-white/15";

/** Dark greeting banner: admin name, date, homepage headline and a link to the live site. */
const WelcomeCard = ({ adminName, today, heroTitle }: WelcomeCardProps) => (
  <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 p-5 text-slate-100 shadow-sm sm:p-6">
    {/* Decorative glows */}
    <div
      aria-hidden
      className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-28 left-1/3 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl"
    />

    <div className="relative flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-blue-200/80">
          Welcome back
        </p>
        <h1 className="mt-1.5 truncate text-2xl font-bold text-white sm:text-[28px]">
          {adminName}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={chip}>
            <Calendar size={13} className="shrink-0 text-blue-200" aria-hidden />
            {today}
          </span>
          {heroTitle && (
            <Link
              href="/admin/settings"
              title="Edit the homepage headline"
              className={`${chip} transition hover:bg-white/20`}
            >
              <Quote size={12} className="shrink-0 text-blue-200" aria-hidden />
              <span className="truncate">{heroTitle}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/admin/settings" className={ghostBtn}>
          <Settings size={15} aria-hidden />
          Homepage
        </Link>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 transition duration-200 hover:bg-slate-100"
        >
          <ExternalLink size={15} aria-hidden />
          View site
        </Link>
      </div>
    </div>
  </div>
);

export default WelcomeCard;
