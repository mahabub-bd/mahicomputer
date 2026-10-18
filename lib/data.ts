import { toStringArray } from "./course-view";
import { prisma } from "./prisma";
import type {
  Category,
  CategoryView,
  Course,
  CourseView,
  FooterGroupView,
  GalleryItem,
  GalleryView,
  Instructor,
  InstructorView,
  NavLink,
  NavLinkView,
  Notice,
  Partner,
  PartnerView,
  Review,
  ReviewView,
  SiteSettingsView,
  SocialLink,
  StatItem,
} from "./types";

export async function getCourses(): Promise<Course[]> {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getAllCourses(): Promise<Course[]> {
  return prisma.course.findMany({ orderBy: { order: "asc" } });
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  return prisma.course.findUnique({ where: { slug } });
}

/** Course + its instructor's designation, for the detail pages. */
/** Prisma Json columns hold string arrays; be defensive when parsing. */
export async function getCourseDetail(slug: string) {
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return null;
  const instructor = course.instructorName
    ? await prisma.instructor.findFirst({
        where: { name: { equals: course.instructorName, mode: "insensitive" } },
      })
    : null;
  return {
    course,
    instructorDescription: instructor?.description ?? "",
    description: toStringArray(course.description),
    modules: toStringArray(course.modules),
  };
}

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getInstructors(): Promise<Instructor[]> {
  return prisma.instructor.findMany({ orderBy: { order: "asc" } });
}

export async function getReviews(): Promise<Review[]> {
  return prisma.review.findMany({ orderBy: { order: "asc" } });
}

export async function getPartners(): Promise<Partner[]> {
  return prisma.partner.findMany({ orderBy: { order: "asc" } });
}

export const DEFAULT_STATS: StatItem[] = [
  { id: "stats-1", title: "Rating", value: "4.8/5", class: "bg-stat-1" },
  { id: "stats-2", title: "Students", value: "5000+", class: "bg-stat-2" },
  { id: "stats-3", title: "Instractor", value: "25+", class: "bg-stat-3" },
  { id: "stats-4", title: "Subject & Skill", value: "75+", class: "bg-stat-4" },
];

/** Site settings singleton; falls back to typed defaults if the row is missing. */
export async function getSiteSettings(): Promise<SiteSettingsView> {
  const row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (!row) {
    return {
      heroTitle: "",
      heroSubtitle: "",
      heroNote: "",
      aboutTitle: "",
      aboutText: "",
      phone: "",
      email: "",
      address: "",
      stats: DEFAULT_STATS,
    };
  }
  return { ...row, stats: parseStats(row.stats) };
}

function parseStats(value: unknown): StatItem[] {
  if (!Array.isArray(value)) return DEFAULT_STATS;
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

export function toCourseView(c: Course): CourseView {
  return {
    courseImg: c.imageUrl,
    courseImgalt: c.imageAlt,
    link: c.slug,
    tag: c.tag,
    tagbg: c.tagbg,
    title: c.title,
    lesson: c.lesson,
    duration: c.duration,
    instractorName: c.instructorName,
    instractorphoto: c.instructorPhotoUrl,
    price: c.price,
  };
}

export function toCategoryView(c: Category): CategoryView {
  return { img: c.imageUrl, title: c.title, alt: c.alt };
}

export function toInstructorView(i: Instructor): InstructorView {
  return { id: i.id, img: i.imageUrl, name: i.name, des: i.description };
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
  return reviews.map(toReviewView);
}

export async function getPartnerViews(): Promise<PartnerView[]> {
  const partners = await getPartners();
  return partners.map(toPartnerView);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
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

/** Published FAQs for the homepage (admin-managed). */
export async function getFaqs() {
  return prisma.faq.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

/** All admin accounts, oldest first (never expose passwordHash). */
export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
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
