import { z } from "zod";

const slug = z
  .string()
  .min(1, "Slug is required")
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");

const imageField = z
  .string()
  .max(500)
  .default("")
  .refine((v) => v === "" || v.startsWith("/") || v.startsWith("http"), {
    message: "Must be a path like /uploads/... or a full URL",
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const courseSchema = z.object({
  slug,
  title: z.string().min(1, "Title is required").max(200),
  tag: z.string().max(100).default(""),
  tagbg: z.string().max(100).default("bg-fuchsia-800"),
  imageUrl: imageField,
  imageAlt: z.string().max(200).default(""),
  lesson: z.coerce.number().int().min(0).default(0),
  duration: z.string().max(50).default(""),
  instructorName: z.string().max(200).default(""),
  instructorPhotoUrl: imageField,
  price: z.coerce.number().int().min(0).default(0),
  description: z.array(z.string().max(5000)).default([]),
  modules: z.array(z.string().max(1000)).default([]),
  prerequisite: z.string().max(300).default(""),
  seats: z.string().max(200).default(""),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const categorySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  imageUrl: imageField,
  alt: z.string().max(200).default(""),
  order: z.coerce.number().int().default(0),
});

export const instructorSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(200).default(""),
  imageUrl: imageField,
  order: z.coerce.number().int().default(0),
});

export const reviewSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  title: z.string().max(200).default("Student"),
  content: z.string().min(1, "Content is required").max(5000),
  course: z.string().max(200).default(""),
  rating: z.coerce.number().min(0).max(5).default(5),
  imageUrl: imageField,
  order: z.coerce.number().int().default(0),
});

export const partnerSchema = z.object({
  imageUrl: imageField,
  alt: z.string().max(200).default(""),
  order: z.coerce.number().int().default(0),
});

export const galleryItemSchema = z.object({
  imageUrl: imageField,
  alt: z.string().max(200).default(""),
  order: z.coerce.number().int().default(0),
});

export const socialLinkSchema = z.object({
  icon: imageField,
  link: z.string().min(1, "Link is required").max(500),
  order: z.coerce.number().int().default(0),
});

export const noticeSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  body: z.string().max(10000).default(""),
  date: z.coerce.date().default(new Date()),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.string().min(1, "Answer is required").max(5000),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const navLinkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  href: z.string().min(1, "Href is required").max(300),
  cssClass: z.string().max(100).default("nothoverable"),
  order: z.coerce.number().int().default(0),
});

export const footerLinkRowSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  href: z.string().min(1, "Href is required").max(300),
  order: z.coerce.number().int().default(0),
});

export const footerGroupSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  order: z.coerce.number().int().default(0),
  links: z.array(footerLinkRowSchema).default([]),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email").max(200),
  phone: z.string().min(1, "Phone is required").max(50),
  message: z.string().min(1, "Message is required").max(5000),
});

export const enrollmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  phone: z
    .string()
    .min(6, "Phone must be at least 6 characters")
    .max(50, "Phone is too long"),
  email: z
    .string()
    .max(200)
    .default("")
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Invalid email",
    }),
  course: z.string().max(200).default(""),
  message: z.string().max(5000).default(""),
});

export const statItemSchema = z.object({
  id: z.string().max(100).default(""),
  title: z.string().max(200).default(""),
  value: z.string().max(100).default(""),
  class: z.string().max(200).default(""),
});

export const siteSettingSchema = z.object({
  heroTitle: z.string().max(500).default(""),
  heroSubtitle: z.string().max(5000).default(""),
  heroNote: z.string().max(500).default(""),
  aboutTitle: z.string().max(500).default(""),
  aboutText: z.string().max(10000).default(""),
  phone: z.string().max(100).default(""),
  email: z.string().max(200).default(""),
  address: z.string().max(500).default(""),
  stats: z.array(statItemSchema).default([]),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type InstructorInput = z.infer<typeof instructorSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type FaqInput = z.infer<typeof faqSchema>;
export type NavLinkInput = z.infer<typeof navLinkSchema>;
export type FooterGroupInput = z.infer<typeof footerGroupSchema>;
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;
