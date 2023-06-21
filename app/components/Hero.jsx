import React from "react";
import styles from "../styles/style";

import img from "../../public/images/herobg.webp"

import { Button } from "../components";



const Hero = () => {
  return (
    <div
      className="hero relative "
      style={{
        backgroundImage: `linear-gradient(to right bottom, rgba(38,59,94,0.9), rgba(38,59,94,0.9)),url(${img.src}); 
        `,
      }}
    >
      <div className={`${styles.boxWidth} z-100`}>
        <div
          className={`${styles.flexCenter} flex-col justify-between items-center `}
        >
          <h2
            className={`${styles.heading2}  font-bangla animate-charcter xl:text-[60px] xs:text-[40px] xl:py-10 xs:py-4 mt-3 text-center`}
          >
            মাহি কম্পিউটার ট্রেনিং ইনস্টিটিউট
          </h2>
          <p
            className={` xl:text-[24px]  mt-5 xl:leading-16 vxs:text-[18px] vxs:leading-8 text-blue-50 font-bangla p-3 max-w-[900px] text-justify `}
          >
            আমরা সব কোর্সের অ্যাডভান্স লেভেল শেখাচ্ছি এবং আমরা সঠিকভাবে সব
            কোর্সের যত্ন নেই । ঢাকা জেলার গুলশান, ভাটারা , বাড্ডা থানায় এই
            ট্রেনিং সেন্টারটি খুবই বিখ্যাত । আমরা বিশ্বাস করি 85% প্রাক্টিক্যাল
            কাজই সেরা প্রশিক্ষণ। আমরা সর্বোত্তম শিক্ষা দেওয়ার প্রতিশ্রুতি
            প্রদান করি।
          </p>

          <p
            className={`mt-5 leading-8 text-rose-50 font-bangla  text-[30px] xs:text-[24px] text-center  w-full`}
          >
            কোর্স মেয়াদ: 03 মাস, 06 মাস, 12 মাস
          </p>

          <Button styles="mt-20 font-bangla ">কোর্স সমূহ</Button>
        </div>
      </div>
      <div className=" absolute shape-1"></div>
    </div>
  );
};

export default Hero;
