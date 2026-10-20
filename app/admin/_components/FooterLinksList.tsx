"use client";

import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { FooterLinkGroupWithLinks } from "@/lib/data";
import { footerGroupSchema, type FooterGroupInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import { Button, Field, Input, SubmitButton } from "@/components/form/FormControls";
import { btnIcon } from "@/components/form/buttonStyles";
import { useZodForm } from "@/components/form/useZodForm";

interface FooterLinksListProps {
  groups: FooterLinkGroupWithLinks[];
}

interface FooterGroupFormProps {
  group?: FooterLinkGroupWithLinks;
  /** Called after a successful save so the parent can close the modal. */
  onDone: () => void;
}

const FooterGroupForm = ({ group, onDone }: FooterGroupFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<FooterGroupInput>(footerGroupSchema, {
    defaultValues: group
      ? {
          title: group.title,
          order: group.order ?? 0,
          links: group.links.map((l, i) => ({
            name: l.name,
            href: l.href,
            order: l.order ?? i,
          })),
        }
      : { title: "", order: 0, links: [] },
  });
  const rows = useFieldArray({ control, name: "links" });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (group) {
        await apiPut(`/api/admin/footer-links/${group.id}`, data);
        toast.success("Footer group updated");
      } else {
        await apiPost("/api/admin/footer-links", data);
        toast.success("Footer group added");
      }
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Group title" required error={errors.title?.message}>
        <Input {...register("title")} aria-invalid={!!errors.title} />
      </Field>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Links</p>
        {rows.fields.map((row, i) => (
          <div key={row.id} className="flex items-start gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <Input
                {...register(`links.${i}.name`)}
                placeholder="Name"
                aria-label="Link name"
                aria-invalid={!!errors.links?.[i]?.name}
              />
              {errors.links?.[i]?.name?.message && (
                <p className="text-xs text-rose-600">
                  {errors.links[i]?.name?.message}
                </p>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <Input
                {...register(`links.${i}.href`)}
                placeholder="#about"
                aria-label="Link href"
                aria-invalid={!!errors.links?.[i]?.href}
              />
              {errors.links?.[i]?.href?.message && (
                <p className="text-xs text-rose-600">
                  {errors.links[i]?.href?.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => rows.remove(i)}
              className={`shrink-0 ${btnIcon("danger", "md")}`}
              aria-label="Remove link"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            rows.append({ name: "", href: "", order: rows.fields.length })
          }
        >
          + Add link row
        </Button>
      </div>

      <SubmitButton busy={isSubmitting}>
        {group ? "Update group" : "Add group"}
      </SubmitButton>
    </form>
  );
};

const FooterLinksList = ({ groups }: FooterLinksListProps) => {
  const [modal, setModal] = useState<{ group?: FooterLinkGroupWithLinks } | null>(null);

  const openModal = (group?: FooterLinkGroupWithLinks) => setModal({ group });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Footer links</h1>
          <p className="mt-1 text-sm text-slate-500">
            Link groups shown in the site footer
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus size={16} />
          Add group
        </Button>
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
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openModal(g)}
                  title="Edit"
                  aria-label="Edit"
                >
                  <Pencil size={14} />
                </Button>
                <DeleteButton
                  url={`/api/admin/footer-links/${g.id}`}
                  confirmText={`Delete group "${g.title}" and all its links?`}
                  iconOnly
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
          <FooterGroupForm
            key={modal.group?.id ?? "new"}
            group={modal.group}
            onDone={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default FooterLinksList;
