"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import type { NavLink } from "@/lib/types";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import { apiPost, apiPut } from "./api";
import { inputCls, labelCls, submitCls } from "./inputs";
import { btn } from "./buttonStyles";

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

  // Shared with the mobile card list below so the two views cannot drift.
  const actions = (l: NavLink) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => openModal(l)}
        title="Edit"
        className={btn("secondary", "sm")}
      >
        <Pencil size={15} />
        Edit
      </button>
      <DeleteButton
        url={`/api/admin/nav-links/${l.id}`}
        confirmText={`Delete "${l.title}"?`}
      />
    </div>
  );

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
          className={`w-full sm:w-auto ${btn("primary")}`}
        >
          <Plus size={16} />
          Add link
        </button>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-[800px] text-left text-sm">
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
                  <div className="flex justify-end">{actions(l)}</div>
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

      {/* ---------- below md: one card per link ----------
          Five columns are unusable at phone widths, so each row becomes
          a stacked card: title, the target href, a class / order grid
          and a wrapping action row. */}
      <ul className="space-y-3 md:hidden">
        {links.map((l) => (
          <li key={l.id} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="min-w-0 truncate font-medium text-slate-900">
              {l.title}
            </p>
            <p className="truncate text-xs text-slate-400">{l.href}</p>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Class
                </dt>
                <dd className="mt-0.5 truncate text-sm font-medium text-slate-700">
                  {l.cssClass}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                  Order
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-700">
                  {l.order}
                </dd>
              </div>
            </dl>

            <div className="mt-3">{actions(l)}</div>
          </li>
        ))}

        {links.length === 0 && (
          <li className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No nav links yet.
          </li>
        )}
      </ul>

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
