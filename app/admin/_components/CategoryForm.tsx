"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { inputCls, labelCls, submitCls } from "./inputs";

interface CategoryFormProps {
  category?: Category;
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
}

const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const router = useRouter();
  const editing = Boolean(category);
  const [form, setForm] = useState({
    title: category?.title ?? "",
    imageUrl: category?.imageUrl ?? "",
    alt: category?.alt ?? "",
    order: category?.order ?? 0,
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
        await apiPut(`/api/admin/categories/${category!.id}`, form);
        toast.success("Category updated");
      } else {
        await apiPost("/api/admin/categories", form);
        toast.success("Category created");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/categories");
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
        <label className={labelCls}>Title *</label>
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>
      <div>
        <label className={labelCls}>Alt text</label>
        <input
          className={inputCls}
          value={form.alt}
          onChange={(e) => set("alt", e.target.value)}
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
        label="Icon / image"
        value={form.imageUrl}
        onChange={(url) => set("imageUrl", url)}
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : editing ? "Update category" : "Create category"}
      </button>
    </form>
  );
};

export default CategoryForm;
