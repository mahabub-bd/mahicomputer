import { getFooterLinkGroups } from "@/lib/data";
import FooterLinksList from "../../_components/FooterLinksList";

export const dynamic = "force-dynamic";

const FooterLinksAdminPage = async () => {
  const groups = await getFooterLinkGroups();
  return <FooterLinksList groups={groups} />;
};

export default FooterLinksAdminPage;
