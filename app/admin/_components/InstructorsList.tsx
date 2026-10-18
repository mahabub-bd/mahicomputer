"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { Instructor } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import InstructorForm from "./InstructorForm";
import Modal from "./Modal";

interface InstructorsListProps {
  instructors: Instructor[];
}

const InstructorsList = ({ instructors }: InstructorsListProps) => {
  const [modal, setModal] = useState<{ instructor?: Instructor } | null>(null);

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
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={16} />
          Add instructor
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Designation</th>
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
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <span className="font-medium text-slate-900">{i.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{i.description}</td>
                <td className="px-4 py-3">{i.order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setModal({ instructor: i })}
                      title="Edit"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <DeleteButton
                      url={`/api/admin/instructors/${i.id}`}
                      confirmText={`Delete "${i.name}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {instructors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No instructors yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.instructor ? `Edit: ${modal.instructor.name}` : "Add instructor"}
      >
        {modal !== null && (
          <InstructorForm
            key={modal.instructor?.id ?? "new"}
            instructor={modal.instructor}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default InstructorsList;
