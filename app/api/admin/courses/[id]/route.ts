import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { resolveCourseRelations } from "@/lib/data";
import { courseSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const data = await resolveCourseRelations(parsed.data);
  if (!data) {
    return NextResponse.json(
      { error: "Selected instructor or category not found", issues: ["Selected instructor or category not found"] },
      { status: 400 }
    );
  }

  try {
    const course = await prisma.course.update({ where: { id }, data });
    revalidateTag("public-data", "max");
    await logAudit({
      action: "UPDATE",
      entity: "Course",
      entityId: id,
      summary: `Updated course — ${course.title}`,
    });
    return NextResponse.json(course);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    throw e;
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const course = await prisma.course.delete({ where: { id } });
    revalidateTag("public-data", "max");
    await logAudit({
      action: "DELETE",
      entity: "Course",
      entityId: id,
      summary: `Deleted course — ${course.title}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
