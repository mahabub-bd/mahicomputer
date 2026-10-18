import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/** Shared section heading: title (+ optional badge) with a right-aligned action link. */
const SectionHeading = ({
  title,
  href,
  action = "Manage",
  children,
}: {
  title: string;
  href: string;
  action?: string;
  children?: ReactNode;
}) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
      {title}
      {children}
    </h2>
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1 text-sm text-blue-600 hover:underline"
    >
      {action}
      <ArrowUpRight size={14} />
    </Link>
  </div>
);

export default SectionHeading;
