import { getGalleryViews } from "@/lib/data";
import AosProvider from "@/app/_components/AosProvider";
import { Gallery } from "@/app/components";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery — Mahi Computer Training Center",
};

const GalleryPage = async () => {
  const items = await getGalleryViews();

  return (
    <AosProvider>
      <div className="w-full overflow-hidden scroll-smooth">
        <Gallery items={items} />
      </div>
    </AosProvider>
  );
};

export default GalleryPage;
