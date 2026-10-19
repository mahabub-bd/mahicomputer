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
      <div className="lg:pl-72">
        <div className="mx-auto max-w-[1600px] p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
