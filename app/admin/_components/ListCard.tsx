import type { ReactNode } from "react";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

interface ListCardField {
  label: string;
  value: ReactNode;
  /** Span the full card width (long values like emails or addresses). */
  wide?: boolean;
}

interface ListCardProps {
  /** Detail page the title links to — omit for a plain title. */
  href?: string;
  title: ReactNode;
  /** Small grey line under the title (email, date, excerpt…). */
  subtitle?: ReactNode;
  /** Thumbnail next to the title, e.g. <CardThumb …/>. */
  media?: ReactNode;
  /** Status pills / rating shown at the top-right. */
  badges?: ReactNode;
  /** Free-form body under the header (truncated notice text…). */
  body?: ReactNode;
  /** Label/value grid under the header. */
  fields?: ListCardField[];
  /** Edit/delete row, shown in a tinted footer bar. */
  actions?: ReactNode;
}

const TITLE = "min-w-0 flex-1 text-[15px] font-semibold leading-snug text-slate-900";

/** Shared mobile list card (renders an <li>) used below md by every admin list. */
const ListCard = ({
  href,
  title,
  subtitle,
  media,
  badges,
  body,
  fields,
  actions,
}: ListCardProps) => (
  <li className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
    <div className="p-4">
      <div className="flex items-start gap-3">
        {media}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            {href ? (
              <Link
                href={href}
                className={`${TITLE} hover:text-blue-700 hover:underline`}
              >
                {title}
              </Link>
            ) : (
              <p className={TITLE}>{title}</p>
            )}
            {badges && (
              <span className="flex shrink-0 items-center gap-1.5">{badges}</span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>

      {body && <div className="mt-2">{body}</div>}

      {fields && fields.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-slate-100 pt-3">
          {fields.map((f) => (
            <div key={f.label} className={f.wide ? "col-span-2 min-w-0" : "min-w-0"}>
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                {f.label}
              </dt>
              <dd className="mt-0.5 truncate text-sm font-medium text-slate-700">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>

    {actions && (
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
        {actions}
      </div>
    )}
  </li>
);

const THUMB_SHAPES = {
  square: "h-12 w-12 rounded-lg",
  wide: "h-14 w-24 rounded-lg",
  avatar: "h-10 w-10 rounded-full",
} as const;

/** Uniform thumbnail for ListCard (placeholder tile when there is no image). */
export const CardThumb = ({
  src,
  alt = "",
  shape = "square",
  fit = "cover",
}: {
  src?: string | null;
  alt?: string;
  shape?: keyof typeof THUMB_SHAPES;
  fit?: "cover" | "contain";
}) =>
  src ? (
    // eslint-disable-next-line @next/next/no-img-element -- thumbs live on an external upload host without a next/image loader
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`${THUMB_SHAPES[shape]} shrink-0 bg-slate-50 ${
        fit === "contain" ? "object-contain" : "object-cover"
      }`}
    />
  ) : (
    <span
      className={`${THUMB_SHAPES[shape]} flex shrink-0 items-center justify-center bg-slate-100 text-slate-300`}
    >
      <ImageIcon className="h-4 w-4" aria-hidden />
    </span>
  );

export default ListCard;
