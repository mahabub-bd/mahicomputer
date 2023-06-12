import React from "react";
import styles from "../styles/style";


import Link from "next/link";

import { CourseCard } from "../components";
import { courses } from "../constants";

const Courses = () => {
  return (
    <div id="courses">
      <div className={`${styles.boxWidth}`}>
        <h2 className={`${styles.heading2} text-center my-4 font-bangla`}>
          আমাদের কোর্সসমূহ
        </h2>
      
        <div className="flex flex-wrap my-10 gap-8 justify-around">
          {courses.map((card, index) => (
            <CourseCard key={card.title} index={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
