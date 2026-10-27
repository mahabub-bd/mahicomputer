"use client";

import { Field, Input, SubmitButton } from "@/components/form/FormControls";
import { btn, btnIcon } from "@/components/form/buttonStyles";
import { useZodForm } from "@/components/form/useZodForm";
import type { NavLink } from "@/lib/types";
import { navLinkSchema, type NavLinkInput } from "@/lib/validators";
import { Menu, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeleteButton from "./DeleteButton";
import EmptyState from "./EmptyState";
import ListCard from "./ListCard";
import Modal from "./Modal";
import { apiPost, apiPut } from "./api";

interface NavLinksListProps {
  links: NavLink[];
}

interface NavLinkFormProps {
  link?: NavLink;
  /** Called after a successful save so the parent can close the modal. */
  onDone: () => void;
}

const NavLinkForm = ({ link, onDone }: NavLinkFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<NavLinkInput>(navLinkSchema, {
    defaultValues: {
      title: link?.title ?? "",
      href: link?.href ?? "",
      cssClass: link?.cssClass ?? "nothoverable",
      order: link?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (link) {
        await apiPut(`/api/admin/nav-links/${link.id}`, data);
        toast.success("Nav link updated");
      } else {
        await apiPost("/api/admin/nav-links", data);
        toast.success("Nav link added");
      }
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Title" required error={errors.title?.message}>
        <Input {...register("title")} aria-invalid={!!errors.title} />
      </Field>
      <Field label="Href" required hint="e.g. #about, /courses, notice" error={errors.href?.message}>
        <Input {...register("href")} aria-invalid={!!errors.href} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CSS class" error={errors.cssClass?.message}>
          <Input {...register("cssClass")} />
        </Field>
        <Field label="Display order" error={errors.order?.message}>
          <Input type="number" {...register("order")} />
        </Field>
      </div>
      <SubmitButton busy={isSubmitting}>
        {link ? "Update link" : "Add link"}
      </SubmitButton>
    </form>
  );
};

const NavLinksList = ({ links }: NavLinksListProps) => {
  const [modal, setModal] = useState<{ link?: NavLink } | null>(null);

  const openModal = (link?: NavLink) => setModal({ link });

  // Shared with the mobile card list below so the two views cannot drift.
  const actions = (l: NavLink) => (
    <div className="flex flex-wrap gap-1">
      <button
        onClick={() => openModal(l)}
        title="Edit"
        aria-label="Edit"
        className={btnIcon("secondary")}
      >
        <Pencil size={15} />
      </button>
      <DeleteButton
        url={`/api/admin/nav-links/${l.id}`}
        confirmText={`Delete "${l.title}"?`}
        iconOnly
      />
    </div>
  );

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
          className={btn("primary")}
        >
          <Plus size={16} />
          Add link
        </button>
      </div>

      {/* ---------- md and up: table ---------- */}
      <div className="admin-table-scroll hidden overflow-x-auto rounded-xl bg-white shadow-sm md:block">
        <table className="w-full min-w-200 text-left text-sm">
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
                <td colSpan={5} className="px-4 py-6">
                  <EmptyState icon={Menu} title="No nav links yet." />
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
          <ListCard
            key={l.id}
            title={l.title}
            subtitle={l.href}
            fields={[
              { label: "Class", value: l.cssClass },
              { label: "Order", value: l.order },
            ]}
            actions={actions(l)}
          />
        ))}

        {links.length === 0 && (
          <li>
            <EmptyState icon={Menu} title="No nav links yet." />
          </li>
        )}
      </ul>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.link ? `Edit: ${modal.link.title}` : "Add nav link"}
      >
        {modal !== null && (
          <NavLinkForm
            key={modal.link?.id ?? "new"}
            link={modal.link}
            onDone={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default NavLinksList;
