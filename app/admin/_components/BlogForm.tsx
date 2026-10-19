"use client";

import { Checkbox, Field, Input, Select, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";
import type { Post } from "@/lib/types";
import { postSchema, type PostFormInput } from "@/lib/validators";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";

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
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<PostFormInput>(postSchema, {
    defaultValues: post
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
      : empty,
  });
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

  const onSubmit = handleSubmit(async (data) => {
    const payload = { ...data, authorId: data.authorId || null };
    try {
      if (post) {
        await apiPut(`/api/admin/blogs/${post.id}`, payload);
        toast.success("Blog updated");
      } else {
        await apiPost("/api/admin/blogs", payload);
        toast.success("Blog created");
      }
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError("root", { message: msg });
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title" required error={errors.title?.message}>
          <Input {...register("title")} aria-invalid={!!errors.title} />
        </Field>
        <Field
          label="Slug"
          required
          hint="URL: /blogs/this-slug"
          error={errors.slug?.message}
        >
          <Input
            {...register("slug", {
              setValueAs: (value) => String(value ?? "").toLowerCase(),
            })}
            aria-invalid={!!errors.slug}
          />
        </Field>
      </div>

      <Field
        label="Excerpt (short summary shown on cards)"
        error={errors.excerpt?.message}
      >
        <Textarea rows={2} {...register("excerpt")} />
      </Field>

      <Field
        label="Content (separate paragraphs with a blank line)"
        error={errors.content?.message}
      >
        <Textarea
          rows={10}
          {...register("content")}
          placeholder="Paragraph 1…&#10;&#10;Paragraph 2…"
        />
      </Field>

      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload
            label="Cover image"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <div className="max-w-xs">
        <Field label="Image alt text" error={errors.imageAlt?.message}>
          <Input {...register("imageAlt")} />
        </Field>
      </div>

      <div className="max-w-xs">
        <Field label="Author (Instructor)" error={errors.authorId?.message}>
          <Controller
            control={control}
            name="authorId"
            render={({ field }) => (
              <Select
                name={field.name}
                ref={field.ref}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                <option value="">— None —</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </Field>
      </div>

      <Controller
        control={control}
        name="published"
        render={({ field }) => (
          <Checkbox
            label="Published"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {errors.imageUrl?.message && (
        <p className="text-sm text-rose-600">{errors.imageUrl.message}</p>
      )}
      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}
      <SubmitButton busy={isSubmitting}>
        {editing ? "Update blog" : "Create blog"}
      </SubmitButton>
    </form>
  );
};

export default BlogForm;
