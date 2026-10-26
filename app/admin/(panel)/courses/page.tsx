import { getAllCourses } from "@/lib/data";
import CoursesList from "../../_components/CoursesList";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ edit?: string }> };

const CoursesAdminPage = async ({ searchParams }: Props) => {
  const { edit } = await searchParams;
  const courses = await getAllCourses();
  return (
    <div>

      <CoursesList courses={courses} editId={edit} />
    </div>
  );
};

export default CoursesAdminPage;
