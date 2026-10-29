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
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const userCreateSchema = z.object({
  email: z.string().email("A valid email is required").max(200),
  name: z.string().min(1, "Name is required").max(100),
  imageUrl: imageField,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

/** Empty password on update = keep the current password. */
export const userUpdateSchema = z.object({
  email: z.string().email("A valid email is required").max(200),
  name: z.string().min(1, "Name is required").max(100),
  imageUrl: imageField,
  password: z.union([
    z.literal(""),
    z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
  ]),
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
  /** Selected Instructor row; the API syncs name/photo from it on save. */
  instructorId: z.string().max(50).nullish(),
  /** Selected Category row. */
  categoryId: z.string().max(50).nullish(),
  price: z.coerce.number().int().min(0).default(0),
  /** Installment plan offered for the course fee (1 = single payment). */
  installments: z.coerce.number().int().min(1).max(36).default(1),
  /** Per-installment amounts, e.g. [2000, 2000, 2000] for a 6000 fee. */
  installmentPlan: z
    .array(z.coerce.number().int().min(0).max(10000000))
    .max(36)
    .default([]),
  rating: z.coerce.number().min(0).max(5).default(4.9),
  reviewCount: z.coerce.number().int().min(0).default(31),
  description: z.array(z.string().max(5000)).default([]),
  modules: z.array(z.string().max(1000)).default([]),
  prerequisite: z.string().max(300).default(""),
  seats: z.string().max(200).default(""),
  admission: z.enum(["UPCOMING", "OPEN", "RUNNING", "COMPLETED"]).default("OPEN"),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});


export const courseFormSchema = courseSchema
  .omit({
    description: true,
    modules: true,
    instructorName: true,
    instructorPhotoUrl: true,
  })
  .extend({
    descriptionText: z.string().max(50000).default(""),
    modulesText: z.string().max(20000).default(""),
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
  attachmentUrl: z.string().max(1000).default(""),
  attachmentName: z.string().max(300).default(""),
  date: z.coerce.date().default(new Date()),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});


export const noticeFormSchema = noticeSchema.extend({
  date: z.string().min(1, "Date is required"),
});


export const newsletterIssueSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  body: z.string().max(10000).default(""),
  date: z.coerce.date().default(new Date()),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});


export const newsletterIssueFormSchema = newsletterIssueSchema.extend({
  date: z.string().min(1, "Date is required"),
});

export const postSchema = z.object({
  slug,
  title: z.string().min(1, "Title is required").max(200),
  excerpt: z.string().max(500).default(""),
  content: z.string().max(50000).default(""),
  imageUrl: imageField,
  imageAlt: z.string().max(200).default(""),
  /** Selected Instructor row shown as the blog author. */
  authorId: z.string().max(50).nullish(),
  published: z.coerce.boolean().default(true),
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
  name: z.string().min(1, "নাম লিখুন").max(200),
  email: z.string().email("সঠিক ইমেইল দিন").max(200),
  phone: z.string().min(1, "ফোন নম্বর দিন").max(50),
  message: z.string().min(1, "বার্তা লিখুন").max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন").max(200),
});

export const enrollmentSchema = z.object({
  name: z.string().min(1, "নাম লিখুন").max(200),
  phone: z
    .string()
    .min(6, "ফোন নম্বর কমপক্ষে ৬ ঘরের হতে হবে")
    .max(50, "ফোন নম্বর অনেক বড়"),
  email: z
    .string()
    .max(200)
    .default("")
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "সঠিক ইমেইল দিন",
    }),
  course: z.string().max(200).default(""),
  message: z.string().max(5000).default(""),
});

/** Admin-side payment tracking for an admission (Enrollment row). */
export const enrollmentPaymentSchema = z.object({
  courseFee: z.coerce.number().int().min(0).max(10000000).default(0),
  installments: z.coerce.number().int().min(1).max(36).default(1),
  installmentPlan: z
    .array(z.coerce.number().int().min(0).max(10000000))
    .max(36)
    .default([]),
  discount: z.coerce.number().int().min(0).max(10000000).default(0),
  paidAmount: z.coerce.number().int().min(0).max(10000000).default(0),
  /** Next installment due date (ISO string or ""); "" clears it. */
  dueDate: z.string().max(40).default(""),
  paymentMethod: z.string().max(100).default(""),
  transactionId: z.string().max(200).default(""),
  adminNote: z.string().max(2000).default(""),
});

/**
 * One received installment payment. Creates a Payment row and increments the
 * admission's paidAmount — the admin never edits the running total by hand.
 * nextDueDate ("ISO string" or "") optionally sets the admission's dueDate.
 */
export const paymentRecordSchema = z.object({
  amount: z.coerce.number().int().min(1, "Amount must be at least ৳1").max(10000000),
  method: z.string().max(100).default(""),
  transactionId: z.string().max(200).default(""),
  note: z.string().max(500).default(""),
  nextDueDate: z.string().max(40).default(""),
});

/** A class batch: course, schedule and seat limit. startDate is a date string. */
export const batchSchema = z.object({
  course: z.string().min(1, "Select a course").max(200),
  name: z.string().min(1, "Batch name is required").max(200),
  startDate: z.string().max(40).default(""),
  schedule: z.string().max(300).default(""),
  capacity: z.coerce.number().int().min(0).max(500).default(0),
  status: z.enum(["UPCOMING", "RUNNING", "COMPLETED"]).default("UPCOMING"),
  note: z.string().max(2000).default(""),
});

