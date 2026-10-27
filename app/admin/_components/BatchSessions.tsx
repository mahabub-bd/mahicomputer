"use client";

import { btn } from "@/components/form/buttonStyles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, Link2, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { apiDelete, apiPost } from "./api";
import EmptyState from "./EmptyState";
import { Field, Input } from "@/components/form/FormControls";

interface BatchSessionsProps {
  batchId: string;
  sessions: { id: string; date: string; topic: string; attendanceCount: number }[];
}

/** Session list + creation for one batch. */
const BatchSessions = ({ batchId, sessions }: BatchSessionsProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");

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
          {sessions.map((s, i) => (
            <li key={s.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-9 shrink-0 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  #{i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">
                    {new Date(s.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {s.topic && (
                      <span className="ml-2 text-xs font-normal text-slate-500">{s.topic}</span>
                    )}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Users size={12} />
                    {s.attendanceCount} marked
                  </p>
                </div>
              </div>
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
                  onClick={() => remove(s.id)}
                  disabled={busy}
                  title="Delete session"
                  aria-label="Delete session"
                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BatchSessions;
