import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

/** Add an approved admission to the batch. */
export async function POST(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const enrollmentId =
    body && typeof body === "object" && typeof body.enrollmentId === "string"
      ? body.enrollmentId
      : null;
  if (!enrollmentId) {
    return NextResponse.json({ error: "enrollmentId is required" }, { status: 400 });
  }

  try {
    // Only approved admissions with a student ID can join a batch.
    const student = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, status: "APPROVED" },
      select: { id: true, name: true },
    });
    if (!student) {
      return NextResponse.json(
        { error: "Only approved admissions can be added" },
        { status: 400 },
      );
    }
    const row = await prisma.batchStudent.create({
      data: { batchId: id, enrollmentId },
    });
    await logAudit({
      action: "CREATE",
      entity: "BatchStudent",
      entityId: row.id,
      summary: `Added student to batch — ${student.name}`,
      newValue: row,
    });
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Student already in this batch or batch not found" },
      { status: 400 },
    );
  }
}

/** Remove a student from the batch (their attendance rows are kept). */
export async function DELETE(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await params;
  const enrollmentId = new URL(req.url).searchParams.get("enrollmentId");
  if (!enrollmentId) {
    return NextResponse.json({ error: "enrollmentId is required" }, { status: 400 });
  }
  const existing = await prisma.batchStudent.findFirst({
    where: { batchId: id, enrollmentId },
  });
  await prisma.batchStudent.deleteMany({ where: { batchId: id, enrollmentId } });
  await logAudit({
    action: "DELETE",
    entity: "BatchStudent",
    entityId: enrollmentId,
    summary: `Removed student from batch`,
    oldValue: existing ?? { batchId: id, enrollmentId },
  });
  return NextResponse.json({ ok: true });
}
