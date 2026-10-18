import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { Post } from "@/lib/types";

/** Blog card for the /blogs grid. */
const BlogCard = ({ post }: { post: Post }) => {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1200px) 45vw, 380px"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-3xl">
            📝
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pt-4">
        <time
          dateTime={new Date(post.createdAt).toISOString()}
          className="flex items-center gap-1.5 text-xs text-slate-400"
        >
          <CalendarDays size={13} aria-hidden />
          {new Date(post.createdAt).toLocaleDateString("en-GB", {
            dateStyle: "medium",
          })}
        </time>

        <h3 className="mt-2 line-clamp-2 font-bangla text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-700">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 font-bangla text-sm leading-6 text-slate-500">
            {post.excerpt}
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm">
        <span className="font-semibold text-blue-700 transition-colors group-hover:text-blue-800">
          বিস্তারিত পড়ুন
        </span>
        <span aria-hidden className="text-slate-400 transition group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
