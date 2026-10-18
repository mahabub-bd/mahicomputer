"use client";

import Link from "next/link";
import { useState } from "react";
import { Info, Pencil, Plus } from "lucide-react";
import type { Course } from "@/lib/types";
import CourseForm from "./CourseForm";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";

interface CoursesListProps {
  courses: Course[];
}

const CoursesList = ({ courses }: CoursesListProps) => {
  // null = closed; { course: undefined } = create; { course } = edit
  const [modal, setModal] = useState<{ course?: Course } | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Courses shown on the home page and in the nav menu
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={16} />
          Add course
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {c.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.imageUrl}
                        alt=""
                        className="h-10 w-16 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{c.title}</p>
                      <p className="text-xs text-slate-400">{c.tag}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{c.slug}</td>
                <td className="px-4 py-3">{c.price}</td>
                <td className="px-4 py-3">{c.order}</td>
                <td className="px-4 py-3">
                  {c.published ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/courses/${c.id}`}
                      title="Details"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Info size={15} />
                      Details
                    </Link>
                    <button
                      onClick={() => setModal({ course: c })}
                      title="Edit"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <DeleteButton
                      url={`/api/admin/courses/${c.id}`}
                      confirmText={`Delete "${c.title}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.course ? `Edit: ${modal.course.title}` : "Add course"}
        wide
      >
        {modal !== null && (
          <CourseForm
            key={modal.course?.id ?? "new"}
            course={modal.course}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default CoursesList;
