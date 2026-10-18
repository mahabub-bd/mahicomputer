import { Star } from "lucide-react";
import { ReviewCard } from "../components";
import styles from "../styles/style";
import type { ReviewView } from "@/lib/types";

interface ReviewProps {
  reviews?: ReviewView[];
}

const Review = ({ reviews = [] }: ReviewProps) => {
  const rated = reviews.filter((r) => r.rating > 0);
  const avg = rated.length
    ? rated.reduce((sum, r) => sum + r.rating, 0) / rated.length
    : 0;

  return (
    <section
      id="review"
      className="section-shell bg-linear-to-b from-blue-50/50 to-white"
    >
      <div className={`${styles.boxWidth} mx-auto px-4 sm:px-6`}>
        <h2
          className={`${styles.heading2} section-title text-center font-bangla`}
          data-aos="fade-up"
        >
          কোর্স সম্পর্কে শিক্ষার্থীদের অভিমত
        </h2>
        <p
          className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          শিক্ষার্থীগণ সর্বদাই মাহি কম্পিউটার এর প্রতি তাদের ভালবাসা প্রকাশ
          করেছেন
        </p>

        {rated.length > 0 && (
          <div
            className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="text-[15px] font-bold text-slate-800">
              {avg.toFixed(1)}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[14px] text-slate-500">
              {reviews.length} টি মতামত
            </span>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((card, i) => (
            <div
              key={card.id}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 90}
            >
              <ReviewCard {...card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Review;
