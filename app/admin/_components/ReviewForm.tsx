"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Course, Review } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { inputCls, labelCls, submitCls } from "./inputs";

interface ReviewFormProps {
  review?: Review;
  /** Course titles offered in the Course dropdown. */
  courses: Course[];
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
}

const empty = {
  name: "",
  title: "Student",
  content: "",
  course: "",
  rating: 5,
  imageUrl: "",
  order: 0,
};

const ReviewForm = ({ review, courses, onSuccess }: ReviewFormProps) => {
  const router = useRouter();
  const editing = Boolean(review);
  const [form, setForm] = useState(
    review
      ? {
          name: review.name,
          title: review.title,
          content: review.content,
          course: review.course,
          rating: review.rating,
          imageUrl: review.imageUrl,
          order: review.order,
        }
      : empty
  );
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
        await apiPut(`/api/admin/reviews/${review!.id}`, form);
        toast.success("Review updated");
      } else {
        await apiPost("/api/admin/reviews", form);
        toast.success("Review created");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/reviews");
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
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label className={labelCls}>Designation</label>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Student"
          />
        </div>
        <div>
          <label className={labelCls}>Course</label>
          <select
            className={inputCls}
            value={form.course}
            onChange={(e) => set("course", e.target.value)}
          >
            <option value="">No course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
            {/* Keep a saved value selectable when its course was renamed or deleted */}
            {review?.course &&
              !courses.some((c) => c.title === review.course) && (
                <option value={review.course}>{review.course}</option>
              )}
          </select>
        </div>
        <div>
          <label className={labelCls}>Rating (0–5)</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            className={inputCls}
            value={form.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Review content *</label>
        <textarea
          className={inputCls}
          rows={4}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          required
        />
      </div>

      <div className="max-w-xs">
        <label className={labelCls}>Display order</label>
        <input
          type="number"
          className={inputCls}
          value={form.order}
          onChange={(e) => set("order", Number(e.target.value))}
        />
      </div>

      <ImageUpload
        label="Student photo"
        value={form.imageUrl}
        onChange={(url) => set("imageUrl", url)}
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : editing ? "Update review" : "Create review"}
      </button>
    </form>
  );
};

export default ReviewForm;
