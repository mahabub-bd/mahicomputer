"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import { categorySchema, type CategoryInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { Field, Input, SubmitButton } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface CategoryFormProps {
  category?: Category;
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
}

const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const router = useRouter();
  const editing = Boolean(category);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<CategoryInput>(categorySchema, {
    defaultValues: {
      title: category?.title ?? "",
      imageUrl: category?.imageUrl ?? "",
      alt: category?.alt ?? "",
      order: category?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (category) {
        await apiPut(`/api/admin/categories/${category.id}`, data);
        toast.success("Category updated");
      } else {
        await apiPost("/api/admin/categories", data);
        toast.success("Category created");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/categories");
      }
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError("root", { message: msg });
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4" noValidate>
      <Field label="Title" required error={errors.title?.message}>
        <Input {...register("title")} aria-invalid={!!errors.title} />
      </Field>
      <Field label="Alt text" error={errors.alt?.message}>
        <Input {...register("alt")} />
      </Field>
      <Field label="Display order" error={errors.order?.message}>
        <Input type="number" {...register("order")} />
      </Field>
      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload
            label="Icon / image"
            value={field.value}
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
        {editing ? "Update category" : "Create category"}
      </SubmitButton>
    </form>
  );
};

export default CategoryForm;
