"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Enrollment, Payment } from "@/lib/types";
import {
  enrollmentPaymentSchema,
  type EnrollmentPaymentInput,
} from "@/lib/validators";
import { apiDelete, apiPatch, apiPost } from "./api";
import { Button, Field, Input, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";


interface EnrollmentPaymentModalProps {
  enrollment: Enrollment;
  /** The admission's course, used to pre-fill fee/plan when the admission
      has none yet (e.g. website-form applications). */
  course?: { price: number; installmentPlan?: unknown };
  onClose: () => void;
}

const toInputDate = (value: Date | string | null) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const toNumberArray = (value: unknown): number[] =>
  Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

/** Admin editor for one admission's payment tracking (fee / installments / paid). */
const EnrollmentPaymentModal = ({
  enrollment,
  course,
  onClose,
}: EnrollmentPaymentModalProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useZodForm<EnrollmentPaymentInput>(enrollmentPaymentSchema, {
    defaultValues: (() => {
      // Fall back to the course's price/plan when the admission itself has
      // none yet — never overwrite values already saved on the admission.
      const plan =
        toNumberArray(enrollment.installmentPlan).length > 0
          ? toNumberArray(enrollment.installmentPlan)
          : toNumberArray(course?.installmentPlan);
      return {
        courseFee: enrollment.courseFee || course?.price || 0,
        installments: plan.length || enrollment.installments,
        installmentPlan: plan,
        discount: enrollment.discount,
        paidAmount: enrollment.paidAmount,
        dueDate: toInputDate(enrollment.dueDate),
        paymentMethod: enrollment.paymentMethod,
        transactionId: enrollment.transactionId,
        adminNote: enrollment.adminNote,
      };
    })(),
  });

  // Live due summary as the admin types: due = fee - discount - paid.
  const fee = Number(watch("courseFee")) || 0;
  const discount = Number(watch("discount")) || 0;
  const paid = Number(watch("paidAmount")) || 0;
  const planRows = (watch("installmentPlan") as number[] | undefined) ?? [];
  const updatePlanRow = (i: number, value: string) => {
    const next = [...planRows];
    next[i] = Number(value) || 0;
    setValue("installmentPlan", next);
  };
  const addPlanRow = () => setValue("installmentPlan", [...planRows, 0]);
  const removePlanRow = (i: number) =>
    setValue(
      "installmentPlan",
      planRows.filter((_, j) => j !== i),
    );
  const due = Math.max(fee - discount - paid, 0);

  // Which installments are covered by the collected amount (cumulative).
  const cumulative = planRows.reduce<number[]>((acc, amount) => {
    acc.push((acc[acc.length - 1] ?? 0) + (Number(amount) || 0));
    return acc;
  }, []);
  const covered = cumulative.map((sum) => sum <= paid);

  // ---- Payment history (one record per installment received) ----
  const [payments, setPayments] = useState<Payment[]>([]);
  const [historyBusy, setHistoryBusy] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [payTrxId, setPayTrxId] = useState("");
  const [payNote, setPayNote] = useState("");
  const [payNextDue, setPayNextDue] = useState("");

  const loadPayments = () =>
    fetch(`/api/admin/enrollments/${enrollment.id}/payments`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setPayments)
      .catch(() => {});

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Suggest the next unpaid installment amount from the plan vs. collected total.
  const suggestAmount = (() => {
    if (due <= 0) return 0;
    const nextIdx = covered.findIndex((c) => !c);
    return nextIdx >= 0 ? (planRows[nextIdx] ?? 0) : due;
  })();
  useEffect(() => {
    setPayAmount(suggestAmount > 0 ? String(suggestAmount) : "");
    // Prefill whenever the suggested next installment changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestAmount]);

  const recordPayment = async () => {
    const amount = Number(payAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a payment amount first");
      return;
    }
    setHistoryBusy(true);
    try {
      await apiPost(`/api/admin/enrollments/${enrollment.id}/payments`, {
        amount,
        method: payMethod,
        transactionId: payTrxId,
        note: payNote,
        nextDueDate: payNextDue,
      });
      toast.success("Payment recorded");
      await loadPayments();
      // Keep the form's running total and ✓ marks in sync with the new record.
      setValue("paidAmount", paid + amount);
      setPayTrxId("");
      setPayNote("");
      setPayNextDue("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setHistoryBusy(false);
    }
  };

  const removePayment = async (paymentId: string, amount: number) => {
    if (!confirm(`Remove this payment? The paid total will be reduced by ৳${amount}.`)) return;
    setHistoryBusy(true);
    try {
      await apiDelete(`/api/admin/enrollments/${enrollment.id}/payments/${paymentId}`);
      toast.success("Payment removed");
      await loadPayments();
      setValue("paidAmount", Math.max(paid - amount, 0));
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove payment");
    } finally {
      setHistoryBusy(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setBusy(true);
    try {
      await apiPatch(`/api/admin/enrollments/${enrollment.id}`, data);
      toast.success("Payment info saved");
      router.refresh();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError("root", { message: msg });
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Course fee (৳)" error={errors.courseFee?.message}>
          <Input type="number" min={0} {...register("courseFee")} />
        </Field>
        <Field label="Installments" error={errors.installments?.message}>
          <Input type="number" min={1} max={36} {...register("installments")} />
        </Field>
        <Field label="Discount (৳)" error={errors.discount?.message}>
          <Input type="number" min={0} {...register("discount")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Paid amount (৳)"
          hint="Auto-updates when you record a payment below."
          error={errors.paidAmount?.message}
        >
          <Input type="number" min={0} {...register("paidAmount")} />
        </Field>
        <Field
          label="Next installment due date"
          hint="Shown in the admissions list; leave empty for none."
          error={errors.dueDate?.message}
        >
          <Input type="date" {...register("dueDate")} />
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-100">
        <span className="font-medium text-slate-600">Due amount</span>
        <span className={`text-lg font-bold ${due > 0 ? "text-rose-600" : "text-emerald-600"}`}>
          ৳{due.toLocaleString("en-BD")}
        </span>
      </div>

      {/* Payments received — one record per installment; paidAmount auto-increments. */}
      <div className="rounded-xl border border-slate-100 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-bold uppercase tracking-wider text-slate-700">
            Payments received
          </p>
          <span className="text-xs text-slate-400">
            {payments.length} payment{payments.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Record-next-installment form — hidden once fully paid. */}
        {due <= 0 ? (
          <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={15} />
            Fully paid — no pending installment.
          </p>
        ) : (
          <>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Field label="Amount (৳)">
            <Input
              type="number"
              min={1}
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder={suggestAmount > 0 ? String(suggestAmount) : "2000"}
            />
          </Field>
          <Field label="Method">
            <Input
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
              placeholder="bKash / Nagad / cash"
            />
          </Field>
          <Field label="TrxID">
            <Input
              value={payTrxId}
              onChange={(e) => setPayTrxId(e.target.value)}
              placeholder="TrxID / receipt no."
            />
          </Field>
          <Field label="Next due date" hint="Optional">
            <Input
              type="date"
              value={payNextDue}
              onChange={(e) => setPayNextDue(e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Input
            value={payNote}
            onChange={(e) => setPayNote(e.target.value)}
            placeholder="Note (optional) — e.g. 2nd installment"
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={recordPayment}
            disabled={historyBusy}
          >
            <Plus size={15} />
            Record payment
          </Button>
        </div>
          </>
        )}

        {/* History — newest first; numbers follow payment order
            (oldest = 1st installment). */}
        {payments.length > 0 && (
          <ul className="mt-3 divide-y divide-slate-100">
            {[...payments]
              .sort((a, b) => +new Date(b.paidAt) - +new Date(a.paidAt))
              .map((p, _, all) => ({
                payment: p,
                no: all.length - all.indexOf(p),
              }))
              .map(({ payment: p, no }) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span
                  className="w-9 shrink-0 text-center text-[11px] font-bold uppercase tracking-wider text-emerald-600"
                  title="Installment number"
                >
                  {ORDINALS[no - 1] ?? `${no}th`}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">
                    ৳{p.amount.toLocaleString("en-BD")}
                    {p.method ? (
                      <span className="ml-2 text-xs font-normal text-slate-500">{p.method}</span>
                    ) : null}
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      {new Date(p.paidAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  {(p.transactionId || p.note) && (
                    <p className="truncate text-xs text-slate-400">
                      {[p.transactionId, p.note].filter(Boolean).join(" — ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removePayment(p.id, p.amount)}
                  disabled={historyBusy}
                  className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                  title="Remove payment"
                  aria-label="Remove payment"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Installment plan (per-student copy of the course plan) */}
      <div className="rounded-xl border border-slate-100 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-bold uppercase tracking-wider text-slate-700">
            Installment schedule
          </p>
          <span className="text-xs text-slate-400">
            Plan total: ৳{planRows.reduce((s, a) => s + (Number(a) || 0), 0).toLocaleString("en-BD")}
          </span>
        </div>
        {planRows.length === 0 ? (
          <p className="text-sm text-slate-400">
            No installment plan — add rows to track per-installment payments.
          </p>
        ) : (
          <div className="space-y-2">
            {planRows.map((amount, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={`w-8 shrink-0 text-center text-[11px] font-bold ${
                    covered[i] ? "text-emerald-600" : "text-slate-400"
                  }`}
                  title={covered[i] ? "Covered by paid amount" : "Not yet paid"}
                >
                  {covered[i] ? "✓" : ORDINALS[i] ?? `${i + 1}th`}
                </span>
                <Input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => updatePlanRow(i, e.target.value)}
                  placeholder="2000"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removePlanRow(i)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addPlanRow}
            >
              + Add installment
            </Button>
          </div>
        )}
      </div>

      <Field label="Internal note" error={errors.adminNote?.message}>
        <Textarea
          rows={3}
          {...register("adminNote")}
          placeholder="Installment schedule, discount reason, verbal agreements…"
        />
      </Field>

      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <SubmitButton busy={isSubmitting || busy}>Save payment info</SubmitButton>
      </div>
    </form>
  );
};

export default EnrollmentPaymentModal;
