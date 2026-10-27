"use client";

import { btn, btnIcon } from "@/components/form/buttonStyles";
import type { SocialLink } from "@/lib/types";
import { Link2, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import EmptyState from "./EmptyState";
import ListCard, { CardThumb } from "./ListCard";
import Modal from "./Modal";
import SocialForm from "./SocialForm";

interface SocialListProps {
  links: SocialLink[];
  /** Embed mode: hides the page header (title/description) since the host
      page provides its own section heading; keeps the "Add link" button. */
  embedded?: boolean;
}

const SocialList = ({ links, embedded = false }: SocialListProps) => {
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
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => setModal({ link: s })}
        title="Edit"
        aria-label="Edit"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/social/${s.id}`}
        confirmText="Delete this social link?"
        iconOnly
      />
    </div>
  );

  return (
    <div>
      {embedded ? (
        <div className="mb-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setModal({})}
            className={btn("secondary", "sm")}
          >
            <Plus size={14} />
            Add link
          </button>
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Social links</h1>
            <p className="mt-1 text-sm text-slate-500">
              Icons shown in the site footer
            </p>
          </div>
          <button
            onClick={() => setModal({})}
            className={btn("primary")}
          >
            <Plus size={16} />
            Add link
          </button>
        </div>
      )}

      {/* ---------- md and up: table ----------} */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-170 text-left text-sm">
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
                    <img src={s.icon} alt="" loading="lazy" decoding="async"
                      className="h-8 w-8 object-contain" />
                  )}
                </td>
                <td className="max-w-90 px-4 py-3">{url(s)}</td>
                <td className="px-4 py-3">{s.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">{actions(s)}</div>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6">
                  <EmptyState icon={Link2} title="No social links yet." />
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
          <ListCard
            key={s.id}
            title={url(s)}
            media={s.icon ? <CardThumb src={s.icon} fit="contain" /> : undefined}
            fields={[{ label: "Order", value: s.order }]}
            actions={actions(s)}
          />
        ))}

        {links.length === 0 && (
          <li>
            <EmptyState icon={Link2} title="No social links yet." />
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
