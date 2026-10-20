"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { apiDelete } from "./api";
import { btn, btnIcon } from "@/components/form/buttonStyles";

interface DeleteButtonProps {
  url: string;
  label?: string;
  confirmText?: string;
  /** Icon-only square button (with tooltip) for tight table rows. */
  iconOnly?: boolean;
}

const DeleteButton = ({
  url,
  label = "Delete",
  confirmText = "Are you sure? This cannot be undone.",
  iconOnly = false,
}: DeleteButtonProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    setError(null);
    try {
      await apiDelete(url);
      toast.success(label === "Delete" ? "Deleted" : `${label}d`);
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <span>
      <button
        onClick={onDelete}
        disabled={busy}
        title={label}
        aria-label={label}
        className={iconOnly ? btnIcon("danger") : btn("danger", "sm")}
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        {!iconOnly && (busy ? "Deleting…" : label)}
      </button>
      {error && <span className="ml-2 text-xs text-rose-600">{error}</span>}
    </span>
  );
};

export default DeleteButton;
