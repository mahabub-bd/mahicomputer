import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { partnerSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const partner = await prisma.partner.update({ where: { id }, data: parsed.data });
  await logAudit({
    action: "UPDATE",
    entity: "Partner",
    entityId: partner.id,
    summary: `Updated Partner — ${auditLabel(partner)}`,
  });
    return NextResponse.json(partner);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.partner.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Partner",
      entityId: id,
      summary: `Deleted Partner — ${auditLabel(deleted)}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
