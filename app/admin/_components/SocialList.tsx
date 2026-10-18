"use client";

import { useState } from "react";
import { Link2, Pencil, Plus } from "lucide-react";
import type { SocialLink } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import SocialForm from "./SocialForm";

interface SocialListProps {
  links: SocialLink[];
}

const SocialList = ({ links }: SocialListProps) => {
  const [modal, setModal] = useState<{ link?: SocialLink } | null>(null);

  // Shared by the md+ table and the phone card list so the two
  // views can never drift apart.
  const url = (s: SocialLink) => (
    <a
      href={s.link}
      target="_blank"
      className="flex items-center gap-1.5 text-blue-600 hover:underline"
    >
      <Link2 size={14} className="shrink-0" />
      <span className="truncate">{s.link}</span>
    </a>
  );

  const actions = (s: SocialLink) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setModal({ link: s })}
        title="Edit"
        className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
      >
        <Pencil size={15} />
        Edit
      </button>
      <DeleteButton
        url={`/api/admin/social/${s.id}`}
        confirmText="Delete this social link?"
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Social links</h1>
          <p className="mt-1 text-sm text-slate-500">
            Icons shown in the site footer
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 sm:w-auto"
        >
          <Plus size={16} />
          Add link
        </button>
      </div>

      {/* ---------- md and up: table ----------} */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {links.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  {s.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.icon} alt="" className="h-8 w-8 object-contain" />
                  )}
                </td>
                <td className="max-w-[360px] px-4 py-3">{url(s)}</td>
                <td className="px-4 py-3">{s.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">{actions(s)}</div>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No social links yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per link ----------}
          Each row becomes a stacked card: icon + truncated URL, the
          order, and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {links.map((s) => (
          <li key={s.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {s.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.icon}
                  alt=""
                  className="h-8 w-8 shrink-0 object-contain"
                />
              )}
              <div className="min-w-0 flex-1">{url(s)}</div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {s.order}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(s)}</div>
          </li>
        ))}

        {links.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No social links yet.
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.link ? "Edit social link" : "Add social link"}
      >
        {modal !== null && (
          <SocialForm
            key={modal.link?.id ?? "new"}
            link={modal.link}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default SocialList;
