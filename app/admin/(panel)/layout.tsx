import type { ReactNode } from "react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import PanelSidebar from "../_components/PanelSidebar";
import SidebarFallback from "../_components/SidebarFallback";

export const metadata = {
  title: "Admin — Mahi Computer",
  robots: { index: false, follow: false },
};

// Sync on purpose: the shell must render immediately (no awaits) so
// loading.tsx and the sidebar skeleton show while server work runs.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="top-right" richColors />
      <Suspense fallback={<SidebarFallback />}>
        <PanelSidebar />
      </Suspense>
      {/* min-w-0 lets the grid/flex children below shrink to the content
          column instead of forcing a sideways page scroll.
          The left padding tracks the sidebar width: narrower on laptops
          (lg, 224px), full width again on large desktops (xl, 288px). */}
      <div className="min-w-0 lg:pl-56 xl:pl-72">
        {/* Padding is set per side on purpose: the `p-*` shorthand at sm/lg
            would reset padding-top and slide the content under the fixed
            mobile top bar (visible between the sm and lg breakpoints). */}
        <div className="mx-auto max-w-[1600px] px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-20 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
