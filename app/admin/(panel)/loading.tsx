/** Instant navigation feedback — shown while the page's server component and DB queries run. */
export default function AdminLoading() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center pt-20 lg:top-0 lg:left-72 lg:pt-8">
      <span
        aria-label="Loading"
        className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-300 border-t-blue-600"
      />
    </div>
  );
}
