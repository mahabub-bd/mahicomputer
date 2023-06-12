"use client";
import React from "react";
import styles from "../styles/style";
import { ReviewCard } from "../components";
import { review } from "../constants";

const Review = () => {
  return (
    <div id="review" className={`${styles.boxWidth} my-5 `}>
      <h2 className={`${styles.heading2} font-bangla text-center my-4`}>
        কোর্স সম্পর্কে লার্নারদের অভিমত
      </h2>
      <p className="font-bangla text-center text-[18px]">
        লার্নাররা সর্বদাই মাহি কম্পিউটার এর প্রতি তাদের ভালবাসা প্রকাশ করেছেন
      </p>
      <div
        className="flex flex-wrap  justify-center w-full  "
        data-aos="fade-left"
      >
        {review.map((card, index) => (
          <ReviewCard key={card.id} index={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Review;
