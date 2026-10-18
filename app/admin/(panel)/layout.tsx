import type { ReactNode } from "react";
import { Toaster } from "sonner";
import Sidebar from "../_components/Sidebar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Admin — Mahi Computer",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.sub },
        select: { name: true, email: true, imageUrl: true },
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="top-right" richColors />
      <Sidebar user={user} />
      <div className="lg:pl-72">
        <div className="mx-auto max-w-[1600px] p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
