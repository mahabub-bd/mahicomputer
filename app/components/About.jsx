import { paymentapp, shape3 } from "@/public";
import Image from "next/image";
import styles from "../styles/style";

const About = () => {
  return (
    <div className="relative" id="about">
      <section className={`${styles.boxWidth} ${styles.paddingY} mx-auto`}>
        <h2
          className={`text-center ${styles.heading2} font-bangla `}
          data-aos="fade-up"
        >
          About Mahi Computer Institute
        </h2>

        <div className={`flex md:flex-row flex-col ${styles.paddingY}`}>
          <div
            className="flex flex-col flex-1  sm:px-16 px-6"
            data-aos="fade-right"
          >
            <p
              className={`${styles.paragraph} mt-5 text-justify  font-bangla `}
            >
              কোন দেশের সম্পদ হল দক্ষ জনশক্তি , তাই দক্ষ জনশক্তি গড়ার লক্ষ্য
              ২০২১ সালে মাহি কম্পিউটার গঠন করা হয় । এখানে বিভিন্ন বিষয়ে
              ব্যবহারিক প্রশিক্ষন দেওয়া হয় । মাহি কম্পিউটার কারিগরি শিক্ষাবোর্ড
              কর্তৃক অনুমোদিত প্রতিষ্ঠান । প্রশিক্ষন শেষে কারিগরি শিক্ষাবোর্ডের
              অধীনে পরীক্ষার মাধ্যমে সরকারী সার্টিফিকেট প্রদান করা হয়
            </p>

            <p className={`${styles.paragraph} mt-5 text-justify font-bangla`}>
              ইঞ্জিনিয়ার মনিরুজ্জামান ২০২১ সালে দক্ষ জনশক্তি করার লক্ষ্য মাহি
              কম্পিউটার গঠন করেন . মাহি কম্পিউটার ওয়েভ ডেভেলপমেন্ট, অফিস
              প্রোগ্রাম , অটো ক্যাড , ভিডিও এডিটিং , থ্রী-ডি স্টুডিও ম্যাক্স,
              ইংলিশ ল্যাংগুয়েজ কোর্স , জাপানি ল্যাংগুয়েজ কোর্স ,কম্পিউটার
              হার্ডওয়্যার কোর্স ইত্যাদি বিষয়ে প্রশিক্ষণ প্রদান করে থাকে ।
            </p>
          </div>
          <div
            className={`flex flex-1 items-center xl:justify-end vxs:justify-center sm:px-16 xl:px-0 `}
            data-aos="fade-left"
          >
            <Image
              src={paymentapp}
              alt="paymentapp "
              className="w-[100%] rounded-md shadow-md "
              priority
            />
          </div>
        </div>
      </section>

      <Image
        src={shape3}
        alt="about"
        className="absolute z-[-50] bottom-0 left-0"
      />
    </div>
  );
};

export default About;
