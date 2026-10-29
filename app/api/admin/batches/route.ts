import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { batchSchema } from "@/lib/validators";

/** Batch list with student/session counts (for the admin batches page). */
export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { students: true, sessions: true } },
    },
  });
  return NextResponse.json(batches);
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const read = batchSchema.safeParse(body);
  if (!read.success) {
    return NextResponse.json(
      { error: "Invalid batch data", issues: read.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }
  const { startDate, ...rest } = read.data;

  const batch = await prisma.batch.create({
    data: {
      ...rest,
      ...(startDate ? { startDate: new Date(startDate) } : {}),
    },
  });
  await logAudit({
    action: "CREATE",
    entity: "Batch",
    entityId: batch.id,
    summary: `Created batch — ${batch.name} (${batch.course})`,
    newValue: batch,
  });
  return NextResponse.json(batch, { status: 201 });
}
