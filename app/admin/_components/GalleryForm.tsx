"use client";

import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { GalleryItem } from "@/lib/types";
import { galleryItemSchema, type GalleryItemInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { Field, Input, SubmitButton } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface GalleryFormProps {
  item?: GalleryItem;
  onSuccess?: () => void;
}

const GalleryForm = ({ item, onSuccess }: GalleryFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<GalleryItemInput>(galleryItemSchema, {
    defaultValues: {
      imageUrl: item?.imageUrl ?? "",
      alt: item?.alt ?? "",
      order: item?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (item) {
        await apiPut(`/api/admin/gallery/${item.id}`, data);
        toast.success("Gallery image updated");
      } else {
        await apiPost("/api/admin/gallery", data);
        toast.success("Gallery image added");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload label="Image" value={field.value} onChange={field.onChange} />
        )}
      />
      <Field label="Alt text" error={errors.alt?.message}>
        <Input {...register("alt")} />
      </Field>
      <Field label="Display order" error={errors.order?.message}>
        <Input type="number" {...register("order")} />
      </Field>
      {errors.imageUrl?.message && (
        <p className="text-sm text-rose-600">{errors.imageUrl.message}</p>
      )}
      <SubmitButton busy={isSubmitting}>
        {item ? "Update image" : "Add image"}
      </SubmitButton>
    </form>
  );
};

export default GalleryForm;
