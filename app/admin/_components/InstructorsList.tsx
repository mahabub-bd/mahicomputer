"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, Pencil, Plus } from "lucide-react";
import type { Instructor, InstructorWithCourseCount } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import InstructorForm from "./InstructorForm";
import Modal from "./Modal";
import useEditDeepLink from "./useEditDeepLink";
import { btn } from "@/components/form/buttonStyles";

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
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/instructors/${i.id}`}
        title="Details"
        className={btn("secondary", "sm")}
      >
        <Info size={15} />
        Details
      </Link>
      <button
        onClick={() => setModal({ instructor: i })}
        title="Edit"
        className={btn("secondary", "sm")}
      >
        <Pencil size={15} />
        Edit
      </button>
      <DeleteButton
        url={`/api/admin/instructors/${i.id}`}
        confirmText={`Delete "${i.name}"? This cannot be undone.`}
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
          className={btn("primary")}
        >
          <Plus size={16} />
          Add instructor
        </button>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
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
                    <span className="font-medium text-slate-900">{i.name}</span>
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
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No instructors yet.
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
          <li key={i.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {i.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={i.imageUrl}
                  alt=""
                  loading="lazy" decoding="async"
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{i.name}</p>
                {i.description && (
                  <p className="truncate text-xs text-slate-400">
                    {i.description}
                  </p>
                )}
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Courses
                </dt>
                <dd className="mt-0.5">{countPill(i._count.courses)}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {i.order}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(i)}</div>
          </li>
        ))}

        {instructors.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No instructors yet.
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
