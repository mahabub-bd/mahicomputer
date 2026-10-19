import { prisma } from "@/lib/prisma";
import CategoriesList from "../../_components/CategoriesList";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ edit?: string }> };

const CategoriesAdminPage = async ({ searchParams }: Props) => {
  const { edit } = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { courses: true } } },
  });
  return <CategoriesList categories={categories} editId={edit} />;
};

export default CategoriesAdminPage;
