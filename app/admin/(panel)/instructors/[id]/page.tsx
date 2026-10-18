import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "../../../_components/PageHeader";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const InstructorDetailsAdminPage = async ({ params }: Props) => {
  const { id } = await params;
  const instructor = await prisma.instructor.findUnique({ where: { id } });
  if (!instructor) notFound();

  // Courses linked to this instructor through the Course.instructorId relation.
  const courses = await prisma.course.findMany({
    where: { instructorId: id },
    orderBy: { order: "asc" },
    select: { id: true, title: true, published: true, price: true },
  });

  const summary = [
    { label: "Display order", value: String(instructor.order) },
    { label: "Photo URL", value: instructor.imageUrl || "—" },
    { label: "Courses", value: String(courses.length) },
    {
      label: "Created",
      value: instructor.createdAt.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      label: "Last updated",
      value: instructor.updatedAt.toLocaleString("en-GB", {
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
        title={instructor.name}
        description="Instructor"
        backHref="/admin/instructors"
        backLabel="Back to all instructors"
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Photo + bio */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Profile</h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {instructor.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={instructor.imageUrl}
                  alt={instructor.name}
                  className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-blue-50"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400 ring-4 ring-slate-50">
                  {instructor.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {instructor.name}
                </p>
                {instructor.description ? (
                  <p className="mt-2 text-[15px] leading-7 text-slate-600">
                    {instructor.description}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">
                    No designation or bio yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Courses taught by this instructor */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Courses{" "}
              <span className="text-sm font-normal text-slate-400">
                ({courses.length})
              </span>
            </h2>
            {courses.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="flex items-center justify-between gap-3 py-2.5 text-[15px] transition-colors hover:text-blue-700"
                    >
                      <span className="font-medium text-slate-800">
                        {course.title}
                      </span>
                      <span className="flex items-center gap-2 text-sm">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          ৳{course.price.toLocaleString("en-BD")}
                        </span>
                        {course.published ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            Hidden
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">
                No courses list this instructor yet. Courses match by the{" "}
                <span className="font-medium text-slate-600">
                  instructor name
                </span>{" "}
                field on each course.
              </p>
            )}
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
              {instructor.id}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailsAdminPage;
