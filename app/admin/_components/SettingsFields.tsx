import { ImageIcon } from "lucide-react";
import type { ReactNode } from "react";

const LABEL = "text-[11px] font-semibold uppercase tracking-wider text-slate-400";

interface ReadFieldProps {
  label: string;
  value: ReactNode;
  /** Span both grid columns (long values: titles, sentences, URLs). */
  wide?: boolean;
  /** Render as a wrapping paragraph instead of a single truncated line. */
  text?: boolean;
}

/** Read-only label/value cell used by the settings view pages. */
export const ReadField = ({ label, value, wide = false, text = false }: ReadFieldProps) => {
  const empty = value === "" || value === null || value === undefined;
  return (
    <div className={wide ? "min-w-0 sm:col-span-2" : "min-w-0"}>
      <dt className={LABEL}>{label}</dt>
      <dd
        className={`mt-1 text-sm text-slate-800 ${
          text ? "whitespace-pre-wrap wrap-break-word leading-relaxed" : "wrap-break-word font-medium"
        }`}
      >
        {empty ? <span className="text-slate-400">—</span> : value}
      </dd>
    </div>
  );
};

/** Two-column label/value grid that holds ReadField cells. */
export const ReadGrid = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <dl className={`grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 ${className}`}>
    {children}
  </dl>
);

interface ReadImageProps {
  label: string;
  src?: string;
  /** Size + shape utilities, e.g. "h-28 w-44" or "aspect-video w-full". */
  className?: string;
  /** Shown instead of the image when nothing is stored. */
  emptyLabel?: string;
}

/** Image slot with a dashed placeholder — settings keep a default until one is uploaded. */
export const ReadImage = ({
  label,
  src,
  className = "h-28 w-44",
  emptyLabel = "Default image",
}: ReadImageProps) => (
  <figure className="min-w-0">
    <figcaption className={LABEL}>{label}</figcaption>
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element -- uploads live on an external blob host
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className={`mt-1 ${className} rounded-lg bg-slate-50 object-cover ring-1 ring-slate-200`}
      />
    ) : (
      <span
        className={`mt-1 ${className} flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-[11px] text-slate-400`}
      >
        <ImageIcon className="h-4 w-4" aria-hidden />
        {emptyLabel}
      </span>
    )}
  </figure>
);
