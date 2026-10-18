import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  addHref?: string;
  addLabel?: string;
}

const PageHeader = ({ title, description, addHref, addLabel = "Add new" }: PageHeaderProps) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    {addHref && (
      <Link
        href={addHref}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
      >
        + {addLabel}
      </Link>
    )}
  </div>
);

export default PageHeader;
