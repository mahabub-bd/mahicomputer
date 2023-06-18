import React from "react";
import styles, { layout } from "../styles/style";

import Image from "next/image";

import { Button } from "../components";



const Hero = () => {
  return (
    <div className="hero bg-[#263b5e] relative ">
      <div className={`${styles.boxWidth} z-100`}>
        <div className={`${styles.flexCenter} flex-col justify-between`}>
          <h2
            className={`${styles.heading2}  font-bangla animate-charcter xl:text-[60px] lg:text-[50px] xl:py-10 xs:py-4 mt-3 text-center`}
          >
            মাহি কম্পিউটার ট্রেনিং ইনস্টিটিউট
          </h2>
          <p
            className={` xl:text-[24px]  mt-5 xl:leading-12 vxs:text-[18px] vxs:leading-8 text-blue-50 font-bangla p-3 max-w-[900px] text-justify `}
          >
            আমরা সব কোর্সের অ্যাডভান্স লেভেল শেখাচ্ছি এবং আমরা সঠিকভাবে সব
            কোর্সের যত্ন নেই । ঢাকা জেলার গুলশান, ভাটারা , বাড্ডা থানায় এই
            ট্রেনিং সেন্টারটি খুবই বিখ্যাত । আমরা বিশ্বাস করি 85% প্রাক্টিক্যাল
            কাজই সেরা প্রশিক্ষণ। আমরা সর্বোত্তম শিক্ষা দেওয়ার প্রতিশ্রুতি
            প্রদান করি।
          </p>

          <p
            className={`mt-5 leading-8 text-rose-50 font-bangla  text-[30px] text-center  w-full`}
          >
            কোর্স মেয়াদ: 03 মাস, 06 মাস, 12 মাস
          </p>

          <Button styles="my-5 font-bangla" >কোর্স সমূহ</Button>
        </div>
        <div className="shape-2"></div>
        

        <div className=" absolute shape-3"></div>
      </div>
    </div>
  );
};

export default Hero;
