"use client";

import { btn, btnIcon } from "@/components/form/buttonStyles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, CheckCircle2, Pencil, Trash2, Users, X } from "lucide-react";
import Link from "next/link";
import { apiDelete, apiPatch, apiPost } from "./api";
import EmptyState from "./EmptyState";
import { Field, Input } from "@/components/form/FormControls";

interface SessionItem {
  id: string;
  date: string;
  topic: string;
  attendanceCount: number;
}

interface BatchSessionsProps {
  batchId: string;
  /** Current batch size — used for the per-session attendance progress. */
  studentsCount: number;
  sessions: SessionItem[];
}

const dayFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});
const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "short" });

/** Same calendar day (local time) or not. */
const isToday = (d: Date) => {
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

/** Session list + creation/editing for one batch. */
const BatchSessions = ({ batchId, studentsCount, sessions }: BatchSessionsProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [adding, setAdding] = useState(false);
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
      setAdding(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add session");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (s: SessionItem) => {
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
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            disabled={busy}
            className={btn("secondary", "sm")}
          >
            <CalendarPlus size={15} />
            Add session
          </button>
        )}
      </div>

      {/* New session — collapsible form */}
      {adding && (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
          <div className="grid gap-2 sm:grid-cols-[auto_1fr]">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Topic" hint="Optional">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Pen tool basics"
                onKeyDown={(e) => e.key === "Enter" && create()}
              />
            </Field>
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              disabled={busy}
              className={btn("ghost", "sm")}
            >
              Cancel
            </button>
            <button type="button" onClick={create} disabled={busy || !date} className={btn("primary", "sm")}>
              <CalendarPlus size={15} />
              Add session
            </button>
          </div>
        </div>
      )}

      {sessions.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="No sessions yet."
          description="Add each class day to take attendance."
        />
      ) : (
        <ul className="space-y-2">
          {sessions.map((s, i) => {
            const d = new Date(s.date);
            const pct =
              studentsCount > 0
                ? Math.min(Math.round((s.attendanceCount / studentsCount) * 100), 100)
                : 0;
            const editing = editingId === s.id;
            const today = isToday(d);
            const past = !today && d < new Date();
            const complete = studentsCount > 0 && s.attendanceCount >= studentsCount;

            return (
              <li key={s.id}>
                {editing ? (
                  // Inline edit form
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
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
                        className={btn("primary", "sm")}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        disabled={busy}
                        title="Cancel"
                        aria-label="Cancel editing"
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-600 disabled:opacity-50"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`group flex items-center gap-3 rounded-xl border p-3 shadow-sm transition ${
                      today
                        ? "border-blue-200 bg-blue-50/40"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    {/* Calendar tile — turns green once everyone is marked */}
                    <div
                      className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg ${
                        complete
                          ? "bg-emerald-50 text-emerald-700"
                          : today
                            ? "bg-blue-600 text-white"
                            : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase leading-none">
                        {monthFmt.format(d)}
                      </span>
                      <span className="text-base font-bold leading-tight">{d.getDate()}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="truncate text-sm font-semibold text-slate-900">
                          {s.topic || `Session ${i + 1}`}
                        </span>
                        <span className="shrink-0 text-xs font-medium text-slate-400">
                          #{i + 1} · {dayFmt.format(d)}
                        </span>
                        {today && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Today
                          </span>
                        )}
                        {past && complete && (
                          <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                        )}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 max-w-32 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct === 100
                                ? "bg-emerald-500"
                                : pct > 0
                                  ? "bg-blue-500"
                                  : "bg-slate-200"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span
                          className={`flex shrink-0 items-center gap-1 text-xs font-medium ${
                            complete ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
                          <Users size={12} />
                          {s.attendanceCount}/{studentsCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Link
                        href={`/admin/batches/${batchId}/sessions/${s.id}`}
                        className={btnIcon(pct === 100 ? "secondary" : "primary", "sm")}
                        title="Take attendance"
                        aria-label={`Take attendance for session ${i + 1}`}
                      >
                        <Users size={14} />
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
