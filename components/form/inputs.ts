/**
 * Shared class strings for admin form controls.
 *
 * Prefer the typed components in ./FormControls (Input, Textarea, Select,
 * Checkbox, SubmitButton, Field) in new markup — they wrap these exact
 * classes so the look stays in one place. These strings remain for the
 * rare control the components don't cover yet.
 */

export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition duration-150 placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/12 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export const labelCls = "mb-1.5 block text-sm font-medium text-slate-700";

export const checkboxCls =
  "h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-blue-600 focus:ring-2 focus:ring-blue-500/40";

export const hintCls = "mt-1 text-xs text-slate-400";

export const errorCls = "mt-1 text-xs font-medium text-rose-600";

export const submitCls =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-500 hover:shadow-md active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:opacity-50";
