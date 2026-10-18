import styles from "../styles/style";

import type { CourseView } from "@/lib/types";
import { CourseCard } from "../components";

interface CoursesProps {
  courses?: CourseView[];
  /**
   * "section" (default) keeps the home-page rhythm — .section-shell pads the
   * top so the block separates from whatever sits above it. "page" is for
   * standalone routes like /courses that start right under the navbar, where
   * that same padding reads as a big empty band.
   */
  variant?: "section" | "page";
}

const Courses = ({ courses = [], variant = "section" }: CoursesProps) => {
  const isPage = variant === "page";

  return (
    <section
      id="courses"
      className={
        isPage
          ? "pt-8 pb-[clamp(3.5rem,7vw,6rem)] md:pt-12"
          : "section-shell"
      }
    >
      <div className={`${styles.boxWidth} px-4 sm:px-6`}>
        <h2
          className={`${styles.heading2} section-title ${
            isPage ? "mb-6 md:mb-8" : "my-6 md:my-8"
          } text-center font-bangla`}
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
