import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { socialLinkSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = socialLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const before = await prisma.socialLink.findUnique({ where: { id } });
    const link = await prisma.socialLink.update({ where: { id }, data: parsed.data });
  await logAudit({
    action: "UPDATE",
    entity: "Social link",
    entityId: link.id,
    summary: `Updated Social link — ${auditLabel(link)}`,
    oldValue: before,
    newValue: link,
  });
    return NextResponse.json(link);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.socialLink.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Social link",
      entityId: id,
      summary: `Deleted Social link — ${auditLabel(deleted)}`,
      oldValue: deleted,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
