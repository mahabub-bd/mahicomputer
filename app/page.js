"use client";

import AOS from "aos";
import "aos/dist/aos.css";


import { useEffect } from "react";
import { Carousel } from "./components";

const HomePage = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className=" w-full overflow-hidden ">
      <marquee behavior="" direction="">
        <strong>
          “বাংলাদেশ কারিগরি শিক্ষাবোর্ড কর্তৃক অনুমোদিত প্রতিষ্ঠান। কোড: 50969 ।
          **** মাহি কম্পিউটার আধুনিক কম্পিউটার শিক্ষার উন্নয়নে এক অনন্য উদহারণ।
          *** মাহী সকল কোর্স 85% প্যাক্ট্রিক্যাল কাজের মাধ্যমে বাস্তবমূখী
          ট্রেনিং প্রদান করেন। *** প্রশিক্ষন শেষে কারিগরি শিক্ষাবোর্ডের অধীনে
          পরীক্ষার মাধ্যমে সরকারী সার্টিফিকেট প্রদান করেন। **** মাহী 100% পাশের
          নিশ্চয়তা প্রদান করেন। ইনশাল্লাহ । 
        </strong>
      </marquee>
      <Carousel />
    </div>
  );
};

export default HomePage;
