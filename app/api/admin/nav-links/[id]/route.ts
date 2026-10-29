import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { navLinkSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = navLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const before = await prisma.navLink.findUnique({ where: { id } });
    const link = await prisma.navLink.update({ where: { id }, data: parsed.data });
  await logAudit({
    action: "UPDATE",
    entity: "Nav link",
    entityId: link.id,
    summary: `Updated Nav link — ${auditLabel(link)}`,
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
    const deleted = await prisma.navLink.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Nav link",
      entityId: id,
      summary: `Deleted Nav link — ${auditLabel(deleted)}`,
      oldValue: deleted,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
