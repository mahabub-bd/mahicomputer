import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { categories, extraCategories } from "../app/constants/categories";
import { courses } from "../app/constants/courses";
import { faqs } from "../app/constants/faq";
import { footerLinks } from "../app/constants/footerLinks";
import { gallery } from "../app/constants/gallery";
import { instractor } from "../app/constants/instractor";
import { navLinks } from "../app/constants/navLinks";
import { partners } from "../app/constants/partners";
import { review } from "../app/constants/review";
import { socialMedia } from "../app/constants/socialMedia";
import { stats } from "../app/constants/stats";
import { PrismaClient } from "../app/generated/prisma/client";
import { courseContent } from "./course-content";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin user
  const email = (process.env.ADMIN_EMAIL || "admin@mahicomputerbd.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "changeme";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
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
      aboutTitle: "About Mahi Computer Institute",
      aboutText:
        "মাহি কম্পিউটার ট্রেনিং সেন্টার, গুলশান, ঢাকা হলো একটি প্রযুক্তি শিক্ষার প্রতিষ্ঠান। এটি ঢাকার গুলশান এলাকায় অবস্থিত একটি জনপ্রিয় কম্পিউটার ট্রেনিং সেন্টার। এই প্রতিষ্ঠানটি বিভিন্ন প্রযুক্তি বিষয়ে প্রশিক্ষণ প্রদান করে এবং ছাত্রদের প্রযুক্তি দক্ষতা বৃদ্ধি করে। এখানে কম্পিউটার অপারেটিং সিস্টেম, কম্পিউটার নেটওয়ার্কিং, ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইনিং, মাল্টিমিডিয়া, অটোক্যাড, প্রোগ্রামিং এবং ডাটাবেস ম্যানেজমেন্ট এমনকি ইথিক্যাল হ্যাকিং এই ধরণের বিভিন্ন প্রশিক্ষণ কোর্স উপলব্ধ আছে।\n\nমাহি কম্পিউটার ট্রেনিং সেন্টারে উপযুক্ত শিক্ষার্থীদের জন্য সুবিধাজনক শিক্ষামূলক পাঠ্যপুস্তক এবং নতুনত্বপূর্ণ কম্পিউটার যন্ত্রাংশ ও সফ্টওয়্যার প্রদান করা হয়। এছাড়াও, প্রশিক্ষকদের পরামর্শ ও পরিচালনা নিশ্চিত করে ছাত্রদের ভাল প্রশিক্ষণ দেয়া হয়। মাহি কম্পিউটার ট্রেনিং সেন্টার যোগ্যতামূলক উপকরণ ও সুযোগ-সুবিধা সহ একটি আধুনিক কম্পিউটার ট্রেনিং প্রতিষ্ঠান।",
      phone: "+8801711102944",
      email: "info@mahicomputerbd.com",
      address: "Ka-65 Shahajadpur, Gulshan, Dhaka-1212",
      stats: stats.map(({ title, value, class: cls }) => ({
        title,
        value,
        class: cls,
      })),
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
      imageUrl: c.courseImg,
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
      imageUrl: c.img,
      alt: c.alt,
      order: i,
    })),
  });

  await prisma.instructor.deleteMany();
  await prisma.instructor.createMany({
    data: instractor.map((p, i) => ({
      name: p.name,
      description: p.des,
      imageUrl: p.img,
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
      imageUrl: r.img,
      order: i,
    })),
  });

  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: partners.map((p, i) => ({
      imageUrl: p.img,
      alt: p.alt,
      order: i,
    })),
  });

  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: gallery.map((g, i) => ({
      imageUrl: g.img,
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
    admin: email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
