"use client";

import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { Faq } from "@/lib/types";
import { faqSchema, type FaqInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import { Checkbox, Field, Input, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface FaqFormProps {
  faq?: Faq;
  onSuccess?: () => void;
}

const FaqForm = ({ faq, onSuccess }: FaqFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<FaqInput>(faqSchema, {
    defaultValues: {
      question: faq?.question ?? "",
      answer: faq?.answer ?? "",
      published: faq?.published ?? true,
      order: faq?.order ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (faq) {
        await apiPut(`/api/admin/faqs/${faq.id}`, data);
        toast.success("FAQ updated");
      } else {
        await apiPost("/api/admin/faqs", data);
        toast.success("FAQ added");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field
        label="Question"
        required
        hint="Used as the accordion heading on the homepage."
        error={errors.question?.message}
      >
        <Input
          {...register("question")}
          aria-invalid={!!errors.question}
          placeholder="ভর্তির জন্য কী কী লাগবে?"
        />
      </Field>
      <Field
        label="Answer"
        required
        hint="Line breaks are kept, just like on the site."
        error={errors.answer?.message}
      >
        <Textarea
          rows={5}
          {...register("answer")}
          aria-invalid={!!errors.answer}
          placeholder="উত্তর লিখুন…"
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-end">
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
        </div>
        <Field
          label="Display order"
          hint="Lower numbers appear first."
          error={errors.order?.message}
        >
          <Input type="number" {...register("order")} />
        </Field>
      </div>
      <SubmitButton busy={isSubmitting}>
        {faq ? "Update FAQ" : "Add FAQ"}
      </SubmitButton>
    </form>
  );
};

export default FaqForm;
