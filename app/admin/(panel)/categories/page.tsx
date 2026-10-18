import { getCategories } from "@/lib/data";
import CategoriesList from "../../_components/CategoriesList";

export const dynamic = "force-dynamic";

const CategoriesAdminPage = async () => {
  const categories = await getCategories();
  return <CategoriesList categories={categories} />;
};

export default CategoriesAdminPage;
