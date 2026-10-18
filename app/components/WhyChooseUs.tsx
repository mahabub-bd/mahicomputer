import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  MonitorCheck,
  Users,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FEATURES: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: MonitorCheck,
    title: "৮৫% হাতে-কলমে প্র্যাক্টিক্যাল",
    text: "প্রতিটি ক্লাসে ল্যাবে বসে নিজে করে শেখা — শুধু থিওরি নয়।",
  },
  {
    Icon: Users,
    title: "অভিজ্ঞ প্রশিক্ষক",
    text: "ইন্ডাস্ট্রি-অভিজ্ঞ প্রশিক্ষকমণ্ডলীর তত্ত্বাবধানে প্রশিক্ষণ।",
  },
  {
    Icon: BadgeCheck,
    title: "সার্টিফিকেট",
    text: "কোর্স শেষে সনদ যা চাকরি ও ফ্রিল্যান্সিংয়ে কাজে লাগে।",
  },
  {
    Icon: BriefcaseBusiness,
    title: "ফ্রিল্যান্সিং গাইডলাইন",
    text: "কোর্স শেষে ফ্রিল্যান্সিং ও চাকরির দিকনির্দেশনা।",
  },
  {
    Icon: Clock3,
    title: "ফ্লেক্সিবল ব্যাচ",
    text: "সকাল-বিকাল-সন্ধ্যা — নিজের সুবিধামতো ব্যাচ বেছে নিন।",
  },
  {
    Icon: Wifi,
    title: "মডার্ন ল্যাব ও ইন্টারনেট",
    text: " সম্পূর্ণ এসি ল্যাব, হাই-স্পিড ইন্টারনেটসহ প্রতিটি পিসি।",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-shell bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <h2 className="section-title text-center font-bangla" data-aos="fade-up">
          কেন মাহি কম্পিউটার ট্রেনিং সেন্টার?
        </h2>
        <p
          className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[15px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          সঠিক প্রশিক্ষণই ক্যারিয়ারের প্রথম সিঁড়ি — আমরা তাই প্রতিটি শিক্ষার্থীর
          যত্ন নিই
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }, i) => (
            <div
              key={title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 80}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 font-bangla text-[17px] font-bold text-slate-900">
                {title}
              </h3>
              <p className="mt-1.5 font-bangla text-[14px] leading-6 text-slate-500">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
