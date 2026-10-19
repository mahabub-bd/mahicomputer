import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import DetailActions from "../../../_components/DetailActions";
import PageHeader from "../../../_components/PageHeader";
import SectionCard from "../../../_components/SectionCard";
import StatusBadge from "../../../_components/StatusBadge";
import SummaryList from "../../../_components/SummaryList";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const BlogDetailsAdminPage = async ({ params }: Props) => {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, imageUrl: true } },
      publishedBy: { select: { name: true } },
    },
  });
  if (!post) notFound();

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const summary = [
    { label: "Slug", value: `/blogs/${post.slug}` },
    { label: "Author", value: post.author?.name || "—" },
    { label: "Published by", value: post.publishedBy?.name || "—" },
    { label: "Created", value: formatDateTime(post.createdAt) },
    { label: "Last updated", value: formatDateTime(post.updatedAt) },
    { label: "Content length", value: `${post.content.length} chars` },
  ];

  return (
    <div>
      <PageHeader
        title={post.title}
        badge={<StatusBadge published={post.published} />}
        description={post.author ? `Author: ${post.author.name}` : "Blog post"}
        actions={
          <DetailActions
            backHref="/admin/blogs"
            backLabel="Back to all blogs"
            viewHref={`/blogs/${post.slug}`}
            editHref={`/admin/blogs?edit=${post.id}`}
            deleteUrl={`/api/admin/blogs/${post.id}`}
            deleteConfirm={`Delete "${post.title}"? This cannot be undone.`}
            afterDeleteHref="/admin/blogs"
          />
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="Content">
            {post.imageUrl ? (
              <div className="relative mb-5 aspect-video overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt || post.title}
                  fill
                  sizes="(min-width: 1280px) 640px, 92vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <p className="mb-5 text-sm text-slate-400">No cover image.</p>
            )}

            {post.excerpt && (
              <p className="mb-5 border-l-4 border-blue-100 pl-3 text-[15px] leading-7 text-slate-500">
                {post.excerpt}
              </p>
            )}

            {paragraphs.length > 0 ? (
              <div className="space-y-4">
                {paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-7 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No content yet.</p>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Summary">
            <SummaryList items={summary} />
          </SectionCard>

          <SectionCard title="Author">
            {post.author ? (
              <div className="flex items-center gap-3">
                {post.author.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full object-cover ring-4 ring-blue-50"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {post.author.name.trim().charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-medium text-slate-900">{post.author.name}</p>
                  <p className="text-xs text-slate-400">Instructor</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No author assigned.</p>
            )}
          </SectionCard>

          <SectionCard title="Record ID">
            <code className="block break-all rounded bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {post.id}
            </code>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsAdminPage;
