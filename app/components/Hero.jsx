import React from "react";
import styles, { layout } from "../styles/style";

import Image from "next/image";

import { Button } from "../components";
import { shape, shape2 } from "@/public";

const Hero = () => {
  return (
    <div className="hero  relative ">
      <div className={`${styles.boxWidth} z-100`}>
        <div className={`${styles.flexCenter} flex-col justify-between`}>
          <h2
            className={`${styles.heading2}  text-white font-bangla animate-charcter xl:text-[50px] xl:py-10 xs:py-4 mt-3 text-center`}
          >
            মাহি কম্পিউটার ট্রেনিং ইনস্টিটিউট
          </h2>
          <p
            className={` xl:text-[24px]  mt-5 xl:leading-12 vxs:text-[18px] vxs:leading-8 text-blue-900 font-bangla   p-3 max-w-[900px] text-justify `}
          >
            আমরা সব কোর্সের অ্যাডভান্স লেভেল শেখাচ্ছি এবং আমরা সঠিকভাবে সব
            কোর্সের যত্ন নেই । ঢাকা জেলার গুলশান, ভাটারা , বাড্ডা থানায় এই
            ট্রেনিং সেন্টারটি খুবই বিখ্যাত । আমরা বিশ্বাস করি 85% প্রাক্টিক্যাল
            কাজই সেরা প্রশিক্ষণ। আমরা সর্বোত্তম শিক্ষা দেওয়ার প্রতিশ্রুতি
            প্রদান করি।
          </p>

          <p
            className={`  text-xl mt-5 leading-8 text-[#6d28d9] font-bangla  text-[32px] text-center  w-full`}
          >
            কোর্স মেয়াদ: ০৩ মাস, ০৬ মাস, এক বছর
          </p>

          <Button styles="my-10 font-bangla ">শুরু করুন</Button>
        </div>
      </div>

      <Image
        src={shape}
        className=" absolute top-0 left-0 shape-image z-[-50] "
        alt="shape"
        priority
      />
      <Image
        src={shape2}
        className=" absolute top-0 right-0 shape-image z-[-50]"
        alt="shape"
        priority
      />
    </div>
  );
};

export default Hero;
