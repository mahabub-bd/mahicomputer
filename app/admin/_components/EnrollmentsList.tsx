"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { btn, btnIcon } from "@/components/form/buttonStyles";
import {
  BookOpen,
  CheckCheck,
  CheckCircle2,
  Clock,
  Mail,
  MailOpen,
  MessageSquare,
  Phone,
  Trash2,
  Undo2,
  XCircle,
} from "lucide-react";
import type { Enrollment } from "@/lib/types";
import { apiDelete, apiPatch } from "./api";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "DECLINED";

const STATUS_META = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
    accent: "border-amber-200 bg-amber-50/40",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    accent: "border-emerald-200 bg-emerald-50/40",
  },
  DECLINED: {
    label: "Declined",
    icon: XCircle,
    badge: "bg-slate-100 text-slate-500 ring-1 ring-slate-300",
    dot: "bg-slate-400",
    accent: "border-slate-200 bg-slate-50/60",
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
}

const EnrollmentsList = ({ enrollments }: EnrollmentsListProps) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("ALL");

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

  const visible =
    filter === "ALL" ? enrollments : enrollments.filter((e) => e.status === filter);

  const tabs: StatusFilter[] = ["ALL", "PENDING", "APPROVED", "DECLINED"];

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
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
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-slate-500">No enrollments for this filter.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((en) => {
            const meta = STATUS_META[en.status];
            const StatusIcon = meta.icon;
            const busy = busyId === en.id;

            return (
              <div
                key={en.id}
                className={`rounded-xl border p-4 shadow-sm transition ${
                  meta.accent
                } ${!en.read ? "ring-1 ring-blue-300" : ""}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Left — 2 lines of info */}
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {/* Avatar */}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                      {initials(en.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      {/* Line 1 — name · badges · date */}
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-semibold text-slate-900">{en.name}</p>
                        {!en.read && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                            New
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${meta.badge}`}
                        >
                          <StatusIcon size={13} />
                          {meta.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock size={12} />
                          {new Date(en.createdAt).toLocaleString("en-GB", {
                            timeStyle: "short",
                            dateStyle: "short",
                          })}
                        </span>
                      </div>

                      {/* Line 2 — email · phone (same order + gaps as messages list) */}
                      <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
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
                      <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        {en.course && (
                          <span className="flex min-w-0 shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-100">
                            <BookOpen size={11} className="shrink-0" />
                            <span className="max-w-[14rem] truncate">{en.course}</span>
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

                  {/* Right — status actions in a single line */}
                  <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                    {en.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => setStatus(en, "APPROVED")}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm transition duration-150 hover:bg-emerald-700 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                        >
                          <CheckCircle2 size={15} />
                          Approve
                        </button>
                        <button
                          onClick={() => setStatus(en, "DECLINED")}
                          disabled={busy}
                          className={btn("secondary", "sm")}
                        >
                          <XCircle size={15} />
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setStatus(en, "PENDING")}
                        disabled={busy}
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-50"
                      >
                        <Undo2 size={15} />
                        Move to pending
                      </button>
                    )}

                    <button
                      onClick={() => markRead(en)}
                      disabled={busy}
                      title={en.read ? "Mark as unread" : "Mark as read"}
                      className={btnIcon("ghost", "sm")}
                    >
                      {en.read ? <MailOpen size={15} /> : <CheckCheck size={15} />}
                    </button>
                    <button
                      onClick={() => remove(en)}
                      disabled={busy}
                      title="Delete"
                      className={btnIcon("danger", "sm")}
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
