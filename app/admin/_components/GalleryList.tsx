"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import GalleryForm from "./GalleryForm";
import Modal from "./Modal";

interface GalleryListProps {
  items: GalleryItem[];
}

const GalleryList = ({ items }: GalleryListProps) => {
  const [modal, setModal] = useState<{ item?: GalleryItem } | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Gallery</h1>
          <p className="mt-1 text-sm text-slate-500">
            Images shown in the home page gallery section
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 sm:w-auto"
        >
          <Plus size={16} />
          Add image
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((g) => (
          <div
            key={g.id}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative aspect-video bg-slate-100">
              {g.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.imageUrl} alt={g.alt} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <p className="min-w-0 truncate text-xs text-slate-500">{g.alt}</p>
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() => setModal({ item: g })}
                  title="Edit"
                  className="rounded-md border border-slate-300 p-1.5 hover:bg-slate-50"
                >
                  <Pencil size={14} />
                </button>
                <DeleteButton url={`/api/admin/gallery/${g.id}`} label=" " />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-slate-500">
            No gallery images yet.
          </p>
        )}
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.item ? "Edit gallery image" : "Add gallery image"}
      >
        {modal !== null && (
          <GalleryForm
            key={modal.item?.id ?? "new"}
            item={modal.item}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default GalleryList;
