"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCheck,
  CheckCircle2,
  Clock,
  MailOpen,
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
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
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
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {initials(en.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{en.name}</p>
                      {!en.read && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] text-white">
                          New
                        </span>
                      )}
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.badge}`}
                      >
                        <StatusIcon size={12} />
                        {meta.label}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {en.phone}
                      {en.email ? ` · ${en.email}` : ""}
                    </p>

                    {en.course && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-100">
                          {en.course}
                        </span>
                      </div>
                    )}

                    {en.message && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                        {en.message}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(en.createdAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  {en.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => setStatus(en, "APPROVED")}
                        disabled={busy}
                        className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <CheckCircle2 size={15} />
                        Approve
                      </button>
                      <button
                        onClick={() => setStatus(en, "DECLINED")}
                        disabled={busy}
                        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-50"
                      >
                        <XCircle size={15} />
                        Decline
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setStatus(en, "PENDING")}
                      disabled={busy}
                      className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <Undo2 size={15} />
                      Move to pending
                    </button>
                  )}
                  <span className="flex-1" />
                  <button
                    onClick={() => markRead(en)}
                    disabled={busy}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-50"
                  >
                    {en.read ? <MailOpen size={15} /> : <CheckCheck size={15} />}
                    Mark as {en.read ? "unread" : "read"}
                  </button>
                  <button
                    onClick={() => remove(en)}
                    disabled={busy}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
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
