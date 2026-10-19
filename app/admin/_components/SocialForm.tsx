"use client";

import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { SocialLink } from "@/lib/types";
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { Field, Input, SubmitButton } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface SocialFormProps {
  link?: SocialLink;
  onSuccess?: () => void;
}

const SocialForm = ({ link, onSuccess }: SocialFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<SocialLinkInput>(socialLinkSchema, {
    defaultValues: {
      icon: link?.icon ?? "",
      link: link?.link ?? "",
      order: link?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (link) {
        await apiPut(`/api/admin/social/${link.id}`, data);
        toast.success("Social link updated");
      } else {
        await apiPost("/api/admin/social", data);
        toast.success("Social link added");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="URL" required error={errors.link?.message}>
        <Input
          {...register("link")}
          aria-invalid={!!errors.link}
          placeholder="https://facebook.com/..."
        />
      </Field>
      <Field label="Display order" error={errors.order?.message}>
        <Input type="number" {...register("order")} />
      </Field>
      <Controller
        control={control}
        name="icon"
        render={({ field }) => (
          <ImageUpload label="Icon" value={field.value} onChange={field.onChange} />
        )}
      />
      {errors.icon?.message && (
        <p className="text-sm text-rose-600">{errors.icon.message}</p>
      )}
      <SubmitButton busy={isSubmitting}>
        {link ? "Update link" : "Add link"}
      </SubmitButton>
    </form>
  );
};

export default SocialForm;
