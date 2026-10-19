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

/**
 * Per-card accent, rotating in lockstep with FEATURE_ICONS so each position
 * always gets the same icon + color pairing. Idle chip + hover fill classes
 * live here as literals so Tailwind can see them.
 */
const ACCENTS: { chip: string; hover: string }[] = [
  { chip: "bg-blue-50 text-blue-600", hover: "group-hover:bg-blue-600" },
  { chip: "bg-teal-50 text-teal-600", hover: "group-hover:bg-teal-600" },
  { chip: "bg-violet-50 text-violet-600", hover: "group-hover:bg-violet-600" },
  { chip: "bg-amber-50 text-amber-600", hover: "group-hover:bg-amber-600" },
  { chip: "bg-rose-50 text-rose-600", hover: "group-hover:bg-rose-600" },
  { chip: "bg-emerald-50 text-emerald-600", hover: "group-hover:bg-emerald-600" },
];

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Decorative ghost index (01, 02, …) shown at the top-right of each card. */
const toBangla = (n: number) =>
  String(n).split("").map((d) => BANGLA_DIGITS[Number(d)]).join("");

interface WhyChooseUsProps {
  settings?: SiteSettingsView;
}

const WhyChooseUs = ({ settings }: WhyChooseUsProps) => {
  const title = settings?.whyTitle?.trim() || "";
  const subtitle = settings?.whySubtitle?.trim() || "";
  const features =
    settings?.whyFeatures?.filter((f) => f.title.trim() || f.text.trim()) ?? [];

  // Admin hasn't filled this section yet — don't ship an empty shell.
  if (!title && !subtitle && features.length === 0) return null;

  return (
    <section
      id="why-us"
      className="section-shell relative scroll-mt-24 overflow-hidden bg-slate-50"
    >
      {/* Soft decorative blobs — pointer-events-none so they never block taps */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-teal-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-350 px-4 sm:px-6">
        {/* Section header */}
        <h2 className="section-title text-center font-bangla" data-aos="fade-up">
          {title}
        </h2>
        <div
          aria-hidden
          className="mx-auto mt-4 h-1 w-16 rounded-full bg-linear-to-r from-blue-600 to-teal-400"
        />
        <p
          className="mx-auto mt-4 max-w-2xl text-center font-bangla text-[15px] leading-7 text-slate-500 sm:text-[16px]"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          {subtitle}
        </p>

        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map(({ title: featTitle, text }, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];

            /* Animation on the wrapper, hover on the card — keeps AOS's
               transition-property override from killing the hover animation. */
            return (
              <li key={featTitle} data-aos="fade-up" data-aos-delay={(i % 3) * 80}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 sm:p-7">
                  {/* Brand-gradient hairline, sweeps in from the left on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-linear-to-r from-blue-600 to-teal-400 transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />

                  {/* Icon chip + ghost index */}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${accent.chip} ${accent.hover} group-hover:text-white`}
                    >
                      <Icon size={22} aria-hidden />
                    </span>
                    <span
                      aria-hidden
                      className="font-bangla text-2xl font-bold leading-none text-slate-100 transition-colors duration-300 group-hover:text-blue-600/20"
                    >
                      {toBangla(i + 1)}
                    </span>
                  </div>

                  <h3 className="mt-5 font-bangla text-[17px] font-bold text-slate-900">
                    {featTitle}
                  </h3>
                  <p className="mt-2 font-bangla text-[14px] leading-7 text-slate-500">
                    {text}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default WhyChooseUs;
