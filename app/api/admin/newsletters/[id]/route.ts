import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { newsletterIssueSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response, session } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = newsletterIssueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const before = await prisma.newsletter.findUnique({ where: { id } });
    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: { ...parsed.data, publishedById: session!.sub },
    });
  await logAudit({
    action: "UPDATE",
    entity: "Newsletter issue",
    entityId: newsletter.id,
    summary: `Updated Newsletter issue — ${auditLabel(newsletter)}`,
    oldValue: before,
    newValue: newsletter,
  });
    revalidateTag("public-data", "max");
    return NextResponse.json(newsletter);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.newsletter.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Newsletter issue",
      entityId: id,
      summary: `Deleted Newsletter issue — ${auditLabel(deleted)}`,
      oldValue: deleted,
    });
    revalidateTag("public-data", "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
