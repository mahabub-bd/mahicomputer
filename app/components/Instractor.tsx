import React from "react";
import styles from "../styles/style";
import Image from "next/image";

import { instractor as staticInstractor } from "../constants";
import type { InstructorView } from "@/lib/types";

interface InstractorProps {
  instructors?: InstructorView[];
}

const Instractor = ({ instructors = staticInstractor }: InstractorProps) => {
  return (
    <section
      id="instructors"
      className="section-shell bg-linear-to-b from-pink-50 via-blue-50/60 to-white"
    >
      <div className={`${styles.boxWidth} mx-auto px-4 sm:px-6`}>
        <h2
          className={`${styles.heading2} section-title text-center font-bangla`}
          data-aos="fade-up"
        >
          আমাদের কোর্স প্রশিক্ষক
        </h2>
        <p
          className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          অভিজ্ঞ ও যোগ্য প্রশিক্ষকদের তত্ত্বাবধানে পেশাদার কম্পিউটার কোর্সে
          দক্ষতা অর্জন করুন
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {instructors.map((item, i) => (
            /* Animation on the wrapper, hover on the card — keeps AOS's
               transition-property override from killing the hover animation. */
            <div
              key={item.id ?? `${item.name}-${item.des}`}
              data-aos="fade-up"
              data-aos-delay={(i % 5) * 80}
            >
              <div className="group h-full cursor-pointer rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1200px) 30vw, 220px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-slate-900/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="px-1 pb-1 pt-3 text-center">
                  <h3 className="font-bangla text-[17px] font-bold text-mahitwo">
                    {item.name}
                  </h3>
                  <p className="mt-2 inline-block max-w-full truncate rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold text-blue-700">
                    {item.des?.trim() || "Instructor"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instractor;
