import Image from "next/image";
import styles from "../styles/style";

import type { CategoryView } from "@/lib/types";
import { shape, shape2 } from "@/public";

interface CategoriesProps {
  categories?: CategoryView[];
}

const Categories = ({ categories = [] }: CategoriesProps) => {
  return (
    <section className="relative overflow-hidden" id="categories">
      <div className="section-shell mx-auto max-w-350 px-4 sm:px-6">
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
              <article className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-100 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-lg sm:p-3">
                {/* Large image tile — fills the card width with a fixed ratio */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-blue-50/70 ring-1 ring-blue-100/70 transition duration-300 group-hover:bg-blue-600/10 group-hover:ring-blue-200">
                  <Image
                    src={item.img}
                    alt={item.alt}
                    fill
                    loading={i < 6 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 150px"
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-110 sm:p-3"
                  />
                </div>
                <h3 className="mt-2 line-clamp-1 min-h-5 text-center text-[14px] font-semibold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-blue-700 sm:text-[15px]">
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
