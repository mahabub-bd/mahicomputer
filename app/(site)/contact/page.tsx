import { getSiteSettings } from "@/lib/data";
import AosProvider from "@/app/_components/AosProvider";
import { Contact, Map } from "@/app/components";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact — Mahi Computer Training Center",
};

const ContactPage = async () => {
  const settings = await getSiteSettings();

  return (
    <AosProvider>
      <div className="w-full overflow-hidden scroll-smooth">
        <Contact settings={settings} />
        <Map settings={settings} />
      </div>
    </AosProvider>
  );
};

export default ContactPage;
