"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Instructor } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { inputCls, labelCls, submitCls } from "./inputs";

interface InstructorFormProps {
  instructor?: Instructor;
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
}

const InstructorForm = ({ instructor, onSuccess }: InstructorFormProps) => {
  const router = useRouter();
  const editing = Boolean(instructor);
  const [form, setForm] = useState({
    name: instructor?.name ?? "",
    description: instructor?.description ?? "",
    imageUrl: instructor?.imageUrl ?? "",
    order: instructor?.order ?? 0,
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
        await apiPut(`/api/admin/instructors/${instructor!.id}`, form);
        toast.success("Instructor updated");
      } else {
        await apiPost("/api/admin/instructors", form);
        toast.success("Instructor created");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/instructors");
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
        <label className={labelCls}>Name *</label>
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>
      <div>
        <label className={labelCls}>Designation / description</label>
        <input
          className={inputCls}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Web Developer"
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
        label="Photo (high-res recommended: 600×750px min — small images look blurry in the cards)"
        value={form.imageUrl}
        onChange={(url) => set("imageUrl", url)}
      />
      <p className="text-xs text-slate-400">
        Portrait crop, 4:5 ratio. Photos smaller than ~400px wide will appear soft/blurry on the
        site.
      </p>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : editing ? "Update instructor" : "Create instructor"}
      </button>
    </form>
  );
};

export default InstructorForm;
