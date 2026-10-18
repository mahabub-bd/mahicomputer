import { prisma } from "@/lib/prisma";
import CategoriesList from "../../_components/CategoriesList";

export const dynamic = "force-dynamic";

const CategoriesAdminPage = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { courses: true } } },
  });
  return <CategoriesList categories={categories} />;
};

export default CategoriesAdminPage;
