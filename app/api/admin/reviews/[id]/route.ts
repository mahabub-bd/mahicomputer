import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { reviewSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.update({ where: { id }, data: parsed.data });
  await logAudit({
    action: "UPDATE",
    entity: "Review",
    entityId: review.id,
    summary: `Updated Review — ${auditLabel(review)}`,
  });
    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.review.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Review",
      entityId: id,
      summary: `Deleted Review — ${auditLabel(deleted)}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
