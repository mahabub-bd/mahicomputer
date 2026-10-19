"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-[15px] text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50";

const iconCls =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-blue-600";

const labelCls = "mb-1.5 block text-[13px] font-semibold text-slate-600";

const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Clear stale success/error feedback as soon as the user edits again.
  const resetStatus = () => {
    if (status === "sent" || status === "error") setStatus("idle");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrorMsg("");

    const payload = {
      name: String(data.get("from_name") || ""),
      email: String(data.get("from_email") || ""),
      phone: String(data.get("from_phone") || ""),
      message: String(data.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          .sendForm(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            form,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
          )
          .catch(() => {});
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।"
      );
      setStatus("error");
    }
  };

  const sending = status === "sending";

  return (
    <form
      id="contact-form"
      onSubmit={onSubmit}
      onChange={resetStatus}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="from_name" className={labelCls}>
            আপনার নাম *
          </label>
          <div className="relative">
            <input
              id="from_name"
              name="from_name"
              type="text"
              required
              disabled={sending}
              placeholder="আপনার পূর্ণ নাম"
              className={inputCls}
            />
            <User size={18} className={iconCls} />
          </div>
        </div>

        <div>
          <label htmlFor="from_email" className={labelCls}>
            আপনার ইমেইল *
          </label>
          <div className="relative">
            <input
              id="from_email"
              name="from_email"
              type="email"
              required
              disabled={sending}
              placeholder="you@example.com"
              className={inputCls}
            />
            <Mail size={18} className={iconCls} />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="from_phone" className={labelCls}>
          ফোন নম্বর *
        </label>
        <div className="relative">
          <input
            id="from_phone"
            name="from_phone"
            type="tel"
            required
            disabled={sending}
            placeholder="+8801XXXXXXXXX"
            className={inputCls}
          />
          <Phone size={18} className={iconCls} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          বার্তা *
        </label>
        <div className="relative">
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            disabled={sending}
            placeholder="আপনার বার্তা লিখুন…"
            className={`${inputCls} min-h-[120px] resize-y`}
          />
          <MessageSquare
            size={18}
            className="pointer-events-none absolute left-4 top-3.5 text-slate-400 transition-colors peer-focus:text-blue-600"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-8 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              পাঠানো হচ্ছে…
            </>
          ) : (
            <>
              <Send size={18} />
              বার্তা পাঠান
            </>
          )}
        </button>

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
