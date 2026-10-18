import Image from "next/image";
import styles from "../styles/style";

import type { CategoryView } from "@/lib/types";
import { shape, shape2 } from "@/public";
import { categories as staticCategories } from "../constants";

interface CategoriesProps {
  categories?: CategoryView[];
}

const Categories = ({ categories = staticCategories }: CategoriesProps) => {
  return (
    <section className="relative overflow-hidden" id="categories">
      <div className={`${styles.boxWidth} section-shell mx-auto px-4 sm:px-6`}>
        <h2
          className={`${styles.heading2} section-title text-center font-bangla`}
          data-aos="fade-up"
        >
          আমাদের সার্ভিস সমূহ
        </h2>
        <p
          className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          আপনার ক্যারিয়ার গড়তে আমরা সম্পূর্ণ হাতেকলমে প্রশিক্ষণ দিয়ে সহায়তা
          করি
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 lg:gap-5">
          {categories.map((item, i) => (
            /* Animation lives on the wrapper; hover lives on the card.
               Keeping them on separate elements avoids AOS overriding the
               card's transition-property (which made hover snap instantly). */
            <div
              key={`${item.alt}-${item.title}-${i}`}
              data-aos="fade-up"
              data-aos-delay={(i % 8) * 70}
            >
              <article className="group flex h-full min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-lg">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-50/70 ring-1 ring-blue-100/70 transition duration-300 group-hover:bg-blue-600 group-hover:ring-blue-600">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-4 text-center text-[15px] font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">
                  {item.title}
                </h3>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative shapes: pointer-events-none so they never intercept card hover */}
      <Image
        src={shape}
        className="pointer-events-none absolute left-0 top-10 hidden w-28 opacity-60 sm:block"
        alt=""
        aria-hidden
      />
      <Image
        src={shape2}
        className="pointer-events-none absolute right-0 top-0 hidden w-32 opacity-60 sm:block"
        alt=""
        aria-hidden
      />
    </section>
  );
};

export default Categories;
