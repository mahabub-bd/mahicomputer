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
    let removedAmount = 0;
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        select: { amount: true, enrollmentId: true },
      });
      if (!payment || payment.enrollmentId !== id) return;
      removedAmount = payment.amount;
      await tx.payment.delete({ where: { id: paymentId } });
      await tx.enrollment.update({
        where: { id },
        data: { paidAmount: { decrement: payment.amount } },
      });
    });
    if (removedAmount > 0) {
      await logAudit({
        action: "DELETE",
        entity: "Payment",
        entityId: paymentId,
        summary: `Removed ৳${removedAmount.toLocaleString("en-BD")} payment record`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove payment" }, { status: 500 });
  }
}
