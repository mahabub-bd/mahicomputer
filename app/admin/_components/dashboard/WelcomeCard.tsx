import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";

interface WelcomeCardProps {
  adminName: string;
  today: string;
  heroTitle?: string;
}

/** Dark greeting banner: admin name, today's date and a link to the live site. */
const WelcomeCard = ({ adminName, today, heroTitle }: WelcomeCardProps) => (
  <div className="mb-6 overflow-hidden rounded-xl bg-slate-900 p-6 text-slate-100 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm text-slate-400">Welcome back,</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">{adminName}</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <Calendar size={15} />
          {today}
        </p>
      </div>
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
      >
        <ExternalLink size={15} />
        View site
      </Link>
    </div>
    {heroTitle && (
      <p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
        {heroTitle}
      </p>
    )}
  </div>
);

export default WelcomeCard;
