"use client";

import { logo } from "@/public";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { apiPost } from "../_components/api";

/* Local field styles — the shared inputCls in _components/inputs.ts is used
   by every admin form, so the login page keeps its own refined set. */
const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10";
const labelCls = "mb-1.5 block text-sm font-semibold text-slate-700";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await apiPost("/api/auth/login", { email, password });
      toast.success("Signed in successfully");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      toast.error(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" richColors />

      {/* ---------- Branding panel ---------- */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-10">
        {/* Decorative gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-24 h-112 w-md rounded-full bg-blue-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[44px_44px]"
        />

        <div className="relative">
          <Image
            src={logo}
            alt="Mahi Computer"
            width={200}
            height={60}
            className="h-11 w-auto"
            priority
          />
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
            Admin Panel
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-snug text-white xl:text-4xl">
            Manage your institute
            <br />
            from one place.
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            Courses, categories, instructors, enrollments, messages and site
            settings — everything on the Mahi Computer website, in one dashboard.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            {[
              "Publish or hide courses in one click",
              "Track student enrollments & messages",
              "Update site content without a developer",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} Mahi Computer Training Center
        </p>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12 sm:px-8">
        <div className="w-full max-w-100">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Image
              src={logo}
              alt="Mahi Computer"
              width={160}
              height={48}
              className="mx-auto h-12 w-auto"
              priority
            />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to continue to the admin panel
            </p>

            <form onSubmit={onSubmit} className="mt-7 space-y-5">
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
                    type="email"
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className={fieldCls}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
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
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`${fieldCls} pr-12`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-slate-400 transition hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-600"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
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
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Protected area — authorised staff only
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
