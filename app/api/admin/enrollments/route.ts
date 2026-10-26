import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { nextStudentId } from "@/lib/student-id";
import { admissionCreateSchema } from "@/lib/validators";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(enrollments);
}

/**
 * Admin-created admission (walk-in student entered by staff) with the full
 * student profile. Created directly in the chosen status — these are not
 * website form submissions.
 */
export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = admissionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const { dateOfBirth, ...rest } = parsed.data;
  const enrollment = await prisma.enrollment.create({
    data: {
      ...rest,
      // Installment count follows the plan rows (mirrors the Course model).
      installments: rest.installmentPlan.length || 1,
      // Admin-entered approvals are real students — assign the ID right away.
      studentId: rest.status === "APPROVED" ? await nextStudentId() : "",
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      read: true, // entered by staff, not a new website lead
    },
  });
  return NextResponse.json(enrollment, { status: 201 });
}
