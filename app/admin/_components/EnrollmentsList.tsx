"use client";

import { btn } from "@/components/form/buttonStyles";
import type { CourseAdmission } from "@/lib/admission";
import type { Enrollment } from "@/lib/types";
import {
  Banknote,
  BookOpen,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  Clock,
  Info,
  Mail,
  Pencil,
  MailOpen,
  MessageSquare,
  Phone,
  Trash2,
  Undo2,
  UserPlus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiDelete, apiPatch } from "./api";
import AdmissionsForm from "./AdmissionsForm";
import EnrollmentPaymentModal from "./EnrollmentPaymentModal";
import Modal from "./Modal";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "DECLINED";

const STATUS_META = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  DECLINED: {
    label: "Declined",
    icon: XCircle,
    badge: "bg-slate-100 text-slate-500 ring-1 ring-slate-300",
    dot: "bg-slate-400",
  },
} as const;

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

interface EnrollmentsListProps {
  enrollments: Enrollment[];
  /** Offered courses with their admission stage — drives the admission form's course picker. */
  courses: {
    title: string;
    admission: CourseAdmission;
    price: number;
    installmentPlan?: unknown;
  }[];
}

const EnrollmentsList = ({ enrollments, courses }: EnrollmentsListProps) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [paymentFor, setPaymentFor] = useState<Enrollment | null>(null);
  const [editFor, setEditFor] = useState<Enrollment | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Distinct course titles from the applications themselves (they are stored
  // as free-text titles on the rows) — powers the course filter dropdown.
  const courseTitles = [...new Set(enrollments.map((e) => e.course).filter(Boolean))].sort();

  const send = async (
    enrollment: Enrollment,
    body: Record<string, unknown>,
    successMsg: string,
  ) => {
    setBusyId(enrollment.id);
    try {
      await apiPatch(`/api/admin/enrollments/${enrollment.id}`, body);
      toast.success(successMsg);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const markRead = (enrollment: Enrollment) =>
    send(
      enrollment,
      { read: !enrollment.read },
      enrollment.read ? "Marked as unread" : "Marked as read",
    );

  const setStatus = (enrollment: Enrollment, status: "PENDING" | "APPROVED" | "DECLINED") =>
    send(
      enrollment,
      { status },
      status === "APPROVED"
        ? "Enrollment approved"
        : status === "DECLINED"
          ? "Enrollment declined"
          : "Moved back to pending",
    );

  const remove = async (enrollment: Enrollment) => {
    setBusyId(enrollment.id);
    try {
      await apiDelete(`/api/admin/enrollments/${enrollment.id}`);
      toast.success("Enrollment deleted");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  if (enrollments.length === 0) {
    return <p className="text-sm text-slate-500">No enrollments yet.</p>;
  }

  const counts: Record<StatusFilter, number> = {
    ALL: enrollments.length,
    PENDING: enrollments.filter((e) => e.status === "PENDING").length,
    APPROVED: enrollments.filter((e) => e.status === "APPROVED").length,
    DECLINED: enrollments.filter((e) => e.status === "DECLINED").length,
  };

  const visible = enrollments.filter(
    (e) =>
      (filter === "ALL" || e.status === filter) &&
      (courseFilter === "ALL" || e.course === courseFilter),
  );

  const tabs: StatusFilter[] = ["ALL", "PENDING", "APPROVED", "DECLINED"];

  return (
    <div>
      {/* Filter tabs + course filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition duration-150 ${
              filter === tab
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab === "ALL" ? "All" : STATUS_META[tab].label}
            <span
              className={`rounded-full px-1.5 text-xs ${
                filter === tab ? "bg-white/20" : "bg-slate-100 text-slate-500"
              }`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
        {courseTitles.length > 0 && (
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            aria-label="Filter by course"
            className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="ALL">All courses</option>
            {courseTitles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Add admission (walk-in student) */}
      <div className="mb-4 flex items-center justify-end">
        <button onClick={() => setAddOpen(true)} className={btn("primary")}>
          <UserPlus size={16} />
          Add admission
        </button>
      </div>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add admission" wide>
        {addOpen && (
          <AdmissionsForm courses={courses} onSuccess={() => setAddOpen(false)} />
        )}
      </Modal>

      {/* Edit admission (student info) */}
      <Modal
        open={editFor !== null}
        onClose={() => setEditFor(null)}
        title={editFor ? `Edit admission — ${editFor.name}` : "Edit admission"}
        wide
      >
        {editFor && (
          <AdmissionsForm
            key={editFor.id}
            courses={courses}
            admission={editFor}
            onSuccess={() => setEditFor(null)}
          />
        )}
      </Modal>

      {/* Payment editor lives outside the list so its buttons never
          submit anything else. */}
      <Modal
        open={paymentFor !== null}
        onClose={() => setPaymentFor(null)}
        title={paymentFor ? `Payment — ${paymentFor.name}` : "Payment"}
      >
        {paymentFor && (
          <EnrollmentPaymentModal
            enrollment={paymentFor}
            course={courses.find((c) => c.title === paymentFor.course)}
            onClose={() => setPaymentFor(null)}
          />
        )}
      </Modal>

      {visible.length === 0 ? (
        <p className="text-sm text-slate-500">No enrollments for this filter.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((en) => {
            const meta = STATUS_META[en.status];
            const StatusIcon = meta.icon;
            const busy = busyId === en.id;

            return (
              <div
                key={en.id}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                  en.status === "PENDING"
                    ? "border-amber-100 border-l-2 border-l-amber-400"
                    : en.status === "APPROVED"
                      ? "border-emerald-100 border-l-2 border-l-emerald-500"
                      : "border-slate-100 border-l-2 border-l-slate-300"
                } ${!en.read ? "ring-2 ring-blue-100" : ""}`}
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                  {/* Student details */}
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                    {/* Avatar (photo when the student has one) */}
                    {en.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={en.photoUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 ring-1 ring-blue-200/70">
                        {initials(en.name)}
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      {/* Line 1 — name · badges · date */}
                      <div className="flex flex-wrap items-center gap-2">
                        {en.studentId && (
                          <code className="rounded bg-slate-50 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
                            {en.studentId}
                          </code>
                        )}
                        <Link
                          href={`/admin/enrollments/${en.id}`}
                          className="text-base font-bold tracking-tight text-slate-900 hover:text-blue-700"
                        >
                          {en.name}
                        </Link>
                        {!en.read && (
                          <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                            New
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badge}`}
                        >
                          <StatusIcon size={13} />
                          {meta.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                          <Clock size={12} />
                          {new Date(en.createdAt).toLocaleString("en-GB", {
                            timeStyle: "short",
                            dateStyle: "short",
                          })}
                        </span>
                      </div>

                      {/* Line 2 — email · phone (same order + gaps as messages list) */}
                      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                        {en.email && (
                          <p className="flex min-w-0 items-center gap-1 truncate text-slate-500">
                            <Mail size={13} className="shrink-0 text-slate-400" />
                            <span className="min-w-0 truncate">{en.email}</span>
                          </p>
                        )}
                        <p className="flex shrink-0 items-center gap-1 text-slate-500">
                          <Phone size={13} className="shrink-0 text-slate-400" />
                          {en.phone}
                        </p>
                      </div>

                      {/* Line 3 — course chip · message (truncated to one line) */}
                      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2 text-sm">
                        {en.course && (
                          <span className="flex min-w-0 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                            <BookOpen size={11} className="shrink-0" />
                            <span className="max-w-56 truncate">{en.course}</span>
                          </span>
                        )}
                        {en.courseFee > 0 && (
                          <button
                            type="button"
                            onClick={() => setPaymentFor(en)}
                            title="Edit payment info"
                            className={`flex min-w-0 shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ring-1 transition hover:brightness-95 ${
                              en.courseFee - en.discount - en.paidAmount > 0
                                ? "bg-rose-50 text-rose-700 ring-rose-100"
                                : "bg-emerald-50 text-emerald-700 ring-emerald-100"
                            }`}
                          >
                            <Banknote size={11} className="shrink-0" />
                            ৳{en.paidAmount.toLocaleString("en-BD")}
                            {en.discount > 0 && ` (−৳${en.discount.toLocaleString("en-BD")})`}
                            {" / "}৳{en.courseFee.toLocaleString("en-BD")}
                          </button>
                        )}
                        {en.dueDate && (
                          <span className="flex shrink-0 items-center gap-1 text-xs text-amber-700">
                            <CalendarClock size={12} />
                            Due{" "}
                            {new Date(en.dueDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                        {en.message && (
                          <p className="flex min-w-0 flex-1 items-center gap-1 truncate text-slate-500">
                            <MessageSquare size={13} className="shrink-0 text-slate-400" />
                            <span className="min-w-0 truncate">{en.message}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 xl:max-w-[360px] xl:justify-end xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
                    <Link
                      href={`/admin/enrollments/${en.id}`}
                      title="Details"
                      aria-label="Details"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Info size={15} />
                      <span>View</span>
                    </Link>
                    <button
                      onClick={() => setEditFor(en)}
                      disabled={busy}
                      title="Edit student info"
                      aria-label="Edit student info"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                    >
                      <Pencil size={15} />
                      <span>Edit</span>
                    </button>
                    {en.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => setStatus(en, "APPROVED")}
                          disabled={busy}
                          title="Approve"
                          aria-label="Approve"
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                        >
                          <CheckCircle2 size={15} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setStatus(en, "DECLINED")}
                          disabled={busy}
                          title="Decline"
                          aria-label="Decline"
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2.5 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          <XCircle size={15} />
                          <span>Decline</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setStatus(en, "PENDING")}
                        disabled={busy}
                        title="Move to pending"
                        aria-label="Move to pending"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        <Undo2 size={15} />
                        <span>Pending</span>
                      </button>
                    )}

                    <button
                      onClick={() => setPaymentFor(en)}
                      disabled={busy}
                      title="Payment info"
                      aria-label="Payment info"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
                    >
                      <Banknote size={15} />
                      <span>Payment</span>
                    </button>

                    <button
                      onClick={() => markRead(en)}
                      disabled={busy}
                      title={en.read ? "Mark as unread" : "Mark as read"}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                    >
                      {en.read ? <MailOpen size={15} /> : <CheckCheck size={15} />}
                    </button>
                    <button
                      onClick={() => remove(en)}
                      disabled={busy}
                      title="Delete"
                      aria-label="Delete"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollmentsList;
