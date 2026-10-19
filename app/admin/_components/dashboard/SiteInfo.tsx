import Link from "next/link";
import { Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { btn } from "../buttonStyles";

export interface ContactInfoItem {
  label: string;
  value: string;
  Icon: LucideIcon;
  href?: string;
}

/** Contact details pulled from site settings, with an "Edit settings" link. */
const SiteInfo = ({ contactInfo }: { contactInfo: ContactInfoItem[] }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
    <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
      Site info
    </h2>
    {contactInfo.length === 0 ? (
      <p className="mt-3 text-sm text-slate-500">
        No contact info set.{" "}
        <Link href="/admin/settings" className="text-blue-600 hover:underline">
          Add it
        </Link>
        .
      </p>
    ) : (
      <ul className="mt-3 space-y-3">
        {contactInfo.map(({ label, value, Icon, href }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Icon size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="block truncate text-sm font-medium text-slate-700 hover:text-blue-600"
                >
                  {value}
                </a>
              ) : (
                <p className="truncate text-sm font-medium text-slate-700">{value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}

    <Link href="/admin/settings" className={`mt-5 ${btn("secondary")}`}>
      <Settings size={15} />
      Edit settings
    </Link>
  </div>
);

export default SiteInfo;
