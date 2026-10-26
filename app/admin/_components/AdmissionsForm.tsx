"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { CourseAdmission } from "@/lib/admission";
import type { Enrollment } from "@/lib/types";
import { admissionCreateSchema, type AdmissionCreateInput } from "@/lib/validators";
import { apiPatch, apiPost } from "./api";
import ImageUpload from "./ImageUpload";
import { Button, Field, Input, Select, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface AdmissionsFormProps {
  /** Offered courses for the picker; OPEN ones are selectable. */
  courses: {
    title: string;
    admission: CourseAdmission;
    installmentPlan?: unknown;
  }[];
  /** When provided, the form edits this admission instead of creating one. */
  admission?: Enrollment;
  onSuccess?: () => void;
}

const toNumberArray = (value: unknown): number[] =>
  Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];

const toInputDate = (value: Date | string | null) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

/**
 * Full student admission form (admin): profile, photo, course and status.
 * Selecting a course copies its installment plan into the admission.
 * With `admission` set it edits the existing record instead of creating.
 */
const AdmissionsForm = ({ courses, admission, onSuccess }: AdmissionsFormProps) => {
  const router = useRouter();
  const editing = Boolean(admission);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useZodForm<AdmissionCreateInput>(admissionCreateSchema, {
    defaultValues: admission
      ? {
          name: admission.name,
          phone: admission.phone,
          email: admission.email,
          course: admission.course,
          message: admission.message,
          status: admission.status,
          installmentPlan: toNumberArray(admission.installmentPlan),
          photoUrl: admission.photoUrl,
          fatherName: admission.fatherName,
          motherName: admission.motherName,
          dateOfBirth: toInputDate(admission.dateOfBirth),
          gender: (admission.gender as AdmissionCreateInput["gender"]) ?? "",
          address: admission.address,
          education: admission.education,
          guardianName: admission.guardianName,
          guardianPhone: admission.guardianPhone,
        }
      : {
          name: "",
          phone: "",
          email: "",
          course: "",
          message: "",
          status: "APPROVED",
          installmentPlan: [],
          photoUrl: "",
          fatherName: "",
          motherName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          education: "",
          guardianName: "",
          guardianPhone: "",
        },
  });

  // Only courses currently accepting applications are selectable — except
  // when editing, where the admission's current course must stay listed.
  const openCourses = courses.filter(
    (c) => c.admission === "OPEN" || (admission && c.title === admission.course),
  );
  const planRows = watch("installmentPlan") ?? [];
  const updatePlanRow = (i: number, value: string) => {
    const next = [...planRows];
    next[i] = Number(value) || 0;
    setValue("installmentPlan", next);
  };
  const removePlanRow = (i: number) =>
    setValue(
      "installmentPlan",
      planRows.filter((_, j) => j !== i),
    );

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (admission) {
        await apiPatch(`/api/admin/enrollments/${admission.id}`, data);
        toast.success("Admission updated");
      } else {
        await apiPost("/api/admin/enrollments", data);
        toast.success("Admission created");
      }
      router.refresh();
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError("root", { message: msg });
      toast.error(msg);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="flex items-start gap-4">
        <Controller
          control={control}
          name="photoUrl"
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              label="Student photo"
            />
          )}
        />
      </div>

      <p className="border-b border-slate-100 pb-2 text-[13px] font-bold uppercase tracking-wider text-slate-700">
        Student information
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name?.message}>
          <Input {...register("name")} />
        </Field>
        <Field label="Phone" required error={errors.phone?.message}>
          <Input {...register("phone")} placeholder="01XXXXXXXXX" />
        </Field>
        <Field label="Email (optional)" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Field>
        <Field label="Gender" error={errors.gender?.message}>
          <Select {...register("gender")}>
            <option value="">— Select —</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </Select>
        </Field>
        <Field label="Father's name" error={errors.fatherName?.message}>
          <Input {...register("fatherName")} />
        </Field>
        <Field label="Mother's name" error={errors.motherName?.message}>
          <Input {...register("motherName")} />
        </Field>
        <Field label="Date of birth" error={errors.dateOfBirth?.message}>
          <Input type="date" {...register("dateOfBirth")} />
        </Field>
        <Field label="Last education" error={errors.education?.message}>
          <Input {...register("education")} placeholder="SSC / HSC / Honours…" />
        </Field>
      </div>
      <Field label="Address" error={errors.address?.message}>
        <Textarea rows={2} {...register("address")} />
      </Field>

      <p className="border-b border-slate-100 pb-2 text-[13px] font-bold uppercase tracking-wider text-slate-700">
        Guardian
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Guardian name" error={errors.guardianName?.message}>
          <Input {...register("guardianName")} />
        </Field>
        <Field label="Guardian phone" error={errors.guardianPhone?.message}>
          <Input {...register("guardianPhone")} />
        </Field>
      </div>

      <p className="border-b border-slate-100 pb-2 text-[13px] font-bold uppercase tracking-wider text-slate-700">
        Course & status
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Course" error={errors.course?.message}>
          <Controller
            control={control}
            name="course"
            render={({ field }) => (
              <Select
                name={field.name}
                ref={field.ref}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  // Copy the selected course's installment plan as a starting point.
                  const selected = courses.find((c) => c.title === e.target.value);
                  setValue(
                    "installmentPlan",
                    selected ? toNumberArray(selected.installmentPlan) : [],
                  );
                }}
                onBlur={field.onBlur}
              >
                <option value="">— None —</option>
                {openCourses.map((c) => (
                  <option key={c.title} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </Select>
            )}
          />
          <p className="mt-1 text-xs text-slate-400">
            Only courses with admission open are listed; the installment plan copies from the
            course and can be adjusted below.
          </p>
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="DECLINED">Declined</option>
          </Select>
        </Field>
        <Field label="Note (optional)" error={errors.message?.message}>
          <Textarea rows={1} {...register("message")} />
        </Field>
      </div>

      <p className="border-b border-slate-100 pb-2 text-[13px] font-bold uppercase tracking-wider text-slate-700">
        Installment plan
      </p>
      {planRows.length === 0 ? (
        <p className="text-sm text-slate-400">
          Select a course to copy its plan, or add rows manually.
        </p>
      ) : (
        <div className="space-y-2">
          {planRows.map((amount, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-28 shrink-0 text-xs font-medium text-slate-500">
                {i + 1}
                {i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} installment
              </span>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => updatePlanRow(i, e.target.value)}
                placeholder="2000"
              />
              <Button type="button" variant="danger" size="sm" onClick={() => removePlanRow(i)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      {errors.root?.message && (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      )}
      <SubmitButton busy={isSubmitting}>
        {editing ? "Save changes" : "Create admission"}
      </SubmitButton>
    </form>
  );
};

export default AdmissionsForm;
