import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import DetailActions from "../../../_components/DetailActions";
import PageHeader from "../../../_components/PageHeader";
import SectionCard from "../../../_components/SectionCard";
import SummaryList from "../../../_components/SummaryList";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const ReviewDetailsAdminPage = async ({ params }: Props) => {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) notFound();

  const rating = Number(review.rating.toFixed(1));

  const summary = [
    { label: "Student", value: review.name },
    { label: "Title", value: review.title || "—" },
    { label: "Course", value: review.course || "General" },
    { label: "Rating", value: `${rating} / 5` },
    { label: "Display order", value: String(review.order) },
  ];

  const meta = [
    { label: "Created", value: formatDateTime(review.createdAt) },
    { label: "Last updated", value: formatDateTime(review.updatedAt) },
  ];

  return (
    <div>
      <PageHeader
        title={review.name}
        description={
          review.course ? `Review for: ${review.course}` : "General review"
        }
        actions={
          <DetailActions
            backHref="/admin/reviews"
            backLabel="Back to all reviews"
            viewHref="/feedback"
            viewLabel="View reviews"
            editHref={`/admin/reviews?edit=${review.id}`}
            deleteUrl={`/api/admin/reviews/${review.id}`}
            deleteConfirm={`Delete the review by "${review.name}"? This cannot be undone.`}
            afterDeleteHref="/admin/reviews"
          />
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Full review text */}
          <SectionCard title="Review Content">
            <div className="mb-4 flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i <= rating ? "currentColor" : "none"}
                  className={i <= rating ? "" : "text-slate-300"}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-slate-500">
                {rating} out of 5
              </span>
            </div>
            <p className="text-[15px] leading-7 text-slate-600">
              {review.content}
            </p>
          </SectionCard>

          {/* Audit timestamps */}
          <SectionCard title="Record">
            <SummaryList items={meta} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <SectionCard title="Summary">
            <SummaryList items={summary} />
          </SectionCard>

          {/* Student photo */}
          <SectionCard title="Student Photo">
            {review.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.imageUrl}
                alt={review.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-50"
              />
            ) : (
              <p className="text-sm text-slate-400">No photo uploaded.</p>
            )}
          </SectionCard>

          <SectionCard title="Record ID">
            <code className="block break-all rounded bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {review.id}
            </code>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsAdminPage;
