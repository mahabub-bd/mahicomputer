"use client";

import { btnIcon } from "@/components/form/buttonStyles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Users, X } from "lucide-react";
import { apiDelete, apiPost } from "./api";
import EmptyState from "./EmptyState";
import { Select } from "@/components/form/FormControls";

interface BatchStudentsProps {
  batchId: string;
  capacity: number;
  students: {
    id: string;
    enrollmentId: string;
    name: string;
    studentId: string;
    phone: string;
    photoUrl: string;
  }[];
  candidates: {
    id: string;
    name: string;
    studentId: string;
    course: string;
    phone: string;
  }[];
}

/** Batch membership manager: add approved admissions, remove members. */
const BatchStudents = ({ batchId, capacity, students, candidates }: BatchStudentsProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState("");

  const add = async () => {
    if (!picked) return;
    setBusy(true);
    try {
      await apiPost(`/api/admin/batches/${batchId}/students`, { enrollmentId: picked });
      toast.success("Student added to batch");
      setPicked("");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add student");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (enrollmentId: string, name: string) => {
    if (!confirm(`Remove ${name} from this batch? Their attendance records are kept.`)) return;
    setBusy(true);
    try {
      await apiDelete(
        `/api/admin/batches/${batchId}/students?enrollmentId=${encodeURIComponent(enrollmentId)}`,
      );
      toast.success("Student removed from batch");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove student");
    } finally {
      setBusy(false);
    }
  };

  const full = capacity > 0 && students.length >= capacity;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Students ({students.length}
          {capacity > 0 ? `/${capacity}` : ""})
        </p>
      </div>

      {/* Add picker */}
      <div className="mb-4 flex items-center gap-2">
        <Select
          value={picked}
          onChange={(e) => setPicked(e.target.value)}
          className="min-w-0 flex-1"
          aria-label="Choose a student to add"
        >
          <option value="">
            {full
              ? "Batch is full"
              : candidates.length === 0
                ? "No approved admissions left to add"
                : "Choose a student to add…"}
          </option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.studentId ? ` (${c.studentId})` : ""} — {c.course || "no course"}
            </option>
          ))}
        </Select>
        <button type="button" onClick={add} disabled={busy || !picked || full} className={btnIcon("secondary")}>
          <UserPlus size={15} />
          Add
        </button>
      </div>

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students in this batch yet."
          description="Add approved admissions above."
        />
      ) : (
        <ul className="divide-y divide-slate-100">
          {students.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div className="flex min-w-0 items-center gap-3">
                {s.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.photoUrl}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                    {s.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {s.name}
                    {s.studentId && (
                      <code className="ml-2 rounded bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700">
                        {s.studentId}
                      </code>
                    )}
                  </p>
                  <p className="truncate text-xs text-slate-400">{s.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(s.enrollmentId, s.name)}
                disabled={busy}
                title="Remove from batch"
                aria-label={`Remove ${s.name} from batch`}
                className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BatchStudents;
