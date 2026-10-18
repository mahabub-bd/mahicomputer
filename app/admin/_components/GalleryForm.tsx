"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { GalleryItem } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { inputCls, labelCls, submitCls } from "./inputs";

interface GalleryFormProps {
  item?: GalleryItem;
  onSuccess?: () => void;
}

const GalleryForm = ({ item, onSuccess }: GalleryFormProps) => {
  const [form, setForm] = useState({
    imageUrl: item?.imageUrl ?? "",
    alt: item?.alt ?? "",
    order: item?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (item) {
        await apiPut(`/api/admin/gallery/${item.id}`, form);
        toast.success("Gallery image updated");
      } else {
        await apiPost("/api/admin/gallery", form);
        toast.success("Gallery image added");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ImageUpload
        label="Image"
        value={form.imageUrl}
        onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
      />
      <div>
        <label className={labelCls}>Alt text</label>
        <input
          className={inputCls}
          value={form.alt}
          onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
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
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : item ? "Update image" : "Add image"}
      </button>
    </form>
  );
};

export default GalleryForm;
