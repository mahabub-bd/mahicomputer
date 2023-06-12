import React from "react";
import styles, { layout } from "../styles/style";

import Image from "next/image";

import { Button } from "../components";
import { app, cad, office, paymentapp, rating, webdesign } from "@/public";

const Hero = () => {
  return (
    <div className="hero shadow-md  relative ">
      <div className={`${styles.boxWidth}    `}>
        <div className={`${styles.flexCenter} flex-col justify-between`}>
          <h2
            className={`${styles.heading2} text-white animate-charcter xl:text-[46px] xl:py-10 xs:py-4 mt-3 text-center`}
          >
            মাহি কম্পিউটার ট্রেনিং ইনস্টিটিউট
          </h2>
          <p
            className={` text-lg  mt-5 leading-10 text-white  p-3 max-w-[900px] text-justify `}
          >
            আমরা সব কোর্সের অ্যাডভান্স লেভেল শেখাচ্ছি এবং আমরা সঠিকভাবে সব
            কোর্সের যত্ন নেই । ঢাকা জেলার গুলশান, ভাটারা , বাড্ডা থানায় এই
            ট্রেনিং সেন্টারটি খুবই বিখ্যাত । আমরা বিশ্বাস করি 85% প্রাক্টিক্যাল
            কাজই সেরা প্রশিক্ষণ। আমরা সর্বোত্তম শিক্ষা দেওয়ার প্রতিশ্রুতি
            প্রদান করি।
          </p>

          <p
            className={`  text-xl mt-5 leading-10 text-[#FFB802] text-center  w-full`}
          >
            কোর্স মেয়াদ: 03 মাস, 06 মাস, 1 বছর
          </p>

          <Button styles="my-5 ">Get Started</Button>
        </div>
      </div>
      <div className=" absolute  shape-1 ">
        <Image src={webdesign} alt="rating" />
      </div>
      <div className=" absolute  shape-2">
        <Image src={office} alt="rating" />
      </div>
      <div className=" absolute  shape-3">
        <Image src={cad} alt="rating" />
      </div>
    </div>
  );
};

export default Hero;
