import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { siteSettingSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings ?? {});
}

export async function PUT(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = siteSettingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  // Homepage content only — business details live in the BusinessSetting table
  // and are written by /api/admin/business-settings.
  const before = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const settings = await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  revalidateTag("public-data", "max");
  await logAudit({
    action: "UPDATE",
    entity: "SiteSetting",
    entityId: "1",
    summary: "Updated site settings",
    oldValue: before,
    newValue: settings,
  });
  return NextResponse.json(settings);
}
