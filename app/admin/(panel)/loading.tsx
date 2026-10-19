/** Instant navigation feedback — shown while the page's server component and DB queries run. */
export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <span
        aria-label="Loading"
        className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-300 border-t-blue-600"
      />
    </div>
  );
}
