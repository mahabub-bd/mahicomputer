"use client";

import { btn, btnIcon } from "@/components/form/buttonStyles";
import type { Batch } from "@/lib/types";
import { CalendarDays, Info, Layers, Pencil, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BatchForm from "./BatchForm";
import DeleteButton from "./DeleteButton";
import EmptyState from "./EmptyState";
import ListCard from "./ListCard";
import Modal from "./Modal";

type BatchRow = Batch & { _count: { students: number; sessions: number } };

interface BatchesListProps {
  batches: BatchRow[];
  courses: { title: string }[];
}

const BATCH_META = {
  UPCOMING: { label: "Upcoming", badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  RUNNING: { label: "Running", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  COMPLETED: { label: "Completed", badge: "bg-slate-100 text-slate-500 ring-1 ring-slate-300" },
} as const;

const statusPill = (status: BatchRow["status"]) => {
  const meta = BATCH_META[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}>
      {meta.label}
    </span>
  );
};

/** Enrolled / capacity, flagged rose once the batch is full. */
const seatsPill = (batch: BatchRow) => {
  const used = batch._count.students;
  if (batch.capacity <= 0) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
        {used} · no limit
      </span>
    );
  }
  const full = used >= batch.capacity;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        full ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-700"
      }`}
    >
      {used} / {batch.capacity}
    </span>
  );
};

const startLabel = (date: Date | null) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const BatchesList = ({ batches, courses }: BatchesListProps) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editFor, setEditFor] = useState<Batch | null>(null);

  // Icon-only actions keep the row compact — labels live in tooltips.
  const actions = (batch: BatchRow) => (
    <div className="flex flex-wrap gap-1">
      <Link
        href={`/admin/batches/${batch.id}`}
        title="Manage batch"
        aria-label="Manage batch"
        className={btnIcon("secondary")}
      >
        <Info size={15} />
      </Link>
      <button
        onClick={() => setEditFor(batch)}
        title="Edit batch"
        aria-label="Edit batch"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/batches/${batch.id}`}
        confirmText={`Delete batch "${batch.name}"? Its sessions and attendance records are removed too.`}
        iconOnly
      />
    </div>
  );

  return (
    <div>
      {/* Page title lives in the page's PageHeader; this list keeps only
          its primary action. */}
      <div className="mb-6 flex justify-end">
        <button onClick={() => setAddOpen(true)} className={btn("primary")}>
          <UserPlus size={16} />
          Add batch
        </button>
      </div>

      {/* ---------- md and up: table ----------
          min-w + the thin scrollbar keep the seven columns readable — they
          scroll inside the card instead of squeezing on tablet. */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">Sessions</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {batches.map((batch) => (
              <tr key={batch.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Layers size={16} />
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/batches/${batch.id}`}
                        className="block truncate font-medium text-slate-900 hover:text-blue-700 hover:underline"
                      >
                        {batch.name}
                      </Link>
                      <p className="truncate text-xs text-slate-400">
                        Starts {startLabel(batch.startDate)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="truncate text-slate-700">{batch.course}</span>
                </td>
                <td className="px-4 py-3">
                  {batch.schedule ? (
                    <span className="text-slate-500">{batch.schedule}</span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">{seatsPill(batch)}</td>
                <td className="px-4 py-3 text-slate-700">{batch._count.sessions}</td>
                <td className="px-4 py-3">{statusPill(batch.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">{actions(batch)}</div>
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6">
                  <EmptyState
                    icon={Layers}
                    title="No batches yet."
                    description="Create the first one to start enrolling students."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per batch ----------
          A seven-column table is unusable at phone widths, so each row
          becomes a stacked card: icon + name, the status pill, then a
          compact seats / sessions / start grid and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {batches.map((batch) => (
          <ListCard
            key={batch.id}
            href={`/admin/batches/${batch.id}`}
            title={batch.name}
            subtitle={batch.course}
            media={
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Layers size={18} />
              </span>
            }
            badges={statusPill(batch.status)}
            body={
              batch.schedule ? (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <CalendarDays size={13} className="shrink-0 text-slate-400" />
                  {batch.schedule}
                </span>
              ) : undefined
            }
            fields={[
              { label: "Seats", value: seatsPill(batch) },
              { label: "Sessions", value: batch._count.sessions },
              { label: "Start date", value: startLabel(batch.startDate), wide: true },
            ]}
            actions={actions(batch)}
          />
        ))}

        {batches.length === 0 && (
          <li>
            <EmptyState
              icon={Layers}
              title="No batches yet."
              description="Create the first one to start enrolling students."
            />
          </li>
        )}
      </ul>

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
