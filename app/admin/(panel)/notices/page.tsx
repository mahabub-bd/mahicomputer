import { prisma } from "@/lib/prisma";
import NoticesList from "../../_components/NoticesList";

export const dynamic = "force-dynamic";

const NoticesAdminPage = async () => {
  const notices = await prisma.notice.findMany({
    orderBy: [{ order: "asc" }, { date: "desc" }],
    include: { publishedBy: { select: { name: true } } },
  });

  return <NoticesList notices={notices} />;
};

export default NoticesAdminPage;
