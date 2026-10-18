"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import type { Notice } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import NoticeForm from "./NoticeForm";

interface NoticesListProps {
  notices: Notice[];
}

const NoticesList = ({ notices }: NoticesListProps) => {
  const [modal, setModal] = useState<{ notice?: Notice } | null>(null);

  const fmtDate = (value: Date | string) =>
    new Date(value).toLocaleDateString("en-GB", { dateStyle: "medium" });

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
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={16} />
          Add notice
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Title / details</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notices.map((n) => (
              <tr key={n.id} className="hover:bg-slate-50 align-top">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmtDate(n.date)}</td>
                <td className="max-w-[420px] px-4 py-3">
                  <p className="font-medium text-slate-900">{n.title}</p>
                  {n.body && (
                    <p className="mt-0.5 line-clamp-2 whitespace-pre-wrap text-slate-500">
                      {n.body}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {n.published ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{n.order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setModal({ notice: n })}
                      title="Edit"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <DeleteButton
                      url={`/api/admin/notices/${n.id}`}
                      confirmText="Delete this notice?"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No notices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
