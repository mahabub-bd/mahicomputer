"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { FooterLinkGroupWithLinks } from "@/lib/data";
import { apiPost, apiPut } from "./api";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import { inputCls, labelCls, submitCls } from "./inputs";
import { btn, btnIcon } from "./buttonStyles";

interface FooterLinksListProps {
  groups: FooterLinkGroupWithLinks[];
}

interface LinkRow {
  name: string;
  href: string;
  order: number;
}

const FooterLinksList = ({ groups }: FooterLinksListProps) => {
  const [modal, setModal] = useState<{ group?: FooterLinkGroupWithLinks } | null>(null);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [busy, setBusy] = useState(false);

  const openModal = (group?: FooterLinkGroupWithLinks) => {
    setTitle(group?.title ?? "");
    setRows(
      group?.links.map((l, i) => ({ name: l.name, href: l.href, order: l.order ?? i })) ?? []
    );
    setModal({ group });
  };

  const setRow = (index: number, key: keyof LinkRow, value: string | number) =>
    setRows((r) => r.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        title,
        order: modal?.group?.order ?? 0,
        links: rows,
      };
      if (modal?.group) {
        await apiPut(`/api/admin/footer-links/${modal.group.id}`, payload);
        toast.success("Footer group updated");
      } else {
        await apiPost("/api/admin/footer-links", payload);
        toast.success("Footer group added");
      }
      setModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Footer links</h1>
          <p className="mt-1 text-sm text-slate-500">
            Link groups shown in the site footer
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className={btn("primary")}
        >
          <Plus size={16} />
          Add group
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <div
            key={g.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="min-w-0 truncate font-semibold text-slate-900">
                {g.title}
              </h2>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => openModal(g)}
                  title="Edit"
                  className={btn("secondary", "sm")}
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <DeleteButton
                  url={`/api/admin/footer-links/${g.id}`}
                  confirmText={`Delete group "${g.title}" and all its links?`}
                />
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {g.links.map((l) => (
                <li key={l.id} className="flex justify-between gap-4">
                  <span className="truncate">{l.name}</span>
                  <span className="truncate text-slate-400">{l.href}</span>
                </li>
              ))}
              {g.links.length === 0 && (
                <li className="text-slate-400">No links in this group.</li>
              )}
            </ul>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500 md:col-span-2">
            No footer groups yet.
          </p>
        )}
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.group ? `Edit: ${modal.group.title}` : "Add footer group"}
        wide
      >
        {modal !== null && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Group title *</label>
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Links</p>
              {rows.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={inputCls}
                    value={row.name}
                    placeholder="Name"
                    onChange={(e) => setRow(i, "name", e.target.value)}
                    required
                  />
                  <input
                    className={inputCls}
                    value={row.href}
                    placeholder="#about"
                    onChange={(e) => setRow(i, "href", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
                    className={`shrink-0 ${btnIcon("danger", "md")}`}
                    aria-label="Remove link"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setRows((r) => [...r, { name: "", href: "", order: r.length }])}
                className={btn("secondary", "sm")}
              >
                + Add link row
              </button>
            </div>

            <button type="submit" disabled={busy} className={submitCls}>
              {busy ? "Saving…" : modal?.group ? "Update group" : "Add group"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default FooterLinksList;
