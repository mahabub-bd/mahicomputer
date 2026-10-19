import type {
  Category,
  ContactMessage,
  Course,
  Enrollment,
  Faq,
  FooterLink,
  FooterLinkGroup,
  GalleryItem,
  Instructor,
  NavLink,
  Newsletter,
  Notice,
  Partner,
  Post,
  Review,
  SocialLink,
} from "@/app/generated/prisma/client";

export type {
  Category,
  ContactMessage,
  Course,
  Enrollment,
  Faq,
  FooterLink,
  FooterLinkGroup,
  GalleryItem,
  Instructor,
  NavLink,
  Newsletter,
  Notice,
  Partner,
  Post,
  Review,
  SocialLink
};

/** Course row with its linked category + instructor (getAllCourses include payload). */
export type CourseWithCategory = Course & {
  category: Category | null;
  instructor: Instructor | null;
};

/** Blog post row with its linked author (instructor) include payload. */
export type PostWithAuthor = Post & {
  author: { name: string; imageUrl: string; description?: string } | null;
};

/** Instructor row with its linked-course count (_count include payload). */
export type InstructorWithCourseCount = Instructor & {
  _count: { courses: number };
};

/** Category row with its linked-course count (_count include payload). */
export type CategoryWithCourseCount = Category & {
  _count: { courses: number };
};

/**
 * View models — same shapes the components always used, except images are
 * plain URL strings ("/images/..." or "/uploads/...") instead of
 * StaticImageData, since they now come from the database.
 */
export interface CourseView {
  courseImg: string;
  courseImgalt: string;
  link: string;
  tag: string;
  tagbg: string;
  title: string;
  lesson: number;
  duration: string;
  instractorName: string;
  instractorphoto: string;
  /** Linked category title (falls back to the tag when unassigned). */
  category?: string;
  price: number;
  /** Card rating row; falls back to the historical 4.9 / 31 when absent. */
  rating?: number;
  reviewCount?: number;
}

export interface CategoryView {
  img: string;
  title: string;
  alt: string;
}

export interface InstructorView {
  id?: string;
  img: string;
  name: string;
  des: string;
}

export interface ReviewView {
  id: string;
  name: string;
  title: string;
  content: string;
  course: string;
  rating: number;
  img: string;
}

export interface PartnerView {
  img: string;
  alt: string;
}

export interface GalleryView {
  img: string;
  alt: string;
}

export interface SocialView {
  id: string;
  icon: string;
  link: string;
}

/** Admin account row without the password hash. */
export interface UserView {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
}

/** Matches the shape Navbar's navLinks constant always had (id = href). */
export interface NavLinkView {
  id: string;
  title: string;
  class: string;
}

export interface FooterGroupView {
  id: string;
  title: string;
  links: { id: string; name: string; link: string }[];
}

export interface StatItem {
  id: string;
  title: string;
  value: string;
  class: string;
}

/** One "Why Choose Us" feature card (icon is assigned by render order). */
export interface WhyFeature {
  title: string;
  text: string;
}

export interface SiteSettingsView {
  heroTitle: string;
  heroSubtitle: string;
  heroNote: string;
  heroImageUrl: string;
  marqueeItems: string[];
  whyTitle: string;
  whySubtitle: string;
  whyFeatures: WhyFeature[];
  mapEmbedUrl: string;
  courseAboutTitle: string;
  courseInsideTitle: string;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;
  ceoTitle: string;
  ceoText: string;
  ceoImageUrl: string;
  phone: string;
  email: string;
  address: string;
  stats: StatItem[];
}
