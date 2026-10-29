import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { footerGroupSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const groups = await prisma.footerLinkGroup.findMany({
    orderBy: { order: "asc" },
    include: { links: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = footerGroupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const { links, ...group } = parsed.data;
  const created = await prisma.$transaction(async (tx) => {
    return tx.footerLinkGroup.create({
      data: {
        ...group,
        links: { create: links.map((l, i) => ({ ...l, order: l.order || i })) },
      },
      include: { links: { orderBy: { order: "asc" } } },
    });
  });
  await logAudit({
    action: "CREATE",
    entity: "FooterLinkGroup",
    entityId: created.id,
    summary: `Created footer link group — ${created.title}`,
    newValue: created,
  });
  return NextResponse.json(created, { status: 201 });
}
