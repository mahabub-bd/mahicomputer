"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Course } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { inputCls, labelCls, submitCls } from "./inputs";

interface CourseFormProps {
  course?: Course;
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
  /** Without onSuccess: refresh in place instead of navigating back to the courses table. */
  stayAfterSave?: boolean;
}

/** Prisma Json columns hold string arrays; be defensive when parsing. */
const toStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const empty = {
  slug: "",
  title: "",
  tag: "",
  tagbg: "bg-fuchsia-800",
  imageUrl: "",
  imageAlt: "",
  lesson: 10,
  duration: "3",
  instructorName: "",
  instructorPhotoUrl: "",
  price: 0,
  rating: 4.9,
  reviewCount: 31,
  descriptionText: "",
  modulesText: "",
  prerequisite: "",
  seats: "",
  published: true,
  order: 0,
};

const CourseForm = ({ course, onSuccess, stayAfterSave }: CourseFormProps) => {
  const router = useRouter();
  const editing = Boolean(course);
  const [form, setForm] = useState(
    course
      ? {
          slug: course.slug,
          title: course.title,
          tag: course.tag,
          tagbg: course.tagbg,
          imageUrl: course.imageUrl,
          imageAlt: course.imageAlt,
          lesson: course.lesson,
          duration: course.duration,
          instructorName: course.instructorName,
          instructorPhotoUrl: course.instructorPhotoUrl,
          price: course.price,
          rating: course.rating,
          reviewCount: course.reviewCount,
          descriptionText: toStringArray(course.description).join("\n\n"),
          modulesText: toStringArray(course.modules).join("\n"),
          prerequisite: course.prerequisite,
          seats: course.seats,
          published: course.published,
          order: course.order,
        }
      : empty
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<string[]>([]);

  // Instructor picker options come from the existing instructors in the DB.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/instructors")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setInstructors(data.map((i: { name: string }) => i.name));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  /** Existing value stays selectable even if it no longer matches an instructor. */
  const instructorOptions = Array.from(
    new Set([form.instructorName, ...instructors].filter(Boolean))
  );

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      ...form,
      description: form.descriptionText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      modules: form.modulesText
        .split("\n")
        .map((m) => m.trim())
        .filter(Boolean),
    };
    delete (payload as Record<string, unknown>).descriptionText;
    delete (payload as Record<string, unknown>).modulesText;
    try {
      if (editing) {
        await apiPut(`/api/admin/courses/${course!.id}`, payload);
        toast.success("Course updated");
      } else {
        await apiPost("/api/admin/courses", payload);
        toast.success("Course created");
      }
      if (onSuccess) {
        onSuccess();
      } else if (stayAfterSave) {
        router.refresh();
      } else {
        router.push("/admin/courses");
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
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <label className={labelCls}>Slug * (URL: /courses/this-slug)</label>
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="lowercase letters, numbers and dashes"
          />
        </div>
        <div>
          <label className={labelCls}>Tag (e.g. Web Development)</label>
          <input
            className={inputCls}
            value={form.tag}
            onChange={(e) => set("tag", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Tag color (Tailwind bg class)</label>
          <input
            className={inputCls}
            value={form.tagbg}
            onChange={(e) => set("tagbg", e.target.value)}
            placeholder="bg-fuchsia-800"
          />
        </div>
        <div>
          <label className={labelCls}>Lessons</label>
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.lesson}
            onChange={(e) => set("lesson", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Duration (months)</label>
          <input
            className={inputCls}
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="3"
          />
        </div>
        <div>
          <label className={labelCls}>Instructor</label>
          {instructors.length > 0 ? (
            <select
              className={inputCls}
              value={form.instructorName}
              onChange={(e) => set("instructorName", e.target.value)}
            >
              <option value="">— None —</option>
              {instructorOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={inputCls}
              value={form.instructorName}
              onChange={(e) => set("instructorName", e.target.value)}
            />
          )}
        </div>
        <div>
          <label className={labelCls}>Price (BDT)</label>
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Rating (0–5, shown on card)</label>
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
        <div>
          <label className={labelCls}>Review count</label>
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.reviewCount}
            onChange={(e) => set("reviewCount", Number(e.target.value))}
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
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Published
          </label>
        </div>
      </div>

      <ImageUpload
        label="Course image"
        value={form.imageUrl}
        onChange={(url) => set("imageUrl", url)}
      />
      <div className="max-w-xs">
        <label className={labelCls}>Image alt text</label>
        <input
          className={inputCls}
          value={form.imageAlt}
          onChange={(e) => set("imageAlt", e.target.value)}
        />
      </div>
      <ImageUpload
        label="Instructor photo"
        value={form.instructorPhotoUrl}
        onChange={(url) => set("instructorPhotoUrl", url)}
      />

      <div>
        <label className={labelCls}>
          Description (separate paragraphs with a blank line)
        </label>
        <textarea
          rows={6}
          className={inputCls}
          value={form.descriptionText}
          onChange={(e) => set("descriptionText", e.target.value)}
          placeholder="Paragraph 1…&#10;&#10;Paragraph 2…"
        />
      </div>
      <div>
        <label className={labelCls}>
          Modules / syllabus (one per line)
        </label>
        <textarea
          rows={6}
          className={inputCls}
          value={form.modulesText}
          onChange={(e) => set("modulesText", e.target.value)}
          placeholder={"Module 1\nModule 2\nModule 3"}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className={labelCls}>Pre-requisite</label>
          <input
            className={inputCls}
            value={form.prerequisite}
            onChange={(e) => set("prerequisite", e.target.value)}
            placeholder="Basic English Knowledge"
          />
        </div>
        <div>
          <label className={labelCls}>Total seat</label>
          <input
            className={inputCls}
            value={form.seats}
            onChange={(e) => set("seats", e.target.value)}
            placeholder="10 students per batch."
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : editing ? "Update course" : "Create course"}
      </button>
    </form>
  );
};

export default CourseForm;
