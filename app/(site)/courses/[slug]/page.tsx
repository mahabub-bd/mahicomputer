import { notFound } from "next/navigation";
<<<<<<< HEAD
import { getPublicCourseDetail, getPublicSiteSettings } from "@/lib/data";
=======
import { getCourseDetail, getSiteSettings } from "@/lib/data";
>>>>>>> 8b57dd81f4b6274869ff3d96c8916c651ef76d20
import { SITE_NAME, truncate } from "@/lib/site";
import CourseDetail from "@/app/components/CourseDetail";
import type { Metadata } from "next";


type Props = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
<<<<<<< HEAD
  const data = await getPublicCourseDetail(slug);
=======
  const data = await getCourseDetail(slug);
>>>>>>> 8b57dd81f4b6274869ff3d96c8916c651ef76d20
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
<<<<<<< HEAD
      ...(course.imageUrl
        ? { images: [{ url: course.imageUrl, alt: course.imageAlt || course.title }] }
        : {}),
=======
      ...(course.imageUrl ? { images: [{ url: course.imageUrl, alt: course.imageAlt || course.title }] } : {}),
>>>>>>> 8b57dd81f4b6274869ff3d96c8916c651ef76d20
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
  const [data, settings] = await Promise.all([
    getPublicCourseDetail(slug),
    getPublicSiteSettings(),
  ]);
  if (!data) notFound();
  return (
    <CourseDetail
      course={data.course}
      instructorDescription={data.instructorDescription}
      category={data.categoryTitle}
      description={data.description}
      modules={data.modules}
      aboutTitle={settings.courseAboutTitle}
      insideTitle={settings.courseInsideTitle}
    />
  );
}
