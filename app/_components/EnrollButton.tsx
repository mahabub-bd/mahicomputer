"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X } from "lucide-react";
import { enrollmentSchema, type EnrollmentInput } from "@/lib/validators";
import { Field, Input, Select, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface EnrollButtonProps {
  /** Pre-selected course title — locks the course picker in the modal. */
  course?: string;
  /** Course titles for the modal's course picker. */
  courses?: string[];
  /** Trigger button classes. */
  className?: string;
  /** Trigger button content. Defaults to "Enroll Now" + arrow icon. */
  children?: React.ReactNode;
  /** When true, the trigger renders disabled ("admission closed"). */
  disabled?: boolean;
}

const defaultTriggerCls =
  "inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md";

const EnrollButton = ({
  course,
  courses,
  className,
  children,
  disabled = false,
}: EnrollButtonProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm<EnrollmentInput>(enrollmentSchema, {
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: course ?? "",
      message: "",
    },
  });

  // Lock page scroll and close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setStatus("idle");
    setError(null);
    reset();
  };

  const onSubmit = handleSubmit(async (data) => {
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.issues?.[0] || "ফরম জমা দিতে ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
      }
      setStatus("sent");
      reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "ফরম জমা দিতে ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
    }
  });

  return (
    <>
      {disabled ? (
        <button
          type="button"
          disabled
          aria-disabled
          className={
            className ??
            "inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-500"
          }
        >
          {children ?? "ভর্তি বন্ধ"}
        </button>
      ) : (
        <button type="button" className={className ?? defaultTriggerCls} onClick={() => setOpen(true)}>
        {children ?? (
          <>
            ভর্তি হোন
            <ArrowRight size={16} />
          </>
        )}
      </button>
      )}

      {open &&
        createPortal(
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 p-4"
          onClick={close}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">ভর্তি হোন</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  আপনার তথ্য দিন, আমরা যোগাযোগ করব।
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {status === "sent" ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                ধন্যবাদ! আপনার তথ্য পৌঁছে গেছে — আমরা শীঘ্রই যোগাযোগ করব।
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3" noValidate>
                <Field label="নাম" htmlFor="enroll-name" required error={errors.name?.message}>
                  <Input
                    id="enroll-name"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    placeholder="আপনার নাম"
                  />
                </Field>
                <Field label="ফোন" htmlFor="enroll-phone" required error={errors.phone?.message}>
                  <Input
                    id="enroll-phone"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                    placeholder="01XXXXXXXXX"
                  />
                </Field>
                <Field label="ইমেইল (ঐচ্ছিক)" htmlFor="enroll-email" error={errors.email?.message}>
                  <Input
                    id="enroll-email"
                    type="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="কোর্স" htmlFor="enroll-course" error={errors.course?.message}>
                  {course ? (
                    <Input
                      id="enroll-course"
                      {...register("course")}
                      readOnly
                      className="text-slate-500"
                    />
                  ) : courses && courses.length > 0 ? (
                    <Select id="enroll-course" {...register("course")}>
                      <option value="">কোর্স নির্বাচন করুন</option>
                      {courses.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input id="enroll-course" {...register("course")} />
                  )}
                </Field>
                <Field
                  label="বার্তা (ঐচ্ছিক)"
                  htmlFor="enroll-message"
                  error={errors.message?.message}
                >
                  <Textarea
                    id="enroll-message"
                    rows={3}
                    {...register("message")}
                    placeholder="কোনো প্রশ্ন থাকলে লিখুন…"
                  />
                </Field>

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <SubmitButton
                  busy={isSubmitting || status === "sending"}
                  busyLabel="পাঠানো হচ্ছে…"
                  className="w-full"
                >
                  সাবমিট করুন
                </SubmitButton>
              </form>
            )}
          </div>
        </div>,
          document.body
        )}
    </>
  );
};

export default EnrollButton;
