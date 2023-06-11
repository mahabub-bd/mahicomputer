import React from "react";
import styles, { layout } from "../styles/style";

import Image from "next/image";

import { Button } from "../components";


const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-900 to-blue-900 xl:h-[50vh] lg:h-[65vh] md:h-[90vh] bg-clip-padding ">
      <div className={`${styles.boxWidth}    `}>
        <div className={`${styles.flexCenter} flex-col`}>
          <h2
            className={`${styles.heading2} text-white   animate-charcter xl:py-20 xs:py-5 text-center `}
          >
            মাহি কম্পিউটার ট্রেনিং ইনস্টিটিউট
          </h2>
          <p
            className={` text-lg  mt-5 leading-10 text-white text-center p-2 `}
          >
            আমরা সব কোর্সের অ্যাডভান্স লেভেল শেখাচ্ছি এবং আমরা সঠিকভাবে সব
            কোর্সের যত্ন নিই। ঢাকা জেলার গুলশান,ভাটারা, বাড্ডা থানায় এই ট্রেনিং
            সেন্টারটি খুবই বিখ্যাত । আমরা বিশ্বাস করি 85% প্রাক্টিক্যাল কাজই
            সেরা প্রশিক্ষণ। আমরা সর্বোত্তম শিক্ষা দেওয়ার প্রতিশ্রুতি প্রদান
            করি।
          </p>

          <p
            className={`  text-xl mt-5 leading-10 text-[#FFB802] text-center  w-full`}
          >
            কোর্স মেয়াদ: 03 মাস, 06 মাস, 1 বছর
          </p>

          <Button styles="my-10 ">Get Started</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;



