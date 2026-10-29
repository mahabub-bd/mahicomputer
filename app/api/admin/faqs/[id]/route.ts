import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { faqSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const before = await prisma.faq.findUnique({ where: { id } });
    const faq = await prisma.faq.update({ where: { id }, data: parsed.data });
  await logAudit({
    action: "UPDATE",
    entity: "FAQ",
    entityId: faq.id,
    summary: `Updated FAQ — ${auditLabel(faq)}`,
    oldValue: before,
    newValue: faq,
  });
    return NextResponse.json(faq);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.faq.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "FAQ",
      entityId: id,
      summary: `Deleted FAQ — ${auditLabel(deleted)}`,
      oldValue: deleted,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
