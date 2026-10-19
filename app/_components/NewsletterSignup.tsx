"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

/** Email capture inside the home-page Newsletter band (Newsletter.tsx). */
const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      toast.success("ধন্যবাদ! আপনি সাবস্ক্রাইব করেছেন।");
      setEmail("");
    } catch {
      toast.error("কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md">
      <label className="block text-[15px] font-bold uppercase tracking-wider text-white">
        নিউজলেটার
      </label>
      <p className="mt-1.5 text-[13px] leading-5 text-slate-400">
        নতুন কোর্স ও অফারের খবর সবার আগে পেতে সাবস্ক্রাইব করুন।
      </p>
      <div className="mt-3 flex overflow-hidden rounded-full border border-white/10 bg-white/5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="আপনার ইমেইল"
          aria-label="Email address"
          className="w-full min-w-0 bg-transparent px-4 py-2.5 text-[14px] text-white outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label="Subscribe"
          className="flex shrink-0 items-center gap-1.5 bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={15} className="animate-spin" aria-hidden />
          ) : (
            <Send size={15} aria-hidden />
          )}
          সাবস্ক্রাইব করুন
        </button>
      </div>
    </form>
  );
};

export default NewsletterSignup;
