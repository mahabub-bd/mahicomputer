import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import DetailActions from "../../../_components/DetailActions";
import PageHeader from "../../../_components/PageHeader";
import SectionCard from "../../../_components/SectionCard";
import SummaryList from "../../../_components/SummaryList";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const CategoryDetailsAdminPage = async ({ params }: Props) => {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const summary = [
    { label: "Display order", value: String(category.order) },
    { label: "Alt text", value: category.alt || "—" },
    { label: "Image URL", value: category.imageUrl || "—" },
    { label: "Created", value: formatDateTime(category.createdAt) },
    { label: "Last updated", value: formatDateTime(category.updatedAt) },
  ];

  return (
    <div>
      <PageHeader
        title={category.title}
        description="Service category"
        actions={
          <DetailActions
            backHref="/admin/categories"
            backLabel="Back to all categories"
            viewHref="/#categories"
            editHref={`/admin/categories?edit=${category.id}`}
            deleteUrl={`/api/admin/categories/${category.id}`}
            deleteConfirm={`Delete "${category.title}"? Its courses will become uncategorized. This cannot be undone.`}
            afterDeleteHref="/admin/categories"
          />
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Image preview */}
          <SectionCard title="Image">
            {category.imageUrl ? (
              <div className="flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.imageUrl}
                  alt={category.alt || category.title}
                  className="max-h-80 w-auto rounded object-contain"
                />
              </div>
            ) : (
              <p className="text-sm text-slate-400">No image uploaded yet.</p>
            )}
            {category.alt && (
              <p className="mt-3 text-sm text-slate-500">
                <span className="font-medium text-slate-700">Alt text:</span>{" "}
                {category.alt}
              </p>
            )}
          </SectionCard>

          {/* Public preview note */}
          <SectionCard title="Where it appears">
            <p className="text-[15px] leading-7 text-slate-600">
              This category is shown in the{" "}
              <span className="font-medium text-slate-900">
                &ldquo;আমাদের সার্ভিস সমূহ&rdquo;
              </span>{" "}
              grid on the home page. Categories are sorted by{" "}
              <span className="font-medium text-slate-900">display order</span>{" "}
              (lower numbers first).
            </p>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Summary">
            <SummaryList items={summary} />
          </SectionCard>

          <SectionCard title="Record ID">
            <code className="block break-all rounded bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {category.id}
            </code>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsAdminPage;
