import { getGalleryViews } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";
import AosProvider from "@/app/_components/AosProvider";
import { Gallery } from "@/app/components";
import type { Metadata } from "next";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from the classrooms, labs, events and student life at Mahi Computer Training Center.",
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery", title: `Gallery | ${SITE_NAME}` },
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
