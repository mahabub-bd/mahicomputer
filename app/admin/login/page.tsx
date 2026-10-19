"use client";

import styles from "@/app/styles/style";
import { logo } from "@/public";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { apiPost } from "../_components/api";

/* Local field styles — the shared inputCls in _components/inputs.ts is used
   by every admin form, so the login page keeps its own refined set. The
   `login-field` hook lets globals.css keep autofill on-brand. */
const fieldCls =
  "login-field w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-11 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 transition duration-200 outline-none hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/12";
const labelCls = "mb-1.5 block text-sm font-semibold text-slate-700";
const hintBoxCls = "mt-1.5 min-h-[16px]";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = { email?: string; password?: string };

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [capsLock, setCapsLock] = useState(false);
  const [shake, setShake] = useState(false);

  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    const trimmed = email.trim();
    if (!trimmed) errs.email = "Email is required";
    else if (!EMAIL_RE.test(trimmed)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    const errs = validate();
    if (errs.email || errs.password) {
      setFieldErrors(errs);
      setShake(true);
      return;
    }
    setFieldErrors({});

    setBusy(true);
    setError(null);
    try {
      await apiPost("/api/auth/login", { email: email.trim(), password });
      toast.success("Signed in successfully");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      toast.error(msg);
      setBusy(false);
      setShake(true);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-50">
      <Toaster position="top-right" richColors theme="light" />

      {/* ---------- Ambient backdrop ---------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-48 h-136 w-136 rounded-full bg-blue-300/40 blur-3xl login-blob-a"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-32 h-120 w-120 rounded-full bg-cyan-200/60 blur-3xl login-blob-b"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-80 w-80 rounded-full bg-sky-200/70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[46px_46px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(255,255,255,0.75)_100%)]"
      />

      {/* ---------- Content: same container width as the homepage ---------- */}
      <div
        className={`${styles.boxWidth} relative z-10 flex min-h-screen flex-col px-4 sm:px-6 lg:flex-row`}
      >
        {/* Branding — left half */}
        <section
          className="login-rise flex w-full flex-col justify-center py-12 lg:w-1/2 lg:py-24 lg:pr-10 xl:pr-16"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="w-full max-w-xl xl:max-w-2xl">
            <Image
              src={logo}
              alt="Mahi Computer"
              width={200}
              height={60}
              className="h-12 w-auto lg:h-14"
              priority
            />

            <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_2px_rgba(37,99,235,0.5)]" />
              Admin Panel
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-snug tracking-tight text-slate-900 sm:text-4xl xl:text-[2.75rem]">
              Manage your institute
              <br />
              from one place.
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-slate-600 xl:text-base">
              Courses, categories, instructors, enrollments, messages and site
              settings — everything on the Mahi Computer website, in one dashboard.
            </p>

            <ul className="mt-8 hidden flex-col gap-3 sm:flex">
              {[
                "Publish or hide courses in one click",
                "Track student enrollments & messages",
                "Update site content without a developer",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/70 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_6px_20px_-12px_rgba(15,23,42,0.35)] backdrop-blur"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-sky-500 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-10 hidden text-xs text-slate-400 lg:block">
              © {new Date().getFullYear()} Mahi Computer Training Center
            </p>
          </div>
        </section>

        {/* Form — right half */}
        <div
          className="login-rise flex w-full items-center justify-center py-10 lg:w-1/2 lg:py-24 lg:pl-10 xl:pl-16"
          style={{ animationDelay: "0.18s" }}
        >
          <div className="w-full max-w-110">
            <div
              className={[
                "relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:p-8",
                shake ? "login-shake" : "",
              ].join(" ")}
              onAnimationEnd={(e) => {
                if (e.animationName === "login-shake") setShake(false);
              }}
            >
              {/* Soft accent line along the top edge */}
              <span
                aria-hidden
                className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-blue-300/80 to-transparent"
              />

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/25">
                <Lock size={19} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-500">
                Sign in to continue to the admin panel
              </p>

              <form onSubmit={onSubmit} className="mt-7 space-y-5" noValidate>
                <div>
                  <label htmlFor="email" className={labelCls}>
                    Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                      <Mail size={17} />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="admin@example.com"
                      className={`${fieldCls} ${fieldErrors.email ? "border-rose-400" : ""
                        }`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError("email");
                      }}
                      required
                      autoFocus
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby="email-hint"
                    />
                  </div>
                  <div id="email-hint" className={hintBoxCls} aria-live="polite">
                    {fieldErrors.email && (
                      <p className="text-xs font-medium text-rose-600">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={labelCls}>
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                      <Lock size={17} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={`${fieldCls} pr-12 ${fieldErrors.password ? "border-rose-400" : ""
                        }`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearFieldError("password");
                      }}
                      onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
                      onKeyDown={(e) => setCapsLock(e.getModifierState("CapsLock"))}
                      onBlur={() => setCapsLock(false)}
                      required
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby="password-hint"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400 transition hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <div id="password-hint" className={hintBoxCls} aria-live="polite">
                    {fieldErrors.password ? (
                      <p className="text-xs font-medium text-rose-600">
                        {fieldErrors.password}
                      </p>
                    ) : capsLock ? (
                      <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                        <TriangleAlert size={13} className="shrink-0" />
                        Caps Lock is on
                      </p>
                    ) : null}
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-600"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-sky-500 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-200 hover:from-blue-500 hover:to-sky-400 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <LogIn size={17} />
                      Sign in
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck size={13} className="shrink-0" />
                Protected area — authorised staff only
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg transition hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <ArrowLeft size={14} />
                Back to website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
