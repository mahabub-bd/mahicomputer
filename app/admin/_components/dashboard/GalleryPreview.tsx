import Link from "next/link";
import SectionHeading from "./SectionHeading";

export type GalleryPreviewItem = {
  id: string;
  imageUrl: string;
  alt: string;
};

/** First eight home-page gallery images as a visual preview. */
const GalleryPreview = ({ items }: { items: GalleryPreviewItem[] }) => (
  <div className="lg:col-span-2">
    <SectionHeading title="Gallery" href="/admin/gallery" />
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No gallery images yet.{" "}
          <Link href="/admin/gallery" className="text-blue-600 hover:underline">
            Add one
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {items.slice(0, 8).map((g) => (
              <div
                key={g.id}
                className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200"
              >
                {g.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.imageUrl}
                    alt={g.alt}
                    loading="lazy" decoding="async"
                      className="h-full w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {items.length} image
            {items.length === 1 ? "" : "s"} in the home page gallery
            {items.length > 8 ? ` · showing first 8` : ""}
          </p>
        </>
      )}
    </div>
  </div>
);

export default GalleryPreview;
