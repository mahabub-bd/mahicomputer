import { unstable_cache } from "next/cache";
import { cache } from "react";
import { toStringArray } from "./course-view";
import { prisma } from "./prisma";
import type {
  Category,
  CategoryView,
  Course,
  CourseView,
  CourseWithCategory,
  FooterGroupView,
  GalleryItem,
  GalleryView,
  Instructor,
  InstructorView,
  InstructorWithCourseCount,
  NavLink,
  NavLinkView,
  Newsletter,
  Notice,
  Partner,
  PartnerView,
  Review,
  ReviewView,
  SiteSettingsView,
  SocialLink,
  StatItem,
  WhyFeature,
} from "./types";
import type { CourseInput } from "./validators";

/** Defensive parsers for Json columns holding complex values. */
function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((s): s is string => typeof s === "string");
}

function parseWhyFeatures(value: unknown): WhyFeature[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (f): f is WhyFeature =>
      typeof f === "object" && f !== null && "title" in f && "text" in f,
  );
}

export async function getCourses(): Promise<CourseWithCategory[]> {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { category: true, instructor: true },
  });
}

export async function getAllCourses(): Promise<CourseWithCategory[]> {
  return prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { category: true, instructor: true },
  });
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  return prisma.course.findUnique({ where: { slug } });
}

/** Course + its instructor's designation, for the detail pages. */
/** Prisma Json columns hold string arrays; be defensive when parsing. */
export async function getCourseDetail(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: { instructor: true, category: true },
  });
  if (!course) return null;
  return {
    course,
    instructorDescription: course.instructor?.description ?? "",
    categoryTitle: course.category?.title ?? "",
    description: toStringArray(course.description),
    modules: toStringArray(course.modules),
  };
}

export type CourseWriteData = Omit<CourseInput, "instructorId" | "categoryId"> & {
  instructorId: string | null;
  categoryId: string | null;
};

/**
 * Resolve the instructor/category selected in the course form: validates
 * both ids and keeps the denormalized instructorName/instructorPhotoUrl
 * display columns in sync with the Instructor row. Returns null when any
 * selected id no longer exists.
 */
export async function resolveCourseRelations(
  data: CourseInput
): Promise<CourseWriteData | null> {
  const { instructorId, categoryId, ...rest } = data;

  const resolved: CourseWriteData = {
    ...rest,
    instructorId: null,
    categoryId: null,
    instructorName: "",
    instructorPhotoUrl: "",
  };

  if (instructorId) {
    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId },
    });
    if (!instructor) return null;
    resolved.instructorId = instructorId;
    resolved.instructorName = instructor.name;
    resolved.instructorPhotoUrl = instructor.imageUrl;
  }

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) return null;
    resolved.categoryId = categoryId;
  }

  return resolved;
}

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getInstructors(): Promise<Instructor[]> {
  return prisma.instructor.findMany({ orderBy: { order: "asc" } });
}

/**
 * Instructors plus the number of *published* courses each one teaches.
 * Unpublished (draft) courses are excluded so the public count never
 * advertises a course that is not open for enrollment.
 */
export async function getInstructorsWithCourseCount(): Promise<InstructorWithCourseCount[]> {
  return prisma.instructor.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { courses: { where: { published: true } } } } },
  });
}

export async function getReviews(): Promise<Review[]> {
  return prisma.review.findMany({ orderBy: { order: "asc" } });
}

export async function getPartners(): Promise<Partner[]> {
  return prisma.partner.findMany({ orderBy: { order: "asc" } });
}

/** Site settings singleton; every field comes from the admin-managed DB row. */
export async function getSiteSettings(): Promise<SiteSettingsView> {
  const row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (!row) {
    return {
      heroTitle: "",
      heroSubtitle: "",
      heroNote: "",
      heroImageUrl: "",
      marqueeItems: [],
      whyTitle: "",
      whySubtitle: "",
      whyFeatures: [],
      mapEmbedUrl: "",
      courseAboutTitle: "",
      courseInsideTitle: "",
      aboutTitle: "",
      aboutText: "",
      aboutImageUrl: "",
      ceoTitle: "",
      ceoText: "",
      ceoImageUrl: "",
      phone: "",
      email: "",
      address: "",
      stats: [],
    };
  }
  return {
    ...row,
    marqueeItems: parseStringArray(row.marqueeItems),
    whyFeatures: parseWhyFeatures(row.whyFeatures),
    stats: parseStats(row.stats),
  };
}

function parseStats(value: unknown): StatItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (s): s is StatItem =>
      typeof s === "object" &&
      s !== null &&
      "title" in s &&
      "value" in s &&
      "class" in s
  );
}

/* ---------- view mappers: DB rows -> component prop shapes ---------- */

export function toCourseView(c: CourseWithCategory): CourseView {
  return {
    courseImg: c.imageUrl,
    courseImgalt: c.imageAlt,
    link: c.slug,
    tag: c.tag,
    tagbg: c.tagbg,
    title: c.title,
    lesson: c.lesson,
    duration: c.duration,
    // Prefer the live relations; fall back to the denormalized display columns.
    instractorName: c.instructor?.name || c.instructorName,
    instractorphoto: c.instructor?.imageUrl || c.instructorPhotoUrl,
    category: c.category?.title || c.tag,
    price: c.price,
    rating: c.rating,
    reviewCount: c.reviewCount,
  };
}

export function toCategoryView(c: Category): CategoryView {
  return { img: c.imageUrl, title: c.title, alt: c.alt };
}

