import type { CourseView } from "@/lib/types";
import { ArrowUpRight, BookOpen, Clock, Signal, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CourseCard = ({
  courseImg,
  courseImgalt,
  link,
  tag,
  tagbg,
  title,
  lesson,
  duration,
  instractorName,
  instractorphoto,
  category,
  price,
  rating = 4.9,
  reviewCount = 31,
}: CourseView) => {
  const meta = [
    { Icon: BookOpen, label: `${lesson} Lessons` },
    { Icon: Clock, label: `${duration} ${Number(duration) > 1 ? "Months" : "Month"}` },
    { Icon: Signal, label: "Beginner" },
  ];

  return (
    <Link
      href={`/courses/${link}`}
      className="course-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200/70 hover:shadow-[0_22px_45px_-22px_rgba(15,23,42,0.45)]"
    >
      {/* ---------- Media ---------- */}
      <div className="relative overflow-hidden">
        <Image
          src={courseImg}
          width={640}
          height={360}
          className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          alt={courseImgalt}
        />
        {/* Soft fade so the pills stay readable on any photo */}
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/55 via-slate-900/5 to-transparent" />

        {/* Linked category; unlinked courses keep the legacy tag chip. */}
        <span
          className={`${tagbg} absolute left-3 top-3 inline-flex max-w-[60%] truncate items-center rounded-full px-2.5 py-1 text-xs font-medium text-white shadow-sm ring-1 ring-black/10`}
        >
          {category || tag}
        </span>

        {/* Rating badge */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {rating.toFixed(1)}
          <span className="font-medium text-slate-400">({reviewCount})</span>
        </span>
      </div>

      {/* ---------- Body ---------- */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-blue-700 md:text-lg">
          {title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {meta.map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-100"
            >
              <Icon size={13} className="text-blue-600" />
              {label}
            </span>
          ))}
        </div>

        {/* Pinned to the bottom so every card in a row lines up */}
        <div className="mt-auto pt-5">
          <div className="flex items-center gap-2.5">
            {instractorphoto ? (
              <Image
                src={instractorphoto}
                width={40}
                height={40}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white"
                alt={instractorName}
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                {(instractorName || "?").slice(0, 1)}
              </span>
            )}
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-slate-800">
                {instractorName || "ইন্সট্রাক্টর"}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-slate-400">
                ইন্সট্রাক্টর
              </span>
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="flex flex-col">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                ফি
              </span>
              <span className="flex items-baseline gap-1">
                <span className="text-xs font-semibold text-slate-500">৳</span>
                <span className="text-2xl font-bold leading-none text-qpayone">
                  {price.toLocaleString("en-BD")}
                </span>
              </span>
            </span>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition duration-300 group-hover:bg-blue-700 group-hover:shadow-md">
              কোর্স দেখুন
              <ArrowUpRight
                size={15}
                className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
