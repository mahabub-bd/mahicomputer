"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, Pencil, Plus, Star } from "lucide-react";
import type { Course, Review } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import ReviewForm from "./ReviewForm";

interface ReviewsListProps {
  reviews: Review[];
  courses: Course[];
}

const ReviewsList = ({ reviews, courses }: ReviewsListProps) => {
  const [modal, setModal] = useState<{ review?: Review } | null>(null);

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
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={16} />
          Add review
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
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
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{r.name}</p>
                      <p className="max-w-xs truncate text-xs text-slate-400">
                        {r.content}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.course}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <Star size={14} fill="currentColor" />
                    {r.rating}
                  </span>
                </td>
                <td className="px-4 py-3">{r.order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/reviews/${r.id}`}
                      title="Details"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Info size={15} />
                      Details
                    </Link>
                    <button
                      onClick={() => setModal({ review: r })}
                      title="Edit"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <DeleteButton
                      url={`/api/admin/reviews/${r.id}`}
                      confirmText={`Delete the review by "${r.name}"? This cannot be undone.`}
                    />
                  </div>
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

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.review ? `Edit: ${modal.review.name}` : "Add review"}
        wide
      >
        {modal !== null && (
          <ReviewForm
            key={modal.review?.id ?? "new"}
            review={modal.review}
            courses={courses}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ReviewsList;
