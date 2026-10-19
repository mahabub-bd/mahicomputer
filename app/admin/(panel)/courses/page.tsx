import { getAllCourses } from "@/lib/data";
import CoursesList from "../../_components/CoursesList";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ edit?: string }> };

const CoursesAdminPage = async ({ searchParams }: Props) => {
  const { edit } = await searchParams;
  const courses = await getAllCourses();
  return <CoursesList courses={courses} editId={edit} />;
};

export default CoursesAdminPage;
