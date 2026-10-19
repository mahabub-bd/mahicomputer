"use client";

import { newsletterSchema, type NewsletterInput } from "@/lib/validators";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Input, SubmitButton } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

/** Email capture inside the home-page Newsletter band (Newsletter.tsx). */
const NewsletterSignup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm<NewsletterInput>(newsletterSchema, {
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Subscription failed");
      toast.success("ধন্যবাদ! আপনি সাবস্ক্রাইব করেছেন।");
      reset();
    } catch {
      toast.error("কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
  });

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md" noValidate>
      <label className="block text-[15px] font-bold uppercase tracking-wider text-white">
        নিউজলেটার
      </label>
      <p className="mt-1.5 text-[13px] leading-5 text-slate-400">
        নতুন কোর্স ও অফারের খবর সবার আগে পেতে সাবস্ক্রাইব করুন।
      </p>
      <div className="mt-3 flex overflow-hidden rounded-full border border-white/10 bg-white/5">
        <Input
          variant="onDark"
          type="email"
          {...register("email")}
          placeholder="আপনার ইমেইল"
          aria-label="Email address"
          aria-invalid={!!errors.email}
        />
        <SubmitButton
          variant="onDark"
          busy={isSubmitting}
          busyLabel=""
          aria-label="Subscribe"
        >
          <Send size={15} aria-hidden />
          সাবস্ক্রাইব করুন
        </SubmitButton>
      </div>
      {errors.email?.message && (
        <p className="mt-2 text-xs font-medium text-rose-300">
          {errors.email.message}
        </p>
      )}
    </form>
  );
};

export default NewsletterSignup;