/** Editing an existing batch — every field optional. */
export const batchUpdateSchema = batchSchema.partial();

/** One class session of a batch; date is a date string, topic optional. */
export const classSessionSchema = z.object({
  date: z.string().min(1, "Date is required").max(40),
  topic: z.string().max(300).default(""),
});

/** Bulk attendance save for one session: one record per batch student. */
export const attendanceSaveSchema = z.object({
  records: z
    .array(
      z.object({
        enrollmentId: z.string().min(1).max(50),
        status: z.enum(["PRESENT", "ABSENT", "LATE"]),
      }),
    )
    .max(500),
});

/**
 * Full admission form (admin-entered walk-in students): student profile,
 * photo and payment-free basics. dateOfBirth is a date-input string; the
 * API converts it to a nullable DateTime.
 */
export const admissionCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  phone: z
    .string()
    .min(6, "Phone must be at least 6 digits")
    .max(50, "Phone is too long"),
  email: z
    .string()
    .max(200)
    .default("")
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Enter a valid email",
    }),
  course: z.string().max(200).default(""),
  message: z.string().max(5000).default(""),
  status: z.enum(["PENDING", "APPROVED", "DECLINED"]).default("APPROVED"),
  /** Per-installment amounts prefilled from the selected course's plan. */
  installmentPlan: z
    .array(z.coerce.number().int().min(0).max(10000000))
    .max(36)
    .default([]),
  photoUrl: z.string().max(2000).default(""),
  fatherName: z.string().max(200).default(""),
  motherName: z.string().max(200).default(""),
  dateOfBirth: z.string().max(40).default(""),
  gender: z.enum(["", "MALE", "FEMALE", "OTHER"]).default(""),
  address: z.string().max(1000).default(""),
  education: z.string().max(300).default(""),
  guardianName: z.string().max(200).default(""),
  guardianPhone: z.string().max(50).default(""),
});

/** Editing an existing admission's student info — every field optional. */
export const admissionUpdateSchema = admissionCreateSchema
  .omit({ status: true })
  .partial();

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
  heroImageUrl: z.string().max(2000).default(""),
  marqueeItems: z.array(z.string().max(300)).default([]),
  whyTitle: z.string().max(500).default(""),
  whySubtitle: z.string().max(2000).default(""),
  whyFeatures: z
    .array(
      z.object({
        title: z.string().max(200).default(""),
        text: z.string().max(1000).default(""),
      }),
    )
    .default([]),
  courseAboutTitle: z.string().max(200).default(""),
  courseInsideTitle: z.string().max(200).default(""),
  aboutTitle: z.string().max(500).default(""),
  aboutText: z.string().max(10000).default(""),
  aboutImageUrl: z.string().max(2000).default(""),
  ceoTitle: z.string().max(500).default(""),
  ceoText: z.string().max(10000).default(""),
  ceoImageUrl: z.string().max(2000).default(""),
  stats: z.array(statItemSchema).default([]),
});

/**
 * Business settings singleton (`BusinessSetting` table): footer contact block,
 * opening hours, map embed and the WhatsApp chat widget.
 */
export const businessSettingSchema = z.object({
  businessName: z.string().max(200).default(""),
  phone: z.string().max(100).default(""),
  email: z.string().max(200).default(""),
  address: z.string().max(500).default(""),
  openingHours: z.string().max(500).default(""),
  mapEmbedUrl: z.string().max(3000).default(""),
  whatsappNumber: z
    .string()
    .trim()
    .max(20)
    .regex(/^\d*$/, "WhatsApp number must be digits only (international format, no +)")
    .default(""),
  whatsappMessage: z.string().max(500).default(""),
  whatsappEnabled: z.boolean().default(true),
});

/** Homepage settings form — marquee items are edited as one line-per-item block. */
export const settingsFormSchema = siteSettingSchema
  .omit({ marqueeItems: true })
  .extend({
    marqueeText: z.string().max(20000).default(""),
  });

export type CourseInput = z.infer<typeof courseSchema>;
export type CourseFormInput = z.infer<typeof courseFormSchema>;
export type NoticeFormInput = z.infer<typeof noticeFormSchema>;
export type NewsletterIssueFormInput = z.infer<typeof newsletterIssueFormSchema>;
export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type EnrollmentPaymentInput = z.infer<typeof enrollmentPaymentSchema>;
export type PaymentRecordInput = z.infer<typeof paymentRecordSchema>;
export type BatchInput = z.infer<typeof batchSchema>;
export type BatchUpdateInput = z.infer<typeof batchUpdateSchema>;
export type ClassSessionInput = z.infer<typeof classSessionSchema>;
export type AdmissionCreateInput = z.infer<typeof admissionCreateSchema>;
export type AdmissionUpdateInput = z.infer<typeof admissionUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserFormInput = z.infer<typeof userCreateSchema>;
export type PostFormInput = z.infer<typeof postSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type InstructorInput = z.infer<typeof instructorSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type FaqInput = z.infer<typeof faqSchema>;
export type NavLinkInput = z.infer<typeof navLinkSchema>;
export type FooterGroupInput = z.infer<typeof footerGroupSchema>;
export type SiteSettingInput = z.infer<typeof siteSettingSchema>;
export type BusinessSettingInput = z.infer<typeof businessSettingSchema>;
