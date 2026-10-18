import Link from "next/link";
import { Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ContactInfoItem {
  label: string;
  value: string;
  Icon: LucideIcon;
  href?: string;
}

/** Contact details pulled from site settings, with an "Edit settings" link. */
const SiteInfo = ({ contactInfo }: { contactInfo: ContactInfoItem[] }) => (
  <div>
    <h2 className="mb-3 text-lg font-semibold text-slate-900">Site info</h2>
    <div className="rounded-xl bg-white p-4 shadow-sm">
      {contactInfo.length === 0 ? (
        <p className="text-sm text-slate-500">
          No contact info set.{" "}
          <Link href="/admin/settings" className="text-blue-600 hover:underline">
            Add it
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {contactInfo.map(({ label, value, Icon, href }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="mt-0.5 text-slate-400">
                <Icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">{label}</p>
                {href ? (
                  <a
                    href={href}
                    className="block truncate text-sm text-slate-700 hover:text-blue-600"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="truncate text-sm text-slate-700">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/admin/settings"
        className="mt-4 flex items-center justify-center gap-2 rounded-md border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        <Settings size={15} />
        Edit settings
      </Link>
    </div>
  </div>
);

export default SiteInfo;
