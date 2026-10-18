import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toStringArray } from "@/lib/course-view";
import EnrollmentsList from "../../../_components/EnrollmentsList";
import PageHeader from "../../../_components/PageHeader";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const CourseDetailsAdminPage = async ({ params }: Props) => {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  const enrollments = await prisma.enrollment.findMany({
    where: { course: course.title },
    orderBy: { createdAt: "desc" },
  });

  const summary = [
    { label: "Slug", value: `/${course.slug}` },
    { label: "Tag", value: course.tag || "—" },
    { label: "Fee", value: `৳${course.price.toLocaleString("en-BD")}` },
    { label: "Duration", value: `${course.duration} Month` },
    { label: "Classes", value: String(course.lesson) },
    { label: "Pre-requisite", value: course.prerequisite || "—" },
    { label: "Total seat", value: course.seats || "—" },
    { label: "Display order", value: String(course.order) },
  ];

  const description = toStringArray(course.description);
  const modules = toStringArray(course.modules);

  return (
    <div>
      <PageHeader
        title={course.title}
        description={course.published ? "Published course" : "Hidden course"}
      />

      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to all courses
        </Link>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              About This Course
            </h2>
            {description.length > 0 ? (
              <div className="space-y-3">
                {description.map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-7 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No description yet.</p>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Inside This Course
            </h2>
            {modules.length > 0 ? (
              <ol className="space-y-2">
                {modules.map((module, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-slate-600">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[12px] font-bold text-blue-600">
                      {i + 1}
                    </span>
                    {module}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-400">No modules yet.</p>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Enrollments{" "}
              <span className="text-sm font-normal text-slate-400">
                ({enrollments.length})
              </span>
            </h2>
            <EnrollmentsList enrollments={enrollments} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Summary</h2>
            <dl className="divide-y divide-slate-100">
              {summary.map((item) => (
                <div key={item.label} className="flex justify-between gap-3 py-2 text-sm">
                  <dt className="shrink-0 text-slate-500">{item.label}</dt>
                  <dd className="text-right font-medium text-slate-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Instructor</h2>
            {course.instructorName ? (
              <div>
                <p className="font-medium text-slate-900">{course.instructorName}</p>
                {course.instructorPhotoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.instructorPhotoUrl}
                    alt={course.instructorName}
                    className="mt-3 h-16 w-16 rounded-full object-cover ring-4 ring-blue-50"
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No instructor assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsAdminPage;
