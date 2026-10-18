import { prisma } from "@/lib/prisma";
import NewsletterList from "../../_components/NewsletterList";

export const dynamic = "force-dynamic";

const NewsletterAdminPage = async () => {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <NewsletterList subscribers={subscribers} />;
};

export default NewsletterAdminPage;
