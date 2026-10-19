"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { Course } from "@/lib/types";
import { courseFormSchema, type CourseFormInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { Checkbox, Field, Input, Select, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

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
  instructorId: "",
  categoryId: "",
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
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<CourseFormInput>(courseFormSchema, {
    defaultValues: course
      ? {
          slug: course.slug,
          title: course.title,
          tag: course.tag,
          tagbg: course.tagbg,
          imageUrl: course.imageUrl,
          imageAlt: course.imageAlt,
          lesson: course.lesson,
          duration: course.duration,
          instructorId: course.instructorId ?? "",
          categoryId: course.categoryId ?? "",
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
      : empty,
  });
  const [instructors, setInstructors] = useState<{ id: string; name: string }[]>(
    []
  );
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );

  // Instructor/category picker options come from the existing DB rows.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/instructors")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setInstructors(
            data.map((i: { id: string; name: string }) => ({
              id: i.id,
              name: i.name,
            }))
          );
        }
      })
      .catch(() => {});
    fetch("/api/admin/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setCategories(
            data.map((c: { id: string; title: string }) => ({
              id: c.id,
              title: c.title,
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
    const { descriptionText, modulesText, ...rest } = data;
    const payload = {
      ...rest,
      instructorId: rest.instructorId || null,
      categoryId: rest.categoryId || null,
      description: descriptionText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      modules: modulesText
        .split("\n")
        .map((m) => m.trim())
        .filter(Boolean),
    };
    try {
      if (course) {
        await apiPut(`/api/admin/courses/${course.id}`, payload);
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
      setError("root", { message: msg });
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Title" required error={errors.title?.message}>
          <Input {...register("title")} aria-invalid={!!errors.title} />
        </Field>
        <Field
          label="Slug"
          required
          hint="URL: /courses/this-slug"
          error={errors.slug?.message}
        >
          <Input
            {...register("slug", {
              setValueAs: (value) => String(value ?? "").toLowerCase(),
            })}
            aria-invalid={!!errors.slug}
          />
        </Field>
        <Field label="Tag (e.g. Web Development)" error={errors.tag?.message}>
          <Input {...register("tag")} />
        </Field>
        <Field label="Tag color (Tailwind bg class)" error={errors.tagbg?.message}>
          <Input {...register("tagbg")} placeholder="bg-fuchsia-800" />
        </Field>
        <Field label="Lessons" error={errors.lesson?.message}>
          <Input type="number" min={0} {...register("lesson")} />
        </Field>
        <Field label="Duration (months)" error={errors.duration?.message}>
          <Input {...register("duration")} placeholder="3" />
        </Field>
        <Field label="Instructor" error={errors.instructorId?.message}>
          <Controller
            control={control}
            name="instructorId"
            render={({ field }) => (
              <Select
                name={field.name}
                ref={field.ref}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                <option value="">— None —</option>
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </Field>
        <Field label="Category" error={errors.categoryId?.message}>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                name={field.name}
                ref={field.ref}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
            )}
          />
        </Field>
        <Field label="Price (BDT)" error={errors.price?.message}>
          <Input type="number" min={0} {...register("price")} />
        </Field>
        <Field label="Rating (0–5, shown on card)" error={errors.rating?.message}>
          <Input type="number" min={0} max={5} step={0.1} {...register("rating")} />
        </Field>
        <Field label="Review count" error={errors.reviewCount?.message}>
          <Input type="number" min={0} {...register("reviewCount")} />
        </Field>
        <Field label="Display order" error={errors.order?.message}>
          <Input type="number" {...register("order")} />
        </Field>
        <div className="flex items-end">
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
        </div>
      </div>

      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload
            label="Course image"
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

      <Field
        label="Description (separate paragraphs with a blank line)"
        error={errors.descriptionText?.message}
      >
        <Textarea
          rows={6}
          {...register("descriptionText")}
          placeholder="Paragraph 1…&#10;&#10;Paragraph 2…"
        />
      </Field>
      <Field
        label="Modules / syllabus (one per line)"
        error={errors.modulesText?.message}
      >
        <Textarea
          rows={6}
          {...register("modulesText")}
          placeholder={"Module 1\nModule 2\nModule 3"}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Pre-requisite" error={errors.prerequisite?.message}>
          <Input {...register("prerequisite")} placeholder="Basic English Knowledge" />
        </Field>
        <Field label="Total seat" error={errors.seats?.message}>
          <Input {...register("seats")} placeholder="10 students per batch." />
        </Field>
      </div>

      {errors.imageUrl?.message && (
        <p className="text-sm text-rose-600">{errors.imageUrl.message}</p>
      )}
      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}
      <SubmitButton busy={isSubmitting}>
        {editing ? "Update course" : "Create course"}
      </SubmitButton>
    </form>
  );
};

export default CourseForm;
