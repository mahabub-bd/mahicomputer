"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { apiDelete } from "./api";

interface DeleteButtonProps {
  url: string;
  label?: string;
  confirmText?: string;
}

const DeleteButton = ({
  url,
  label = "Delete",
  confirmText = "Are you sure? This cannot be undone.",
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
        className="flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        {busy ? "Deleting…" : label}
      </button>
      {error && <span className="ml-2 text-xs text-rose-600">{error}</span>}
    </span>
  );
};

export default DeleteButton;
