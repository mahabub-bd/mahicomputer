import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

/** Shared section heading: title (+ optional badge) with a right-aligned action pill. */
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
    <h2 className="flex items-center gap-2 text-[17px] font-bold text-slate-900">
      {title}
      {children}
    </h2>
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
    >
      {action}
      <ArrowUpRight size={13} />
    </Link>
  </div>
);

export default SectionHeading;
