import Image from "next/image";
import { BookOpen, BriefcaseBusiness, Users } from "lucide-react";

import type { InstructorView } from "@/lib/types";

interface InstractorProps {
  instructors?: InstructorView[];
}

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Decimal digits → Bengali numerals, so the counts match the rest of the copy. */
const toBangla = (n: number) =>
  String(n).split("").map((d) => BANGLA_DIGITS[Number(d)]).join("");

/** Fallback avatar for instructors whose photo was never uploaded. */
const toInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2);
  return `${words[0][0]}${words[1][0]}`;
};

const Instractor = ({ instructors = [] }: InstractorProps) => {
  /* An instructor without a name is meaningless on screen, and a broken
     photo would leave a hole in the row — keep only renderable cards. */
  const list = instructors.filter((i) => i.name.trim());
  if (list.length === 0) return null;

  const totalCourses = list.reduce((sum, i) => sum + (i.courseCount ?? 0), 0);

  return (
    <section
      id="instructors"
      aria-labelledby="instructors-title"
      className="section-shell relative scroll-mt-24 overflow-hidden bg-linear-to-b from-blue-50/70 via-white to-pink-50/40"
    >
      {/* Soft decorative blobs — pointer-events-none so they never block taps */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-pink-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-350 px-4 sm:px-6">
        {/* ---------- Section header ---------- */}
        <p
          className="text-center font-bangla text-[13px] font-bold uppercase tracking-[0.2em] text-blue-600"
          data-aos="fade-up"
        >
          প্রশিক্ষক মণ্ডলী
        </p>
        <h2
          id="instructors-title"
          className="section-title mt-2 text-center font-bangla"
          data-aos="fade-up"
          data-aos-delay="60"
        >
          আমাদের কোর্স প্রশিক্ষক
        </h2>
        <div
          aria-hidden
          className="mx-auto mt-4 h-1 w-16 rounded-full bg-linear-to-r from-blue-600 to-teal-400"
          data-aos="zoom-in"
          data-aos-delay="120"
        />
        <p
          className="mx-auto mt-4 max-w-2xl text-center font-bangla text-[15px] leading-7 text-slate-500 sm:text-[16px]"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          অভিজ্ঞ ও যোগ্য প্রশিক্ষকদের তত্ত্বাবধানে পেশাদার কম্পিউটার কোর্সে
          দক্ষতা অর্জন করুন
        </p>

        {/* ---------- Quick stats ---------- */}
        <div
          className="mx-auto mt-6 flex w-fit flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-blue-100 bg-white/80 px-5 py-2.5 shadow-sm backdrop-blur-sm"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <span className="flex items-center gap-2 font-bangla text-[14px] font-semibold text-slate-700">
            <Users size={16} className="text-blue-600" aria-hidden />
            {toBangla(list.length)} জন অভিজ্ঞ প্রশিক্ষক
          </span>
          {totalCourses > 0 && (
            <>
              <span aria-hidden className="h-4 w-px bg-slate-200" />
              <span className="flex items-center gap-2 font-bangla text-[14px] font-semibold text-slate-700">
                <BookOpen size={16} className="text-teal-600" aria-hidden />
                {toBangla(totalCourses)} টি কোর্স পড়ানো হয়
              </span>
            </>
          )}
        </div>

        {/* ---------- Cards ---------- */}
        <ul className="mt-10 grid list-none grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {list.map((item, i) => {
            const courses = item.courseCount ?? 0;
            const photo = item.img.trim();

            /* Animation on the wrapper, hover on the card — keeps AOS's
               transition-property override from killing the hover animation. */
            return (
              <li
                key={item.id ?? `${item.name}-${i}`}
                className="h-full"
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 90}
              >
                <article className="group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-slate-100 bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/10">
                  {/* Brand-gradient hairline, sweeps in from the left on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-linear-to-r from-blue-600 via-teal-500 to-emerald-400 transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />

                  {/* Soft panel the avatar sits on */}
                  <div
                    aria-hidden
                    className="relative h-20 w-full overflow-hidden bg-linear-to-br from-blue-50 via-sky-50 to-teal-50"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-blue-200/40 blur-2xl" />
                    <div className="pointer-events-none absolute -left-8 -bottom-12 h-24 w-24 rounded-full bg-teal-200/40 blur-2xl" />
                  </div>

                  {/* Index badge */}
                  <span
                    aria-hidden
                    className="absolute right-4 top-3 z-20 rounded-full bg-white/85 px-2.5 py-1 font-bangla text-[12px] font-bold text-slate-500 backdrop-blur-sm"
                  >
                    {toBangla(i + 1)}
                  </span>

                  {/* Avatar — overlaps the panel */}
                  <div className="relative -mt-14 h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-100 to-teal-50">
                        <span className="font-bangla text-3xl font-bold text-blue-300">
                          {toInitials(item.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col items-center px-4 pb-5 pt-4">
                    <h3 className="font-bangla text-[16px] font-bold leading-6 text-slate-900 transition-colors duration-300 group-hover:text-blue-700">
                      {item.name}
                    </h3>

                    {item.des.trim() && (
                      <span
                        title={item.des}
                        className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[12.5px] font-semibold text-blue-700 ring-1 ring-blue-100"
                      >
                        <BriefcaseBusiness size={12} className="shrink-0" aria-hidden />
                        <span className="line-clamp-1 min-w-0">{item.des}</span>
                      </span>
                    )}

                    {courses > 0 && (
                      <p className="mt-auto flex items-center gap-1.5 pt-3 text-[12px] font-semibold text-slate-500">
                        <BookOpen size={13} className="text-teal-500" aria-hidden />
                        {toBangla(courses)} টি কোর্স পড়ান
                      </p>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Instractor;
