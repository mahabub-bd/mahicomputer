import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { socialLinkSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = socialLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const link = await prisma.socialLink.create({ data: parsed.data });
  await logAudit({
    action: "CREATE",
    entity: "Social link",
    entityId: link.id,
    summary: `Created Social link — ${auditLabel(link)}`,
  });
  return NextResponse.json(link, { status: 201 });
}
