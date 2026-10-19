"use client";

import { Loader2 } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithRef,
  ReactNode,
} from "react";
import { btn } from "./buttonStyles";
import { checkboxCls, errorCls, hintCls, inputCls, labelCls, submitCls } from "./inputs";


const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

interface FieldProps {
 
  label?: ReactNode;
  htmlFor?: string;
  
  required?: boolean;
 
  hint?: ReactNode;

  error?: ReactNode;
  className?: string;
  children: ReactNode;
}


export const Field = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: FieldProps) => (
  <div className={className}>
    {label !== undefined && (
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className={errorCls}>{error}</p>
    ) : hint ? (
      <p className={hintCls}>{hint}</p>
    ) : null}
  </div>
);

/** Icon-left, roomier control used by the public contact form. */
const siteInputCls =
  "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-[15px] text-slate-800 transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50";

/** Frosted pill used on the admin login card (the `login-field` hook keeps autofill on-brand). */
const loginInputCls =
  "login-field w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-11 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 transition duration-200 outline-none hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/12";

const inputVariants = {
  default: inputCls,
  /** Borderless, transparent — for embedding inside a custom container (e.g. the dark newsletter pill). */
  onDark:
    "w-full min-w-0 bg-transparent px-4 py-2.5 text-[14px] text-white outline-none placeholder:text-slate-500",
  site: siteInputCls,
  login: loginInputCls,
} as const;

export type InputVariant = keyof typeof inputVariants;

interface InputProps extends ComponentPropsWithRef<"input"> {
  variant?: InputVariant;
}

export const Input = ({ variant = "default", className, ...props }: InputProps) => (
  <input className={cx(inputVariants[variant], className)} {...props} />
);

const textareaVariants = {
  default: inputCls,
  /** Matches the `site` input variant (multi-line). */
  site: siteInputCls,
} as const;

export type TextareaVariant = keyof typeof textareaVariants;

interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  variant?: TextareaVariant;
}

export const Textarea = ({ variant = "default", className, ...props }: TextareaProps) => (
  <textarea className={cx(textareaVariants[variant], className)} {...props} />
);

export const Select = ({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"select">) => (
  <select className={cx(inputCls, "cursor-pointer", className)} {...props}>
    {children}
  </select>
);

interface CheckboxProps extends Omit<ComponentPropsWithRef<"input">, "type"> {
  label: ReactNode;
  className?: string;
}

/** Labeled checkbox used for "Published" toggles and similar options. */
export const Checkbox = ({ label, className, ...props }: CheckboxProps) => (
  <label className={cx("flex cursor-pointer items-center gap-2 text-sm text-slate-700", className)}>
    <input type="checkbox" className={checkboxCls} {...props} />
    {label}
  </label>
);

const submitVariants = {
  primary: submitCls,
  /** Solid blue, compact — sits inside a custom container such as the newsletter pill. */
  onDark:
    "inline-flex shrink-0 items-center justify-center gap-1.5 bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white transition duration-150 hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-60",
  /** Public contact-form button. */
  site: "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-8 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60",
  /** Full-width gradient button on the admin login card. */
  login:
    "flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-sky-500 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-200 hover:from-blue-500 hover:to-sky-400 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
} as const;

export type SubmitVariant = keyof typeof submitVariants;

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shows the busy label + spinner and disables the button. */
  busy?: boolean;
  busyLabel?: string;
  variant?: SubmitVariant;
  children: ReactNode;
}

/** Submit button with a built-in busy/loading state. */
export const SubmitButton = ({
  busy,
  busyLabel = "Saving…",
  variant = "primary",
  children,
  className,
  disabled,
  ...props
}: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={busy || disabled}
    className={cx(submitVariants[variant], className)}
    {...props}
  >
    {busy ? (
      <>
        <Loader2 size={16} className="animate-spin" aria-hidden />
        {busyLabel}
      </>
    ) : (
      children
    )}
  </button>
);

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "dark";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
}


export const Button = ({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button type={type} className={cx(btn(variant, size), className)} {...props} />
);
