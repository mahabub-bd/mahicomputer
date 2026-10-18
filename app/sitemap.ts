import { getPublicCourses, getPublicPosts } from "@/lib/data";
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
  "/blogs",
  "/feedback",
  "/contact",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts] = await Promise.all([
    getPublicCourses(),
    getPublicPosts(),
  ]);

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

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blogs/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...coursePages, ...postPages];
}
