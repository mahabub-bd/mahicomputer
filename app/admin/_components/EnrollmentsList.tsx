"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCheck, MailOpen, Trash2 } from "lucide-react";
import type { Enrollment } from "@/lib/types";
import { apiDelete, apiPatch } from "./api";

interface EnrollmentsListProps {
  enrollments: Enrollment[];
}

const EnrollmentsList = ({ enrollments }: EnrollmentsListProps) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const markRead = async (enrollment: Enrollment) => {
    setBusyId(enrollment.id);
    try {
      await apiPatch(`/api/admin/enrollments/${enrollment.id}`, { read: !enrollment.read });
      toast.success(enrollment.read ? "Marked as unread" : "Marked as read");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

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

  return (
    <div className="space-y-3">
      {enrollments.map((en) => (
        <div
          key={en.id}
          className={`rounded-lg border p-4 ${
            en.read ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50/50"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-slate-900">
                {en.name}
                {!en.read && (
                  <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] text-white">
                    New
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500">
                {en.phone}
                {en.email ? ` · ${en.email}` : ""} ·{" "}
                {new Date(en.createdAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                timeStyle: "short",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => markRead(en)}
                disabled={busyId === en.id}
                className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                {en.read ? <MailOpen size={15} /> : <CheckCheck size={15} />}
                Mark as {en.read ? "unread" : "read"}
              </button>
              <button
                onClick={() => remove(en)}
                disabled={busyId === en.id}
                className="flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
          {en.course && (
            <p className="mt-3">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                {en.course}
              </span>
              {en.message ? ` — ${en.message}` : ""}
            </p>
          )}
          {!en.course && en.message && (
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{en.message}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EnrollmentsList;
