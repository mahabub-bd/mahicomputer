import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { primaryBtnCls, secondaryBtnCls } from "@/components/form/buttonStyles";

interface PageHeaderProps {
  title: string;
  /** Status pill (or similar) rendered beside the title. */
  badge?: ReactNode;
  /** Subtitle below the title. */
  description?: ReactNode;
  addHref?: string;
  addLabel?: string;
  /** Renders a "Back to list" button on the right side of the header. */
  backHref?: string;
  backLabel?: string;
  /** Right-side action slot — detail pages pass <DetailActions /> here. */
  actions?: ReactNode;
}

const PageHeader = ({
  title,
  badge,
  description,
  addHref,
  addLabel = "Add new",
  backHref,
  backLabel = "Back to list",
  actions,
}: PageHeaderProps) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {badge}
      </div>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>

    {(backHref || addHref || actions) && (
      <div className="flex flex-wrap items-center gap-2.5">
        {backHref && (
          <Link
            href={backHref}
            className={`group ${secondaryBtnCls}`}
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden
            />
            {backLabel}
          </Link>
        )}
        {actions}
        {addHref && (
          <Link href={addHref} className={primaryBtnCls}>
            <Plus size={15} aria-hidden />
            {addLabel}
          </Link>
        )}
      </div>
    )}
  </div>
);

export default PageHeader;
