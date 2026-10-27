"use client";

import { btn, btnIcon } from "@/components/form/buttonStyles";
import type { Newsletter } from "@/lib/types";
import { Pencil, Plus, Send } from "lucide-react";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import EmptyState from "./EmptyState";
import ListCard from "./ListCard";
import Modal from "./Modal";
import NewsletterForm from "./NewsletterForm";

interface NewslettersListProps {
  newsletters: (Newsletter & { publishedBy: { name: string } | null })[];
}

const NewslettersList = ({ newsletters }: NewslettersListProps) => {
  const [modal, setModal] = useState<{ newsletter?: Newsletter } | null>(null);

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

  const actions = (n: Newsletter) => (
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => setModal({ newsletter: n })}
        title="Edit"
        aria-label="Edit"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/newsletters/${n.id}`}
        confirmText="Delete this newsletter?"
        iconOnly
      />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Newsletters</h1>
          <p className="mt-1 text-sm text-slate-500">
            Newsletter issues shown on the site&apos;s /newsletters page
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className={btn("primary")}
        >
          <Plus size={16} />
          Add newsletter
        </button>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-220 text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Title / body</th>
              <th className="px-4 py-3">Published by</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {newsletters.map((n) => (
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
            {newsletters.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6">
                  <EmptyState icon={Send} title="No newsletters yet." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- below md: one card per newsletter ---------- */}
      <ul className="space-y-3 md:hidden">
        {newsletters.map((n) => (
          <ListCard
            key={n.id}
            title={n.title}
            subtitle={fmtDate(n.date)}
            badges={statusPill(n.published)}
            body={
              n.body ? (
                <p className="line-clamp-3 whitespace-pre-wrap text-xs text-slate-500">
                  {n.body}
                </p>
              ) : undefined
            }
            fields={[
              { label: "Published by", value: n.publishedBy?.name || "—" },
              { label: "Order", value: n.order },
            ]}
            actions={actions(n)}
          />
        ))}

        {newsletters.length === 0 && (
          <li>
            <EmptyState icon={Send} title="No newsletters yet." />
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.newsletter ? `Edit: ${modal.newsletter.title}` : "Add newsletter"}
        wide
      >
        {modal !== null && (
          <NewsletterForm
            key={modal.newsletter?.id ?? "new"}
            newsletter={modal.newsletter}
            onSuccess={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default NewslettersList;
