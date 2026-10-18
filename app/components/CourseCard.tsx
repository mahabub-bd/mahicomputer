import { lessonimg, rating as ratingIcon, signal, day } from "@/public";
import Image from "next/image";
import Link from "next/link";
import type { CourseView } from "@/lib/types";

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
  price,
  rating = 4.9,
  reviewCount = 31,
}: CourseView) => {
  return (
    <Link
      href={`/courses/${link}`}
      className="course-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-100/80 hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <Image
          src={courseImg}
          width={640}
          height={360}
          className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          alt={courseImgalt}
        />
        <span
          className={`${tagbg} absolute right-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white shadow-sm`}
        >
          {tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-600">
          <Image
            src={ratingIcon}
            width={14}
            height={14}
            className="h-[14px] w-[14px]"
            alt="rating"
          />
          <span className="font-medium text-slate-700">{rating.toFixed(1)}</span>
          <span className="text-slate-400">({reviewCount})</span>
        </div>

        <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-700 md:text-[20px]">
          {title}
        </h3>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 py-4">
          <div className="flex items-center gap-2">
            <Image
              src={instractorphoto}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              alt={instractorName}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800">
                {instractorName}
              </span>
              <span className="text-xs text-slate-500">Instructor</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">BDT</span>
            <span className="text-xl font-semibold text-qpayone">
              {price.toLocaleString("en-BD")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Image src={lessonimg} width={16} height={16} alt="lessons" />
          <span>{lesson} Lessons</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Image src={day} width={16} height={16} alt="duration" />
          <span>{duration} {Number(duration) > 1 ? "Months" : "Month"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Image src={signal} width={16} height={16} alt="level" />
          <span>Beginner</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
