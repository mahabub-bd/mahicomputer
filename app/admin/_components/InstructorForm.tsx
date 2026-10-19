"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { Instructor } from "@/lib/types";
import { instructorSchema, type InstructorInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { Field, Input, SubmitButton } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface InstructorFormProps {
  instructor?: Instructor;
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
}

const InstructorForm = ({ instructor, onSuccess }: InstructorFormProps) => {
  const router = useRouter();
  const editing = Boolean(instructor);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<InstructorInput>(instructorSchema, {
    defaultValues: {
      name: instructor?.name ?? "",
      description: instructor?.description ?? "",
      imageUrl: instructor?.imageUrl ?? "",
      order: instructor?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (instructor) {
        await apiPut(`/api/admin/instructors/${instructor.id}`, data);
        toast.success("Instructor updated");
      } else {
        await apiPost("/api/admin/instructors", data);
        toast.success("Instructor created");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/instructors");
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
      <Field label="Name" required error={errors.name?.message}>
        <Input {...register("name")} aria-invalid={!!errors.name} />
      </Field>
      <Field label="Designation / description" error={errors.description?.message}>
        <Input {...register("description")} placeholder="Web Developer" />
      </Field>
      <Field label="Display order" error={errors.order?.message}>
        <Input type="number" {...register("order")} />
      </Field>
      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload
            label="Photo (high-res recommended: 600×750px min — small images look blurry in the cards)"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <p className="text-xs text-slate-400">
        Portrait crop, 4:5 ratio. Photos smaller than ~400px wide will appear soft/blurry on the
        site.
      </p>

      {errors.imageUrl?.message && (
        <p className="text-sm text-rose-600">{errors.imageUrl.message}</p>
      )}
      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}
      <SubmitButton busy={isSubmitting}>
        {editing ? "Update instructor" : "Create instructor"}
      </SubmitButton>
    </form>
  );
};

export default InstructorForm;
