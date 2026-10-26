import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { paymentRecordSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

/** Payment history for one admission (newest first). */
export async function GET(_req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const payments = await prisma.payment.findMany({
    where: { enrollmentId: id },
    orderBy: { paidAt: "desc" },
  });
  return NextResponse.json(payments);
}

/**
 * Record one received installment: creates the Payment row and increments the
 * admission's paidAmount in the same transaction, so the running total can
 * never drift out of sync with the history.
 */
export async function POST(req: Request, { params }: Params) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const read = paymentRecordSchema.safeParse(body);
  if (!read.success) {
    return NextResponse.json(
      { error: "Invalid payment data", issues: read.error.issues.map((i) => i.message) },
      { status: 400 },
    );
  }
  const { amount, method, transactionId, note, nextDueDate } = read.data;

  try {
    const payment = await prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!enrollment) return null;
      return tx.payment.create({
        data: {
          enrollmentId: id,
          amount,
          method,
          transactionId,
          note,
        },
      });
    });
    if (!payment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Keep the admission's summary in sync: paid total, latest method/TrxID
    // and (optionally) the next installment's due date.
    await prisma.enrollment.update({
      where: { id },
      data: {
        paidAmount: { increment: amount },
        ...(method ? { paymentMethod: method } : {}),
        ...(transactionId ? { transactionId } : {}),
        ...(nextDueDate ? { dueDate: new Date(nextDueDate) } : {}),
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
