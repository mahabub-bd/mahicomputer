import {
  getPublicBusinessSettings,
  getPublicCourseViews,
  getPublicFooterLinkGroups,
  getPublicNavLinks,
  getPublicSocialLinks,
  toFooterGroupView,
  toNavLinkView,
} from "@/lib/data";
import type { ReactNode } from "react";
import WhatsAppChat from "../_components/WhatsAppChat";
import { Footer, Navbar } from "../components";


export const revalidate = 60;

const SiteLayout = async ({ children }: { children: ReactNode }) => {
  const [courses, social, navLinks, footerGroups, business] = await Promise.all([
    getPublicCourseViews(),
    getPublicSocialLinks(),
    getPublicNavLinks(),
    getPublicFooterLinkGroups(),
    getPublicBusinessSettings(),
  ]);

  return (
    <>
      <Navbar
        courses={courses}
        social={social}
        navLinks={navLinks.map(toNavLinkView)}
        settings={business}
      />
      <main>{children}</main>
      <Footer
        social={social}
        footerLinks={footerGroups.map(toFooterGroupView)}
        settings={business}
      />
      <WhatsAppChat
        number={business.whatsappEnabled ? business.whatsappNumber : ""}
        message={business.whatsappMessage}
        businessName={business.businessName || "Mahi Computer"}
      />
    </>
  );
};
export default SiteLayout;
