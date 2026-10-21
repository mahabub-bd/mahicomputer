"use client";

import { btnIcon } from "@/components/form/buttonStyles";
import type { Category, CategoryWithCourseCount } from "@/lib/types";
import { Info, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CategoryForm from "./CategoryForm";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import useEditDeepLink from "./useEditDeepLink";

interface CategoriesListProps {
  categories: CategoryWithCourseCount[];
  /** From ?edit=<id> — opens that category's edit modal on mount. */
  editId?: string;
}

const CategoriesList = ({ categories, editId }: CategoriesListProps) => {
  const [modal, setModal] = useState<{ category?: Category } | null>(null);
  const closeModal = useEditDeepLink(
    editId,
    categories,
    (category) => setModal({ category }),
    () => setModal(null),
  );

  // Shared by the md+ table and the phone card list so the two
  // views can never drift apart.
  const countPill = (count: number) => (
    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
      {count}
    </span>
  );

  const actions = (c: CategoryWithCourseCount) => (
    <div className="flex flex-wrap gap-1">
      <Link
        href={`/admin/categories/${c.id}`}
        title="Details"
        aria-label="Details"
        className={btnIcon("secondary")}
      >
        <Info size={15} />
      </Link>
      <button
        onClick={() => setModal({ category: c })}
        title="Edit"
        aria-label="Edit"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/categories/${c.id}`}
        confirmText={`Delete "${c.title}"? This cannot be undone.`}
        iconOnly
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">
            Service categories shown on the home page
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          title="Add category"
          aria-label="Add category"
          className={btnIcon("primary", "md")}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* ---------- md and up: table ----------
          Five columns scroll inside the card instead of squeezing
          on tablet. */}
      <div>
        <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Courses</th>
                <th className="px-4 py-3">Alt</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.imageUrl}
                          alt=""
                          loading="lazy" decoding="async"
                      className="h-10 w-10 rounded object-contain"
                        />
                      )}
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="font-medium text-slate-900 hover:text-blue-700 hover:underline"
                      >
                        {c.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">{countPill(c._count.courses)}</td>
                  <td className="px-4 py-3 text-slate-500">{c.alt}</td>
                  <td className="px-4 py-3">{c.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">{actions(c)}</div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- below md: one card per category ----------}
          A five-column table is unusable at phone widths, so each row
          becomes a stacked card: thumbnail + title, then a compact
          courses / order grid and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {categories.map((c) => (
          <li key={c.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {c.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt=""
                  loading="lazy" decoding="async"
                      className="h-10 w-10 shrink-0 rounded object-contain"
                />
              )}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/categories/${c.id}`}
                  className="block truncate font-medium text-slate-900 hover:text-blue-700 hover:underline"
                >
                  {c.title}
                </Link>
                {c.alt && (
                  <p className="truncate text-xs text-slate-400">{c.alt}</p>
                )}
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Courses
                </dt>
                <dd className="mt-0.5">{countPill(c._count.courses)}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {c.order}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(c)}</div>
          </li>
        ))}

        {categories.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No categories yet.
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={closeModal}
        title={modal?.category ? `Edit: ${modal.category.title}` : "Add category"}
      >
        {modal !== null && (
          <CategoryForm
            key={modal.category?.id ?? "new"}
            category={modal.category}
            onSuccess={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default CategoriesList;
