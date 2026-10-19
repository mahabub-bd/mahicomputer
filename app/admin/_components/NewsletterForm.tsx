"use client";

import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { Newsletter } from "@/lib/types";
import {
  newsletterIssueFormSchema,
  type NewsletterIssueFormInput,
} from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import { Checkbox, Field, Input, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface NewsletterFormProps {
  newsletter?: Newsletter;
  onSuccess?: () => void;
}

const toDateInput = (value?: Date | string) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
};

const NewsletterForm = ({ newsletter, onSuccess }: NewsletterFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<NewsletterIssueFormInput>(newsletterIssueFormSchema, {
    defaultValues: {
      title: newsletter?.title ?? "",
      body: newsletter?.body ?? "",
      date: toDateInput(newsletter?.date),
      published: newsletter?.published ?? true,
      order: newsletter?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (newsletter) {
        await apiPut(`/api/admin/newsletters/${newsletter.id}`, data);
        toast.success("Newsletter updated");
      } else {
        await apiPost("/api/admin/newsletters", data);
        toast.success("Newsletter added");
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
          placeholder="October newsletter — new batches, offers and updates"
        />
      </Field>
      <Field
        label="Body"
        hint="Blank lines separate paragraphs on the public page."
        error={errors.body?.message}
      >
        <Textarea
          rows={6}
          {...register("body")}
          placeholder="বিস্তারিত লিখুন…"
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Issue date" error={errors.date?.message}>
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
        {newsletter ? "Update newsletter" : "Add newsletter"}
      </SubmitButton>
    </form>
  );
};

export default NewsletterForm;
