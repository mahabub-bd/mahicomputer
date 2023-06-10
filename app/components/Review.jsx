import React from "react";
import styles from "../styles/style";
import { ReviewCard } from "../components";
import { review } from "../constants";


const Review = () => {
  return (
    <div className={`${styles.boxWidth} my-5`}>
      <h2 className={`${styles.heading2} text-center my-4`}>Review & Rating</h2>
      <p className={`${styles.paragraph} text-center`}>
        Pick your favorite course from our hand Picked categories.
      </p>
      <p className={`${styles.paragraph} text-center`}>
        A Well organized collection of excellence
      </p>
      <div className="flex flex-wrap  justify-center w-full  ">
        {review.map((card, index) => (
          <ReviewCard key={card.id} index={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Review;
