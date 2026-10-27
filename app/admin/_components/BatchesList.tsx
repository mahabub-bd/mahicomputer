"use client";

import { btn } from "@/components/form/buttonStyles";
import type { Batch } from "@/lib/types";
import {
  BookOpen,
  CalendarDays,
  Info,
  Layers,
  Pencil,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiDelete } from "./api";
import BatchForm from "./BatchForm";
import Modal from "./Modal";

interface BatchesListProps {
  batches: (Batch & { _count: { students: number; sessions: number } })[];
  courses: { title: string }[];
}

const BATCH_META = {
  UPCOMING: { label: "Upcoming", badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  RUNNING: { label: "Running", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  COMPLETED: { label: "Completed", badge: "bg-slate-100 text-slate-500 ring-1 ring-slate-300" },
} as const;

const BatchesList = ({ batches, courses }: BatchesListProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editFor, setEditFor] = useState<Batch | null>(null);

  const remove = async (batch: Batch) => {
    if (
      !confirm(
        `Delete batch "${batch.name}"? Its sessions and attendance records are removed too.`,
      )
    )
      return;
    setBusy(true);
    try {
      await apiDelete(`/api/admin/batches/${batch.id}`);
      toast.success("Batch deleted");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <button onClick={() => setAddOpen(true)} className={btn("primary")}>
          <UserPlus size={16} />
          Add batch
        </button>
      </div>

      {batches.length === 0 ? (
        <p className="text-sm text-slate-500">No batches yet — create the first one.</p>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => {
            const meta = BATCH_META[batch.status];
            return (
              <div
                key={batch.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 border-l-2 border-l-blue-500 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <Layers size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/batches/${batch.id}`}
                          className="text-base font-bold tracking-tight text-slate-900 hover:text-blue-700"
                        >
                          {batch.name}
                        </Link>
                        <span
                          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badge}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
                        <span className="flex min-w-0 items-center gap-1">
                          <BookOpen size={13} className="shrink-0 text-slate-400" />
                          {batch.course}
                        </span>
                        {batch.schedule && (
                          <span className="flex shrink-0 items-center gap-1">
                            <CalendarDays size={13} className="shrink-0 text-slate-400" />
                            {batch.schedule}
                          </span>
                        )}
                        <span className="flex shrink-0 items-center gap-1">
                          <Users size={13} className="shrink-0 text-slate-400" />
                          {batch._count.students}
                          {batch.capacity > 0 ? ` / ${batch.capacity} seats` : " students"}
                        </span>
                        {batch._count.sessions > 0 && (
                          <span className="shrink-0">{batch._count.sessions} sessions</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 xl:max-w-[240px] xl:justify-end xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
                    <Link
                      href={`/admin/batches/${batch.id}`}
                      title="Manage batch"
                      aria-label="Manage batch"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Info size={15} />
                      <span>Manage</span>
                    </Link>
                    <button
                      onClick={() => setEditFor(batch)}
                      disabled={busy}
                      title="Edit batch"
                      aria-label="Edit batch"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                    >
                      <Pencil size={15} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => remove(batch)}
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add batch" wide>
        {addOpen && <BatchForm courses={courses} onSuccess={() => setAddOpen(false)} />}
      </Modal>

      <Modal
        open={editFor !== null}
        onClose={() => setEditFor(null)}
        title={editFor ? `Edit batch — ${editFor.name}` : "Edit batch"}
        wide
      >
        {editFor && (
          <BatchForm
            key={editFor.id}
            courses={courses}
            batch={editFor}
            onSuccess={() => setEditFor(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default BatchesList;
