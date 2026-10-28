import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { noticeSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response, session } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = noticeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const notice = await prisma.notice.update({
      where: { id },
      data: { ...parsed.data, publishedById: session!.sub },
    });
  await logAudit({
    action: "UPDATE",
    entity: "Notice",
    entityId: notice.id,
    summary: `Updated Notice — ${auditLabel(notice)}`,
  });
    revalidateTag("public-data", "max");
    return NextResponse.json(notice);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.notice.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Notice",
      entityId: id,
      summary: `Deleted Notice — ${auditLabel(deleted)}`,
    });
    revalidateTag("public-data", "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
