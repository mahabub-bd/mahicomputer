import type { SiteSettingsView } from "@/lib/types";
import { MapPin, Navigation } from "lucide-react";

/** Opens Google Maps directions straight to the training centre. */
const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Mahi+Computers+and+Training+Center";

interface MapProps {
  settings?: SiteSettingsView;
}

const Map = ({ settings }: MapProps) => {
  const embedUrl = settings?.mapEmbedUrl?.trim() || "";
  return (
    <section
      id="location"
      className="section-shell relative scroll-mt-24 overflow-hidden bg-white"
    >
      <div className="mx-auto max-w-350 px-4 sm:px-6">
        {/* Section header */}
        <p
          className="text-center font-bangla text-[13px] font-bold uppercase tracking-[0.2em] text-blue-600"
          data-aos="fade-up"
        >
          আমাদের অবস্থান
        </p>
        <h2
          className="section-title mt-2 text-center font-bangla"
          data-aos="fade-up"
          data-aos-delay="60"
        >
          খুঁজে পাবেন এখানে
        </h2>
        <div
          className="mx-auto mt-4 h-1 w-16 rounded-full bg-blue-600/70"
          aria-hidden
        />

        {/* Framed map card — rendered only when the admin has set an embed URL */}
        {embedUrl && (
        <div className="relative mt-10" data-aos="fade-up" data-aos-delay="120">
          <div
            className="absolute -inset-3 rounded-4xl border border-blue-100 bg-blue-50/40"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/60">
            <iframe
              title="মাহি কম্পিউটার ট্রেনিং সেন্টার — Google Map"
              src={embedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-90 w-full border-0 sm:h-105"
            />

            {/* Directions CTA */}
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl sm:right-6 sm:top-6"
            >
              <Navigation size={16} aria-hidden />
              দিকনির্দেশ নিন
            </a>
          </div>

          {/* Floating address badge (overhangs below the frame) */}
          <div className="absolute -bottom-5 left-4 z-10 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-lg sm:left-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin size={20} aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                Location
              </span>
              <span className="block font-bangla text-[15px] font-bold text-slate-900">
                মাহি কম্পিউটার ট্রেনিং সেন্টার, গুলশান, ঢাকা
              </span>
            </span>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default Map;
