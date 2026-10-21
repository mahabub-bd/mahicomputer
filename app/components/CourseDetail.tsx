import EnrollButton from "@/app/_components/EnrollButton";
import { Breadcrumb } from "@/app/_components/PageHead";
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
  "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-slate-700 shadow-sm backdrop-blur";

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
  prerequisite = "এসএসসি পাস / কম্পিউটারের বেসিক ধারণা",
  seats = "প্রতি ব্যাচে সর্বোচ্চ ১০ জন ছাত্রছাত্রী।",
  aboutTitle = "কোর্স সম্পর্কে",
  insideTitle = "কোর্সের ভেতরে যা থাকছে",
}: CourseDetailProps) => {
  const details = [
    { icon: Wallet, label: "কোর্স ফি", value: `৳${course.price.toLocaleString("en-BD")}` },
    { icon: Clock, label: "কোর্সের মেয়াদ", value: `${course.duration} মাস` },
    { icon: BookOpen, label: "মোট ক্লাস", value: `${course.lesson}` },
    { icon: Award, label: "প্রয়োজনীয় যোগ্যতা", value: prerequisite },
    { icon: Users, label: "মোট সিট", value: seats },
  ];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <header className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-pink-50">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl sm:h-80 sm:w-80"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl sm:h-80 sm:w-80"
        />

        <div className={`relative mx-auto max-w-350 px-4 pb-16 pt-6 sm:px-6 sm:pt-8`}>
          <div className="mt-1">
            <Breadcrumb
              align="left"
              items={[
                { label: "কোর্স", href: "/courses" },
                ...(category ? [{ label: category, href: "/courses" }] : []),
                { label: course.title },
              ]}
            />
          </div>

          <div className="mt-5 grid items-center gap-8 sm:gap-10 lg:mt-6 lg:grid-cols-[1.15fr_1fr] xl:gap-14">
            {/* Left — course identity */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {category && (
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-blue-700 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
                  >
                    <BookOpen size={12} aria-hidden />
                    {category}
                  </Link>
                )}
                {course.tag && (
                  <span
                    className={`inline-block rounded-full px-3 py-1.5 text-[12px] font-bold text-white shadow-sm ${course.tagbg || "bg-blue-600"}`}
                  >
                    {course.tag}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-[clamp(1.75rem,5vw,3rem)] font-bold leading-tight tracking-tight text-slate-900">
                {course.title}
              </h1>

              {course.instructorName && (
                <div className="mt-4 flex items-center gap-3">
                  {course.instructorPhotoUrl ? (
                    <Image
                      src={course.instructorPhotoUrl}
                      alt={course.instructorName}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Award size={18} />
                    </span>
                  )}
                  <p className="text-[14px] text-slate-600">
                    <span className="font-semibold text-slate-900">{course.instructorName}</span>
                    <span className="text-slate-400"> · কোর্স ইন্সট্রাক্টর</span>
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <span className={chipCls}>
                  <Clock size={15} className="text-blue-600" />
                  {course.duration} মাস
                </span>
                <span className={chipCls}>
                  <BookOpen size={15} className="text-blue-600" />
                  {course.lesson} ক্লাস
                </span>
              </div>

              {/* Price + primary CTA — stacked full-width on mobile for thumb reach */}
              <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:gap-x-5">
                <EnrollButton
                  course={course.title}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-7 py-3.5 text-[15px] font-semibold text-white shadow-md shadow-blue-700/25 transition hover:bg-blue-800 hover:shadow-lg sm:w-auto sm:py-3"
                />
                <div className="mt-3 flex items-center justify-center gap-2 sm:mt-0 sm:block">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-400">
                    কোর্স ফি
                  </p>
                  <p className="text-[22px] font-bold leading-7 text-blue-700 sm:text-[26px] sm:leading-8">
                    ৳{course.price.toLocaleString("en-BD")}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-center text-[13px] text-slate-500 sm:text-left">{seats}</p>
            </div>

            {/* Right — image with floating duration card */}
            <div className="relative mt-2">
              <div className="relative aspect-16/10 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl ring-1 ring-slate-100">
                <Image
                  src={course.imageUrl}
                  alt={course.imageAlt || course.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-4 z-10 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-lg sm:left-6 sm:px-4 sm:py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-10 sm:w-10">
                  <Clock size={18} />
                </span>
                <div>
                  <p className="text-[13px] font-bold text-slate-900 sm:text-[14px]">
                    {course.duration} মাস
                  </p>
                  <p className="text-[11px] text-slate-500 sm:text-[12px]">{course.lesson} ক্লাস</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Body ---------- */}
      <div className={`mx-auto max-w-350 px-4 pb-28 pt-10 sm:px-6 sm:pt-12 lg:pb-12`}>
        <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr] xl:gap-12">
          {/* Main column */}
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-6 w-1.5 rounded-full bg-blue-600" />
              <h2 className="text-[21px] font-bold tracking-tight text-[#112244] sm:text-[26px]">
                {aboutTitle}
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {description.map((paragraph, i) => (
                <p key={i} className="text-[16px] leading-8 text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Syllabus — numbered vertical timeline */}
            <div className="mt-12">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-6 w-1.5 rounded-full bg-blue-600" />
                <h2 className="text-[21px] font-bold tracking-tight text-[#112244] sm:text-[26px]">
                  {insideTitle}
                </h2>
              </div>

              {modules.length > 0 ? (
                <ol className="mt-8">
                  {modules.map((module, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[13px] font-bold text-white shadow-sm shadow-blue-600/30">
                          {i + 1}
                        </span>
                        {i < modules.length - 1 && (
                          <span
                            aria-hidden
                            className="my-1 w-0.5 flex-1 rounded bg-slate-200"
                          />
                        )}
                      </div>
                      <p
                        className={`text-[15px] leading-7 text-slate-600 ${
                          i < modules.length - 1 ? "pb-6" : ""
                        }`}
                      >
                        {module}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-5 text-[15px] text-slate-500">
                  বিস্তারিত সিলেবাস শীঘ্রই যুক্ত করা হবে।
                </p>
              )}
            </div>
          </div>

          {/* Sidebar — selling flow: price → details → instructor → help */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-blue-200/60 bg-linear-to-b from-blue-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-700/20">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-blue-100">
                কোর্স ফি
              </p>
              <p className="mt-1 text-[38px] font-bold leading-none tracking-tight">
                ৳{course.price.toLocaleString("en-BD")}
              </p>
              <p className="mt-2 text-[13px] text-blue-100">
                {course.duration} মাস · {course.lesson} ক্লাস
              </p>
              <EnrollButton
                course={course.title}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 hover:shadow-md"
              />
              <p className="mt-3 text-center text-[12px] leading-5 text-blue-100">{seats}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
                কোর্সের বিবরণ
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

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
                ইন্সট্রাক্টর
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
                  <p className="text-[13px] text-slate-500">কোর্স ইন্সট্রাক্টর</p>
                </div>
              </div>
              {instructorDescription && (
                <p className="mt-4 text-[14px] leading-7 text-slate-600">
                  {instructorDescription}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 text-center">
              <p className="text-[15px] font-semibold text-slate-800">
                এই কোর্স নিয়ে প্রশ্ন আছে?
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                ভর্তির আগে আমাদের সাথে কথা বলুন।
              </p>
              <div className="mt-4 flex justify-center">
                <EnrollButton course={course.title} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ---------- Mobile sticky fee + enroll bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-6px_20px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              কোর্স ফি
            </p>
            <p className="truncate text-[19px] font-bold leading-6 text-blue-700">
              ৳{course.price.toLocaleString("en-BD")}
            </p>
          </div>
          <EnrollButton
            course={course.title}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-700/25 transition hover:bg-blue-800"
          />
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
