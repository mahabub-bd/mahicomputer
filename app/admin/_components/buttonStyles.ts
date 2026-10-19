/**
 * Admin button system — modern squared (rounded-lg) buttons.
 *
 * Three surface variants (primary / secondary / danger) plus ghost and
 * dark for colored backgrounds, in two sizes. Prefer btn() in new
 * markup; the exported constants are the md-size variants used by
 * page headers, toolbars and detail actions.
 */

const focusCls = "focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  primary: `bg-blue-600 text-white shadow-sm hover:bg-blue-500 hover:shadow-md ${focusCls} focus-visible:outline-blue-500 disabled:pointer-events-none disabled:opacity-50`,
  secondary: `border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 ${focusCls} focus-visible:outline-slate-400 disabled:pointer-events-none disabled:opacity-50`,
  danger: `border border-rose-200 bg-rose-50 text-rose-600 shadow-sm hover:border-rose-300 hover:bg-rose-100 ${focusCls} focus-visible:outline-rose-500 disabled:pointer-events-none disabled:opacity-50`,
  ghost: `text-slate-600 hover:bg-slate-100 hover:text-slate-900 ${focusCls} focus-visible:outline-slate-400 disabled:pointer-events-none disabled:opacity-50`,
  /** For dark surfaces (sidebar menu, gradient dashboard cards). */
  dark: `bg-white/10 text-white hover:bg-white/20 ${focusCls} focus-visible:outline-white disabled:pointer-events-none disabled:opacity-50`,
} as const;

const sizes = {
  sm: "gap-1.5 px-3 py-1.5 text-[13px]",
  md: "gap-2 px-4 py-2 text-sm",
} as const;

const iconSizes = {
  sm: "p-1.5",
  md: "p-2",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

/** Labeled button: btn("primary"), btn("secondary", "sm") … */
export function btn(variant: Variant, size: Size = "md"): string {
  return `inline-flex items-center justify-center rounded-lg font-semibold transition duration-150 active:translate-y-px ${variants[variant]} ${sizes[size]}`;
}

/** Square icon-only button: btnIcon("danger") … */
export function btnIcon(variant: Variant, size: Size = "sm"): string {
  return `inline-flex items-center justify-center rounded-lg transition duration-150 active:translate-y-px ${variants[variant]} ${iconSizes[size]}`;
}

/** md-size presets (PageHeader, DetailActions, list toolbars). */
export const primaryBtnCls = btn("primary");
export const secondaryBtnCls = btn("secondary");
export const dangerBtnCls = btn("danger");
