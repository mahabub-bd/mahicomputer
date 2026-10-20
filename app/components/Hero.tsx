import {
  ArrowRight,
  ChevronDown,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { SiteSettingsView } from "@/lib/types";

interface HeroProps {
  settings?: SiteSettingsView;
}

const Hero = ({ settings }: HeroProps) => {
  const s = {
    heroTitle: settings?.heroTitle?.trim() || "",
    heroSubtitle: settings?.heroSubtitle?.trim() || "",
    heroNote: settings?.heroNote?.trim() || "",
  };
  // Admin-uploaded hero background — shown only when set.
  const heroImage = settings?.heroImageUrl?.trim() || "";

  return (
    <section className="hero relative flex items-center overflow-hidden">
      {/* Admin-uploaded hero background — optimized/resized via next/image */}
      {heroImage && (
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}
      {/* Gradient scrim — darkens the photo (or acts as the base when no photo is set) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-[#111f36]/92 to-[#1f345c]/78"
      />
      {/* Floating decorative shapes (animations live in globals.css) */}
      <span aria-hidden className="shape-1 absolute" />
      <span aria-hidden className="shape-2 absolute" />
      <span aria-hidden className="shape-3 absolute" />

      {/* Soft glow accents — purely decorative, never intercept taps */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-350 px-4 py-20 sm:px-6 sm:py-28 lg:py-10 xl:py-28">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Eyebrow badge */}
          <p
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-bangla text-[13px] font-semibold text-blue-100 backdrop-blur-sm"
            data-aos="fade-up"
          >
            <Sparkles size={14} className="text-amber-300" aria-hidden />
            ঢাকার সেরা কম্পিউটার প্রশিক্ষণ কেন্দ্র
          </p>

          {/* Title */}
          <h1
            className="max-w-4xl font-bangla text-[30px] font-bold leading-[1.3] text-white ss:text-[38px] lg:text-[44px] lg:leading-[1.2] xl:text-[54px]"
            data-aos="fade-up"
            data-aos-delay="60"
          >
            {s.heroTitle}
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-195 font-bangla text-[16px] leading-8 text-blue-100/85 sm:text-[18px] sm:leading-9 lg:text-[17px] lg:leading-8 xl:text-[18px] xl:leading-9"
            data-aos="fade-up"
            data-aos-delay="120"
          >
            {s.heroSubtitle}
          </p>

          {/* Duration note pill */}
          <p
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-5 py-2.5 font-bangla text-[16px] font-medium text-emerald-100 sm:text-[17px] lg:text-[16px] xl:text-[17px]"
            data-aos="fade-up"
            data-aos-delay="180"
          >
            <Clock size={18} className="text-emerald-300" aria-hidden />
            {s.heroNote}
          </p>

          {/* CTAs */}
          <div
            className="mt-1 flex flex-wrap items-center justify-center gap-3"
            data-aos="fade-up"
            data-aos-delay="240"
          >
            <Link
              href="#courses"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bangla text-[15px] font-semibold text-slate-900 shadow-lg shadow-blue-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl lg:text-[15px] xl:text-[16px]"
            >
              কোর্স সমূহ দেখুন
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 font-bangla text-[15px] font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 lg:text-[15px] xl:text-[16px]"
            >
              ভর্তি ও যোগাযোগ
            </Link>
          </div>

          {/* Location mini-line */}
          <span
            className="mt-1 inline-flex items-center gap-1.5 font-bangla text-[14px] text-blue-100/70"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <MapPin size={16} className="text-rose-300" aria-hidden />
            গুলশান, ভাটারা, বাড্ডা — ঢাকা
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="নিচে স্ক্রল করুন"
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 text-white/60 transition hover:text-white sm:block"
      >
        <ChevronDown size={24} className="animate-bounce" aria-hidden />
      </a>
    </section>
  );
};

export default Hero;
