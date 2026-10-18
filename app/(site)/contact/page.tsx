<<<<<<< HEAD
import { getPublicSiteSettings } from "@/lib/data";
=======
import { getSiteSettings } from "@/lib/data";
>>>>>>> 8b57dd81f4b6274869ff3d96c8916c651ef76d20
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
  const settings = await getPublicSiteSettings();

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
