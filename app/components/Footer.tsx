import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { logodark } from "@/public";
import {
  footerLinks as staticFooterLinks,
  socialMedia as staticSocial,
} from "../constants";
import styles from "../styles/style";
import type { FooterGroupView, SiteSettingsView, SocialView } from "@/lib/types";

interface FooterProps {
  social?: SocialView[];
  footerLinks?: FooterGroupView[];
  settings?: SiteSettingsView;
}

const defaults = {
  phone: "+8801711102944",
  email: "info@mahicomputerbd.com",
  address: "Ka-65 Shahajadpur, Gulshan, Dhaka-1212",
};

/**
 * Footer link values are admin-editable, so normalize stray shapes:
 * bare phone numbers become tel: links, "notice" becomes "/notice".
 */
const toHref = (raw: string) => {
  const v = (raw || "").trim();
  if (!v) return "#";
  if (/^(https?:|mailto:|tel:)/i.test(v) || v.startsWith("#")) return v;
  if (/^[+\d][\d\s()-]{5,}$/.test(v)) return `tel:${v.replace(/[\s()-]/g, "")}`;
  return v.startsWith("/") ? v : `/${v}`;
};

const isExternal = (href: string) => /^https?:/i.test(href);
const isScheme = (href: string) => /^(mailto:|tel:)/i.test(href);

const contactRowCls =
  "group flex items-start gap-3 text-[15px] text-slate-300 transition-colors hover:text-white";

const contactIconCls =
  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-blue-300 ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600";

const Footer = ({
  social = staticSocial,
  footerLinks = staticFooterLinks,
  settings,
}: FooterProps) => {
  // Empty admin fields should fall back to the defaults, not blank them out.
  const s = {
    phone: settings?.phone?.trim() || defaults.phone,
    email: settings?.email?.trim() || defaults.email,
    address: settings?.address?.trim() || defaults.address,
  };

  return (
    <footer className="relative overflow-hidden bg-[#101d36]">
      {/* soft decorative glows */}
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"
        aria-hidden
      />

      <div className={`${styles.boxWidth} relative px-4 pt-14 pb-10 sm:px-6 sm:pt-16`}>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
          {/* ---------- Brand + contact ---------- */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src={logodark}
                alt="Mahi Computer"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <ul className="mt-7 space-y-4">
              <li>
                <a
                  href={`tel:${s.phone.replace(/[\s()-]/g, "")}`}
                  className={contactRowCls}
                >
                  <span className={contactIconCls} aria-hidden>
                    <Phone size={16} />
                  </span>
                  {/* leading-9 matches the 36px icon tile so text stays optically centered */}
                  <span className="leading-9">{s.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${s.email}`} className={contactRowCls}>
                  <span className={contactIconCls} aria-hidden>
                    <Mail size={16} />
                  </span>
                  <span className="leading-9">{s.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactRowCls}
                >
                  <span className={contactIconCls} aria-hidden>
                    <MapPin size={16} />
                  </span>
                  <span className="leading-7">{s.address}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ---------- Link groups (admin-managed) ---------- */}
          <div className="flex flex-wrap gap-x-10 gap-y-10">
            {footerLinks.map((group) => (
              <div key={group.id} className="min-w-[170px] flex-1">
                <h3 className="text-[16px] font-bold text-white">
                  {group.title}
                </h3>
                <span
                  className="mt-2 block h-0.5 w-8 rounded-full bg-blue-500"
                  aria-hidden
                />

                <ul className="mt-4 space-y-2.5">
                  {group.links.map((item) => {
                    const href = toHref(item.link);
                    const external = isExternal(href);
                    const scheme = isScheme(href);
                    const cls =
                      "group inline-flex items-center gap-2 text-[14.5px] text-slate-300 transition-colors hover:text-white";
                    const inner = (
                      <>
                        <span
                          aria-hidden
                          className="h-1 w-1 rounded-full bg-blue-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        />
                        {item.name}
                      </>
                    );

                    return (
                      <li key={item.id}>
                        {external || scheme ? (
                          <a
                            href={href}
                            className={cls}
                            {...(external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {inner}
                          </a>
                        ) : (
                          <Link href={href} className={cls}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="mt-12 flex flex-col items-center gap-5 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <p className="text-[13px] text-slate-400">
            © {new Date().getFullYear()} Mahi Computer. All Rights Reserved.
          </p>

          <div className="flex items-center gap-3">
            {social.map((item) => {
              // Derive a readable label ("facebook") from the icon filename.
              const platform =
                item.icon.split("/").pop()?.replace(/\.\w+$/, "") || item.id;
              return (
                <Link
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:ring-blue-600"
                >
                  <Image
                    src={item.icon}
                    alt=""
                    aria-hidden
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px] object-contain"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
