import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { classSessionSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string; sessionId: string }> };

/** Update a session's date/topic. */
export async function PATCH(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id, sessionId } = await params;
  const body = await req.json().catch(() => null);
  const read = classSessionSchema.partial().safeParse(body);
  if (!read.success) {
    return NextResponse.json(
      { error: "Invalid session data", issues: read.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }
  try {
    const session = await prisma.classSession.update({
      where: { id: sessionId },
      data: {
        ...(read.data.date !== undefined ? { date: new Date(read.data.date) } : {}),
        ...(read.data.topic !== undefined ? { topic: read.data.topic } : {}),
      },
    });
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

/** Delete a session (attendance rows cascade-delete with it). */
export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id, sessionId } = await params;
  // Scoped to the batch so a wrong URL cannot touch another batch's session.
  await prisma.classSession.deleteMany({ where: { id: sessionId, batchId: id } });
  return NextResponse.json({ ok: true });
}
