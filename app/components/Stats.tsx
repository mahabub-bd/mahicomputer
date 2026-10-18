import { stats as staticStats } from "../constants";
import styles from "../styles/style";
import type { StatItem } from "@/lib/types";

interface StatsProps {
  stats?: StatItem[];
}

const Stats = ({ stats = staticStats }: StatsProps) => (
  <section className="section-shell bg-linear-to-b from-white to-blue-50/60">
    <div className={`${styles.boxWidth} mx-auto px-4 sm:px-6`}>
      <h2
        className={`${styles.heading2} section-title text-center font-bangla`}
        data-aos="fade-up"
      >
        এক নজরে আমাদের সফলতা
      </h2>
      <p
        className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        বিশ্বাসের ভিত্তিতে গড়া একটি সফল কম্পিউটার প্রশিক্ষণ কেন্দ্র
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {stats.map((stat, i) => (
          /* Animation on the wrapper, hover on the card — keeps AOS's
             transition-property override from killing the hover animation. */
          <div
            key={stat.id || stat.title}
            data-aos="fade-up"
            data-aos-delay={i * 80}
          >
            <div
              className={`${stat.class} backdrop-blur-xs relative h-full overflow-hidden rounded-2xl border border-white/70 p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:p-7`}
            >
              {/* soft decorative bubbles */}
              <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/40" />
              <div className="pointer-events-none absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-white/30" />

              <p className="relative font-plusjakarta text-[32px] font-bold leading-none text-mahithree sm:text-[40px]">
                {stat.value}
              </p>
              <div
                className="relative mx-auto mt-3 h-1 w-10 rounded-full bg-mahithree/50"
                aria-hidden
              />
              <p className="relative mt-3 font-plusjakarta text-[14px] font-medium leading-snug text-slate-600 sm:text-[16px]">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
