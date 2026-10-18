import { notFound } from "next/navigation";
import { getCourseDetail, getSiteSettings } from "@/lib/data";
import { SITE_NAME, truncate } from "@/lib/site";
import CourseDetail from "@/app/components/CourseDetail";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const data = await getCourseDetail(slug);
  if (!data) return {};

  const { course } = data;
  const description = truncate(
    data.description.join(" ") ||
      `${course.title} course at ${SITE_NAME} — ${course.duration}, ${course.lesson} lessons. Enroll today.`,
  );

  return {
    title: course.title,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      url: `/courses/${course.slug}`,
      title: `${course.title} | ${SITE_NAME}`,
      description,
      ...(course.imageUrl ? { images: [{ url: course.imageUrl, alt: course.imageAlt || course.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | ${SITE_NAME}`,
      description,
      ...(course.imageUrl ? { images: [course.imageUrl] } : {}),
    },
  };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [data, settings] = await Promise.all([getCourseDetail(slug), getSiteSettings()]);
  if (!data) notFound();
  return (
    <CourseDetail
      course={data.course}
      instructorDescription={data.instructorDescription}
      description={data.description}
      modules={data.modules}
      aboutTitle={settings.courseAboutTitle}
      insideTitle={settings.courseInsideTitle}
    />
  );
}
