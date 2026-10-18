import { getNavLinks } from "@/lib/data";
import NavLinksList from "../../_components/NavLinksList";

export const dynamic = "force-dynamic";

const NavLinksAdminPage = async () => {
  const links = await getNavLinks();
  return <NavLinksList links={links} />;
};

export default NavLinksAdminPage;
