import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { attendanceSaveSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string; sessionId: string }> };

/**
 * Bulk-save attendance for one session: upserts one row per batch student.
 * Students left out of the payload keep their previous status.
 */
export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id, sessionId } = await params;
  const body = await req.json().catch(() => null);
  const read = attendanceSaveSchema.safeParse(body);
  if (!read.success) {
    return NextResponse.json(
      { error: "Invalid attendance data", issues: read.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  // The session must belong to this batch.
  const session = await prisma.classSession.findFirst({
    where: { id: sessionId, batchId: id },
    select: { id: true },
  });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { records } = read.data;
  await prisma.$transaction(
    records.map((r) =>
      prisma.attendance.upsert({
        where: {
          sessionId_enrollmentId: { sessionId, enrollmentId: r.enrollmentId },
        },
        create: { sessionId, enrollmentId: r.enrollmentId, status: r.status },
        update: { status: r.status },
      }),
    ),
  );
  await logAudit({
    action: "UPDATE",
    entity: "Attendance",
    entityId: sessionId,
    summary: `Saved attendance — ${records.length} student${records.length === 1 ? "" : "s"}`,
    detail: { batchId: id, sessionId },
  });
  return NextResponse.json({ ok: true });
}
