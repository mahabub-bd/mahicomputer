import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";

interface WelcomeCardProps {
  adminName: string;
  today: string;
  heroTitle?: string;
}

/** Dark gradient greeting banner: admin name, today's date and a link to the live site. */
const WelcomeCard = ({ adminName, today, heroTitle }: WelcomeCardProps) => (
  <div className="relative mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-blue-900 p-6 text-slate-100 shadow-sm">
    {/* Decorative glow */}
    <div
      aria-hidden
      className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-28 left-1/3 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl"
    />

    <div className="relative flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-[13px] font-medium uppercase tracking-wider text-blue-200/80">
          Welcome back
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-[28px]">{adminName}</h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-slate-200">
          <Calendar size={13} className="text-blue-200" />
          {today}
        </p>
      </div>
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/20"
      >
        <ExternalLink size={15} />
        View site
      </Link>
    </div>
    {heroTitle && (
      <p className="relative mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
        {heroTitle}
      </p>
    )}
  </div>
);

export default WelcomeCard;
