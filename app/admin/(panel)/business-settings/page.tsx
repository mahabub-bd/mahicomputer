import { getBusinessSettings, getSocialLinks } from "@/lib/data";
import PageHeader from "../../_components/PageHeader";
import BusinessSettingsEditButton from "../../_components/BusinessSettingsEditButton";
import BusinessSettingsView from "../../_components/BusinessSettingsView";

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
        actions={<BusinessSettingsEditButton settings={settings} />}
      />
      <BusinessSettingsView settings={settings} socialLinks={socialLinks} />
    </div>
  );
};

export default BusinessSettingsAdminPage;
