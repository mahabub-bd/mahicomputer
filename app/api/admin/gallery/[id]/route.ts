import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { galleryItemSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = galleryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const before = await prisma.galleryItem.findUnique({ where: { id } });
    const item = await prisma.galleryItem.update({ where: { id }, data: parsed.data });
  await logAudit({
    action: "UPDATE",
    entity: "Gallery item",
    entityId: item.id,
    summary: `Updated Gallery item — ${auditLabel(item)}`,
    oldValue: before,
    newValue: item,
  });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.galleryItem.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Gallery item",
      entityId: id,
      summary: `Deleted Gallery item — ${auditLabel(deleted)}`,
      oldValue: deleted,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
