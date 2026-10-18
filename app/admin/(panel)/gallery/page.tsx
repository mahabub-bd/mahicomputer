import { getGalleryItems } from "@/lib/data";
import GalleryList from "../../_components/GalleryList";

export const dynamic = "force-dynamic";

const GalleryAdminPage = async () => {
  const items = await getGalleryItems();
  return <GalleryList items={items} />;
};

export default GalleryAdminPage;
