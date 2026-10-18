import { getCategories, toCategoryView } from "@/lib/data";
import AosProvider from "@/app/_components/AosProvider";
import { Categories } from "@/app/components";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services — Mahi Computer Training Center",
};

const ServicesPage = async () => {
  const categories = await getCategories();

  return (
    <AosProvider>
      <div className="w-full overflow-hidden scroll-smooth">
        <Categories categories={categories.map(toCategoryView)} />
      </div>
    </AosProvider>
  );
};

export default ServicesPage;
