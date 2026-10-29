import { PageHead } from "@/app/_components/PageHead";
import { getPublicBusinessSettings, getPublicSocialLinks } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";
import AosProvider from "@/app/_components/AosProvider";
import { Contact, Map } from "@/app/components";
import type { Metadata } from "next";

// Content is DB-driven and editable from the admin panel — never prerender at build time.

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Mahi Computer Training Center — call, email or visit our campus for course admission, schedules and free counselling.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: `Contact | ${SITE_NAME}` },
};

const ContactPage = async () => {
  const [settings, socials] = await Promise.all([
    getPublicBusinessSettings(),
    getPublicSocialLinks(),
  ]);

  return (
    <AosProvider>
      <div className="w-full overflow-hidden scroll-smooth">
        <PageHead items={[{ label: "যোগাযোগ" }]} />
        <Contact settings={settings} social={socials} />
        <Map settings={settings} />
      </div>
    </AosProvider>
  );
};

export default ContactPage;
