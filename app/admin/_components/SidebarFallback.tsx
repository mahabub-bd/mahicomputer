import { Menu } from "lucide-react";

/** Skeleton shown while the sidebar user query streams in. Matches the sidebar geometry to avoid layout shift. */
export default function SidebarFallback() {
  return (
    <>
      {/* Mobile top bar — static, no user data needed */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 bg-slate-900 px-4 py-3 text-slate-100 lg:hidden">
        <span className="rounded-md p-1.5">
          <Menu size={22} />
        </span>
        <span className="h-8 w-8 animate-pulse rounded-md bg-slate-700" />
        <p className="text-base font-semibold">Admin Panel</p>
      </div>

      {/* Desktop sidebar skeleton — width matches the real sidebar so the
          page content doesn't shift when the user query resolves. */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col bg-slate-900 p-3 lg:block lg:w-56 xl:w-72">
        <div className="mb-4 flex items-center gap-3 border-b border-slate-700 px-3 py-4">
          <span className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-slate-700 lg:h-10 lg:w-10 xl:h-11 xl:w-11" />
          <span className="flex-1 space-y-2">
            <span className="block h-4 w-32 animate-pulse rounded bg-slate-700" />
            <span className="block h-3 w-20 animate-pulse rounded bg-slate-800" />
          </span>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="block h-7 animate-pulse rounded-md bg-slate-800" />
          ))}
        </div>
      </aside>
    </>
  );
}
