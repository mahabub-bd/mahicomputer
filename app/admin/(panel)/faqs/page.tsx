import { prisma } from "@/lib/prisma";
import FaqsList from "../../_components/FaqsList";

export const dynamic = "force-dynamic";

const FaqsAdminPage = async () => {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return <FaqsList faqs={faqs} />;
};

export default FaqsAdminPage;
