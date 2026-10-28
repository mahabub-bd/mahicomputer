import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { auditLabel, logAudit } from "@/lib/audit";
import { instructorSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = instructorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const instructor = await prisma.instructor.update({ where: { id }, data: parsed.data });
  await logAudit({
    action: "UPDATE",
    entity: "Instructor",
    entityId: instructor.id,
    summary: `Updated Instructor — ${auditLabel(instructor)}`,
  });
    revalidateTag("public-data", "max");
    return NextResponse.json(instructor);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const deleted = await prisma.instructor.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Instructor",
      entityId: id,
      summary: `Deleted Instructor — ${auditLabel(deleted)}`,
    });
    revalidateTag("public-data", "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
