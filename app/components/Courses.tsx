import styles from "../styles/style";

import type { CourseView } from "@/lib/types";
import { CourseCard } from "../components";
import { courses as staticCourses } from "../constants";

interface CoursesProps {
  courses?: CourseView[];
}

const Courses = ({ courses = staticCourses }: CoursesProps) => {
  return (
    <section id="courses" className="section-shell">
      <div className={`${styles.boxWidth} px-4 sm:px-6`}>
        <h2
          className={`${styles.heading2} section-title my-6 text-center font-bangla md:my-8`}
          data-aos="fade-up"
        >
          আমাদের কোর্সসমূহ
        </h2>

        <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          {courses.map((card) => (
            <CourseCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
