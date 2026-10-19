"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Newsletter } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import { inputCls, labelCls, submitCls } from "./inputs";

interface NewsletterFormProps {
  newsletter?: Newsletter;
  onSuccess?: () => void;
}

const toDateInput = (value?: Date | string) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
};

const NewsletterForm = ({ newsletter, onSuccess }: NewsletterFormProps) => {
  const [form, setForm] = useState({
    title: newsletter?.title ?? "",
    body: newsletter?.body ?? "",
    date: toDateInput(newsletter?.date),
    published: newsletter?.published ?? true,
    order: newsletter?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (newsletter) {
        await apiPut(`/api/admin/newsletters/${newsletter.id}`, form);
        toast.success("Newsletter updated");
      } else {
        await apiPost("/api/admin/newsletters", form);
        toast.success("Newsletter added");
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
        <label className={labelCls}>Title *</label>
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="October newsletter — new batches, offers and updates"
          required
        />
      </div>
      <div>
        <label className={labelCls}>Body</label>
        <textarea
          rows={6}
          className={inputCls}
          value={form.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="বিস্তারিত লিখুন…"
        />
        <p className="mt-1 text-xs text-slate-400">
          Blank lines separate paragraphs on the public page.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Issue date</label>
          <input
            type="date"
            className={inputCls}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
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
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        Published (visible on the site)
      </label>
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : newsletter ? "Update newsletter" : "Add newsletter"}
      </button>
    </form>
  );
};

export default NewsletterForm;
