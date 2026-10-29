import { getBusinessSettings, getSocialLinks } from "@/lib/data";
import PageHeader from "../../_components/PageHeader";
import BusinessSettingsForm from "../../_components/BusinessSettingsForm";

export const dynamic = "force-dynamic";

const BusinessSettingsAdminPage = async () => {
  const [settings, socialLinks] = await Promise.all([
    getBusinessSettings(),
    getSocialLinks(),
  ]);

  return (
    <div>
      <PageHeader
        title="Business settings"
        description="Business name, opening hours, contact info, map, social links and the WhatsApp chat widget"
      />
      <BusinessSettingsForm settings={settings} socialLinks={socialLinks} />
    </div>
  );
};

export default BusinessSettingsAdminPage;
