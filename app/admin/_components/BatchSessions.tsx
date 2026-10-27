"use client";

import { btn } from "@/components/form/buttonStyles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Link2, Pencil, Trash2, Users, X } from "lucide-react";
import Link from "next/link";
import { apiDelete, apiPatch, apiPost } from "./api";
import EmptyState from "./EmptyState";
import { Field, Input } from "@/components/form/FormControls";

interface BatchSessionsProps {
  batchId: string;
  /** Current batch size — used for the per-session attendance progress bar. */
  studentsCount: number;
  sessions: { id: string; date: string; topic: string; attendanceCount: number }[];
}

/** Session list + creation/editing for one batch. */
const BatchSessions = ({ batchId, studentsCount, sessions }: BatchSessionsProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");
  // Inline edit state (one row at a time).
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTopic, setEditTopic] = useState("");

  const create = async () => {
    if (!date) {
      toast.error("Pick a class date first");
      return;
    }
    setBusy(true);
    try {
      await apiPost(`/api/admin/batches/${batchId}/sessions`, { date, topic });
      toast.success("Session added");
      setDate("");
      setTopic("");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add session");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (s: { id: string; date: string; topic: string }) => {
    setEditingId(s.id);
    setEditDate(s.date.slice(0, 10));
    setEditTopic(s.topic);
  };

  const saveEdit = async () => {
    if (!editingId || !editDate) return;
    setBusy(true);
    try {
      await apiPatch(`/api/admin/batches/${batchId}/sessions/${editingId}`, {
        date: editDate,
        topic: editTopic,
      });
      toast.success("Session updated");
      setEditingId(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update session");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (sessionId: string) => {
    if (!confirm("Delete this session? Its attendance records are removed too.")) return;
    setBusy(true);
    try {
      await apiDelete(`/api/admin/batches/${batchId}/sessions/${sessionId}`);
      toast.success("Session deleted");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete session");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold uppercase tracking-wider text-slate-700">
          Class sessions ({sessions.length})
        </p>
      </div>

      {/* New session */}
      <div className="mb-4 grid grid-cols-[1fr_1.4fr_auto] items-end gap-2">
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Topic" hint="Optional">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Pen tool basics"
          />
        </Field>
        <button type="button" onClick={create} disabled={busy} className={btn("secondary", "sm")}>
          <CalendarPlus size={15} />
          Add
        </button>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="No sessions yet."
          description="Add each class day to take attendance."
        />
      ) : (
        <ul className="divide-y divide-slate-100">
          {sessions.map((s, i) => {
            const d = new Date(s.date);
            const pct =
              studentsCount > 0
                ? Math.min(Math.round((s.attendanceCount / studentsCount) * 100), 100)
                : 0;
            const editing = editingId === s.id;

            return (
              <li key={s.id} className="flex items-start gap-3 py-2.5">
                {/* Calendar tile */}
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <span className="text-[10px] font-bold uppercase leading-none">
                    {d.toLocaleDateString("en-GB", { month: "short" })}
                  </span>
                  <span className="text-base font-bold leading-tight">{d.getDate()}</span>
                </div>

                {editing ? (
                  // Inline edit form
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-end gap-2">
                      <Field label="Date">
                        <Input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-36"
                        />
                      </Field>
                      <Field label="Topic">
                        <Input
                          value={editTopic}
                          onChange={(e) => setEditTopic(e.target.value)}
                          className="w-52"
                        />
                      </Field>
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={busy || !editDate}
                        className={btn("secondary", "sm")}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        disabled={busy}
                        title="Cancel"
                        aria-label="Cancel editing"
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span className="font-semibold text-slate-900">
                        #{i + 1} ·{" "}
                        {d.toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      {s.topic && (
                        <span className="truncate text-xs text-slate-500">{s.topic}</span>
                      )}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            pct === 100
                              ? "bg-emerald-500"
                              : pct > 0
                                ? "bg-blue-500"
                                : "bg-slate-200"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Users size={12} />
                        {s.attendanceCount}/{studentsCount} marked
                      </span>
                    </div>
                  </div>
                )}

                {!editing && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                      href={`/admin/batches/${batchId}/sessions/${s.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Link2 size={14} />
                      Attendance
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      disabled={busy}
                      title="Edit date/topic"
                      aria-label="Edit session"
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      disabled={busy}
                      title="Delete session"
                      aria-label="Delete session"
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BatchSessions;
