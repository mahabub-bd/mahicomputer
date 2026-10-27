"use client";

import { btnIcon } from "@/components/form/buttonStyles";
import type { Instructor, InstructorWithCourseCount } from "@/lib/types";
import { Info, Pencil, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import EmptyState from "./EmptyState";
import ListCard, { CardThumb } from "./ListCard";
import InstructorForm from "./InstructorForm";
import Modal from "./Modal";
import useEditDeepLink from "./useEditDeepLink";

interface InstructorsListProps {
  instructors: InstructorWithCourseCount[];
  /** From ?edit=<id> — opens that instructor's edit modal on mount. */
  editId?: string;
}

const InstructorsList = ({ instructors, editId }: InstructorsListProps) => {
  const [modal, setModal] = useState<{ instructor?: Instructor } | null>(null);
  const closeModal = useEditDeepLink(
    editId,
    instructors,
    (instructor) => setModal({ instructor }),
    () => setModal(null),
  );

  // Shared by the md+ table and the phone card list so the two
  // views can never drift apart.
  const countPill = (count: number) => (
    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
      {count}
    </span>
  );

  const actions = (i: InstructorWithCourseCount) => (
    <div className="flex flex-wrap gap-1">
      <Link
        href={`/admin/instructors/${i.id}`}
        title="Details"
        aria-label="Details"
        className={btnIcon("secondary")}
      >
        <Info size={15} />
      </Link>
      <button
        onClick={() => setModal({ instructor: i })}
        title="Edit"
        aria-label="Edit"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/instructors/${i.id}`}
        confirmText={`Delete "${i.name}"? This cannot be undone.`}
        iconOnly
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Instructors</h1>
          <p className="mt-1 text-sm text-slate-500">
            Instructors shown on the home page
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          title="Add instructor"
          aria-label="Add instructor"
          className={btnIcon("primary", "md")}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Courses</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {instructors.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {i.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={i.imageUrl}
                        alt=""
                        loading="lazy" decoding="async"
                      className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <Link
                      href={`/admin/instructors/${i.id}`}
                      className="font-medium text-slate-900 hover:text-blue-700 hover:underline"
                    >
                      {i.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{i.description}</td>
                <td className="px-4 py-3">{countPill(i._count.courses)}</td>
                <td className="px-4 py-3">{i.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">{actions(i)}</div>
                </td>
              </tr>
            ))}
            {instructors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6">
                  <EmptyState icon={Users} title="No instructors yet." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per instructor ----------}
          A five-column table is unusable at phone widths, so each row
          becomes a stacked card: avatar + name/designation, then a
          compact courses / order grid and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {instructors.map((i) => (
          <ListCard
            key={i.id}
            href={`/admin/instructors/${i.id}`}
            title={i.name}
            subtitle={i.description}
            media={<CardThumb src={i.imageUrl} shape="avatar" />}
            fields={[
              { label: "Courses", value: countPill(i._count.courses) },
              { label: "Order", value: i.order },
            ]}
            actions={actions(i)}
          />
        ))}

        {instructors.length === 0 && (
          <li>
            <EmptyState icon={Users} title="No instructors yet." />
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal?.instructor ? `Edit: ${modal.instructor.name}` : "Add instructor"}
      >
        {modal !== null && (
          <InstructorForm
            key={modal.instructor?.id ?? "new"}
            instructor={modal.instructor}
            onSuccess={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default InstructorsList;
