"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { Partner } from "@/lib/types";
import { partnerSchema, type PartnerInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { Field, Input, SubmitButton } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface PartnerFormProps {
  partner?: Partner;
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
}

const PartnerForm = ({ partner, onSuccess }: PartnerFormProps) => {
  const router = useRouter();
  const editing = Boolean(partner);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<PartnerInput>(partnerSchema, {
    defaultValues: {
      imageUrl: partner?.imageUrl ?? "",
      alt: partner?.alt ?? "",
      order: partner?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (partner) {
        await apiPut(`/api/admin/partners/${partner.id}`, data);
        toast.success("Partner updated");
      } else {
        await apiPost("/api/admin/partners", data);
        toast.success("Partner created");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/partners");
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
      <Field label="Name / alt text" error={errors.alt?.message}>
        <Input {...register("alt")} placeholder="nrb" />
      </Field>
      <Field label="Display order" error={errors.order?.message}>
        <Input type="number" {...register("order")} />
      </Field>
      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload label="Logo" value={field.value} onChange={field.onChange} />
        )}
      />

      {errors.imageUrl?.message && (
        <p className="text-sm text-rose-600">{errors.imageUrl.message}</p>
      )}
      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}
      <SubmitButton busy={isSubmitting}>
        {editing ? "Update partner" : "Create partner"}
      </SubmitButton>
    </form>
  );
};

export default PartnerForm;
