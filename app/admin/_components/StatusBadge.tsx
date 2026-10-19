interface StatusBadgeProps {
  published: boolean;
  onLabel?: string;
  offLabel?: string;
}

/** Published/Hidden status pill with a status dot — used in detail-page headers. */
const StatusBadge = ({
  published,
  onLabel = "Published",
  offLabel = "Hidden",
}: StatusBadgeProps) =>
  published ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
      {onLabel}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden />
      {offLabel}
    </span>
  );

export default StatusBadge;
