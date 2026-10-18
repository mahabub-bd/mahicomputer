import {
  getInstructors,
  getSiteSettings,
  toInstructorView,
} from "@/lib/data";
import AosProvider from "@/app/_components/AosProvider";
import { About, CEO, Instractor, Stats } from "@/app/components";
import WhyChooseUs from "@/app/components/WhyChooseUs";

// Content is DB-driven and editable from the admin panel — never prerender at build time.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "About — Mahi Computer Training Center",
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
