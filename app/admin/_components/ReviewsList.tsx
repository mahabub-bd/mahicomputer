"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, Pencil, Plus, Star } from "lucide-react";
import type { Course, Review } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import ReviewForm from "./ReviewForm";
import useEditDeepLink from "./useEditDeepLink";
import { btn } from "@/components/form/buttonStyles";

interface ReviewsListProps {
  reviews: Review[];
  courses: Course[];
  /** From ?edit=<id> — opens that review's edit modal on mount. */
  editId?: string;
}

const ReviewsList = ({ reviews, courses, editId }: ReviewsListProps) => {
  const [modal, setModal] = useState<{ review?: Review } | null>(null);
  const closeModal = useEditDeepLink(
    editId,
    reviews,
    (review) => setModal({ review }),
    () => setModal(null),
  );

  // Shared with the mobile card list below so the two views cannot drift.
  const rating = (value: number) => (
    <span className="inline-flex items-center gap-1 text-amber-600">
      <Star size={14} fill="currentColor" />
      {value}
    </span>
  );

  const actions = (r: Review) => (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/reviews/${r.id}`}
        title="Details"
        className={btn("secondary", "sm")}
      >
        <Info size={15} />
        Details
      </Link>
      <button
        onClick={() => setModal({ review: r })}
        title="Edit"
        className={btn("secondary", "sm")}
      >
        <Pencil size={15} />
        Edit
      </button>
      <DeleteButton
        url={`/api/admin/reviews/${r.id}`}
        confirmText={`Delete the review by "${r.name}"? This cannot be undone.`}
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reviews</h1>
          <p className="mt-1 text-sm text-slate-500">
            Student course ratings shown on the home page
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className={btn("primary")}
        >
          <Plus size={16} />
          Add review
        </button>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {r.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.imageUrl}
                        alt=""
                        loading="lazy" decoding="async"
                      className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{r.name}</p>
                      <p className="max-w-xs truncate text-xs text-slate-400">
                        {r.content}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.course}</td>
                <td className="px-4 py-3">{rating(r.rating)}</td>
                <td className="px-4 py-3">{r.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">{actions(r)}</div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No reviews yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per review ----------}
          A five-column table is unusable at phone widths, so each row
          becomes a stacked card: avatar + name with the star rating,
          the comment, a course / order grid and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {r.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.imageUrl}
                  alt=""
                  loading="lazy" decoding="async"
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate font-medium text-slate-900">
                    {r.name}
                  </p>
                  <span className="shrink-0">{rating(r.rating)}</span>
                </div>
                <p className="truncate text-xs text-slate-400">{r.content}</p>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Course
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium text-slate-700">
                  {r.course}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {r.order}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(r)}</div>
          </li>
        ))}

        {reviews.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No reviews yet.
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal?.review ? `Edit: ${modal.review.name}` : "Add review"}
        wide
      >
        {modal !== null && (
          <ReviewForm
            key={modal.review?.id ?? "new"}
            review={modal.review}
            courses={courses}
            onSuccess={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default ReviewsList;
