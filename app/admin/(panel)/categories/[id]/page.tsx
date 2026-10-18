import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../_components/PageHeader";

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
    {
      label: "Created",
      value: category.createdAt.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      label: "Last updated",
      value: category.updatedAt.toLocaleString("en-GB", {
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
        title={category.title}
        description="Service category"
        backHref="/admin/categories"
        backLabel="Back to all categories"
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Image preview */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Image</h2>
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
          </div>

          {/* Public preview note */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Where it appears
            </h2>
            <p className="text-[15px] leading-7 text-slate-600">
              This category is shown in the{" "}
              <span className="font-medium text-slate-900">
                &ldquo;আমাদের সার্ভিস সমূহ&rdquo;
              </span>{" "}
              grid on the home page. Categories are sorted by{" "}
              <span className="font-medium text-slate-900">display order</span>{" "}
              (lower numbers first).
            </p>
            <Link
              href="/#categories"
              className="mt-4 inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              View on home page
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Summary</h2>
            <dl className="divide-y divide-slate-100">
              {summary.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between gap-3 py-2 text-sm"
                >
                  <dt className="shrink-0 text-slate-500">{item.label}</dt>
                  <dd className="break-all text-right font-medium text-slate-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Record ID</h2>
            <code className="block break-all rounded bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {category.id}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsAdminPage;
