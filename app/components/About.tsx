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
            className="flex flex-col flex-1  sm:px-16 px-4"
            data-aos="fade-right"
          >
            <p
              className={`${styles.paragraph} mt-5 text-justify  font-bangla `}
            >
              মাহি কম্পিউটার ট্রেনিং সেন্টার, গুলশান, ঢাকা হলো একটি প্রযুক্তি
              শিক্ষার প্রতিষ্ঠান। এটি ঢাকার গুলশান এলাকায় অবস্থিত একটি জনপ্রিয়
              কম্পিউটার ট্রেনিং সেন্টার। এই প্রতিষ্ঠানটি বিভিন্ন প্রযুক্তি
              বিষয়ে প্রশিক্ষণ প্রদান করে এবং ছাত্রদের প্রযুক্তি দক্ষতা বৃদ্ধি
              করে। এখানে কম্পিউটার
              অপারেটিং সিস্টেম, কম্পিউটার নেটওয়ার্কিং, ওয়েব ডেভেলপমেন্ট,
              গ্রাফিক্স ডিজাইনিং, মাল্টিমিডিয়া, অটোক্যাড, প্রোগ্রামিং এবং
              ডাটাবেস ম্যানেজমেন্ট এমনকি ইথিক্যাল হ্যাকিং এই ধরণের বিভিন্ন
              প্রশিক্ষণ কোর্স উপলব্ধ আছে।
            </p>

            <p className={`${styles.paragraph} mt-5 text-justify font-bangla`}>
              মাহি কম্পিউটার ট্রেনিং সেন্টারে উপযুক্ত শিক্ষার্থীদের জন্য
              সুবিধাজনক শিক্ষামূলক পাঠ্যপুস্তক এবং নতুনত্বপূর্ণ কম্পিউটার
              যন্ত্রাংশ ও সফ্টওয়্যার প্রদান করা হয়। এছাড়াও, প্রশিক্ষকদের
              পরামর্শ ও পরিচালনা নিশ্চিত করে ছাত্রদের ভাল প্রশিক্ষণ দেয়া হয়।
              মাহি কম্পিউটার ট্রেনিং সেন্টার যোগ্যতামূলক উপকরণ ও সুযোগ-সুবিধা সহ
              একটি আধুনিক কম্পিউটার ট্রেনিং প্রতিষ্ঠান। 
            </p>
          </div>
          <div
            className={`flex flex-1 items-center xl:justify-end vxs:justify-center `}
            data-aos="fade-left"
          >
            <Image
              src={paymentapp}
              alt="paymentapp "
              className="w-[95%] rounded-md shadow-md "
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
