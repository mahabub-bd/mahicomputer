"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Faq } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import { inputCls, labelCls, submitCls } from "./inputs";

interface FaqFormProps {
  faq?: Faq;
  onSuccess?: () => void;
}

const FaqForm = ({ faq, onSuccess }: FaqFormProps) => {
  const [form, setForm] = useState({
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    published: faq?.published ?? true,
    order: faq?.order ?? 0,
  });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (faq) {
        await apiPut(`/api/admin/faqs/${faq.id}`, form);
        toast.success("FAQ updated");
      } else {
        await apiPost("/api/admin/faqs", form);
        toast.success("FAQ added");
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
        <label className={labelCls}>Question *</label>
        <input
          className={inputCls}
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          placeholder="ভর্তির জন্য কী কী লাগবে?"
          required
        />
      </div>
      <div>
        <label className={labelCls}>Answer *</label>
        <textarea
          rows={5}
          className={inputCls}
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))
          }
          placeholder="উত্তর লিখুন…"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
            Published (visible on the site)
          </label>
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
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : faq ? "Update FAQ" : "Add FAQ"}
      </button>
    </form>
  );
};

export default FaqForm;
