import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { nextStudentId } from "@/lib/student-id";
import { admissionUpdateSchema, enrollmentPaymentSchema } from "@/lib/validators";

const ENROLLMENT_STATUSES = ["PENDING", "APPROVED", "DECLINED"] as const;

const STUDENT_FIELDS = [
  "name",
  "phone",
  "email",
  "course",
  "message",
  "photoUrl",
  "fatherName",
  "motherName",
  "dateOfBirth",
  "gender",
  "address",
  "education",
  "guardianName",
  "guardianPhone",
] as const;

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const read = typeof body?.read === "boolean" ? body.read : undefined;
  const rawStatus = typeof body?.status === "string" ? body.status.toUpperCase() : undefined;
  const status =
    rawStatus !== undefined && (ENROLLMENT_STATUSES as readonly string[]).includes(rawStatus)
      ? rawStatus
      : undefined;

  // Payment fields are validated as a group (optional — absent means untouched).
  const payment =
    body &&
    typeof body === "object" &&
    [
      "courseFee",
      "installments",
      "discount",
      "paidAmount",
      "dueDate",
      "paymentMethod",
      "transactionId",
      "adminNote",
    ].some((k) => k in body)
      ? enrollmentPaymentSchema.safeParse(body)
      : undefined;
  if (payment && !payment.success) {
    return NextResponse.json(
      { error: "Invalid payment data", issues: payment.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  // Student-info fields (optional — absent means untouched).
  const student =
    body &&
    typeof body === "object" &&
    STUDENT_FIELDS.some((k) => k in body)
      ? admissionUpdateSchema.safeParse(body)
      : undefined;
  if (student && !student.success) {
    return NextResponse.json(
      { error: "Invalid student data", issues: student.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }

  if (read === undefined && status === undefined && !payment?.success && !student?.success) {
    return NextResponse.json(
      {
        error:
          "`read` boolean, `status` (PENDING | APPROVED | DECLINED), payment or student fields are required",
      },
      { status: 400 },
    );
  }

  // Approval assigns a student ID the first time an application is approved.
  const approving =
    status === "APPROVED" && !(await prisma.enrollment.findFirst({
      where: { id, studentId: { not: "" } },
      select: { id: true },
    }));

  try {
    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        ...(read === undefined ? {} : { read }),
        ...(status === undefined ? {} : { status }),
        ...(approving ? { studentId: await nextStudentId() } : {}),
        ...(student?.success
          ? {
              ...student.data,
              // The form sends "" / ISO string; the column is a nullable DateTime.
              ...(student.data.dateOfBirth !== undefined
                ? {
                    dateOfBirth: student.data.dateOfBirth
                      ? new Date(student.data.dateOfBirth)
                      : null,
                  }
                : {}),
            }
          : {}),
        ...(payment?.success
          ? {
              ...payment.data,
              // The form sends "" / ISO string; the column is a nullable DateTime.
              dueDate: payment.data.dueDate ? new Date(payment.data.dueDate) : null,
            }
          : {}),
      },
    });
    // Audit the meaningful admin actions (read/unread is too noisy to log).
    if (status !== undefined) {
      await logAudit({
        action: "UPDATE",
        entity: "Enrollment",
        entityId: id,
        summary:
          status === "APPROVED"
            ? `Approved admission — ${enrollment.name}`
            : status === "DECLINED"
              ? `Declined admission — ${enrollment.name}`
              : `Moved admission back to pending — ${enrollment.name}`,
      });
    } else if (payment?.success) {
      await logAudit({
        action: "UPDATE",
        entity: "Enrollment",
        entityId: id,
        summary: `Updated payment info — ${enrollment.name}`,
        detail: { paidAmount: enrollment.paidAmount },
      });
    } else if (student?.success) {
      await logAudit({
        action: "UPDATE",
        entity: "Enrollment",
        entityId: id,
        summary: `Updated student info — ${enrollment.name}`,
      });
    }
    return NextResponse.json(enrollment);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    const enrollment = await prisma.enrollment.delete({ where: { id } });
    await logAudit({
      action: "DELETE",
      entity: "Enrollment",
      entityId: id,
      summary: `Deleted admission — ${enrollment.name}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
