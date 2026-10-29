import type { SiteSettingsView } from "@/lib/types";
import { Award, GraduationCap, Trophy, Users } from "lucide-react";
import SectionCard from "./SectionCard";
import { ReadField, ReadGrid, ReadImage } from "./SettingsFields";

interface SettingsViewProps {
  settings: SiteSettingsView;
}

/** Same rotation as `app/components/Stats.tsx` so the preview matches the homepage. */
const STAT_ICONS = [GraduationCap, Trophy, Award, Users] as const;

/** Shared two-column layout and image slot so every image section lines up. */
const DETAIL_GRID = "grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]";
const IMAGE_SLOT = "aspect-[4/3] w-full";

/**
 * Read-only overview of the homepage settings singleton. The edit modal lives
 * in `SettingsEditButton`, which the page renders in the header actions slot.
 */
const SettingsView = ({ settings }: SettingsViewProps) => {
  return (
    <div>
      <div className="space-y-6">
        <SectionCard title="Hero section">
          <div className={DETAIL_GRID}>
            <ReadGrid>
              <ReadField label="Title" value={settings.heroTitle} wide />
              <ReadField label="Subtitle" value={settings.heroSubtitle} wide text />
              <ReadField label="Note" value={settings.heroNote} wide />
            </ReadGrid>
            <ReadImage
              label="Background image"
              src={settings.heroImageUrl}
              className={IMAGE_SLOT}
              emptyLabel="Default background"
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Marquee (top announcements bar)"
          meta={settings.marqueeItems.length > 0 ? `(${settings.marqueeItems.length})` : undefined}
        >
          {settings.marqueeItems.length > 0 ? (
            <ol className="space-y-2">
              {settings.marqueeItems.map((item, i) => (
                <li
                  key={`${item}-${i}`}
                  className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="mt-0.5 w-8 shrink-0 text-right font-mono text-[13px] tabular-nums text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="min-w-0 wrap-break-word text-sm text-slate-700">{item}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400">Using the default announcements.</p>
          )}
        </SectionCard>

        <SectionCard title="Why Choose Us">
          <ReadGrid className="mb-5">
            <ReadField label="Section title" value={settings.whyTitle} />
            <ReadField label="Section subtitle" value={settings.whySubtitle} />
          </ReadGrid>

          {settings.whyFeatures.length > 0 ? (
            <ol className="space-y-2">
              {settings.whyFeatures.map((feature, i) => (
                <li
                  key={`${feature.title}-${i}`}
                  className="flex gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-blue-700 ring-1 ring-slate-200">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {feature.title || "Untitled feature"}
                    </p>
                    <p className="wrap-break-word text-sm text-slate-500">{feature.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400">Using the default features.</p>
          )}
        </SectionCard>

        <SectionCard title="Course detail page">
          <ReadGrid>
            <ReadField label="About section heading" value={settings.courseAboutTitle} />
            <ReadField label="Modules section heading" value={settings.courseInsideTitle} />
          </ReadGrid>
        </SectionCard>

        <SectionCard title="About section">
          <div className={DETAIL_GRID}>
            <ReadGrid>
              <ReadField label="Title" value={settings.aboutTitle} wide />
              <ReadField label="Text" value={settings.aboutText} wide text />
            </ReadGrid>
            <ReadImage
              label="About image"
              src={settings.aboutImageUrl}
              className={IMAGE_SLOT}
              emptyLabel="Default image"
            />
          </div>
        </SectionCard>

        <SectionCard title="CEO section">
          <div className={DETAIL_GRID}>
            <ReadGrid>
              <ReadField label="Title" value={settings.ceoTitle} wide />
              <ReadField label="Message" value={settings.ceoText} wide text />
            </ReadGrid>
            <ReadImage
              label="CEO image"
              src={settings.ceoImageUrl}
              className={IMAGE_SLOT}
              emptyLabel="Default image"
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Stats (one glance section)"
          meta={settings.stats.length > 0 ? `(${settings.stats.length})` : undefined}
        >
          {settings.stats.length > 0 ? (
            <>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {settings.stats.map((stat, i) => {
                  const Icon = STAT_ICONS[i % STAT_ICONS.length];
                  return (
                    <li
                      key={`${stat.id}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition duration-200 hover:border-blue-200 hover:bg-white hover:shadow-sm"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-b from-blue-500 to-cyan-500 text-white shadow-sm ring-1 ring-white/40">
                        <Icon size={18} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        {stat.value ? (
                          <p className="truncate bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-[22px] font-extrabold leading-tight text-transparent tabular-nums">
                            {stat.value}
                          </p>
                        ) : (
                          <p className="text-[22px] font-extrabold leading-tight text-slate-300">
                            —
                          </p>
                        )}
                        <p className="truncate text-xs text-slate-500">
                          {stat.title || "Untitled stat"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-xs text-slate-400">
                Mirrors the homepage cards — the numbers count up when the section
                scrolls into view.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">Using the default stats.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default SettingsView;
