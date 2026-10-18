import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
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
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.footerLinkGroup.delete({ where: { id } }); // links cascade
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
