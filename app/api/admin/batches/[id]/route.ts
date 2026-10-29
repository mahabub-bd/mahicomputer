import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { batchUpdateSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const read = batchUpdateSchema.safeParse(body);
  if (!read.success) {
    return NextResponse.json(
      { error: "Invalid batch detail", issues: read.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }
  const { startDate, ...rest } = read.data;

  const before = await prisma.batch.findUnique({ where: { id } });
  try {
    const batch = await prisma.batch.update({
      where: { id },
      data: {
        ...rest,
        // "" clears the date; absent leaves it untouched.
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
      },
    });
    await logAudit({
      action: "UPDATE",
      entity: "Batch",
      entityId: id,
      summary: `Updated batch — ${batch.name}`,
      oldValue: before,
      newValue: batch,
    });
    return NextResponse.json(batch);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const batch = await prisma.batch.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Batch",
      entityId: id,
      summary: `Deleted batch — ${batch.name}`,
      oldValue: batch,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
