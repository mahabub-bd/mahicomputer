import { ceo, paymentapp, shape3 } from "@/public";
import Image from "next/image";
import styles from "../styles/style";

const CEO = () => {
  return (
    <div className=" relative bg   " id="about">
      <section className={`${styles.boxWidth} ${styles.paddingY} mx-auto`}>
        <h2
          className={`text-center ${styles.heading2} font-bangla `}
          data-aos="fade-up"
        >
          Message from CEO & Founder
        </h2>

        <div className={`flex md:flex-row flex-col ${styles.paddingY}`}>
          <div
            className={`flex flex-1 items-center xl:justify-start vxs:justify-center `}
            data-aos="fade-right"
          >
            <Image
              src={ceo}
              alt="paymentapp "
              className="w-[80%] rounded-md shadow-md"
              priority
            />
          </div>
          <div
            className="flex flex-col flex-1 xl:px-0 sm:px-16 px-6"
            data-aos="fade-left"
          >
            <p
              className={`${styles.paragraph} mt-5 text-justify  font-bangla `}
            >
              অত্যন্ত অল্প বেতনে আমরা বিশ্বমানের অটোক্যাড ২ডি, থ্রি-ডি স্টেডিও
              ম্যাকাস্ এর মাধ্যমে ড্রইনিং শিক্ষা দিচ্ছি- যাহা বড়ই আর্কষনীয় ।
              অল্প সময়ের মধ্যে যে কোন বাড়ি ড্রইং করতে সক্ষম। তাছাড়া ট্রেনিং শেষে
              বাংলাদেশ কারিগড়ি শিক্ষাবোর্ড কর্তৃক পরীক্ষার মাধম্যে সার্টিফিকেট
              গ্রহণ করতে পারবেন। ইনশাল্লাহ্ ।
            </p>

            <p className={`${styles.paragraph} mt-5 text-justify font-bangla`}>
              ইঞ্জিনিয়ার মনিরুজ্জামান ২০২১ সালে দক্ষ জনশক্তি করার লক্ষ্য মাহি
              কম্পিউটার গঠন করেন . মাহি কম্পিউটার ওয়েভ ডেভেলপমেন্ট, অফিস
              প্রোগ্রাম , অটো ক্যাড , ভিডিও এডিটিং , থ্রী-ডি স্টুডিও ম্যাক্স,
              ইংলিশ ল্যাংগুয়েজ কোর্স , জাপানি ল্যাংগুয়েজ কোর্স ,কম্পিউটার
              হার্ডওয়্যার কোর্স ইত্যাদি বিষয়ে প্রশিক্ষণ প্রদান করে থাকে ।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CEO;
