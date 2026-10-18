"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { SocialLink } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { inputCls, labelCls, submitCls } from "./inputs";

interface SocialFormProps {
  link?: SocialLink;
  onSuccess?: () => void;
}

const SocialForm = ({ link, onSuccess }: SocialFormProps) => {
  const [form, setForm] = useState({
    icon: link?.icon ?? "",
    link: link?.link ?? "",
    order: link?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (link) {
        await apiPut(`/api/admin/social/${link.id}`, form);
        toast.success("Social link updated");
      } else {
        await apiPost("/api/admin/social", form);
        toast.success("Social link added");
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
      <div>
        <label className={labelCls}>URL *</label>
        <input
          className={inputCls}
          value={form.link}
          onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          placeholder="https://facebook.com/..."
          required
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
      <ImageUpload
        label="Icon"
        value={form.icon}
        onChange={(url) => setForm((f) => ({ ...f, icon: url }))}
      />
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : link ? "Update link" : "Add link"}
      </button>
    </form>
  );
};

export default SocialForm;
