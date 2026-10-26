"use client";

import type { Course, CourseWithCategory } from "@/lib/types";
import { ADMISSION_META } from "@/lib/admission";
import { Info, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { btn, btnIcon } from "@/components/form/buttonStyles";
import CourseForm from "./CourseForm";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import useEditDeepLink from "./useEditDeepLink";

interface CoursesListProps {
  courses: CourseWithCategory[];
  /** From ?edit=<id> — opens that course's edit modal on mount. */
  editId?: string;
}

const CoursesList = ({ courses, editId }: CoursesListProps) => {
  // null = closed; { course: undefined } = create; { course } = edit
  const [modal, setModal] = useState<{ course?: Course } | null>(null);
  const closeModal = useEditDeepLink(
    editId,
    courses,
    (course) => setModal({ course }),
    () => setModal(null),
  );

  const statusPill = (published: boolean) =>
    published ? (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
        Published
      </span>
    ) : (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
        Hidden
      </span>
    );

  const admissionPill = (c: CourseWithCategory) => {
    const meta = ADMISSION_META[c.admission];
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs ${meta.adminPill}`}>
        {meta.adminLabel}
      </span>
    );
  };

  // Icon-only actions keep the row compact — labels live in tooltips.
  const actions = (c: CourseWithCategory) => (
    <div className="flex flex-wrap gap-1">
      <Link
        href={`/admin/courses/${c.id}`}
        title="Details"
        aria-label="Details"
        className={btnIcon("secondary")}
      >
        <Info size={15} />
      </Link>
      <button
        onClick={() => setModal({ course: c })}
        title="Edit"
        aria-label="Edit"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/courses/${c.id}`}
        confirmText={`Delete "${c.title}"? This cannot be undone.`}
        iconOnly
      />
    </div>
  );

  return (
    <div>
      {/* Page title lives in the page's PageHeader; this list keeps only
          its primary action. */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setModal({})}
          className={btn("primary")}
        >
          <Plus size={16} />
          Add course
        </button>
      </div>

      {/* ---------- md and up: table ----------
          min-w + the thin scrollbar keep the eight columns readable —
          they scroll inside the card instead of squeezing on tablet. */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        {/* min-w tuned to fit a ~1024px content area (laptop minus sidebar)
            now that actions are icon-only. */}
        <table className="w-full min-w-4xl text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-3 py-3">Course</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Instructor</th>
              <th className="px-3 py-3">Fee</th>
              <th className="px-3 py-3">Order</th>
              <th className="px-3 py-3">Visibility</th>
              <th className="px-3 py-3">Admission</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    {c.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.imageUrl}
                        alt=""
                        loading="lazy" decoding="async"
                      className="h-10 w-16 shrink-0 rounded object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="block truncate font-medium text-slate-900 hover:text-blue-700 hover:underline"
                      >
                        {c.title}
                      </Link>
                      <p className="truncate text-xs text-slate-400">{c.tag}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {c.category ? (
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {c.category.title}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {c.instructor ? (
                    <div className="flex items-center gap-2">
                      {c.instructor.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.instructor.imageUrl}
                          alt=""
                          loading="lazy" decoding="async"
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                        />
                      )}
                      <span className="truncate text-slate-700">
                        {c.instructor.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-3 py-3 font-medium text-slate-700">
                  ৳{c.price.toLocaleString("en-BD")}
                </td>
                <td className="px-3 py-3">{c.order}</td>
                <td className="px-3 py-3">{statusPill(c.published)}</td>
                <td className="px-3 py-3">{admissionPill(c)}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end">{actions(c)}</div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per course ----------}
          An eight-column table is unusable at phone widths, so each row
          becomes a stacked card: thumbnail + title, then a compact
          fee / order / instructor grid and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {courses.map((c) => (
          <li key={c.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {c.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt=""
                  loading="lazy" decoding="async"
                      className="h-14 w-24 shrink-0 rounded object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/admin/courses/${c.id}`}
                    className="min-w-0 flex-1 truncate font-medium text-slate-900 hover:text-blue-700 hover:underline"
                  >
                    {c.title}
                  </Link>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {statusPill(c.published)}
                    {admissionPill(c)}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-400">{c.tag}</p>
                {c.category && (
                  <span className="mt-1.5 inline-block max-w-full truncate rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {c.category.title}
                  </span>
                )}
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Fee
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  ৳{c.price.toLocaleString("en-BD")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {c.order}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Instructor
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium text-slate-700">
                  {c.instructor?.name || "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(c)}</div>
          </li>
        ))}

        {courses.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No courses yet.
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal?.course ? `Edit: ${modal.course.title}` : "Add course"}
        wide
      >
        {modal !== null && (
          <CourseForm
            key={modal.course?.id ?? "new"}
            course={modal.course}
            onSuccess={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default CoursesList;
