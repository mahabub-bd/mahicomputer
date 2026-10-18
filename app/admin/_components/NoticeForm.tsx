"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Notice } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import { inputCls, labelCls, submitCls } from "./inputs";

interface NoticeFormProps {
  notice?: Notice;
  onSuccess?: () => void;
}

const toDateInput = (value?: Date | string) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
};

const NoticeForm = ({ notice, onSuccess }: NoticeFormProps) => {
  const [form, setForm] = useState({
    title: notice?.title ?? "",
    body: notice?.body ?? "",
    date: toDateInput(notice?.date),
    published: notice?.published ?? true,
    order: notice?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (notice) {
        await apiPut(`/api/admin/notices/${notice.id}`, form);
        toast.success("Notice updated");
      } else {
        await apiPost("/api/admin/notices", form);
        toast.success("Notice added");
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
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="ছুটির নোটিশ / Admission going on"
          required
        />
      </div>
      <div>
        <label className={labelCls}>Details</label>
        <textarea
          rows={5}
          className={inputCls}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder="বিস্তারিত লিখুন…"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Notice date</label>
          <input
            type="date"
            className={inputCls}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
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
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
        />
        Published (visible on the site)
      </label>
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : notice ? "Update notice" : "Add notice"}
      </button>
    </form>
  );
};

export default NoticeForm;
