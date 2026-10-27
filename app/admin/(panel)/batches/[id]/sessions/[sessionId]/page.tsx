import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../_components/PageHeader";
import AttendanceGrid from "../../../../../_components/AttendanceGrid";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string; sessionId: string }> };

const SessionAttendancePage = async ({ params }: Props) => {
  const { id, sessionId } = await params;
  const session = await prisma.classSession.findFirst({
    where: { id: sessionId, batchId: id },
    include: {
      batch: { select: { name: true, course: true } },
    },
  });
  if (!session) notFound();

  const students = await prisma.batchStudent.findMany({
    where: { batchId: id },
    orderBy: { joinedAt: "asc" },
    include: {
      enrollment: {
        select: { id: true, name: true, studentId: true, photoUrl: true },
        // Existing marks for this session, keyed by student below.
        include: { attendance: { where: { sessionId } } },
      },
    },
  });

  return (
    <div>
      <PageHeader
        title={`Attendance — ${new Date(session.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`}
        description={`${session.batch.name} · ${session.batch.course}${
          session.topic ? ` · ${session.topic}` : ""
        }`}
        actions={
          <a
            href={`/admin/batches/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            Back to batch
          </a>
        }
      />
      <AttendanceGrid
        batchId={id}
        sessionId={sessionId}
        students={students.map((s) => ({
          enrollmentId: s.enrollmentId,
          name: s.enrollment.name,
          studentId: s.enrollment.studentId,
          photoUrl: s.enrollment.photoUrl,
          status:
            s.enrollment.attendance.find((a) => a.sessionId === sessionId)?.status ?? null,
        }))}
      />
    </div>
  );
};

export default SessionAttendancePage;
