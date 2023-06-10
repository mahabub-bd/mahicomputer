import React from "react";
import styles from "../styles/style";
import Image from "next/image";

import Link from "next/link";

import { CourseCard } from "../components";
import { courses } from "../constants";

const Courses = () => {
  return (
    <div className={`${styles.boxWidth}`}>
      <h2 className={`${styles.heading2} text-center my-4`}>Popular Courses</h2>
      <p className={`${styles.paragraph} text-center`}>
        A curated collection of amazing courses, chosen based on
      </p>
      <p className={`${styles.paragraph} text-center`}>
        popularity andratings by students
      </p>
      <div className="flex flex-wrap my-10 gap-8 justify-around">
        {courses.map((card, index) => (
          <CourseCard key={card.title} index={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
