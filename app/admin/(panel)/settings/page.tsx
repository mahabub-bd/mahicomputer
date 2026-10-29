import { getSiteSettings } from "@/lib/data";
import PageHeader from "../../_components/PageHeader";
import SettingsEditButton from "../../_components/SettingsEditButton";
import SettingsView from "../../_components/SettingsView";

export const dynamic = "force-dynamic";

const SettingsAdminPage = async () => {
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader
        title="Homepage settings"
        description="Homepage sections — hero, marquee, why choose us, about, CEO and stats"
        actions={<SettingsEditButton settings={settings} />}
      />
      <SettingsView settings={settings} />
    </div>
  );
};

export default SettingsAdminPage;
