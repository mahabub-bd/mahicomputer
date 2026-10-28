import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { galleryItemSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = galleryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const item = await prisma.galleryItem.create({ data: parsed.data });
  await logAudit({
    action: "CREATE",
    entity: "Gallery item",
    entityId: item.id,
    summary: `Created Gallery item — ${auditLabel(item)}`,
  });
  return NextResponse.json(item, { status: 201 });
}
