"use client";

import { ArrowLeft, ExternalLink, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiDelete } from "./api";
import { dangerBtnCls, primaryBtnCls, secondaryBtnCls } from "@/components/form/buttonStyles";

export interface DetailActionsProps {
  /** List page the back button returns to. */
  backHref: string;
  backLabel?: string;

  viewHref?: string;
  viewLabel?: string;

  editHref?: string;
  editLabel?: string;
  deleteUrl?: string;
  deleteLabel?: string;
  deleteConfirm?: string;

  afterDeleteHref?: string;
}


const DetailActions = ({
  backHref,
  backLabel = "Back to list",
  viewHref,
  viewLabel = "View on site",
  editHref,
  editLabel = "Edit",
  deleteUrl,
  deleteLabel = "Delete",
  deleteConfirm = "Are you sure? This cannot be undone.",
  afterDeleteHref,
}: DetailActionsProps) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    if (!deleteUrl || !window.confirm(deleteConfirm)) return;
    setDeleting(true);
    try {
      await apiDelete(deleteUrl);
      toast.success("Deleted");
      if (afterDeleteHref) {
        router.push(afterDeleteHref);
      } else {
        setDeleting(false);
        router.refresh();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      toast.error(msg);
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2.5">
      <Link
        href={backHref}
        className={`group ${secondaryBtnCls}`}
        title={backLabel}
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
          aria-hidden
        />
        {backLabel}
      </Link>

      {viewHref && (
        <Link
          href={viewHref}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryBtnCls}
          title={viewLabel}
        >
          <ExternalLink size={15} aria-hidden />
          {viewLabel}
        </Link>
      )}

      {deleteUrl && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          title={deleteLabel}
          className={dangerBtnCls}
        >
          {deleting ? (
            <Loader2 size={15} className="animate-spin" aria-hidden />
          ) : (
            <Trash2 size={15} aria-hidden />
          )}
          {deleting ? "Deleting…" : deleteLabel}
        </button>
      )}

      {editHref && (
        <Link href={editHref} className={primaryBtnCls} title={editLabel}>
          <Pencil size={15} aria-hidden />
          {editLabel}
        </Link>
      )}
    </div>
  );
};

export default DetailActions;
