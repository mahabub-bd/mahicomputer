"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Post } from "@/lib/types";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { inputCls, labelCls, submitCls } from "./inputs";

interface BlogFormProps {
  post?: Post;
  onSuccess?: () => void;
}

const empty = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  imageAlt: "",
  authorId: "",
  published: true,
};

const BlogForm = ({ post, onSuccess }: BlogFormProps) => {
  const editing = Boolean(post);
  const [form, setForm] = useState(
    post
      ? {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.imageUrl,
          imageAlt: post.imageAlt,
          authorId: post.authorId ?? "",
          published: post.published,
        }
      : empty
  );
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);

  // Author picker options come from the existing Instructor rows.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/instructors")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setAuthors(
            data.map((i: { id: string; name: string }) => ({
              id: i.id,
              name: i.name,
            }))
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = { ...form, authorId: form.authorId || null };
    try {
      if (editing) {
        await apiPut(`/api/admin/blogs/${post!.id}`, payload);
        toast.success("Blog updated");
      } else {
        await apiPost("/api/admin/blogs", form);
        toast.success("Blog created");
      }
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label className={labelCls}>Slug * (URL: /blogs/this-slug)</label>
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="lowercase letters, numbers and dashes"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>
          Excerpt (short summary shown on cards)
        </label>
        <textarea
          rows={2}
          className={inputCls}
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>
          Content (separate paragraphs with a blank line)
        </label>
        <textarea
          rows={10}
          className={inputCls}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="Paragraph 1…&#10;&#10;Paragraph 2…"
        />
      </div>

      <ImageUpload
        label="Cover image"
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

      <div className="max-w-xs">
        <label className={labelCls}>Author (Instructor)</label>
        <select
          className={inputCls}
          value={form.authorId}
          onChange={(e) => set("authorId", e.target.value)}
        >
          <option value="">— None —</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        Published
      </label>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={busy} className={submitCls}>
        {busy ? "Saving…" : editing ? "Update blog" : "Create blog"}
      </button>
    </form>
  );
};

export default BlogForm;
