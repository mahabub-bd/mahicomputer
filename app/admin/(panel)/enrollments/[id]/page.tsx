import { btn } from "@/components/form/buttonStyles";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { FileText, ReceiptText } from "lucide-react";
import { notFound } from "next/navigation";
import AdmissionActions from "../../../_components/AdmissionActions";
import DetailActions from "../../../_components/DetailActions";
import PageHeader from "../../../_components/PageHeader";
import SectionCard from "../../../_components/SectionCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const STATUS_META = {
  PENDING: { label: "Pending", pill: "bg-amber-50 text-amber-700 ring-amber-200" },
  APPROVED: { label: "Approved", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  DECLINED: { label: "Declined", pill: "bg-slate-100 text-slate-500 ring-slate-300" },
} as const;

const AdmissionDetailsAdminPage = async ({ params }: Props) => {
  const { id } = await params;
  const [enrollment, courses] = await Promise.all([
    prisma.enrollment.findUnique({
      where: { id },
      include: { payments: { orderBy: { paidAt: "desc" } } },
    }),
    prisma.course.findMany({
      select: { title: true, admission: true, price: true, installmentPlan: true },
      orderBy: { order: "asc" },
    }),
  ]);
  if (!enrollment) notFound();

  const status = STATUS_META[enrollment.status];

  const studentRows = [
    { label: "Phone", value: enrollment.phone },
    ...(enrollment.email ? [{ label: "Email", value: enrollment.email }] : []),
    ...(enrollment.fatherName ? [{ label: "Father's name", value: enrollment.fatherName }] : []),
    ...(enrollment.motherName ? [{ label: "Mother's name", value: enrollment.motherName }] : []),
    ...(enrollment.dateOfBirth
      ? [
          {
            label: "Date of birth",
            value: new Date(enrollment.dateOfBirth).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
        ]
      : []),
    ...(enrollment.gender
      ? [
          {
            label: "Gender",
            value:
              enrollment.gender === "MALE"
                ? "Male"
                : enrollment.gender === "FEMALE"
                  ? "Female"
                  : "Other",
          },
        ]
      : []),
    ...(enrollment.education ? [{ label: "Last education", value: enrollment.education }] : []),
    ...(enrollment.address ? [{ label: "Address", value: enrollment.address }] : []),
    ...(enrollment.guardianName
      ? [{ label: "Guardian", value: enrollment.guardianName }]
      : []),
    ...(enrollment.guardianPhone
      ? [{ label: "Guardian phone", value: enrollment.guardianPhone }]
      : []),
  ];

  const summary = [
    ...(enrollment.studentId
      ? [
          {
            label: "Student ID",
            value: (
              <code className="rounded bg-slate-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
                {enrollment.studentId}
              </code>
            ),
          },
        ]
      : []),
    { label: "Course", value: enrollment.course || "—" },
    { label: "Status", value: status.label },
    {
      label: "Applied",
      value: formatDateTime(enrollment.createdAt),
    },
    {
      label: "Source",
      value: enrollment.read ? "Admin entered / reviewed" : "Website form",
    },
    ...(enrollment.message ? [{ label: "Message", value: enrollment.message }] : []),
  ];

  return (
    <div>
      <PageHeader
        title={enrollment.name}
        badge={
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${status.pill}`}
          >
            {status.label}
          </span>
        }
        description={enrollment.course || "Admission"}
        actions={
          <div className="flex items-center gap-2">
            <a
              href={`/api/admin/enrollments/${enrollment.id}/admission-form`}
              target="_blank"
              rel="noopener noreferrer"
              className={btn("secondary", "sm")}
            >
              <FileText size={14} />
              Form PDF
            </a>
            <a
              href={`/api/admin/enrollments/${enrollment.id}/receipt`}
              target="_blank"
              rel="noopener noreferrer"
              className={btn("secondary", "sm")}
            >
              <ReceiptText size={14} />
              Receipt PDF
            </a>
            <DetailActions
              backHref="/admin/enrollments"
              backLabel="Back to admissions"
              deleteUrl={`/api/admin/enrollments/${enrollment.id}`}
              deleteConfirm={`Delete the admission for "${enrollment.name}"? This cannot be undone.`}
              afterDeleteHref="/admin/enrollments"
            />
          </div>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="Student information">
            <div className="flex flex-col gap-5 sm:flex-row">
              {enrollment.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={enrollment.photoUrl}
                  alt={enrollment.name}
                  className="h-28 w-28 shrink-0 rounded-xl object-cover ring-4 ring-blue-50"
                />
              ) : (
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-600">
                  {enrollment.name
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("")}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {studentRows.length > 0 ? (
                  <dl className="divide-y divide-slate-100">
                    {studentRows.map((row) => (
                      <div key={row.label} className="flex justify-between gap-3 py-2 text-sm">
                        <dt className="shrink-0 text-slate-500">{row.label}</dt>
                        <dd className="min-w-0 break-all text-right font-medium text-slate-900">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-slate-400">
                    Only name and phone were submitted — full profile is filled by admin.
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Status & payment">
            <AdmissionActions enrollment={enrollment} courses={courses} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Summary">
            <dl className="divide-y divide-slate-100">
              {summary.map((item) => (
                <div key={item.label} className="flex justify-between gap-3 py-2 text-sm">
                  <dt className="shrink-0 text-slate-500">{item.label}</dt>
                  <dd className="min-w-0 break-all text-right font-medium text-slate-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard title="Record ID">
            <code className="block break-all rounded bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {enrollment.id}
            </code>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default AdmissionDetailsAdminPage;
