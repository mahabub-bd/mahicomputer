import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { businessSettingSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const settings = await prisma.businessSetting.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings ?? {});
}

export async function PUT(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = businessSettingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const before = await prisma.businessSetting.findUnique({ where: { id: 1 } });
  const settings = await prisma.businessSetting.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  revalidateTag("public-data", "max");
  await logAudit({
    action: "UPDATE",
    entity: "BusinessSetting",
    entityId: "1",
    summary: "Updated business settings",
    oldValue: before,
    newValue: settings,
  });
  return NextResponse.json(settings);
}
