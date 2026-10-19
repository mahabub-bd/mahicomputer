"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { Course, Review } from "@/lib/types";
import { reviewSchema, type ReviewInput } from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { Field, Input, Select, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface ReviewFormProps {
  review?: Review;
  /** Course titles offered in the Course dropdown. */
  courses: Course[];
  /** When provided, the parent handles post-save behavior (e.g. closing a modal) instead of navigating. */
  onSuccess?: () => void;
}

const empty = {
  name: "",
  title: "Student",
  content: "",
  course: "",
  rating: 5,
  imageUrl: "",
  order: 0,
};

const ReviewForm = ({ review, courses, onSuccess }: ReviewFormProps) => {
  const router = useRouter();
  const editing = Boolean(review);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<ReviewInput>(reviewSchema, {
    defaultValues: review
      ? {
          name: review.name,
          title: review.title,
          content: review.content,
          course: review.course,
          rating: review.rating,
          imageUrl: review.imageUrl,
          order: review.order,
        }
      : empty,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (review) {
        await apiPut(`/api/admin/reviews/${review.id}`, data);
        toast.success("Review updated");
      } else {
        await apiPost("/api/admin/reviews", data);
        toast.success("Review created");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/reviews");
      }
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError("root", { message: msg });
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" required error={errors.name?.message}>
          <Input {...register("name")} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Designation" error={errors.title?.message}>
          <Input {...register("title")} placeholder="Student" />
        </Field>
        <Field label="Course" error={errors.course?.message}>
          <Select {...register("course")}>
            <option value="">No course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
            {/* Keep a saved value selectable when its course was renamed or deleted */}
            {review?.course &&
              !courses.some((c) => c.title === review.course) && (
                <option value={review.course}>{review.course}</option>
              )}
          </Select>
        </Field>
        <Field label="Rating (0–5)" error={errors.rating?.message}>
          <Input
            type="number"
            min={0}
            max={5}
            step={0.1}
            {...register("rating")}
          />
        </Field>
      </div>

      <Field label="Review content" required error={errors.content?.message}>
        <Textarea
          rows={4}
          {...register("content")}
          aria-invalid={!!errors.content}
        />
      </Field>

      <div className="max-w-xs">
        <Field label="Display order" error={errors.order?.message}>
          <Input type="number" {...register("order")} />
        </Field>
      </div>

      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload
            label="Student photo"
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
        {editing ? "Update review" : "Create review"}
      </SubmitButton>
    </form>
  );
};

export default ReviewForm;
