import { getSiteSettings } from "@/lib/data";
import PageHeader from "../../_components/PageHeader";
import SettingsForm from "../../_components/SettingsForm";

export const dynamic = "force-dynamic";

const SettingsAdminPage = async () => {
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="Hero, about, contact info, social links and stats"
      />
      <SettingsForm settings={settings} />
    </div>
  );
};

export default SettingsAdminPage;
