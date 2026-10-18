import React from "react";
import styles from "../styles/style";

import herobg from "../../public/images/herobg.webp";

import { Button } from "../components";
import type { SiteSettingsView } from "@/lib/types";

interface HeroProps {
  settings?: SiteSettingsView;
}

const defaults = {
  heroTitle: "মাহি কম্পিউটার ট্রেনিং ইনস্টিটিউট",
  heroSubtitle:
    "আমরা সব কোর্সের অ্যাডভান্স লেভেল শেখাচ্ছি এবং আমরা সঠিকভাবে সব কোর্সের যত্ন নেই । ঢাকা জেলার গুলশান, ভাটারা , বাড্ডা থানায় এই ট্রেনিং সেন্টারটি খুবই বিখ্যাত । আমরা বিশ্বাস করি 85% প্রাক্টিক্যাল কাজই সেরা প্রশিক্ষণ। আমরা সর্বোত্তম শিক্ষা দেওয়ার প্রতিশ্রুতি প্রদান করি।",
  heroNote: "কোর্স মেয়াদ: 03 মাস, 06 মাস, 12 মাস",
};

const Hero = ({ settings }: HeroProps) => {
  const s = { ...defaults, ...settings };
  return (
    <section
      className={"hero relative flex items-center overflow-hidden py-16 sm:py-24"}
      style={{
        backgroundImage: `linear-gradient(to right bottom, rgba(38,59,94,0.9), rgba(38,59,94,0.9)),url(${herobg.src})
        `,
      }}
    >
      <div className={`${styles.boxWidth} relative z-10 mx-auto`}>
        <div
          className={`${styles.flexCenter} flex-col items-center gap-5 text-center`}
        >
          <h2
            className={`${styles.heading2} max-w-4xl font-bangla text-white lg:text-[60px] vxs:text-[34px] xl:py-4 xs:py-2 mt-3 text-center`}
          >
            {s.heroTitle}
          </h2>
          <p
            className={`xl:text-[22px] xl:leading-10 vxs:text-[18px] vxs:leading-8 text-blue-50 font-bangla vxs:p-4 max-w-[820px] text-center `}
          >
            {s.heroSubtitle}
          </p>

          <p
            className={`leading-8 text-rose-50 font-bangla text-[24px] vxs:text-[20px] text-center w-full`}
          >
            {s.heroNote}
          </p>

          <Button styles="mt-3 font-bangla ">কোর্স সমূহ</Button>
        </div>
      </div>
      <div className=" absolute shape-1"></div>
    </section>
  );
};

export default Hero;
