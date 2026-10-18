import { getPartners } from "@/lib/data";
import PartnersList from "../../_components/PartnersList";

export const dynamic = "force-dynamic";

const PartnersAdminPage = async () => {
  const partners = await getPartners();
  return <PartnersList partners={partners} />;
};

export default PartnersAdminPage;
