import { PageHead } from "@/app/_components/PageHead";
import { getPublicPostBySlug } from "@/lib/data";
import { SITE_NAME, truncate } from "@/lib/site";
import { CalendarDays, User } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <article className="mx-auto max-w-350 2xl:max-w-[1536px] px-4 py-5 sm:py-10 sm:px-6">
      <PageHead
        items={[
          { label: "ব্লগ", href: "/blogs" },
          { label: post.title },
        ]}
      />

      <header className="title-header mt-8 grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h1 className="font-bangla text-[clamp(1.7rem,3.5vw,2.6rem)] font-bold leading-tight text-slate-900">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
            <time
              dateTime={new Date(post.createdAt).toISOString()}
              className="flex items-center gap-1.5"
            >
              <CalendarDays size={14} aria-hidden />
              {new Date(post.createdAt).toLocaleDateString("bn-BD", {
                dateStyle: "long",
              })}
            </time>
            {post.author?.name ? (
              <span className="flex items-center gap-2">
                {post.author.imageUrl ? (
                  <Image
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-700">
                    {post.author.name.trim().charAt(0)}
                  </span>
                )}
                <span className="font-medium text-slate-600">{post.author.name}</span>
              </span>
            ) : (
              post.publishedBy?.name && (
                <span className="flex items-center gap-1.5">
                  <User size={14} aria-hidden />
                  {post.publishedBy.name}
                </span>
              )
            )}
          </div>

          {post.excerpt && (
            <p className="mt-4 font-bangla text-[16px] leading-7 text-slate-500">
              {post.excerpt}
            </p>
          )}
        </div>

        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            width={768}
            height={576}
            priority
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="h-auto w-full rounded-2xl border border-slate-100 shadow-lg"
          />
        )}
      </header>

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
          ← সব ব্লগ
        </Link>
      </div>
    </article>
  );
};

export default BlogDetailPage;
