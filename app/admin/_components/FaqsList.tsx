"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { Faq } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import FaqForm from "./FaqForm";
import { btn, btnIcon } from "@/components/form/buttonStyles";

interface FaqsListProps {
  faqs: Faq[];
}

const FaqsList = ({ faqs }: FaqsListProps) => {
  const [modal, setModal] = useState<{ faq?: Faq } | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">FAQ</h1>
          <p className="mt-1 text-sm text-slate-500">
            Questions shown in the homepage FAQ section
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className={btn("primary")}
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={faq.id}
            className={`rounded-xl border p-4 ${
              faq.published ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">
                  {i + 1}. {faq.question}
                  {!faq.published && (
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                      Hidden
                    </span>
                  )}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{faq.answer}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => setModal({ faq })}
                  title="Edit"
                  aria-label="Edit"
                  className={btnIcon("secondary")}
                >
                  <Pencil size={15} />
                </button>
                <DeleteButton
                  url={`/api/admin/faqs/${faq.id}`}
                  confirmText="Delete this FAQ?"
                  iconOnly
                />
              </div>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            No FAQs yet.
          </p>
        )}
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.faq ? "Edit FAQ" : "Add FAQ"}
      >
        {modal !== null && (
          <FaqForm
            key={modal.faq?.id ?? "new"}
            faq={modal.faq}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default FaqsList;
