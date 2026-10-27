"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Batch } from "@/lib/types";
import { batchSchema, type BatchInput } from "@/lib/validators";
import { apiPatch, apiPost } from "./api";
import {
  Field,
  Input,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface BatchFormProps {
  /** Course titles offered on the site — drives the course picker. */
  courses: { title: string }[];
  /** Present = edit mode. */
  batch?: Batch;
  onSuccess?: () => void;
}

/** Create/edit one class batch. */
const BatchForm = ({ courses, batch, onSuccess }: BatchFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<BatchInput>(batchSchema, {
    defaultValues: batch
      ? {
          course: batch.course,
          name: batch.name,
          startDate: batch.startDate ? toInputDate(batch.startDate) : "",
          schedule: batch.schedule,
          capacity: batch.capacity,
          status: batch.status,
          note: batch.note,
        }
      : {
          course: courses[0]?.title ?? "",
          name: "",
          startDate: "",
          schedule: "",
          capacity: 0,
          status: "UPCOMING",
          note: "",
        },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (batch) {
        await apiPatch(`/api/admin/batches/${batch.id}`, data);
        toast.success("Batch updated");
      } else {
        await apiPost("/api/admin/batches", data);
        toast.success("Batch created");
      }
      router.refresh();
      onSuccess?.();
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : "Save failed" });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Course" required error={errors.course?.message}>
          <Select {...register("course")}>
            {courses.map((c) => (
              <option key={c.title} value={c.title}>
                {c.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Batch name" required error={errors.name?.message}>
          <Input {...register("name")} placeholder="Batch 3 — Evening" />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Start date" hint="Optional">
          <Input type="date" {...register("startDate")} />
        </Field>
        <Field label="Schedule" hint="e.g. Sat, Mon, Wed — 6:00 PM">
          <Input {...register("schedule")} />
        </Field>
        <Field label="Seats" hint="0 = unlimited">
          <Input type="number" min={0} {...register("capacity")} />
        </Field>
      </div>

      <Field label="Status">
        <Select {...register("status")}>
          <option value="UPCOMING">Upcoming</option>
          <option value="RUNNING">Running</option>
          <option value="COMPLETED">Completed</option>
        </Select>
      </Field>

      <Field label="Note" error={errors.note?.message}>
        <Textarea rows={2} {...register("note")} placeholder="Classroom, instructor…" />
      </Field>

      {errors.root?.message && <p className="text-sm text-rose-600">{errors.root.message}</p>}

      <div className="flex items-center justify-end">
        <SubmitButton busy={isSubmitting}>{batch ? "Save changes" : "Create batch"}</SubmitButton>
      </div>
    </form>
  );
};

const toInputDate = (value: Date | string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

export default BatchForm;
