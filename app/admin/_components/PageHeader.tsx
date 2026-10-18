import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  addHref?: string;
  addLabel?: string;
  /** Renders a "Back to list" button on the right side of the header. */
  backHref?: string;
  backLabel?: string;
}

const PageHeader = ({
  title,
  description,
  addHref,
  addLabel = "Add new",
  backHref,
  backLabel = "Back to list",
}: PageHeaderProps) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>

    {(backHref || addHref) && (
      <div className="flex flex-wrap items-center gap-2.5">
        {backHref && (
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden
            />
            {backLabel}
          </Link>
        )}
        {addHref && (
          <Link
            href={addHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-md"
          >
            <Plus size={15} aria-hidden />
            {addLabel}
          </Link>
        )}
      </div>
    )}
  </div>
);

export default PageHeader;
