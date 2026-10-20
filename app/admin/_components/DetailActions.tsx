"use client";

import { ArrowLeft, ExternalLink, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiDelete } from "./api";
import { btnIcon } from "@/components/form/buttonStyles";

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
        aria-label={backLabel}
        title={backLabel}
        className={btnIcon("secondary")}
      >
        <ArrowLeft size={16} aria-hidden />
      </Link>

      {viewHref && (
        <Link
          href={viewHref}
          target="_blank"
          rel="noopener noreferrer"
          className={btnIcon("secondary")}
          aria-label={viewLabel}
          title={viewLabel}
        >
          <ExternalLink size={15} aria-hidden />
        </Link>
      )}

      {deleteUrl && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label={deleteLabel}
          title={deleting ? "Deleting…" : deleteLabel}
          className={btnIcon("danger")}
        >
          {deleting ? (
            <Loader2 size={15} className="animate-spin" aria-hidden />
          ) : (
            <Trash2 size={15} aria-hidden />
          )}
        </button>
      )}

      {editHref && (
        <Link
          href={editHref}
          className={btnIcon("primary")}
          aria-label={editLabel}
          title={editLabel}
        >
          <Pencil size={15} aria-hidden />
        </Link>
      )}
    </div>
  );
};

export default DetailActions;
