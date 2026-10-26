import { getSiteSettings } from "@/lib/data";
import PageHeader from "../../_components/PageHeader";
import SettingsForm from "../../_components/SettingsForm";

export const dynamic = "force-dynamic";

const SettingsAdminPage = async () => {
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader
        title="Homepage settings"
        description="Homepage sections — hero, marquee, why choose us, about, CEO and stats"
      />
      <SettingsForm settings={settings} />
    </div>
  );
};

export default SettingsAdminPage;
