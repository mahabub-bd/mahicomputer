import type { SiteSettingsView } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  MonitorCheck,
  Users,
  Wifi,
} from "lucide-react";

/** Icons cycle through this pool for admin-defined features. */
const FEATURE_ICONS: LucideIcon[] = [
  MonitorCheck,
  Users,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Wifi,
];

interface WhyChooseUsProps {
  settings?: SiteSettingsView;
}

const WhyChooseUs = ({ settings }: WhyChooseUsProps) => {
  const title = settings?.whyTitle?.trim() || "";
  const subtitle = settings?.whySubtitle?.trim() || "";
  const features =
    settings?.whyFeatures?.filter((f) => f.title.trim() || f.text.trim()) ?? [];

  return (
    <section className="section-shell bg-slate-50">
      <div className="mx-auto max-w-350 px-4 sm:px-6">
        <h2 className="section-title text-center font-bangla" data-aos="fade-up">
          {title}
        </h2>
        <p
          className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[15px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          {subtitle}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map(({ title: featTitle, text }, i) => (
            /* Animation on the wrapper, hover on the card — keeps AOS's
               transition-property override from killing the hover animation. */
            <div
              key={featTitle}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 80}
            >
              <div className="group h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <FeatureIcon index={i} />
                </span>
                <h3 className="mt-4 font-bangla text-[17px] font-bold text-slate-900">
                  {featTitle}
                </h3>
                <p className="mt-1.5 font-bangla text-[14px] leading-6 text-slate-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureIcon = ({ index }: { index: number }) => {
  const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
  return <Icon size={22} />;
};

export default WhyChooseUs;
