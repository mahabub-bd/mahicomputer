"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import type { NavLink } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import { apiPost, apiPut } from "./api";
import { inputCls, labelCls, submitCls } from "./inputs";

interface NavLinksListProps {
  links: NavLink[];
}

const NavLinksList = ({ links }: NavLinksListProps) => {
  const [modal, setModal] = useState<{ link?: NavLink } | null>(null);
  const [form, setForm] = useState({ title: "", href: "", cssClass: "nothoverable", order: 0 });
  const [busy, setBusy] = useState(false);

  const openModal = (link?: NavLink) => {
    setForm({
      title: link?.title ?? "",
      href: link?.href ?? "",
      cssClass: link?.cssClass ?? "nothoverable",
      order: link?.order ?? 0,
    });
    setModal({ link });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (modal?.link) {
        await apiPut(`/api/admin/nav-links/${modal.link.id}`, form);
        toast.success("Nav link updated");
      } else {
        await apiPost("/api/admin/nav-links", form);
        toast.success("Nav link added");
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
          <h1 className="text-2xl font-semibold text-slate-900">Nav links</h1>
          <p className="mt-1 text-sm text-slate-500">
            Top navigation menu items
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          <Plus size={16} />
          Add link
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Href</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {links.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{l.title}</td>
                <td className="px-4 py-3 text-slate-500">{l.href}</td>
                <td className="px-4 py-3 text-slate-500">{l.cssClass}</td>
                <td className="px-4 py-3">{l.order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(l)}
                      title="Edit"
                      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <DeleteButton
                      url={`/api/admin/nav-links/${l.id}`}
                      confirmText={`Delete "${l.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No nav links yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.link ? `Edit: ${modal.link.title}` : "Add nav link"}
      >
        {modal !== null && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Href * (e.g. #about, /courses, notice)</label>
              <input
                className={inputCls}
                value={form.href}
                onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>CSS class</label>
                <input
                  className={inputCls}
                  value={form.cssClass}
                  onChange={(e) => setForm((f) => ({ ...f, cssClass: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Display order</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                />
              </div>
            </div>
            <button type="submit" disabled={busy} className={submitCls}>
              {busy ? "Saving…" : modal?.link ? "Update link" : "Add link"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default NavLinksList;
