import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { resolveCourseRelations } from "@/lib/data";
import { courseSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const courses = await prisma.course.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

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
    const course = await prisma.course.create({ data });
    revalidateTag("public-data", "max");
    await logAudit({
      action: "CREATE",
      entity: "Course",
      entityId: course.id,
      summary: `Created course — ${course.title}`,
      newValue: course,
    });
    return NextResponse.json(course, { status: 201 });
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    throw e;
  }
}
