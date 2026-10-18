import {
  getCourseViews,
  getFooterLinkGroups,
  getNavLinks,
  getSiteSettings,
  getSocialLinks,
  toFooterGroupView,
  toNavLinkView,
} from "@/lib/data";
import type { ReactNode } from "react";
import { Footer, Navbar } from "../components";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

const SiteLayout = async ({ children }: { children: ReactNode }) => {
  const [courses, social, navLinks, footerGroups, settings] = await Promise.all([
    getCourseViews(),
    getSocialLinks(),
    getNavLinks(),
    getFooterLinkGroups(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar
        courses={courses}
        social={social}
        navLinks={navLinks.map(toNavLinkView)}
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
