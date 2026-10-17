import React from "react";
import styles from "../styles/style";


import { CourseCard } from "../components";
import { courses } from "../constants";

const Courses = () => {
  return (
    <div id="courses">
      <div className={`${styles.boxWidth}`}>
        <h2
          className={`${styles.heading2} text-center my-4 font-bangla`}
          data-aos="fade-up"
        >
          আমাদের কোর্সসমূহ
        </h2>

        <div className="flex flex-wrap my-10 gap-8 justify-around">
          {courses.map((card) => (
            <CourseCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
