"use client";

import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { Notice } from "@/lib/types";
import { noticeFormSchema, type NoticeFormInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import { Checkbox, Field, Input, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface NoticeFormProps {
  notice?: Notice;
  onSuccess?: () => void;
}

const toDateInput = (value?: Date | string) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
};

const NoticeForm = ({ notice, onSuccess }: NoticeFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<NoticeFormInput>(noticeFormSchema, {
    defaultValues: {
      title: notice?.title ?? "",
      body: notice?.body ?? "",
      date: toDateInput(notice?.date),
      published: notice?.published ?? true,
      order: notice?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (notice) {
        await apiPut(`/api/admin/notices/${notice.id}`, data);
        toast.success("Notice updated");
      } else {
        await apiPost("/api/admin/notices", data);
        toast.success("Notice added");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Title" required error={errors.title?.message}>
        <Input
          {...register("title")}
          aria-invalid={!!errors.title}
          placeholder="ছুটির নোটিশ / Admission going on"
        />
      </Field>
      <Field label="Details" error={errors.body?.message}>
        <Textarea
          rows={5}
          {...register("body")}
          placeholder="বিস্তারিত লিখুন…"
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Notice date" error={errors.date?.message}>
          <Input type="date" {...register("date")} aria-invalid={!!errors.date} />
        </Field>
        <Field label="Display order" error={errors.order?.message}>
          <Input type="number" {...register("order")} />
        </Field>
      </div>
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
      <SubmitButton busy={isSubmitting}>
        {notice ? "Update notice" : "Add notice"}
      </SubmitButton>
    </form>
  );
};

export default NoticeForm;
