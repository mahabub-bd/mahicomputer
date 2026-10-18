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
  Notice,
  Partner,
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
  Notice,
  Partner,
  Review,
  SocialLink
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
  price: number;
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

export interface SiteSettingsView {
  heroTitle: string;
  heroSubtitle: string;
  heroNote: string;
  aboutTitle: string;
  aboutText: string;
  phone: string;
  email: string;
  address: string;
  stats: StatItem[];
}
