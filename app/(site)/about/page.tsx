import {
  getInstructors,
  getSiteSettings,
  toInstructorView,
} from "@/lib/data";
import { SITE_NAME } from "@/lib/site";
import AosProvider from "@/app/_components/AosProvider";
import { About, CEO, Instractor, Stats } from "@/app/components";
import WhyChooseUs from "@/app/components/WhyChooseUs";
import type { Metadata } from "next";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Mahi Computer Training Center — our mission, teaching approach and the experienced instructors behind thousands of successful students.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: `About Us | ${SITE_NAME}` },
};

const AboutPage = async () => {
  const [settings, instructors] = await Promise.all([
    getSiteSettings(),
    getInstructors(),
  ]);

  return (
    <AosProvider>
      <div className="w-full overflow-hidden scroll-smooth">
        <About settings={settings} />
        <CEO settings={settings} />
        <Instractor instructors={instructors.map(toInstructorView)} />
        <WhyChooseUs settings={settings} />
        <Stats stats={settings.stats} />
      </div>
    </AosProvider>
  );
};

export default AboutPage;
