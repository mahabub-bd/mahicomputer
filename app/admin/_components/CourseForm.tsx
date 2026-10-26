"use client";

import { Button, Checkbox, Field, Input, Select, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";
import { ADMISSION_META, ADMISSION_ORDER } from "@/lib/admission";
import type { Course } from "@/lib/types";
import { courseFormSchema, type CourseFormInput } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";

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

const toNumberArray = (value: unknown): number[] =>
  Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
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
  installments: 1,
  installmentPlan: [],
  rating: 4.9,
  reviewCount: 31,
  descriptionText: "",
  modulesText: "",
  prerequisite: "",
  seats: "",
  admission: "OPEN" as const,
  published: true,
  order: 0,
};

/** Card wrapper giving each form group a consistent modal-friendly look. */
const Section = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`rounded-2xl border border-slate-200 bg-slate-50/60 p-4 ${className}`}
  >
    <p className="mb-3 border-b border-slate-200 pb-2 text-[12px] font-bold uppercase tracking-wider text-slate-600">
      {title}
    </p>
    <div className="space-y-3">{children}</div>
  </section>
);

const CourseForm = ({ course, onSuccess, stayAfterSave }: CourseFormProps) => {
  const router = useRouter();
  const editing = Boolean(course);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
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
          installments: course.installments,
          installmentPlan: toNumberArray(course.installmentPlan),
          rating: course.rating,
          reviewCount: course.reviewCount,
          descriptionText: toStringArray(course.description).join("\n\n"),
          modulesText: toStringArray(course.modules).join("\n"),
          prerequisite: course.prerequisite,
          seats: course.seats,
          admission: course.admission,
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
  // Primitive arrays are not supported by useFieldArray's typing, so the
  // installment rows are managed directly with watch + setValue.
  const planRows = (watch("installmentPlan") as number[] | undefined) ?? [];
  const planTotal = planRows.reduce((sum, a) => sum + (Number(a) || 0), 0);
  const price = Number(watch("price")) || 0;
  const updatePlanRow = (i: number, value: string) => {
    const next = [...planRows];
    next[i] = Number(value) || 0;
    setValue("installmentPlan", next);
  };
  const addPlanRow = () => setValue("installmentPlan", [...planRows, 0]);
  const removePlanRow = (i: number) =>
    setValue(
      "installmentPlan",
      planRows.filter((_, j) => j !== i),
    );
  const splitEqually = () => {
    if (planRows.length === 0 || price <= 0) return;
    const base = Math.floor(price / planRows.length);
    const remainder = price - base * planRows.length;
    setValue(
      "installmentPlan",
      planRows.map((_, i) => base + (i === 0 ? remainder : 0)),
    );
  };

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
      // The public "কিস্তি" count follows the plan rows.
      installments: data.installmentPlan.length || 1,
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
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Basic information">
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tag" hint="Shown as a chip (e.g. Web Development)" error={errors.tag?.message}>
              <Input {...register("tag")} />
            </Field>
            <Field label="Tag color (bg class)" error={errors.tagbg?.message}>
              <Input {...register("tagbg")} placeholder="bg-fuchsia-800" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
          </div>
        </Section>

        <Section title="Pricing & schedule">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (৳)" error={errors.price?.message}>
              <Input type="number" min={0} {...register("price")} />
            </Field>
            <Field label="Duration (months)" error={errors.duration?.message}>
              <Input {...register("duration")} placeholder="3" />
            </Field>
            <Field label="Lessons" error={errors.lesson?.message}>
              <Input type="number" min={0} {...register("lesson")} />
            </Field>
            <Field label="Total seat" error={errors.seats?.message}>
              <Input {...register("seats")} placeholder="10 students per batch." />
            </Field>
            <Field label="Rating (0–5)" error={errors.rating?.message}>
              <Input type="number" min={0} max={5} step={0.1} {...register("rating")} />
            </Field>
            <Field label="Review count" error={errors.reviewCount?.message}>
              <Input type="number" min={0} {...register("reviewCount")} />
            </Field>
          </div>
        </Section>
      </div>

      <Section title="Course media">
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <ImageUpload
              label="Course image (landscape, ~640×360px or larger)"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.imageUrl?.message && (
          <p className="text-sm text-rose-600">{errors.imageUrl.message}</p>
        )}
        <div className="max-w-xs">
          <Field label="Image alt text" error={errors.imageAlt?.message}>
            <Input {...register("imageAlt")} />
          </Field>
        </div>
      </Section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Content">
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
          <Field label="Pre-requisite" error={errors.prerequisite?.message}>
            <Input {...register("prerequisite")} placeholder="Basic English Knowledge" />
          </Field>
        </Section>

        <Section title="Modules / syllabus">
          <Field
            label="One module per line"
            error={errors.modulesText?.message}
          >
            <Textarea
              rows={8}
              {...register("modulesText")}
              placeholder={"Module 1\nModule 2\nModule 3"}
            />
          </Field>
        </Section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Installment plan">
          <p className="text-xs text-slate-400">
            Per-installment amounts (e.g. 6000 fee → 2000 + 2000 + 2000). These carry over to
            each admission. With no rows the fee is a single payment.
          </p>
          {planRows.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-slate-200">
              <span className="text-slate-500">
                Plan total:{" "}
                <span
                  className={`font-semibold ${
                    price > 0 && planTotal !== price ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  ৳{planTotal.toLocaleString("en-BD")}
                </span>
                {price > 0 && planTotal !== price && (
                  <span className="ml-1 text-amber-600">(fee: ৳{price.toLocaleString("en-BD")})</span>
                )}
              </span>
              <button
                type="button"
                onClick={splitEqually}
                className="font-semibold text-blue-600 hover:underline"
              >
                Split fee equally
              </button>
            </div>
          )}
          <div className="space-y-2">
            {planRows.map((amount, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-xs font-medium text-slate-500">
                  {i + 1}
                  {i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} installment
                </span>
                <Input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => updatePlanRow(i, e.target.value)}
                  placeholder="2000"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removePlanRow(i)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addPlanRow}
            >
              + Add installment
            </Button>
          </div>
        </Section>

        <Section title="Admission & visibility">
          <Field
            label="Admission / lifecycle stage"
            hint="Applications are accepted only while the stage is “Admission open”."
            error={errors.admission?.message}
          >
            <Select {...register("admission")}>
              {ADMISSION_ORDER.map((stage) => (
                <option key={stage} value={stage}>
                  {ADMISSION_META[stage].adminLabel}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex items-center justify-between gap-4">
            <Controller
              control={control}
              name="published"
              render={({ field }) => (
                <Checkbox
                  label="Published (visible on the site)"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Field label="Display order" error={errors.order?.message} className="w-32">
              <Input type="number" {...register("order")} />
            </Field>
          </div>
        </Section>
      </div>

      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}

      {/* Sticky save bar — bleeds to the modal edges and stays visible
          while scrolling the form. */}
      <div className="sticky bottom-0 -mx-6 -mb-5 flex justify-end gap-3 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-sm">
        <SubmitButton busy={isSubmitting}>
          {editing ? "Update course" : "Create course"}
        </SubmitButton>
      </div>
    </form>
  );
};

export default CourseForm;
