import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHeader from "../../../_components/PageHeader";
import BatchStudents from "../../../_components/BatchStudents";
import BatchSessions from "../../../_components/BatchSessions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const BATCH_META = {
  UPCOMING: { label: "Upcoming", pill: "bg-amber-50 text-amber-700 ring-amber-200" },
  RUNNING: { label: "Running", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  COMPLETED: { label: "Completed", pill: "bg-slate-100 text-slate-500 ring-slate-300" },
} as const;

const BatchDetailAdminPage = async ({ params }: Props) => {
  const { id } = await params;
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      students: {
        orderBy: { joinedAt: "asc" },
        include: {
          enrollment: {
            select: { id: true, name: true, studentId: true, phone: true, photoUrl: true },
          },
        },
      },
      sessions: {
        orderBy: { date: "asc" },
        include: { _count: { select: { attendance: true } } },
      },
    },
  });
  if (!batch) notFound();

  // Approved admissions not yet in this batch — the add-student picker.
  const members = new Set(batch.students.map((s) => s.enrollmentId));
  const candidates = await prisma.enrollment.findMany({
    where: { status: "APPROVED", id: { notIn: [...members] } },
    select: { id: true, name: true, studentId: true, course: true, phone: true },
    orderBy: { name: "asc" },
  });

  const status = BATCH_META[batch.status];
  const totalMarks = batch.sessions.reduce((n, s) => n + s._count.attendance, 0);
  const expectedMarks = batch.sessions.length * batch.students.length;
  const stats = [
    {
      label: "Students",
      value: `${batch.students.length}${batch.capacity > 0 ? `/${batch.capacity}` : ""}`,
    },
    { label: "Sessions", value: String(batch.sessions.length) },
    {
      label: "Attendance marked",
      value: `${totalMarks}${expectedMarks > 0 ? `/${expectedMarks}` : ""}`,
    },
    {
      label: "Start date",
      value: batch.startDate
        ? new Date(batch.startDate).toLocaleDateString("en-GB", { dateStyle: "medium" })
        : "—",
    },
  ];

  return (
    <div>
      <PageHeader
        title={batch.name}
        badge={
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${status.pill}`}
          >
            {status.label}
          </span>
        }
        description={`${batch.course}${batch.schedule ? ` · ${batch.schedule}` : ""}`}
        actions={
          <Link
            href="/admin/batches"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            Back to batches
          </Link>
        }
      />

      {/* Batch stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {s.label}
            </p>
            <p className="mt-0.5 text-xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <BatchStudents
          batchId={batch.id}
          capacity={batch.capacity}
          students={batch.students.map((s) => ({
            id: s.id,
            enrollmentId: s.enrollmentId,
            name: s.enrollment.name,
            studentId: s.enrollment.studentId,
            phone: s.enrollment.phone,
            photoUrl: s.enrollment.photoUrl,
          }))}
          candidates={candidates}
        />

        <BatchSessions
          batchId={batch.id}
          studentsCount={batch.students.length}
          sessions={batch.sessions.map((s) => ({
            id: s.id,
            date: s.date.toISOString(),
            topic: s.topic,
            attendanceCount: s._count.attendance,
          }))}
        />
      </div>
    </div>
  );
};

export default BatchDetailAdminPage;