export function toInstructorView(
  i: Instructor & { _count?: { courses: number } },
): InstructorView {
  return {
    id: i.id,
    img: i.imageUrl,
    name: i.name,
    des: i.description,
    courseCount: i._count?.courses ?? 0,
  };
}

export function toReviewView(r: Review): ReviewView {
  return {
    id: r.id,
    name: r.name,
    title: r.title,
    content: r.content,
    course: r.course,
    rating: r.rating,
    img: r.imageUrl,
  };
}

export function toPartnerView(p: Partner): PartnerView {
  return { img: p.imageUrl, alt: p.alt };
}

export async function getCourseViews(): Promise<CourseView[]> {
  const courses = await getCourses();
  return courses.map(toCourseView);
}

export async function getReviewViews(): Promise<ReviewView[]> {
  const reviews = await getReviews();
  // Skip rows whose image was never uploaded — rendering an empty src is invalid.
  return reviews.filter((r) => r.imageUrl.trim()).map(toReviewView);
}

/** Instructor cards for the public site, with each teacher's course count. */
export async function getInstructorViews(): Promise<InstructorView[]> {
  const instructors = await getInstructorsWithCourseCount();
  return instructors.map(toInstructorView);
}

export async function getPartnerViews(): Promise<PartnerView[]> {
  const partners = await getPartners();
  return partners.filter((p) => p.imageUrl.trim()).map(toPartnerView);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
  return items.filter((g) => g.imageUrl.trim());
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
}

/** Published notices for the public notice board (newest first). */
export async function getNotices(): Promise<Notice[]> {
  return prisma.notice.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
}

/** Published newsletter issues for the public newsletters page (newest first). */
export async function getNewsletters(): Promise<Newsletter[]> {
  return prisma.newsletter.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
}

/** Published FAQs for the homepage (admin-managed). */
export async function getFaqs() {
  return prisma.faq.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

/** Published blog posts, newest first. */
export async function getPosts() {
  return prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true, imageUrl: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, imageUrl: true, description: true } },
      publishedBy: { select: { name: true } },
    },
  });
}

/** All admin accounts, oldest first (never expose passwordHash). */
export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, name: true, imageUrl: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getNavLinks(): Promise<NavLink[]> {
  return prisma.navLink.findMany({ orderBy: { order: "asc" } });
}

export async function getFooterLinkGroups() {
  return prisma.footerLinkGroup.findMany({
    orderBy: { order: "asc" },
    include: { links: { orderBy: { order: "asc" } } },
  });
}

/** FooterLinkGroup with its nested links (the include payload). */
export type FooterLinkGroupWithLinks = Awaited<
  ReturnType<typeof getFooterLinkGroups>
>[number];

export function toGalleryView(g: GalleryItem): GalleryView {
  return { img: g.imageUrl, alt: g.alt };
}

export async function getGalleryViews(): Promise<GalleryView[]> {
  const items = await getGalleryItems();
  return items.map(toGalleryView);
}

export function toNavLinkView(n: NavLink): NavLinkView {
  return { id: n.href, title: n.title, class: n.cssClass };
}

export function toFooterGroupView(g: FooterLinkGroupWithLinks): FooterGroupView {
  return {
    id: g.id,
    title: g.title,
    links: g.links.map((l) => ({ id: l.id, name: l.name, link: l.href })),
  };
}

/* ---------- cached public reads ----------
 * The public site revalidates every PUBLIC_REVALIDATE seconds instead of
 * hitting the database on every request. Admin pages keep using the
 * uncached getters above so edits are always visible immediately.
 *
 * `cache()` also dedupes calls within one request (layout + page +
 * generateMetadata used to fetch the same rows 2–3×).
 */
const PUBLIC_REVALIDATE = 60;

function cachedPublic<A extends unknown[], R>(
  key: string,
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  return cache(
    unstable_cache(fn, [key], {
      revalidate: PUBLIC_REVALIDATE,
      tags: ["public-data"],
    }),
  );
}

export const getPublicCourses = cachedPublic("public:courses", getCourses);
export const getPublicCourseViews = cachedPublic("public:courseViews", getCourseViews);
export const getPublicCategories = cachedPublic("public:categories", getCategories);
export const getPublicInstructors = cachedPublic("public:instructors", getInstructors);
export const getPublicInstructorViews = cachedPublic(
  "public:instructorViews",
  getInstructorViews,
);
export const getPublicReviewViews = cachedPublic("public:reviewViews", getReviewViews);
export const getPublicPartnerViews = cachedPublic("public:partnerViews", getPartnerViews);
export const getPublicGalleryViews = cachedPublic("public:galleryViews", getGalleryViews);
export const getPublicSiteSettings = cachedPublic("public:siteSettings", getSiteSettings);
export const getPublicNotices = cachedPublic("public:notices", getNotices);
export const getPublicNewsletters = cachedPublic(
  "public:newsletters",
  getNewsletters
);
export const getPublicFaqs = cachedPublic("public:faqs", getFaqs);
export const getPublicSocialLinks = cachedPublic("public:socialLinks", getSocialLinks);
export const getPublicNavLinks = cachedPublic("public:navLinks", getNavLinks);
export const getPublicFooterLinkGroups = cachedPublic("public:footerLinkGroups", getFooterLinkGroups);
export const getPublicCourseDetail = cachedPublic("public:courseDetail", getCourseDetail);
export const getPublicPosts = cachedPublic("public:posts", getPosts);
export const getPublicPostBySlug = cachedPublic("public:postBySlug", getPostBySlug);
