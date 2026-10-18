import { getAllCourses } from "@/lib/data";
import CoursesList from "../../_components/CoursesList";

export const dynamic = "force-dynamic";

const CoursesAdminPage = async () => {
  const courses = await getAllCourses();
  return <CoursesList courses={courses} />;
};

export default CoursesAdminPage;
