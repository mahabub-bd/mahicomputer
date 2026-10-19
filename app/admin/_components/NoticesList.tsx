"use client";

import type { Notice } from "@/lib/types";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import NoticeForm from "./NoticeForm";
import { btn } from "./buttonStyles";

interface NoticesListProps {
  notices: (Notice & { publishedBy: { name: string } | null })[];
}

const NoticesList = ({ notices }: NoticesListProps) => {
  const [modal, setModal] = useState<{ notice?: Notice } | null>(null);

  const fmtDate = (value: Date | string) =>
    new Date(value).toLocaleDateString("en-GB", { dateStyle: "medium" });

  // Shared by the md+ table and the phone card list so the two
  // views can never drift apart.
  const statusPill = (published: boolean) =>
    published ? (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
        Published
      </span>
    ) : (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
        Hidden
      </span>
    );

  const actions = (n: Notice) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setModal({ notice: n })}
        title="Edit"
        className={btn("secondary", "sm")}
      >
        <Pencil size={15} />
        Edit
      </button>
      <DeleteButton
        url={`/api/admin/notices/${n.id}`}
        confirmText="Delete this notice?"
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Notice board shown on the site&apos;s notice page
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className={`w-full sm:w-auto ${btn("primary")}`}
        >
          <Plus size={16} />
          Add notice
        </button>
      </div>

      {/* ---------- md and up: table ----------}
          Six columns scroll inside the card instead of squeezing
          on tablet. */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Title / details</th>
              <th className="px-4 py-3">Published by</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notices.map((n) => (
              <tr key={n.id} className="hover:bg-slate-50 align-top">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmtDate(n.date)}</td>
                <td className="max-w-105 px-4 py-3">
                  <p className="font-medium text-slate-900">{n.title}</p>
                  {n.body && (
                    <p className="mt-0.5 line-clamp-2 whitespace-pre-wrap text-slate-500">
                      {n.body}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {n.publishedBy?.name || "—"}
                </td>
                <td className="px-4 py-3">{statusPill(n.published)}</td>
                <td className="px-4 py-3">{n.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">{actions(n)}</div>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No notices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per notice ----------}
          A six-column table is unusable at phone widths, so each row
          becomes a stacked card: title + status pill, date, clamped
          body, then a publisher / order grid and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {notices.map((n) => (
          <li key={n.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 flex-1 truncate font-medium text-slate-900">
                {n.title}
              </p>
              <span className="shrink-0">{statusPill(n.published)}</span>
            </div>
            <p className="truncate text-xs text-slate-400">{fmtDate(n.date)}</p>
            {n.body && (
              <p className="mt-0.5 line-clamp-3 whitespace-pre-wrap text-xs text-slate-500">
                {n.body}
              </p>
            )}

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Published by
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium text-slate-700">
                  {n.publishedBy?.name || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {n.order}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(n)}</div>
          </li>
        ))}

        {notices.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No notices yet.
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.notice ? "Edit notice" : "Add notice"}
      >
        {modal !== null && (
          <NoticeForm
            key={modal.notice?.id ?? "new"}
            notice={modal.notice}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default NoticesList;
