import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../_components/PageHeader";

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
    {
      label: "Created",
      value: new Date(review.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      label: "Last updated",
      value: new Date(review.updatedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  return (
    <div>
      <PageHeader
        title={review.name}
        description={
          review.course ? `Review for: ${review.course}` : "General review"
        }
        backHref="/admin/reviews"
        backLabel="Back to all reviews"
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Full review text */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Review Content
            </h2>
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
          </div>

          {/* Audit timestamps */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Record</h2>
            <dl className="divide-y divide-slate-100">
              {meta.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between gap-3 py-2 text-sm"
                >
                  <dt className="shrink-0 text-slate-500">{item.label}</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Summary</h2>
            <dl className="divide-y divide-slate-100">
              {summary.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between gap-3 py-2 text-sm"
                >
                  <dt className="shrink-0 text-slate-500">{item.label}</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Student photo */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Student Photo
            </h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsAdminPage;
