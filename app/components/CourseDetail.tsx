import EnrollButton from "@/app/_components/EnrollButton";
import styles from "@/app/styles/style";
import type { Course } from "@/lib/types";
import {
  Award,
  BookOpen,
  Clock,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseDetailProps {
  course: Course;
  instructorDescription?: string;
  /** Category title shown in the breadcrumb (from the linked Category row). */
  category?: string;
  /** Intro paragraphs shown under the About heading (from the DB). */
  description?: string[];
  /** Syllabus items under the Inside heading (from the DB). */
  modules?: string[];
  prerequisite?: string;
  seats?: string;
  /** Section headings (admin-editable via site settings). */
  aboutTitle?: string;
  insideTitle?: string;
}

const chipCls =
  "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-700 shadow-sm";

/**
 * Shared course-details layout used by every /courses/[slug] page.
 * Rich content (description, modules) is per-course; everything numeric
 * (fee, duration, classes, instructor) comes from the database.
 */
const CourseDetail = ({
  course,
  instructorDescription = "",
  category = "",
  description = [],
  modules = [],
  prerequisite = "SSC pass / basic computer knowledge",
  seats = "10 students per batch.",
  aboutTitle = "About This Course",
  insideTitle = "Inside This Course",
}: CourseDetailProps) => {
  const details = [
    { icon: Wallet, label: "Course Fee", value: `৳${course.price.toLocaleString("en-BD")}` },
    { icon: Clock, label: "Course Duration", value: `${course.duration} Month` },
    { icon: BookOpen, label: "Total Classes", value: `${course.lesson}` },
    { icon: Award, label: "Pre-requisite", value: prerequisite },
    { icon: Users, label: "Total Seat", value: seats },
  ];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <header className="bg-linear-to-br from-blue-50 via-white to-pink-50">
        <div className={`${styles.boxWidth} mx-auto px-4 pb-12 pt-8 sm:px-6`}>
          <nav
            className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-blue-700">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/courses" className="transition-colors hover:text-blue-700">
              Courses
            </Link>
            {category && (
              <>
                <span aria-hidden>/</span>
                <span className="font-semibold text-slate-800">{category}</span>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="font-semibold text-slate-800">{course.title}</span>
          </nav>

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] xl:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {category && (
                  <>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </span>
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[12px] font-bold text-white transition hover:bg-blue-700"
                    >
                      <BookOpen size={12} aria-hidden />
                      {category}
                    </Link>
                  </>
                )}
                {course.tag && (
                  <>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      Tag
                    </span>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[12px] font-bold text-white ${course.tagbg || "bg-blue-600"}`}
                    >
                      {course.tag}
                    </span>
                  </>
                )}
              </div>

              <h1 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tight text-slate-900">
                {course.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className={chipCls}>
                  <Clock size={15} className="text-blue-600" />
                  {course.duration} Months
                </span>
                <span className={chipCls}>
                  <BookOpen size={15} className="text-blue-600" />
                  {course.lesson} Classes
                </span>
                <span className={chipCls}>
                  <Wallet size={15} className="text-blue-600" />
                  ৳{course.price.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="mt-7">
                <EnrollButton
                  course={course.title}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-3 text-[15px] font-semibold text-white shadow-md transition hover:bg-blue-800 hover:shadow-lg"
                />
              </div>
            </div>

            <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
              <Image
                src={course.imageUrl}
                alt={course.imageAlt || course.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Body ---------- */}
      <div className={`${styles.boxWidth} mx-auto px-4 py-12 sm:px-6`}>
        <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr] xl:gap-12">
          <div>
            <h2 className="text-[26px] font-bold tracking-tight text-[#112244]">
              {aboutTitle}
            </h2>
            <div className="mt-4 space-y-4">
              {description.map((paragraph, i) => (
                <p key={i} className="text-[16px] leading-8 text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="text-[26px] font-bold tracking-tight text-[#112244]">
                {insideTitle}
              </h2>
              <ol className="mt-5 grid items-start gap-4 sm:grid-cols-2">
                {modules.map((module, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-[#faf9fd] p-4"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[13px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-7 text-slate-600">
                      {module}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Instructor
              </h3>
              <div className="mt-4 flex items-center gap-4">
                {course.instructorPhotoUrl ? (
                  <Image
                    src={course.instructorPhotoUrl}
                    alt={course.instructorName || "Instructor"}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover shadow ring-4 ring-blue-50"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Award size={26} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-[17px] font-bold text-slate-900">
                    {course.instructorName || "—"}
                  </p>
                  <p className="text-[13px] text-slate-500">Course Instructor</p>
                </div>
              </div>
              {instructorDescription && (
                <p className="mt-4 text-[14px] leading-7 text-slate-600">
                  {instructorDescription}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Course Details
              </h3>
              <dl className="mt-4 divide-y divide-slate-100">
                {details.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <d.icon size={16} />
                    </span>
                    <dt className="text-[14px] text-slate-500">{d.label}</dt>
                    <dd className="ml-auto text-right text-[15px] font-bold text-slate-900">
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 text-center">
              <p className="text-[15px] font-semibold text-slate-800">
                Have questions about this course?
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                Talk to us before you enroll.
              </p>
              <div className="mt-4 flex justify-center">
                <EnrollButton course={course.title} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
