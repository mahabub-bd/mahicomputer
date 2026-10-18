import { getCourses } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

// Course content is admin-managed — keep the sitemap fresh on every request.
export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/about",
  "/courses",
  "/services",
  "/gallery",
  "/notice",
  "/feedback",
  "/contact",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();

  const staticPages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
    url: absoluteUrl(`/courses/${course.slug}`),
    lastModified: course.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...coursePages];
}
