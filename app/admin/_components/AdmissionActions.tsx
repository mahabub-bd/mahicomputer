"use client";

import { btnIcon } from "@/components/form/buttonStyles";
import type { CourseAdmission } from "@/lib/admission";
import type { Enrollment, Payment } from "@/lib/types";
import {
  Banknote,
  CalendarClock,
  CheckCircle2,
  Pencil,
  Undo2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiPatch } from "./api";
import AdmissionsForm from "./AdmissionsForm";
import EnrollmentPaymentModal from "./EnrollmentPaymentModal";
import Modal from "./Modal";

interface AdmissionActionsProps {
  /** Enrollment row with its payments included (detail page query). */
  enrollment: Enrollment & { payments?: Payment[] };
  /** Offered courses for the edit form's picker. */
  courses: {
    title: string;
    admission: CourseAdmission;
    price: number;
    installmentPlan?: unknown;
  }[];
}

/**
 * Client-side controls for the admission detail page: application status
 * transitions, student-info editing and the payment summary with its edit
 * modal.
 */
const AdmissionActions = ({ enrollment, courses }: AdmissionActionsProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const setStatus = async (status: "PENDING" | "APPROVED" | "DECLINED") => {
    setBusy(true);
    try {
      await apiPatch(`/api/admin/enrollments/${enrollment.id}`, { status });
      toast.success(
        status === "APPROVED"
          ? "Admission approved"
          : status === "DECLINED"
            ? "Admission declined"
            : "Moved back to pending",
      );
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  // Same course fallback as the payment modal: show the course's fee/plan
  // until the admission has its own values saved.
  const course = courses.find((c) => c.title === enrollment.course);
  const toNumberArray = (value: unknown): number[] =>
    Array.isArray(value)
      ? value.filter((item): item is number => typeof item === "number")
      : [];

  const fee = enrollment.courseFee || course?.price || 0;
  const planAmounts =
    toNumberArray(enrollment.installmentPlan).length > 0
      ? toNumberArray(enrollment.installmentPlan)
      : toNumberArray(course?.installmentPlan);

  const due = Math.max(fee - enrollment.discount - enrollment.paidAmount, 0);

  // Payment history with installment numbers: numbers follow payment order
  // (oldest = 1st installment); displayed newest first.
  const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
  const numberedPayments = [...(enrollment.payments ?? [])]
    .sort((a, b) => +new Date(a.paidAt) - +new Date(b.paidAt))
    .map((p, i) => ({ payment: p, no: i + 1 }))
    .reverse();

  const paymentRows: { label: string; value: React.ReactNode }[] = [
    { label: "Course fee", value: `৳${fee.toLocaleString("en-BD")}` },
    ...(enrollment.discount > 0
      ? [{ label: "Discount", value: `−৳${enrollment.discount.toLocaleString("en-BD")}` }]
      : []),
    {
      label: "Installments",
      value:
        planAmounts.length > 0
          ? planAmounts.map((a) => `৳${a.toLocaleString("en-BD")}`).join(" + ")
          : String(enrollment.installments),
    },
    { label: "Paid", value: `৳${enrollment.paidAmount.toLocaleString("en-BD")}` },
    {
      label: "Due",
      value: (
        <span className={due > 0 ? "text-rose-600" : "text-emerald-600"}>
          ৳{due.toLocaleString("en-BD")}
        </span>
      ),
    },
    ...(enrollment.dueDate
      ? [
          {
            label: "Next due date",
            value: new Date(enrollment.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          },
        ]
      : []),
    ...(enrollment.paymentMethod
      ? [{ label: "Payment method", value: enrollment.paymentMethod }]
      : []),
    ...(enrollment.transactionId
      ? [{ label: "Transaction ID", value: enrollment.transactionId }]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Status transitions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className={btnIcon("secondary")}
          title="Edit student info"
          aria-label="Edit student info"
        >
          <Pencil size={15} />
        </button>
        {enrollment.status === "PENDING" ? (
          <>
            <button
              type="button"
              onClick={() => setStatus("APPROVED")}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 size={15} />
              Approve
            </button>
            <button
              type="button"
              onClick={() => setStatus("DECLINED")}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <XCircle size={15} />
              Decline
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setStatus("PENDING")}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Undo2 size={15} />
            Move to pending
          </button>
        )}
      </div>

      {/* Payment tracking */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-slate-700">
            <Banknote size={15} className="text-emerald-600" />
            Payment
          </p>
          <button
            type="button"
            onClick={() => setPaymentOpen(true)}
            className={btnIcon("secondary")}
            title="Edit payment info"
            aria-label="Edit payment info"
          >
            <Pencil size={14} />
          </button>
        </div>

        {fee === 0 && !enrollment.paidAmount ? (
          <p className="text-sm text-slate-400">
            No payment recorded yet — set the fee to start tracking.
          </p>
        ) : (
          <dl className="divide-y divide-slate-100">
            {paymentRows.map((row) => (
              <div key={row.label} className="flex justify-between gap-3 py-1.5 text-sm">
                <dt className="shrink-0 text-slate-500">{row.label}</dt>
                <dd className="text-right font-medium text-slate-900">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {enrollment.adminNote && (
          <p className="mt-3 rounded-lg bg-white p-3 text-[13px] leading-6 text-slate-600 ring-1 ring-slate-100">
            {enrollment.adminNote}
          </p>
        )}

        {/* Payment history — newest first, numbered by payment order
            (1st payment = 1st installment). */}
        {(enrollment.payments?.length ?? 0) > 0 && (
          <div className="mt-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Payment history
            </p>
            <ul className="divide-y divide-slate-100 rounded-lg bg-white ring-1 ring-slate-100">
              {numberedPayments.map(({ payment: p, no }) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                >
                  <span
                    className="w-9 shrink-0 text-center text-[11px] font-bold uppercase tracking-wider text-emerald-600"
                    title="Installment number"
                  >
                    {ORDINALS[no - 1] ?? `${no}th`}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">
                      ৳{p.amount.toLocaleString("en-BD")}
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        {new Date(p.paidAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    {(p.method || p.transactionId || p.note) && (
                      <p className="truncate text-xs text-slate-400">
                        {[p.method, p.transactionId, p.note].filter(Boolean).join(" — ")}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {enrollment.dueDate && due > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-700">
            <CalendarClock size={13} />
            Next installment due{" "}
            {new Date(enrollment.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Edit admission — ${enrollment.name}`}
        wide
      >
        {editOpen && (
          <AdmissionsForm
            courses={courses}
            admission={enrollment}
            onSuccess={() => setEditOpen(false)}
          />
        )}
      </Modal>

      <Modal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title={`Payment — ${enrollment.name}`}
      >
        {paymentOpen && (
          <EnrollmentPaymentModal
            enrollment={enrollment}
            course={courses.find((c) => c.title === enrollment.course)}
            onClose={() => setPaymentOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdmissionActions;
