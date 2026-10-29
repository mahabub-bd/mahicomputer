import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string; paymentId: string }> };

/** Remove a wrongly-recorded payment and reverse its amount from paidAmount. */
export async function DELETE(
  _req: Request,
  { params }: Params,
) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id, paymentId } = await params;
  try {
    // Holder object: an assignment inside the transaction callback is invisible
    // to TS's control-flow narrowing, which would otherwise collapse the type.
    const capture: { row: Awaited<ReturnType<typeof prisma.payment.findUnique>> } = {
      row: null,
    };
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment || payment.enrollmentId !== id) return;
      capture.row = payment;
      await tx.payment.delete({ where: { id: paymentId } });
      await tx.enrollment.update({
        where: { id },
        data: { paidAmount: { decrement: payment.amount } },
      });
    });
    if (capture.row) {
      await logAudit({
        action: "DELETE",
        entity: "Payment",
        entityId: paymentId,
        summary: `Removed ৳${capture.row.amount.toLocaleString("en-BD")} payment record`,
        oldValue: capture.row,
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove payment" }, { status: 500 });
  }
}
