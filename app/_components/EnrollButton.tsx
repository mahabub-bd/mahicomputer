"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X } from "lucide-react";

interface EnrollButtonProps {
  /** Pre-selected course title — locks the course picker in the modal. */
  course?: string;
  /** Course titles for the modal's course picker. */
  courses?: string[];
  /** Trigger button classes. */
  className?: string;
  /** Trigger button content. Defaults to "Enroll Now" + arrow icon. */
  children?: React.ReactNode;
}

const defaultTriggerCls =
  "inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md";

const EnrollButton = ({
  course,
  courses,
  className,
  children,
}: EnrollButtonProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

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
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          phone: String(data.get("phone") || ""),
          email: String(data.get("email") || ""),
          course: String(data.get("course") || ""),
          message: String(data.get("message") || ""),
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.issues?.[0] || "ফরম জমা দিতে ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "ফরম জমা দিতে ব্যর্থ হয়েছে, আবার চেষ্টা করুন।");
    }
  };

  const inputCls =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelCls = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <>
      <button type="button" className={className ?? defaultTriggerCls} onClick={() => setOpen(true)}>
        {children ?? (
          <>
            ভর্তি হোন
            <ArrowRight size={16} />
          </>
        )}
      </button>

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
              <form onSubmit={onSubmit} className="space-y-3">
                <div>
                  <label className={labelCls} htmlFor="enroll-name">
                    নাম *
                  </label>
                  <input
                    id="enroll-name"
                    name="name"
                    required
                    className={inputCls}
                    placeholder="আপনার নাম"
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="enroll-phone">
                    ফোন *
                  </label>
                  <input
                    id="enroll-phone"
                    name="phone"
                    required
                    className={inputCls}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="enroll-email">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    id="enroll-email"
                    name="email"
                    type="email"
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="enroll-course">
                    কোর্স
                  </label>
                  {course ? (
                    <input
                      id="enroll-course"
                      name="course"
                      value={course}
                      readOnly
                      className={`${inputCls} bg-slate-50 text-slate-500`}
                    />
                  ) : courses && courses.length > 0 ? (
                    <select id="enroll-course" name="course" className={inputCls} defaultValue="">
                      <option value="">কোর্স নির্বাচন করুন</option>
                      {courses.map((title) => (
                        <option key={title} value={title}>
                          {title}
                        </option>
                      ))}
                    </select>
                    ) : (
                    <input id="enroll-course" name="course" className={inputCls} />
                  )}
                </div>
                <div>
                  <label className={labelCls} htmlFor="enroll-message">
                    বার্তা (ঐচ্ছিক)
                  </label>
                  <textarea
                    id="enroll-message"
                    name="message"
                    rows={3}
                    className={inputCls}
                    placeholder="কোনো প্রশ্ন থাকলে লিখুন…"
                  />
                </div>

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-md bg-blue-700 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
                >
                  {status === "sending" ? "পাঠানো হচ্ছে…" : "সাবমিট করুন"}
                </button>
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
