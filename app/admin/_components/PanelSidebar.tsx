import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Sidebar from "./Sidebar";

/**
 * Server component that fetches the admin user for the sidebar.
 * Kept out of the layout so the shell renders instantly and this
 * query streams in behind a Suspense boundary.
 */
export default async function PanelSidebar() {
  const session = await getSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.sub },
        select: { name: true, email: true, imageUrl: true },
      })
    : null;

  return <Sidebar user={user} />;
}
