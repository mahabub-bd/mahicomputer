import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { classSessionSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

/** Sessions of a batch (oldest first) with attendance counts. */
export async function GET(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const sessions = await prisma.classSession.findMany({
    where: { batchId: id },
    orderBy: { date: "asc" },
    include: { _count: { select: { attendance: true } } },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const read = classSessionSchema.safeParse(body);
  if (!read.success) {
    return NextResponse.json(
      { error: "Invalid session data", issues: read.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }
  const { date, topic } = read.data;
  const session = await prisma.classSession.create({
    data: { batchId: id, date: new Date(date), topic },
  });
  await logAudit({
    action: "CREATE",
    entity: "ClassSession",
    entityId: session.id,
    summary: `Added class session — ${new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}${topic ? ` (${topic})` : ""}`,
    newValue: session,
  });
  return NextResponse.json(session, { status: 201 });
}
