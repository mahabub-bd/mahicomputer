import { getCategories, toCategoryView } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";
import AosProvider from "@/app/_components/AosProvider";
import { Categories } from "@/app/components";
import type { Metadata } from "next";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore all training services and course categories offered by Mahi Computer Training Center.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services", title: `Services | ${SITE_NAME}` },
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
