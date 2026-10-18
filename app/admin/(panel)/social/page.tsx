import { getSocialLinks } from "@/lib/data";
import SocialList from "../../_components/SocialList";

export const dynamic = "force-dynamic";

const SocialAdminPage = async () => {
  const links = await getSocialLinks();
  return <SocialList links={links} />;
};

export default SocialAdminPage;
