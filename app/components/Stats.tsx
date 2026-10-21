"use client";

import type { StatItem } from "@/lib/types";
import { Award, GraduationCap, Trophy, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/style";

interface StatsProps {
  stats?: StatItem[];
}

/** Per-card icon, assigned by render order to keep the grid visually balanced. */
const CARD_ICONS = [GraduationCap, Trophy, Award, Users] as const;

const BN = "০১২৩৪৫৬৭৮৯";
const toAsciiNumber = (s: string) =>
  s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));

/**
 * Splits an admin-edited stat value ("১০০০+", "5,000 Students", "15")
 * so only the numeric run is animated; text around it is preserved.
 */
const parseStat = (raw: string) => {
  const normalized = toAsciiNumber(raw);
  const useBn = /[০-৯]/.test(raw);
  const m = normalized.match(/[0-9][0-9,]*/);

  const target = m ? parseInt(m[0].replace(/,/g, ""), 10) : NaN;
  if (!m || !Number.isFinite(target)) {
    return { raw, target: NaN, prefix: "", suffix: "", grouped: false, useBn };
  }

  const idx = m.index ?? 0;
  return {
    // Serve the finished value first (SSR/SEO), then count up on scroll.
    raw,
    target,
    prefix: raw.slice(0, idx),
    suffix: raw.slice(idx + m[0].length),
    grouped: m[0].includes(","),
    useBn,
  };
};

const EN_TO_BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toDisplay = (n: string, info: ReturnType<typeof parseStat>) => {
  const grouped = info.grouped ? Number(n).toLocaleString("en-US") : n;
  const digits = info.useBn ? grouped.replace(/\d/g, (d) => EN_TO_BN[+d]) : grouped;
  return info.prefix + digits + info.suffix;
};

/**
 * Counts from 1 up to the stat's value once the card scrolls into view.
 * Renders the final value until IntersectionObserver fires, so SSR keeps
 * the full content for SEO and there is no "0" flash.
 */
const StatValue = ({ raw }: { raw: string }) => {
  const info = useRef(parseStat(raw)).current;
  const [display, setDisplay] = useState(raw);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!Number.isFinite(info.target)) return;
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const runCount = () => {
      const duration = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const value = Math.max(1, Math.round(info.target * eased));
        setDisplay(toDisplay(String(value), info));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        runCount();
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [info]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
};

const Stats = ({ stats = [] }: StatsProps) => (
  <section className="relative overflow-hidden bg-[#0b1526] py-[clamp(3.5rem,7vw,6rem)]">
    {/* Decorative glows + top accent line, same language as the footer */}
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/60 to-transparent"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-32 right-1/5 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
    />

    <div className="relative mx-auto max-w-350 px-4 sm:px-6">
      {/* Section header */}
      <p
        className="text-center font-bangla text-[13px] font-bold uppercase tracking-[0.2em] text-cyan-300"
        data-aos="fade-up"
      >
        আমাদের সফলতা
      </p>
      <h2
        className={`${styles.heading2} mt-2 text-center font-bangla text-white`}
        data-aos="fade-up"
        data-aos-delay="50"
      >
        এক নজরে আমাদের সফলতা
      </h2>
      <p
        className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-400"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        বিশ্বাসের ভিত্তিতে গড়া একটি সফল কম্পিউটার প্রশিক্ষণ কেন্দ্র
      </p>

      {/* Stat cards — glassy dark tiles */}
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {stats.map((stat, i) => {
          const Icon = CARD_ICONS[i % CARD_ICONS.length];
          return (
            /* Animation on the wrapper, hover on the card — keeps AOS's
               transition-property override from killing the hover animation. */
            <div
              key={stat.id || stat.title}
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center shadow-lg shadow-black/20 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-cyan-400/40 hover:bg-white/[0.1] hover:shadow-xl sm:p-7">
                {/* Corner glow that brightens on hover */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl transition-opacity duration-300 group-hover:bg-cyan-400/35" />

                {/* Icon badge */}
                <span className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-b from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-900/50 ring-1 ring-white/20">
                  <Icon size={20} aria-hidden />
                </span>

                {/* Big number — gradient text, counts up on scroll */}
                <p className="relative mt-4 bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text font-plusjakarta text-[34px] font-extrabold leading-none text-transparent sm:text-[44px]">
                  <StatValue raw={stat.value} />
                </p>

                {/* Label */}
                <p className="relative mt-3 font-plusjakarta text-[14px] font-medium leading-snug text-slate-300 sm:text-[16px]">
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Stats;
