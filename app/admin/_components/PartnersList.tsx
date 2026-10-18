"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { Partner } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import PartnerForm from "./PartnerForm";

interface PartnersListProps {
  partners: Partner[];
}

const PartnersList = ({ partners }: PartnersListProps) => {
  const [modal, setModal] = useState<{ partner?: Partner } | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Partners</h1>
          <p className="mt-1 text-sm text-slate-500">
            Partner logos shown on the home page
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={16} />
          Add partner
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Alt text</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {partners.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex h-12 w-24 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-slate-50 p-1">
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt={p.alt}
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{p.alt}</td>
                <td className="px-4 py-3">{p.order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setModal({ partner: p })}
                      title="Edit"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <DeleteButton
                      url={`/api/admin/partners/${p.id}`}
                      confirmText={`Delete partner "${p.alt}"? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No partners yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.partner ? `Edit: ${modal.partner.alt}` : "Add partner"}
      >
        {modal !== null && (
          <PartnerForm
            key={modal.partner?.id ?? "new"}
            partner={modal.partner}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default PartnersList;
