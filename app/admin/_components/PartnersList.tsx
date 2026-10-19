"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { Partner } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import PartnerForm from "./PartnerForm";
import { btn } from "./buttonStyles";

interface PartnersListProps {
  partners: Partner[];
}

const PartnersList = ({ partners }: PartnersListProps) => {
  const [modal, setModal] = useState<{ partner?: Partner } | null>(null);

  const actions = (p: Partner) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setModal({ partner: p })}
        title="Edit"
        className={btn("secondary", "sm")}
      >
        <Pencil size={15} />
        Edit
      </button>
      <DeleteButton
        url={`/api/admin/partners/${p.id}`}
        confirmText={`Delete partner "${p.alt}"? This cannot be undone.`}
      />
    </div>
  );

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
          className={btn("primary")}
        >
          <Plus size={16} />
          Add partner
        </button>
      </div>

      {/* ---------- md and up: table ----------} */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
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
                  <div className="flex justify-end">{actions(p)}</div>
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

      {/* ---------- below md: one card per partner ----------}
          Each row becomes a stacked card: logo box + alt text, the
          order, and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {partners.map((p) => (
          <li key={p.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-slate-50 p-1">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.alt}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{p.alt}</p>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {p.order}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(p)}</div>
          </li>
        ))}

        {partners.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No partners yet.
          </li>
        )}
      </ul>

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
