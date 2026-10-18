import { notFound } from "next/navigation";
import { getCourseDetail } from "@/lib/data";
import CourseDetail from "@/app/components/CourseDetail";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = await getCourseDetail(slug);
  if (!data) notFound();
  return (
    <CourseDetail
      course={data.course}
      instructorDescription={data.instructorDescription}
      description={data.description}
      modules={data.modules}
    />
  );
}
