import { ceo, paymentapp, shape3 } from "@/public";
import Image from "next/image";
import styles from "../styles/style";

const CEO = () => {
  return (
    <div className="relative bg" id="about">
      <section className={`${styles.boxWidth} ${styles.paddingY} mx-auto`}>
        <h2
          className={`text-center ${styles.heading2} font-bangla `}
          data-aos="fade-up"
        >
          Message from CEO & Founder
        </h2>

        <div className={`flex md:flex-row flex-col`}>
          <div
            className={`flex flex-1 items-center xl:justify-start vxs:justify-center `}
            data-aos="fade-right"
          >
            <Image
              src={ceo}
              alt="paymentapp "
              className="w-[95%] rounded-md shadow-md"
              priority
            />
          </div>
          <div
            className="flex flex-col flex-1 sm:px-16 px-6 "
            data-aos="fade-right"
          >
            <p className={`${styles.paragraph} text-justify font-bangla`}>
              প্রিয় ছাত্রছাত্রীরা, আজকে আমাদের সম্মানিত কম্পিউটার প্রশিক্ষণ
              কেন্দ্রের সিইও হিসেবে আপনাদের সম্বোধন করতে পেরে আমি রোমাঞ্চিত। এটা
              অত্যন্ত গর্ব এবং উত্সাহের সাথে যে আমি কম্পিউটিং জগতে জ্ঞান, দক্ষতা
              বিকাশ এবং কর্মজীবনের উন্নতির যাত্রা শুরু করতে চাওয়া সকলকে উষ্ণ
              স্বাগত জানাই।
            </p>

            <p className={`${styles.paragraph} mt-5 text-justify font-bangla`}>
              আমাদের কম্পিউটার প্রশিক্ষণ কেন্দ্রে, আমরা আপনাকে আজকের দ্রুতগতির,
              প্রযুক্তি-চালিত যুগে উন্নতির জন্য প্রয়োজনীয় প্রয়োজনীয় সরঞ্জাম
              এবং দক্ষতার সাথে সজ্জিত করতে প্রতিশ্রুতিবদ্ধ। আমরা বুঝতে পারি যে
              ক্রমবর্ধমান ডিজিটাল বিশ্বে, যোগ্য এবং সু-প্রশিক্ষিত ব্যক্তিদের
              চাহিদা আগের যেকোনো সময়ের চেয়ে বেশি। অতএব, আমরা আমাদের
              প্রোগ্রামগুলিকে বিশদে মনোযোগ সহকারে ডিজাইন করেছি, নিশ্চিত করে যে
              সেগুলি শিল্পের মানগুলির সাথে সারিবদ্ধ হয় এবং চাকরির বাজারের
              ক্রমবর্ধমান চাহিদাগুলি পূরণ করে৷ আমাদের কম্পিউটার প্রশিক্ষণ
              কেন্দ্রে স্বাগতম, যেখানে স্বপ্ন উড়ে যায়।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CEO;
