import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toStringArray } from "@/lib/course-view";
import { formatDateTime } from "@/lib/format";
import DetailActions from "../../../_components/DetailActions";
import EnrollmentsList from "../../../_components/EnrollmentsList";
import PageHeader from "../../../_components/PageHeader";
import SectionCard from "../../../_components/SectionCard";
import StatusBadge from "../../../_components/StatusBadge";
import SummaryList from "../../../_components/SummaryList";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const CourseDetailsAdminPage = async ({ params }: Props) => {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { category: true, instructor: true },
  });
  if (!course) notFound();

  const enrollments = await prisma.enrollment.findMany({
    where: { course: course.title },
    orderBy: { createdAt: "desc" },
  });

  const summary = [
    { label: "Slug", value: `/${course.slug}` },
    { label: "Category", value: course.category?.title || "—" },
    { label: "Tag", value: course.tag || "—" },
    { label: "Fee", value: `৳${course.price.toLocaleString("en-BD")}` },
    { label: "Duration", value: `${course.duration} Month` },
    { label: "Classes", value: String(course.lesson) },
    { label: "Pre-requisite", value: course.prerequisite || "—" },
    { label: "Total seat", value: course.seats || "—" },
    { label: "Display order", value: String(course.order) },
    { label: "Created", value: formatDateTime(course.createdAt) },
    { label: "Last updated", value: formatDateTime(course.updatedAt) },
  ];

  const description = toStringArray(course.description);
  const modules = toStringArray(course.modules);

  return (
    <div>
      <PageHeader
        title={course.title}
        badge={<StatusBadge published={course.published} />}
        description={course.category?.title || "Course"}
        actions={
          <DetailActions
            backHref="/admin/courses"
            backLabel="Back to all courses"
            viewHref={`/courses/${course.slug}`}
            editHref={`/admin/courses?edit=${course.id}`}
            deleteUrl={`/api/admin/courses/${course.id}`}
            deleteConfirm={`Delete "${course.title}"? This cannot be undone.`}
            afterDeleteHref="/admin/courses"
          />
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="About This Course">
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
          </SectionCard>

          <SectionCard title="Inside This Course">
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
          </SectionCard>

          <SectionCard title="Enrollments" meta={`(${enrollments.length})`}>
            <EnrollmentsList enrollments={enrollments} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Summary">
            <SummaryList items={summary} />
          </SectionCard>

          <SectionCard title="Instructor">
            {course.instructor ? (
              <div>
                <p className="font-medium text-slate-900">{course.instructor.name}</p>
                {course.instructor.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.instructor.imageUrl}
                    alt={course.instructor.name}
                    className="mt-3 h-16 w-16 rounded-full object-cover ring-4 ring-blue-50"
                  />
                )}
              </div>
            ) : course.instructorName ? (
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
          </SectionCard>

          <SectionCard title="Record ID">
            <code className="block break-all rounded bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {course.id}
            </code>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsAdminPage;
