"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Partner } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { inputCls, labelCls, submitCls } from "./inputs";

interface PartnerFormProps {
  partner?: Partner;
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
}

const PartnerForm = ({ partner, onSuccess }: PartnerFormProps) => {
  const router = useRouter();
  const editing = Boolean(partner);
  const [form, setForm] = useState({
    imageUrl: partner?.imageUrl ?? "",
    alt: partner?.alt ?? "",
    order: partner?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (editing) {
        await apiPut(`/api/admin/partners/${partner!.id}`, form);
        toast.success("Partner updated");
      } else {
        await apiPost("/api/admin/partners", form);
        toast.success("Partner created");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/partners");
      }
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
      toast.error(msg);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <div>
        <label className={labelCls}>Name / alt text</label>
        <input
          className={inputCls}
          value={form.alt}
          onChange={(e) => set("alt", e.target.value)}
          placeholder="nrb"
        />
      </div>
      <div>
        <label className={labelCls}>Display order</label>
        <input
          type="number"
          className={inputCls}
          value={form.order}
          onChange={(e) => set("order", Number(e.target.value))}
        />
      </div>
      <ImageUpload
        label="Logo"
        value={form.imageUrl}
        onChange={(url) => set("imageUrl", url)}
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : editing ? "Update partner" : "Create partner"}
      </button>
    </form>
  );
};

export default PartnerForm;
