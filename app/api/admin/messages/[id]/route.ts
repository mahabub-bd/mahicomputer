import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const read = typeof body?.read === "boolean" ? body.read : undefined;
  if (read === undefined) {
    return NextResponse.json({ error: "`read` boolean is required" }, { status: 400 });
  }

  try {
    const message = await prisma.contactMessage.update({ where: { id }, data: { read } });
    return NextResponse.json(message);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.contactMessage.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "ContactMessage",
      entityId: id,
      summary: `Deleted message — ${deleted.name}`,
      oldValue: deleted,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
