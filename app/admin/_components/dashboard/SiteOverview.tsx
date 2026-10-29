import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ExternalLink } from "lucide-react";
import SectionHeading from "./SectionHeading";

export interface ContactInfoItem {
  label: string;
  value: string;
  Icon: LucideIcon;
  href?: string;
}

export interface SocialLinkItem {
  id: string;
  icon: string;
  link: string;
}

interface SiteOverviewProps {
  contactInfo: ContactInfoItem[];
  links: SocialLinkItem[];
}

/** How many social rows fit the rail before the panel turns into a list. */
const SOCIAL_LIMIT = 4;

/**
 * The public contact details plus the footer social links in one rail card —
 * both are edited on the same page, so they no longer take two cards.
 */
const SiteOverview = ({ contactInfo, links }: SiteOverviewProps) => {
  const hasContact = contactInfo.length > 0;
  const hasLinks = links.length > 0;

  return (
    <div className="min-w-0">
      <SectionHeading title="Site overview" href="/admin/business-settings" />
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {!hasContact && !hasLinks ? (
          <p className="p-5 text-sm text-slate-500">
            No contact info or social links yet.{" "}
            <Link href="/admin/business-settings" className="text-blue-600 hover:underline">
              Add them
            </Link>
            .
          </p>
        ) : (
          <>
            {hasContact && (
              <ul className="space-y-3 p-5">
                {contactInfo.map(({ label, value, Icon, href }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Icon size={15} aria-hidden />
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

            {hasLinks && (
              <div className="border-t border-slate-100 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Social links
                </p>
                <ul className="mt-2.5 space-y-2">
                  {links.slice(0, SOCIAL_LIMIT).map((link) => (
                    <li key={link.id} className="flex items-center gap-2.5">
                      {link.icon && (
                        // eslint-disable-next-line @next/next/no-img-element -- icon URL is pasted by the admin
                        <img
                          src={link.icon}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-4 w-4 shrink-0 object-contain"
                        />
                      )}
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-w-0 items-center gap-1 text-sm text-slate-700 hover:text-blue-600"
                      >
                        <span className="truncate">{link.link}</span>
                        <ExternalLink size={12} className="shrink-0 text-slate-400" />
                      </a>
                    </li>
                  ))}
                </ul>
                {links.length > SOCIAL_LIMIT && (
                  <p className="mt-2 text-xs text-slate-400">
                    +{links.length - SOCIAL_LIMIT} more on the business settings page
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SiteOverview;
