import { getPublicPostBySlug } from "@/lib/data";
import { SITE_NAME, truncate } from "@/lib/site";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, User } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return {};

  const description = truncate(
    post.excerpt ||
      post.content.slice(0, 160) ||
      `${post.title} — blog post at ${SITE_NAME}.`
  );

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      url: `/blogs/${post.slug}`,
      title: `${post.title} | ${SITE_NAME}`,
      description,
      ...(post.imageUrl
        ? { images: [{ url: post.imageUrl, alt: post.imageAlt || post.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${SITE_NAME}`,
      description,
      ...(post.imageUrl ? { images: [post.imageUrl] } : {}),
    },
  };
};

/** Split the admin-managed blob into readable paragraphs. */
const toParagraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

const BlogDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post || !post.published) notFound();

  const paragraphs = toParagraphs(post.content);
  const [lead, ...rest] = paragraphs;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav
        className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition-colors hover:text-blue-700">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/blogs" className="transition-colors hover:text-blue-700">
          Blogs
        </Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-slate-800">{post.title}</span>
      </nav>

      <header className="title-header mt-8">
        <h1 className="font-bangla text-[clamp(1.7rem,3.5vw,2.6rem)] font-bold leading-tight text-slate-900">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
          <time
            dateTime={new Date(post.createdAt).toISOString()}
            className="flex items-center gap-1.5"
          >
            <CalendarDays size={14} aria-hidden />
            {new Date(post.createdAt).toLocaleDateString("en-GB", {
              dateStyle: "long",
            })}
          </time>
          {post.publishedBy?.name && (
            <span className="flex items-center gap-1.5">
              <User size={14} aria-hidden />
              {post.publishedBy.name}
            </span>
          )}
        </div>

        {post.excerpt && (
          <p className="mt-4 font-bangla text-[16px] leading-7 text-slate-500">
            {post.excerpt}
          </p>
        )}
      </header>

      {post.imageUrl && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
          <Image
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 92vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8 space-y-5">
        {lead && (
          <p className="font-bangla text-[17px] leading-8 text-slate-700 sm:text-[18px]">
            {lead}
          </p>
        )}
        {rest.map((paragraph) => (
          <p
            key={paragraph}
            className="font-bangla text-[15px] leading-7 text-slate-500 sm:text-[16px]"
          >
            {paragraph}
          </p>
        ))}
        {paragraphs.length === 0 && (
          <p className="font-bangla text-slate-400">No content yet.</p>
        )}
      </div>

      <div className="mt-12 border-t border-slate-100 pt-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-[15px] font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
        >
          ← All blogs
        </Link>
      </div>
    </article>
  );
};

export default BlogDetailPage;
