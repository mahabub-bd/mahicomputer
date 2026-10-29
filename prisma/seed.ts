import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env", quiet: true });


import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { courseContent } from "./course-content";
import { categories, extraCategories } from "./seed-data/categories";
import { courses } from "./seed-data/courses";
import { faqs } from "./seed-data/faq";
import { footerLinks } from "./seed-data/footerLinks";
import { gallery } from "./seed-data/gallery";
import { instractor } from "./seed-data/instractor";
import { navLinks } from "./seed-data/navLinks";
import { partners } from "./seed-data/partners";
import { review } from "./seed-data/review";
import { socialMedia } from "./seed-data/socialMedia";
import { stats } from "./seed-data/stats";
import {
  dummyBatches,
  dummyEnrollments,
  dummyMessages,
  dummyNewsletters,
  dummyNotices,
  dummyPosts,
  dummySubscribers,
  paymentChunks,
} from "./seed-data/dummy";
import {
  categoryImages,
  courseImages,
  galleryImages,
  instructorImages,
  partnerImages,
  reviewImages,
} from "./seed-data/blob-urls";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin user
  const email = (process.env.ADMIN_EMAIL || "admin@mahicomputerbd.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "changeme";
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Admin" },
  });

  // Site settings (singleton)
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroTitle: "মাহি কম্পিউটার ট্রেনিং ইনস্টিটিউট",
      heroSubtitle:
        "আমরা সব কোর্সের অ্যাডভান্স লেভেল শেখাচ্ছি এবং আমরা সঠিকভাবে সব কোর্সের যত্ন নেই । ঢাকা জেলার গুলশান, ভাটারা , বাড্ডা থানায় এই ট্রেনিং সেন্টারটি খুবই বিখ্যাত । আমরা বিশ্বাস করি 85% প্রাক্টিক্যাল কাজই সেরা প্রশিক্ষণ। আমরা সর্বোত্তম শিক্ষা দেওয়ার প্রতিশ্রুতি প্রদান করি।",
      heroNote: "কোর্স মেয়াদ: 03 মাস, 06 মাস, 12 মাস",
      aboutTitle: "মাহি কম্পিউটার ইনস্টিটিউট সম্পর্কে",
      aboutText:
        "মাহি কম্পিউটার ট্রেনিং সেন্টার, গুলশান, ঢাকা হলো একটি প্রযুক্তি শিক্ষার প্রতিষ্ঠান। এটি ঢাকার গুলশান এলাকায় অবস্থিত একটি জনপ্রিয় কম্পিউটার ট্রেনিং সেন্টার। এই প্রতিষ্ঠানটি বিভিন্ন প্রযুক্তি বিষয়ে প্রশিক্ষণ প্রদান করে এবং ছাত্রদের প্রযুক্তি দক্ষতা বৃদ্ধি করে। এখানে কম্পিউটার অপারেটিং সিস্টেম, কম্পিউটার নেটওয়ার্কিং, ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইনিং, মাল্টিমিডিয়া, অটোক্যাড, প্রোগ্রামিং এবং ডাটাবেস ম্যানেজমেন্ট এমনকি ইথিক্যাল হ্যাকিং এই ধরণের বিভিন্ন প্রশিক্ষণ কোর্স উপলব্ধ আছে।\n\nমাহি কম্পিউটার ট্রেনিং সেন্টারে উপযুক্ত শিক্ষার্থীদের জন্য সুবিধাজনক শিক্ষামূলক পাঠ্যপুস্তক এবং নতুনত্বপূর্ণ কম্পিউটার যন্ত্রাংশ ও সফ্টওয়্যার প্রদান করা হয়। এছাড়াও, প্রশিক্ষকদের পরামর্শ ও পরিচালনা নিশ্চিত করে ছাত্রদের ভাল প্রশিক্ষণ দেয়া হয়। মাহি কম্পিউটার ট্রেনিং সেন্টার যোগ্যতামূলক উপকরণ ও সুযোগ-সুবিধা সহ একটি আধুনিক কম্পিউটার ট্রেনিং প্রতিষ্ঠান।",
      stats: stats.map(({ title, value, class: cls }) => ({
        title,
        value,
        class: cls,
      })),
    },
  });

  // Business settings (singleton) — contact details, map and WhatsApp widget.
  await prisma.businessSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      phone: "+8801711102944",
      email: "info@mahicomputerbd.com",
      address: "Ka-65 Shahajadpur, Gulshan, Dhaka-1212",
    },
  });

  // Courses / categories / instructors (delete-and-recreate, idempotent)
  await prisma.course.deleteMany();
  await prisma.course.createMany({
    data: courses.map((c, i) => ({
      slug: c.link,
      title: c.title,
      tag: c.tag,
      tagbg: c.tagbg,
      imageUrl: courseImages[c.link] ?? c.courseImg,
      imageAlt: c.courseImgalt,
      lesson: c.lesson,
      duration: c.duration,
      instructorName: c.instractorName,
      instructorPhotoUrl: c.instractorphoto,
      price: c.price,
      description: courseContent[c.link]?.description ?? [],
      modules: courseContent[c.link]?.modules ?? [],
      prerequisite: courseContent[c.link]?.prerequisite ?? "",
      seats: courseContent[c.link]?.seats ?? "",
      order: i,
    })),
  });

  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: [...categories, ...extraCategories].map((c, i) => ({
      title: c.title,
      imageUrl: categoryImages[c.title] ?? c.img,
      alt: c.alt,
      order: i,
    })),
  });

  await prisma.instructor.deleteMany();
  await prisma.instructor.createMany({
    data: instractor.map((p, i) => ({
      name: p.name,
      description: p.des,
      imageUrl: instructorImages[i] ?? p.img,
      order: i,
    })),
  });

  await prisma.review.deleteMany();
  await prisma.review.createMany({
    data: review.map((r, i) => ({
      name: r.name,
      title: r.title,
      content: r.content,
      course: r.course,
      rating: r.rating,
      imageUrl: reviewImages[i] ?? r.img,
      order: i,
    })),
  });

  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: partners.map((p, i) => ({
      imageUrl: partnerImages[p.alt] ?? p.img,
      alt: p.alt,
      order: i,
    })),
  });

  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: gallery.map((g, i) => ({
      imageUrl: galleryImages[i] ?? g.img,
      alt: g.alt,
      order: i,
    })),
  });

  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: faqs.map((f, i) => ({
      question: f.question,
      answer: f.answer,
      order: i,
    })),
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: socialMedia.map((s, i) => ({
      icon: s.icon,
      link: s.link,
      order: i,
    })),
  });

  await prisma.navLink.deleteMany();
  await prisma.navLink.createMany({
    data: navLinks.map((n, i) => ({
      title: n.title,
      href: n.id,
      cssClass: n.class,
      order: i,
    })),
  });

  await prisma.footerLinkGroup.deleteMany();
  await prisma.footerLinkGroup.createMany({
    data: footerLinks.map((g, i) => ({ title: g.title, order: i })),
  });
  const groups = await prisma.footerLinkGroup.findMany({ orderBy: { order: "asc" } });
  for (const [i, g] of footerLinks.entries()) {
    const dbGroup = groups[i];
    if (!dbGroup) continue;
    await prisma.footerLink.createMany({
      data: g.links.map((l, j) => ({
        name: l.name,
        href: l.link,
        order: j,
        groupId: dbGroup.id,
      })),
    });
  }

  // ---- Dummy data: admissions, batches, sessions, attendance, payments ----
  // All invented students; delete-and-recreate like the sections above.
  await prisma.attendance.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.batchStudent.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.post.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.contactMessage.deleteMany();

  // Admissions (with student IDs + payment history for approved ones).
  const enrollmentIds: string[] = [];
  for (const e of dummyEnrollments) {
    const paid = e.paidAmount ?? 0;
    const created = await prisma.enrollment.create({
      data: {
        name: e.name,
        phone: e.phone,
        email: e.email,
        course: e.course,
        message: e.message,
        status: e.status,
        read: e.status !== "PENDING",
        studentId: e.studentId ?? "",
        courseFee: e.courseFee ?? 0,
        installmentPlan: e.installmentPlan ?? [],
        discount: e.discount ?? 0,
        paidAmount: paid,
        paymentMethod: e.paymentMethod ?? "",
        gender: e.gender ?? "",
        fatherName: e.fatherName ?? "",
        motherName: e.motherName ?? "",
        education: e.education ?? "",
        address: e.address ?? "",
        guardianName: e.guardianName ?? "",
        guardianPhone: e.guardianPhone ?? "",
        createdAt: new Date(e.appliedAt ?? "2026-10-05"),
        // One Payment row per installment chunk actually collected.
        payments: {
          create: paymentChunks(e).map((amount, i) => ({
            amount,
            method: e.paymentMethod ?? "Cash",
            paidAt: new Date(`2026-10-${String(3 + i * 7).padStart(2, "0")}`),
          })),
        },
      },
    });
    enrollmentIds.push(created.id);
  }

  // Batches with students, class sessions and attendance.
  for (const b of dummyBatches) {
    const batch = await prisma.batch.create({
      data: {
        course: b.course,
        name: b.name,
        startDate: new Date(b.startDate),
        schedule: b.schedule,
        capacity: b.capacity,
        status: b.status,
        note: b.note,
        students: {
          create: b.students.map((i) => ({ enrollmentId: enrollmentIds[i] })),
        },
        sessions: {
          create: b.sessions.map((s) => ({
            date: new Date(s.date),
            topic: s.topic,
          })),
        },
      },
      include: { sessions: { orderBy: { date: "asc" } } },
    });

    for (const [si, marks] of b.attendance.entries()) {
      const session = batch.sessions[si];
      if (!session) continue;
      await prisma.attendance.createMany({
        data: b.students.map((ei, mi) => ({
          sessionId: session.id,
          enrollmentId: enrollmentIds[ei],
          status:
            marks[mi] === "A" ? "ABSENT" : marks[mi] === "L" ? "LATE" : "PRESENT",
        })),
      });
    }
  }

  // Notices / newsletters / blog posts / subscribers / contact messages.
  await prisma.notice.createMany({
    data: dummyNotices.map((n, i) => ({
      title: n.title,
      body: n.body,
      published: n.published,
      date: new Date(`2026-10-${String(25 - i * 5).padStart(2, "0")}`),
      order: i,
      publishedById: admin.id,
    })),
  });

  await prisma.newsletter.createMany({
    data: dummyNewsletters.map((n, i) => ({
      title: n.title,
      body: n.body,
      published: n.published,
      order: i,
      publishedById: admin.id,
    })),
  });

  const firstInstructor = await prisma.instructor.findFirst({ orderBy: { order: "asc" } });
  await prisma.post.createMany({
    data: dummyPosts.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      published: p.published,
      authorId: firstInstructor?.id,
      publishedById: admin.id,
      createdAt: new Date(`2026-10-${String(26 - i * 8).padStart(2, "0")}`),
    })),
  });

  await prisma.newsletterSubscriber.createMany({
    data: dummySubscribers.map((email, i) => ({
      email,
      createdAt: new Date(`2026-10-${String(26 - i * 4).padStart(2, "0")}`),
    })),
  });

  await prisma.contactMessage.createMany({
    data: dummyMessages.map((m, i) => ({
      ...m,
      createdAt: new Date(`2026-10-${String(27 - i * 3).padStart(2, "0")}`),
    })),
  });

  console.log("Seeded:", {
    courses: courses.length,
    categories: categories.length,
    instructors: instractor.length,
    reviews: review.length,
    partners: partners.length,
    gallery: gallery.length,
    social: socialMedia.length,
    navLinks: navLinks.length,
    faqs: faqs.length,
    footerGroups: footerLinks.length,
    enrollments: dummyEnrollments.length,
    batches: dummyBatches.length,
    notices: dummyNotices.length,
    posts: dummyPosts.length,
    messages: dummyMessages.length,
    admin: email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
