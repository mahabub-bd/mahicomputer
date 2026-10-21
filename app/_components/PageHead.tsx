import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

/**
 * Shared breadcrumb + page-head design used by every inner (site) page.
 *
 *  - <Breadcrumb>   — just the trail (Home icon → chevrons → current page).
 *  - <PageHead>     — gradient hero strip holding the breadcrumb, optionally
 *                     followed by the page title and subtitle.
 *
 * Pages whose first section already renders its own big heading (Courses,
 * About, Gallery…) only show the compact breadcrumb strip; simple list pages
 * (Notice, Blogs, Newsletters) also get title + subtitle here.
 */

export interface Crumb {
  label: string;
  href?: string;
}

const Breadcrumb = ({
  items,
  align = "center",
}: {
  items: Crumb[];
  align?: "left" | "center";
}) => (
  <nav
    aria-label="Breadcrumb"
    className={`flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-slate-500 ${
      align === "center" ? "justify-center" : ""
    }`}
  >
    <Link
      href="/"
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:text-blue-700 hover:bg-blue-50"
    >
      <Home size={13} aria-hidden />
      হোম
    </Link>

    {items.map((crumb) => (
      <span key={crumb.label} className="inline-flex items-center gap-1.5">
        <ChevronRight size={14} aria-hidden className="text-slate-300" />
        {!crumb.href ? (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="rounded-full px-2 py-1 transition-colors hover:text-blue-700 hover:bg-blue-50"
            >
              {crumb.label}
            </Link>
          )}
      </span>
    ))}
  </nav>
);

const PageHead = ({
  items,
  title,
  subtitle,
  align = "left",
}: {
  items: Crumb[];
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
}) => (
  <header className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-pink-50">
    {/* Soft decorative blobs — pointer-events-none so they never block taps */}
    <div
      aria-hidden
      className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-pink-200/40 blur-3xl"
    />

    <div
      className={`relative mx-auto max-w-350 px-4 sm:px-6 ${
        title ? "pt-5 pb-7 sm:pt-6 sm:pb-9" : "py-3 sm:py-3.5"
      }`}
    >
      <div data-aos="fade-down">
        <Breadcrumb items={items} align={align} />
      </div>
      {title && (
        <h1
          className="mt-4 text-center font-bangla text-[clamp(1.7rem,3.5vw,2.5rem)] font-bold leading-tight text-slate-900"
          data-aos="fade-up"
        >
          {title}
        </h1>
      )}
      {subtitle && (
        <p
          className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {subtitle}
        </p>
      )}
    </div>
  </header>
);

export { Breadcrumb, PageHead };
