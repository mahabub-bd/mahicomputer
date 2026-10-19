"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validators";
import { Input, SubmitButton, Textarea } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

const iconCls =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-blue-600";

const labelCls = "mb-1.5 block text-[13px] font-semibold text-slate-600";

const errorCls = "mt-1 text-xs font-medium text-rose-600";

const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm<ContactMessageInput>(contactMessageSchema, {
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  // Clear stale success/error feedback as soon as the user edits again.
  const resetStatus = () => {
    if (status === "sent" || status === "error") setStatus("idle");
  };

  const onSubmit = handleSubmit(async (data) => {
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.issues?.[0] ?? body?.error ?? "বার্তা পাঠানো হয়েছে না, আবার চেষ্টা করুন।"
        );
      }

      // Fire-and-forget email notification (DB is the source of truth)
      if (
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      ) {
        const emailjs = (await import("@emailjs/browser")).default;
        emailjs
          .send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            {
              from_name: data.name,
              from_email: data.email,
              from_phone: data.phone,
              message: data.message,
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
          )
          .catch(() => {});
      }

      setStatus("sent");
      reset();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।"
      );
      setStatus("error");
    }
  });

  const sending = status === "sending" || isSubmitting;

  return (
    <form
      id="contact-form"
      onSubmit={onSubmit}
      onChange={resetStatus}
      className="space-y-4"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="from_name" className={labelCls}>
            আপনার নাম *
          </label>
          <div className="relative">
            <Input
              variant="site"
              id="from_name"
              type="text"
              disabled={sending}
              placeholder="আপনার পূর্ণ নাম"
              className="peer"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            <User size={18} className={iconCls} />
          </div>
          {errors.name?.message && <p className={errorCls}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="from_email" className={labelCls}>
            আপনার ইমেইল *
          </label>
          <div className="relative">
            <Input
              variant="site"
              id="from_email"
              type="email"
              disabled={sending}
              placeholder="you@example.com"
              className="peer"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            <Mail size={18} className={iconCls} />
          </div>
          {errors.email?.message && (
            <p className={errorCls}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="from_phone" className={labelCls}>
          ফোন নম্বর *
        </label>
        <div className="relative">
          <Input
            variant="site"
            id="from_phone"
            type="tel"
            disabled={sending}
            placeholder="+8801XXXXXXXXX"
            className="peer"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          <Phone size={18} className={iconCls} />
        </div>
        {errors.phone?.message && <p className={errorCls}>{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          বার্তা *
        </label>
        <div className="relative">
          <Textarea
            variant="site"
            id="message"
            rows={5}
            disabled={sending}
            placeholder="আপনার বার্তা লিখুন…"
            className="peer min-h-[120px] resize-y"
            {...register("message")}
            aria-invalid={!!errors.message}
          />
          <MessageSquare
            size={18}
            className="pointer-events-none absolute left-4 top-3.5 text-slate-400 transition-colors peer-focus:text-blue-600"
          />
        </div>
        {errors.message?.message && (
          <p className={errorCls}>{errors.message.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <SubmitButton
          variant="site"
          busy={sending}
          busyLabel="পাঠানো হচ্ছে…"
        >
          <Send size={18} />
          বার্তা পাঠান
        </SubmitButton>

        <div aria-live="polite" className="min-w-0 flex-1">
          {status === "sent" && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[14px] font-medium text-emerald-700">
              <CheckCircle2 size={17} className="shrink-0" />
              আপনার বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।
            </p>
          )}
          {status === "error" && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[14px] font-medium text-rose-700"
            >
              <AlertCircle size={17} className="shrink-0" />
              {errorMsg || "কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।"}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
