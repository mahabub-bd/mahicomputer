import Image from "next/image";
import { Quote, Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  title: string;
  content: string;
  course: string;
  rating: number;
  img: string;
}

const ReviewCard = ({
  name,
  title,
  content,
  course,
  rating,
  img,
}: ReviewCardProps) => {
  const fullStars = Math.round(rating);

  return (
    <figure className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex items-center gap-0.5"
          aria-label={`Rated ${rating} out of 5`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < fullStars
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-100 text-slate-200"
              }
            />
          ))}
          <span className="ml-1.5 text-[13px] font-bold text-slate-700">
            {rating.toFixed(1)}
          </span>
        </div>

        {course && (
          <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
            {course}
          </span>
        )}
      </div>

      <Quote
        size={32}
        aria-hidden
        className="mt-4 text-blue-100 transition-colors duration-300 group-hover:text-blue-200"
      />

      <blockquote className="mt-2 flex-1 text-[15px] leading-7 text-slate-600">
        {content}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <Image
          src={img}
          alt={name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
        />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-slate-900">
            {name}
          </p>
          <p className="truncate text-[13px] text-slate-500">{title}</p>
        </div>
      </figcaption>
    </figure>
  );
};

export default ReviewCard;
