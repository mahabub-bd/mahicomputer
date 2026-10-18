"use client";

import type { Category } from "@/lib/types";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import CategoryForm from "./CategoryForm";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";

interface CategoriesListProps {
  categories: Category[];
}

const CategoriesList = ({ categories }: CategoriesListProps) => {
  const [modal, setModal] = useState<{ category?: Category } | null>(null);

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
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={16} />
          Add category
        </button>
      </div>

      <div>
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Category</th>
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
                          className="h-10 w-10 rounded object-contain"
                        />
                      )}
                      <span className="font-medium text-slate-900">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.alt}</td>
                  <td className="px-4 py-3">{c.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal({ category: c })}
                        title="Edit"
                        className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      <DeleteButton
                        url={`/api/admin/categories/${c.id}`}
                        confirmText={`Delete "${c.title}"? This cannot be undone.`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.category ? `Edit: ${modal.category.title}` : "Add category"}
      >
        {modal !== null && (
          <CategoryForm
            key={modal.category?.id ?? "new"}
            category={modal.category}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default CategoriesList;
