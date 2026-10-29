import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { footerGroupSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = footerGroupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const { links, ...group } = parsed.data;
  const before = await prisma.footerLinkGroup.findUnique({
    where: { id },
    include: { links: { orderBy: { order: "asc" } } },
  });
  const updated = await prisma.$transaction(async (tx) => {
    await tx.footerLink.deleteMany({ where: { groupId: id } });
    return tx.footerLinkGroup.update({
      where: { id },
      data: {
        ...group,
        links: { create: links.map((l, i) => ({ ...l, order: l.order || i })) },
      },
      include: { links: { orderBy: { order: "asc" } } },
    });
  });
  await logAudit({
    action: "UPDATE",
    entity: "FooterLinkGroup",
    entityId: id,
    summary: `Updated footer link group — ${updated.title}`,
    oldValue: before,
    newValue: updated,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const group = await prisma.footerLinkGroup.delete({ where: { id } }); // links cascade
    await logAudit({
      action: "DELETE",
      entity: "FooterLinkGroup",
      entityId: id,
      summary: `Deleted footer link group — ${group.title}`,
      oldValue: group,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
