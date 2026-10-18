import { ceo } from "@/public";
import Image from "next/image";
import { Quote } from "lucide-react";

const CEO = () => {
  return (
    <section
      id="ceo-message"
      className="section-shell relative scroll-mt-24 overflow-hidden bg-linear-to-b from-white via-blue-50/40 to-white"
    >
      {/* Soft decorative blobs — pointer-events-none so they never block taps */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -bottom-16 h-64 w-64 rounded-full bg-rose-100/30 blur-3xl"
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Section header */}
        <p
          className="text-center font-bangla text-[13px] font-bold uppercase tracking-[0.2em] text-blue-600"
          data-aos="fade-up"
        >
          CEO & Founder
        </p>
        <h2
          className="section-title mt-2 text-center font-bangla"
          data-aos="fade-up"
          data-aos-delay="60"
        >
          Message from CEO & Founder
        </h2>
        <div
          className="mx-auto mt-4 h-1 w-16 rounded-full bg-blue-600/70"
          aria-hidden
        />

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <div className="relative order-1 lg:order-none" data-aos="fade-right">
            <div
              className="absolute -inset-3 rounded-[2rem] border border-blue-100 bg-blue-50/40"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/60">
              <Image
                src={ceo}
                alt="CEO & Founder of Mahi Computer Institute"
                priority
                sizes="(min-width: 1200px) 45vw, 92vw"
                className="h-auto w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/35 via-transparent to-transparent"
                aria-hidden
              />
            </div>

            {/* CEO info badge */}
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-lg sm:left-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Quote size={18} aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                  Message
                </span>
                <span className="block font-bangla text-[15px] font-bold text-slate-900">
                  CEO & Founder
                </span>
              </span>
            </div>
          </div>

          {/* Copy */}
          <div className="order-2 lg:order-none" data-aos="fade-left">
            <div className="relative">
              <Quote
                className="absolute -left-1 -top-1 h-8 w-8 -translate-y-2 text-blue-100"
                aria-hidden
              />
              <p className="font-bangla text-[17px] leading-8 text-slate-700 sm:text-[18px] sm:leading-9">
                প্রিয় ছাত্রছাত্রীরা, আজকে আমাদের সম্মানিত কম্পিউটার প্রশিক্ষণ
                কেন্দ্রের সিইও হিসেবে আপনাদের সম্বোধন করতে পেরে আমি রোমাঞ্চিত। এটা
                অত্যন্ত গর্ব এবং উত্সাহের সাথে যে আমি কম্পিউটিং জগতে জ্ঞান, দক্ষতা
                বিকাশ এবং কর্মজীবনের উন্নতির যাত্রা শুরু করতে চাওয়া সকলকে উষ্ণ
                স্বাগত জানাই।
              </p>
            </div>

            <p className="mt-5 font-bangla text-[15px] leading-7 text-slate-600 sm:text-[16px] sm:leading-8">
              আমাদের কম্পিউটার প্রশিক্ষণ কেন্দ্রে, আমরা আপনাকে আজকের দ্রুতগতির,
              প্রযুক্তি-চালিত যুগে উন্নতির জন্য প্রয়োজনীয় সরঞ্জাম এবং দক্ষতার
              সাথে সজ্জিত করতে প্রতিশ্রুতিবদ্ধ। আমরা বুঝতে পারি যে ক্রমবর্ধমান
              ডিজিটাল বিশ্বে, যোগ্য এবং সু-প্রশিক্ষিত ব্যক্তিদের চাহিদা আগের
              যেকোনো সময়ের চেয়ে বেশি। অতএব, আমরা আমাদের প্রোগ্রামগুলিকে
              বিশদে মনোযোগ সহকারে ডিজাইন করেছি, নিশ্চিত করে যে সেগুলি শিল্পের
              মানগুলির সাথে সারিবদ্ধ হয় এবং চাকরির বাজারের ক্রমবর্ধমান
              চাহিদাগুলি পূরণ করে।
            </p>

            <p className="mt-5 font-bangla text-[15px] leading-7 text-slate-600 sm:text-[16px] sm:leading-8">
              আমাদের কম্পিউটার প্রশিক্ষণ কেন্দ্রে স্বাগতম, যেখানে স্বপ্ন উড়ে
              যায়।
            </p>

            <div className="mt-8 inline-flex flex-col rounded-2xl border border-slate-100 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-sm">
              <span className="font-bangla text-[16px] font-bold text-slate-900">
                মাহি কম্পিউটার ট্রেনিং সেন্টার
              </span>
              <span className="text-[13px] font-medium uppercase tracking-wider text-blue-600">
                CEO & Founder
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CEO;
