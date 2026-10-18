import { Phone } from "lucide-react";
import EnrollButton from "@/app/_components/EnrollButton";

interface AdmissionBannerProps {
  courses?: string[];
}

/** Bold mid-page banner: admission is open — enroll or call. */
const AdmissionBanner = ({ courses = [] }: AdmissionBannerProps) => {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <div
        className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-800 via-blue-700 to-blue-600 px-6 py-10 text-center shadow-xl sm:px-12"
        data-aos="zoom-in"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10"
        />

        <p className="font-bangla text-[13px] font-bold uppercase tracking-[0.2em] text-blue-200">
          ভর্তি চলছে
        </p>
        <h2 className="mt-2 font-bangla text-[clamp(1.5rem,3.5vw,2.4rem)] font-bold leading-snug text-white">
          নতুন ব্যাচে ভর্তি শুরু হয়েছে — আপনার সিট বুক করুন আজই
        </h2>
        <p className="mx-auto mt-2 max-w-2xl font-bangla text-[14px] leading-6 text-blue-100">
          সীমিত আসন, ভর্তি শেষ হলে অপেক্ষা করতে হবে পরের ব্যাচের জন্য।
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <EnrollButton
            courses={courses}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[15px] font-bold text-blue-700 shadow-md transition hover:bg-blue-50"
          />
          <a
            href="tel:+8801711102944"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-white/10"
          >
            <Phone size={16} />
            কল করুন: +8801711102944
          </a>
        </div>
      </div>
    </section>
  );
};

export default AdmissionBanner;
