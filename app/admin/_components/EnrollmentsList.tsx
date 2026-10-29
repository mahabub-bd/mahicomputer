"use client";

import { btn, btnIcon } from "@/components/form/buttonStyles";
import type { CourseAdmission } from "@/lib/admission";
import type { Enrollment } from "@/lib/types";
import {
  Banknote,
  BookOpen,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  Info,
  Mail,
  MailOpen,
  MessageSquare,
  Pencil,
  Phone,
  Undo2,
  UserPlus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AdmissionsForm from "./AdmissionsForm";
import DeleteButton from "./DeleteButton";
import EmptyState from "./EmptyState";
import { apiPatch } from "./api";
import EnrollmentPaymentModal from "./EnrollmentPaymentModal";
import ListCard from "./ListCard";
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

/** Emerald approve action — the shared helper only ships blue/grey/danger. */
const approveBtnCls =
  "inline-flex items-center justify-center rounded-lg bg-emerald-600 p-1.5 text-white shadow-sm transition duration-150 hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

const appliedLabel = (date: Date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const shortDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

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

  // Shared by the md+ table and the phone cards so the two views can never
  // drift apart.
  const Avatar = ({ enrollment, size }: { enrollment: Enrollment; size: string }) =>
    enrollment.photoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element -- student photos live on an external upload host
      <img
        src={enrollment.photoUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className={`${size} shrink-0 rounded-full object-cover ring-1 ring-slate-200`}
      />
    ) : (
      <span
        className={`${size} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 ring-1 ring-blue-200/70`}
      >
        {initials(enrollment.name)}
      </span>
    );

  const statusPill = (status: Enrollment["status"]) => {
    const meta = STATUS_META[status];
    const Icon = meta.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}
      >
        <Icon size={12} />
        {meta.label}
      </span>
    );
  };

  const newPill = (
    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
      New
    </span>
  );

  const courseChip = (enrollment: Enrollment) =>
    enrollment.course ? (
      <span className="inline-flex max-w-40 items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
        <BookOpen size={11} className="shrink-0" />
        <span className="truncate">{enrollment.course}</span>
      </span>
    ) : (
      <span className="text-xs text-slate-400">—</span>
    );

  /** Paid / (discount) / fee, red while the student still owes money. */
  const paymentChip = (enrollment: Enrollment) => {
    if (enrollment.courseFee <= 0) return <span className="text-xs text-slate-400">—</span>;
    const remaining = enrollment.courseFee - enrollment.discount - enrollment.paidAmount;
    return (
      <button
        type="button"
        onClick={() => setPaymentFor(enrollment)}
        title="Edit payment info"
        className={`inline-flex max-w-44 items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ring-1 transition hover:brightness-95 ${
          remaining > 0
            ? "bg-rose-50 text-rose-700 ring-rose-100"
            : "bg-emerald-50 text-emerald-700 ring-emerald-100"
        }`}
      >
        <Banknote size={11} className="shrink-0" />
        <span className="truncate">
          ৳{enrollment.paidAmount.toLocaleString("en-BD")}
          {enrollment.discount > 0 && ` (−৳${enrollment.discount.toLocaleString("en-BD")})`}
          {" / "}৳{enrollment.courseFee.toLocaleString("en-BD")}
        </span>
      </button>
    );
  };

  const dueLabel = (enrollment: Enrollment) =>
    enrollment.dueDate ? (
      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700">
        <CalendarClock size={11} className="shrink-0" />
        Due {shortDate(enrollment.dueDate)}
      </span>
    ) : null;

  // Icon-only actions keep the row compact — labels live in tooltips.
  const actions = (enrollment: Enrollment) => {
    const busy = busyId === enrollment.id;
    return (
      <div className="flex flex-wrap gap-1">
        <Link
          href={`/admin/enrollments/${enrollment.id}`}
          title="View details"
          aria-label="View details"
          className={btnIcon("secondary")}
        >
          <Info size={15} />
        </Link>
        <button
          onClick={() => setEditFor(enrollment)}
          disabled={busy}
          title="Edit student info"
          aria-label="Edit student info"
          className={btnIcon("secondary")}
        >
          <Pencil size={15} />
        </button>
        {enrollment.status === "PENDING" && (
          <button
            onClick={() => setStatus(enrollment, "APPROVED")}
            disabled={busy}
            title="Approve"
            aria-label="Approve"
            className={approveBtnCls}
          >
            <CheckCircle2 size={15} />
          </button>
        )}
        {enrollment.status !== "DECLINED" && (
          <button
            onClick={() => setStatus(enrollment, "DECLINED")}
            disabled={busy}
            title="Decline"
            aria-label="Decline"
            className={btnIcon("secondary")}
          >
            <XCircle size={15} />
          </button>
        )}
        {enrollment.status !== "PENDING" && (
          <button
            onClick={() => setStatus(enrollment, "PENDING")}
            disabled={busy}
            title="Move to pending"
            aria-label="Move to pending"
            className={btnIcon("secondary")}
          >
            <Undo2 size={15} />
          </button>
        )}
        <button
          onClick={() => setPaymentFor(enrollment)}
          disabled={busy}
          title="Payment info"
          aria-label="Payment info"
          className={btnIcon("secondary")}
        >
          <Banknote size={15} />
        </button>
        <button
          onClick={() => markRead(enrollment)}
          disabled={busy}
          title={enrollment.read ? "Mark as unread" : "Mark as read"}
          aria-label={enrollment.read ? "Mark as unread" : "Mark as read"}
          className={btnIcon("secondary")}
        >
          {enrollment.read ? <MailOpen size={15} /> : <CheckCheck size={15} />}
        </button>
        <DeleteButton
          url={`/api/admin/enrollments/${enrollment.id}`}
          confirmText={`Delete the enrollment for "${enrollment.name}"? This cannot be undone.`}
          iconOnly
        />
      </div>
    );
  };

  if (enrollments.length === 0) {
    return (
      <>
        <EmptyState
          icon={ClipboardList}
          title="No enrollments yet."
          action={
            <button onClick={() => setAddOpen(true)} className={btn("primary")}>
              <UserPlus size={16} />
              Add admission
            </button>
          }
        />
        <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add admission" wide>
          {addOpen && (
            <AdmissionsForm courses={courses} onSuccess={() => setAddOpen(false)} />
          )}
        </Modal>
      </>
    );
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
      {/* Status tabs · course filter · the list's primary action */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
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

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {courseTitles.length > 0 && (
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              aria-label="Filter by course"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="ALL">All courses</option>
              {courseTitles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
          <button onClick={() => setAddOpen(true)} className={btn("primary")}>
            <UserPlus size={16} />
            Add admission
          </button>
        </div>
      </div>

      {/* ---------- md and up: table ----------
          min-w + the thin scrollbar keep the seven columns readable — they
          scroll inside the card instead of squeezing on tablet. */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-5xl text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-3">Student</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-3 py-3">Course</th>
              <th className="px-3 py-3">Payment</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Applied</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((en) => (
              <tr
                key={en.id}
                className={en.read ? "hover:bg-slate-50" : "bg-blue-50/40 hover:bg-blue-50"}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar enrollment={en} size="h-9 w-9" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/enrollments/${en.id}`}
                          className="truncate font-medium text-slate-900 hover:text-blue-700 hover:underline"
                        >
                          {en.name}
                        </Link>
                        {!en.read && newPill}
                      </div>
                      <p className="truncate font-mono text-xs text-slate-400">
                        {en.studentId || "No ID assigned"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <p className="flex max-w-45 items-center gap-1 text-slate-600">
                    <Mail size={12} className="shrink-0 text-slate-400" />
                    <span className="truncate">{en.email || "—"}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <Phone size={12} className="shrink-0" />
                    {en.phone}
                  </p>
                  {en.message && (
                    <p
                      title={en.message}
                      className="mt-0.5 flex max-w-45 items-center gap-1 text-xs text-slate-400"
                    >
                      <MessageSquare size={12} className="shrink-0" />
                      <span className="truncate">{en.message}</span>
                    </p>
                  )}
                </td>
                <td className="px-3 py-3">{courseChip(en)}</td>
                <td className="px-3 py-3">
                  {paymentChip(en)}
                  {en.dueDate && <p className="mt-1">{dueLabel(en)}</p>}
                </td>
                <td className="px-3 py-3">{statusPill(en.status)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                  {appliedLabel(en.createdAt)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end">{actions(en)}</div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6">
                  <EmptyState
                    icon={ClipboardList}
                    title="No enrollments for this filter."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per enrollment ----------
          A seven-column table is unusable at phone widths, so each row
          becomes a stacked card: avatar + name, status pills, then a compact
          course / phone / applied grid and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {visible.map((en) => (
          <ListCard
            key={en.id}
            href={`/admin/enrollments/${en.id}`}
            title={en.name}
            subtitle={en.studentId || en.email || en.phone}
            media={<Avatar enrollment={en} size="h-10 w-10" />}
            badges={
              <>
                {!en.read && newPill}
                {statusPill(en.status)}
              </>
            }
            body={
              <div className="flex flex-wrap items-center gap-2">
                {paymentChip(en)}
                {dueLabel(en)}
              </div>
            }
            fields={[
              { label: "Course", value: courseChip(en), wide: true },
              { label: "Phone", value: en.phone },
              { label: "Applied", value: appliedLabel(en.createdAt) },
              { label: "Email", value: en.email || "—", wide: true },
            ]}
            actions={actions(en)}
          />
        ))}

        {visible.length === 0 && (
          <li>
            <EmptyState icon={ClipboardList} title="No enrollments for this filter." />
          </li>
        )}
      </ul>

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
        wide
      >
        {paymentFor && (
          <EnrollmentPaymentModal
            enrollment={paymentFor}
            course={courses.find((c) => c.title === paymentFor.course)}
            onClose={() => setPaymentFor(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default EnrollmentsList;
