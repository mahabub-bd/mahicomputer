import {
  getPublicCourseViews,
  getPublicFooterLinkGroups,
  getPublicNavLinks,
  getPublicSiteSettings,
  getPublicSocialLinks,
  toFooterGroupView,
  toNavLinkView,
} from "@/lib/data";
import type { ReactNode } from "react";
import { Footer, Navbar } from "../components";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const revalidate = 60;

const SiteLayout = async ({ children }: { children: ReactNode }) => {
  const [courses, social, navLinks, footerGroups, settings] = await Promise.all([
    getPublicCourseViews(),
    getPublicSocialLinks(),
    getPublicNavLinks(),
    getPublicFooterLinkGroups(),
    getPublicSiteSettings(),
  ]);

  return (
    <>
      <Navbar
        courses={courses}
        social={social}
        navLinks={navLinks.map(toNavLinkView)}
        settings={settings}
      />
      <main>{children}</main>
      <Footer
        social={social}
        footerLinks={footerGroups.map(toFooterGroupView)}
        settings={settings}
      />
    </>
  );
};
export default SiteLayout;
