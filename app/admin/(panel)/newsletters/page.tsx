import { prisma } from "@/lib/prisma";
import NewslettersList from "../../_components/NewslettersList";

export const dynamic = "force-dynamic";

const NewslettersAdminPage = async () => {
  const newsletters = await prisma.newsletter.findMany({
    orderBy: [{ order: "asc" }, { date: "desc" }],
    include: { publishedBy: { select: { name: true } } },
  });

  return <NewslettersList newsletters={newsletters} />;
};

export default NewslettersAdminPage;
