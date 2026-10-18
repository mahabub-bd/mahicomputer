import { paymentapp } from "@/public";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { SiteSettingsView } from "@/lib/types";

interface AboutProps {
  settings?: SiteSettingsView;
}

const defaults = {
  aboutTitle: "About Mahi Computer Institute",
  aboutText:
    "মাহি কম্পিউটার ট্রেনিং সেন্টার, গুলশান, ঢাকা হলো একটি প্রযুক্তি শিক্ষার প্রতিষ্ঠান। এটি ঢাকার গুলশান এলাকায় অবস্থিত একটি জনপ্রিয় কম্পিউটার ট্রেনিং সেন্টার। এই প্রতিষ্ঠানটি বিভিন্ন প্রযুক্তি বিষয়ে প্রশিক্ষণ প্রদান করে এবং ছাত্রদের প্রযুক্তি দক্ষতা বৃদ্ধি করে। এখানে কম্পিউটার\nঅপারেটিং সিস্টেম, কম্পিউটার নেটওয়ার্কিং, ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইনিং, মাল্টিমিডিয়া, অটোক্যাড, প্রোগ্রামিং এবং ডাটাবেস ম্যানেজমেন্ট এমনকি ইথিক্যাল হ্যাকিং এই ধরণের বিভিন্ন প্রশিক্ষণ কোর্স উপলব্ধ আছে।\n\nমাহি কম্পিউটার ট্রেনিং সেন্টারে উপযুক্ত শিক্ষার্থীদের জন্য সুবিধাজনক শিক্ষামূলক পাঠ্যপুস্তক এবং নতুনত্বপূর্ণ কম্পিউটার যন্ত্রাংশ ও সফ্টওয়্যার প্রদান করা হয়। এছাড়াও, প্রশিক্ষকদের পরামর্শ ও পরিচালনা নিশ্চিত করে ছাত্রদের ভাল প্রশিক্ষণ দেয়া হয়। মাহি কম্পিউটার ট্রেনিং সেন্টার যোগ্যতামূলক উপকরণ ও সুযোগ-সুবিধা সহ একটি আধুনিক কম্পিউটার ট্রেনিং প্রতিষ্ঠান।",
};

/** Split the admin-managed blob of text into readable paragraphs. */
const toParagraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

const About = ({ settings }: AboutProps) => {
  // Empty admin fields should fall back to the defaults, not blank the section.
  const s = {
    aboutTitle: settings?.aboutTitle?.trim() || defaults.aboutTitle,
    aboutText: settings?.aboutText?.trim() || defaults.aboutText,
    // Admin-uploaded image; the bundled image is the fallback.
    aboutImageUrl: settings?.aboutImageUrl?.trim() || "",
  };

  const paragraphs = toParagraphs(s.aboutText);
  // Lead paragraph reads slightly larger; the rest are body copy.
  const [lead, ...rest] = paragraphs;

  return (
    <section
      id="about"
      className="section-shell relative scroll-mt-24 overflow-hidden bg-linear-to-b from-white via-blue-50/40 to-white"
    >
      {/* Soft decorative blobs — pointer-events-none so they never block taps */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-rose-100/40 blur-3xl"
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Section header */}
        <p
          className="text-center font-bangla text-[13px] font-bold uppercase tracking-[0.2em] text-blue-600"
          data-aos="fade-up"
        >
          আমাদের সম্পর্কে
        </p>
        <h2
          className="section-title mt-2 text-center font-bangla"
          data-aos="fade-up"
          data-aos-delay="60"
        >
          {s.aboutTitle}
        </h2>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-blue-600/70" aria-hidden />

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <div data-aos="fade-right">
            {lead && (
              <p className="font-bangla text-[17px] leading-8 text-slate-700 sm:text-[18px] sm:leading-9">
                {lead}
              </p>
            )}

            {rest.length > 0 && (
              <div className="mt-4 space-y-4">
                {rest.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-bangla text-[15px] leading-7 text-slate-500 sm:text-[16px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-[15px] font-semibold text-white shadow-md shadow-blue-600/25 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
              >
                কোর্স সমূহ দেখুন
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-[15px] font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
              >
                যোগাযোগ করুন
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative" data-aos="fade-left">
            <div className="absolute -inset-3 rounded-[2rem] border border-blue-100 bg-blue-50/40" aria-hidden />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/60">
              {/* eslint-disable-next-line @next/next/no-img-element -- uses local /uploads/... or any URL the admin pastes */}
              <img
                src={s.aboutImageUrl || paymentapp.src}
                alt="মাহি কম্পিউটার ট্রেনিং সেন্টার"
                loading="eager"
                sizes="(min-width: 1200px) 45vw, 92vw"
                className="h-auto w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/45 via-transparent to-transparent"
                aria-hidden
              />
            </div>

            {/* Floating location badge */}
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-lg sm:left-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={20} aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                  Location
                </span>
                <span className="block font-bangla text-[15px] font-bold text-slate-900">
                  গুলশান, ঢাকা
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
