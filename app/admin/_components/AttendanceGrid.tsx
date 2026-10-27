"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCheck, Save } from "lucide-react";
import { apiPut } from "./api";
import { btn } from "@/components/form/buttonStyles";

type Mark = "PRESENT" | "ABSENT" | "LATE";

interface AttendanceGridProps {
  batchId: string;
  sessionId: string;
  students: {
    enrollmentId: string;
    name: string;
    studentId: string;
    photoUrl: string;
    /** Existing mark for this session; null = not marked yet. */
    status: Mark | null;
  }[];
}

const MARKS: { value: Mark; label: string; on: string; off: string }[] = [
  { value: "PRESENT", label: "P", on: "bg-emerald-600 text-white ring-emerald-600", off: "text-emerald-700 ring-emerald-200 hover:bg-emerald-50" },
  { value: "LATE", label: "L", on: "bg-amber-500 text-white ring-amber-500", off: "text-amber-700 ring-amber-200 hover:bg-amber-50" },
  { value: "ABSENT", label: "A", on: "bg-rose-600 text-white ring-rose-600", off: "text-rose-700 ring-rose-200 hover:bg-rose-50" },
];

/** Attendance marking for one class session (P / L / A per student). */
const AttendanceGrid = ({ batchId, sessionId, students }: AttendanceGridProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  // null = untouched (leave as-is on save); otherwise the chosen mark.
  const [marks, setMarks] = useState<Record<string, Mark | null>>(() =>
    Object.fromEntries(students.map((s) => [s.enrollmentId, s.status])),
  );

  const set = (enrollmentId: string, mark: Mark) =>
    setMarks((m) => ({ ...m, [enrollmentId]: mark }));

  const markAllPresent = () =>
    setMarks(Object.fromEntries(students.map((s) => [s.enrollmentId, "PRESENT" as Mark])));

  const save = async () => {
    setBusy(true);
    try {
      const records = students
        .map((s) => ({ enrollmentId: s.enrollmentId, status: marks[s.enrollmentId] }))
        .filter((r): r is { enrollmentId: string; status: Mark } => r.status !== null);
      await apiPut(
        `/api/admin/batches/${batchId}/sessions/${sessionId}/attendance`,
        { records },
      );
      toast.success("Attendance saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (students.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-sm text-slate-500">
        No students in this batch yet — add students before taking attendance.
      </p>
    );
  }

  const present = Object.values(marks).filter((v) => v === "PRESENT").length;
  const absent = Object.values(marks).filter((v) => v === "ABSENT").length;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-emerald-700">{present} present</span>
          {" · "}
          <span className="font-semibold text-rose-600">{absent} absent</span>
          {" · "}
          {students.length} total
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={markAllPresent} className={btn("secondary", "sm")}>
            <CheckCheck size={15} />
            All present
          </button>
          <button type="button" onClick={save} disabled={busy} className={btn("primary", "sm")}>
            <Save size={15} />
            Save attendance
          </button>
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {students.map((s) => (
          <li key={s.enrollmentId} className="flex items-center justify-between gap-3 py-2.5">
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
                <p className="truncate text-sm font-medium text-slate-900">
                  {s.name}
                  {s.studentId && (
                    <code className="ml-2 rounded bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700">
                      {s.studentId}
                    </code>
                  )}
                </p>
              </div>
            </div>

            {/* P / L / A toggles */}
            <div className="flex shrink-0 items-center gap-1">
              {MARKS.map((m) => {
                const active = marks[s.enrollmentId] === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => set(s.enrollmentId, m.value)}
                    title={m.value.charAt(0) + m.value.slice(1).toLowerCase()}
                    aria-label={`${m.value} for ${s.name}`}
                    aria-pressed={active}
                    className={`h-8 w-8 rounded-full text-xs font-bold ring-1 transition ${
                      active ? m.on : `bg-white ${m.off}`
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceGrid;
