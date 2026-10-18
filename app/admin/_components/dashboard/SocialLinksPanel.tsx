import Link from "next/link";
import { ExternalLink } from "lucide-react";
import SectionHeading from "./SectionHeading";

export type SocialLinkItem = {
  id: string;
  icon: string;
  link: string;
};

/** Footer social icons with their target links. */
const SocialLinksPanel = ({ links }: { links: SocialLinkItem[] }) => (
  <div>
    <SectionHeading title="Social links" href="/admin/social" />
    <div className="rounded-xl bg-white p-4 shadow-sm">
      {links.length === 0 ? (
        <p className="text-sm text-slate-500">
          No social links yet.{" "}
          <Link href="/admin/social" className="text-blue-600 hover:underline">
            Add one
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {links.map((s) => (
            <li key={s.id} className="flex items-center gap-3">
              {s.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.icon}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain"
                />
              )}
              <a
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="flex min-w-0 items-center gap-1 text-sm text-slate-700 hover:text-blue-600"
              >
                <span className="truncate">{s.link}</span>
                <ExternalLink size={12} className="shrink-0 text-slate-400" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default SocialLinksPanel;
