import type { BusinessSettingsView, FooterGroupView, SocialView } from "@/lib/types";
import { logodark } from "@/public";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BackToTop from "../_components/BackToTop";

interface FooterProps {
  social?: SocialView[];
  footerLinks?: FooterGroupView[];
  settings?: BusinessSettingsView;
}

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
  "group flex items-center gap-2.5 text-[15px] text-slate-300 transition-colors hover:text-white";

const contactIconCls =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-blue-300 ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600";

const Footer = ({
  social = [],
  footerLinks = [],
  settings,
}: FooterProps) => {
  const s = {
    businessName: settings?.businessName?.trim() || "",
    phone: settings?.phone?.trim() || "",
    email: settings?.email?.trim() || "",
    address: settings?.address?.trim() || "",
    whatsappNumber: settings?.whatsappNumber?.trim() || "",
    whatsappMessage: settings?.whatsappMessage?.trim() || "",
    openingHours: settings?.openingHours?.trim() || "",
  };

  return (
    <footer className="relative overflow-hidden bg-[#0b1526]">
      {/* Accent hairline across the very top */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-blue-700 via-blue-500 to-cyan-400 opacity-80"
        aria-hidden
      />
      {/* soft decorative glows */}
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-1500 2xl:max-w-384 px-4 pt-9 pb-5 sm:px-6 sm:pt-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr] lg:gap-12">
          {/* ---------- Brand + contact + social ---------- */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src={logodark}
                alt="Mahi Computer"
                className="h-9 w-auto object-contain"
                priority={false}
              />
            </Link>

            <p className="mt-2.5 max-w-sm text-[15px] leading-7 text-slate-400">
              মাহি কম্পিউটার ট্রেনিং সেন্টার, গুলশান — হাতে-কলমে প্রশিক্ষণ, অভিজ্ঞ
              প্রশিক্ষক ও ক্যারিয়ার-কেন্দ্রিক কম্পিউটার কোর্স।
            </p>

            <ul className="mt-5 space-y-2.5">
              <li>
                <a
                  href={`tel:${s.phone.replace(/[\s()-]/g, "")}`}
                  className={contactRowCls}
                >
                  <span className={contactIconCls} aria-hidden>
                    <Phone size={15} />
                  </span>
                  <span>{s.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${s.email}`} className={contactRowCls}>
                  <span className={contactIconCls} aria-hidden>
                    <Mail size={15} />
                  </span>
                  <span>{s.email}</span>
                </a>
              </li>
              {s.whatsappNumber && (
                <li>
                  <a
                    href={`https://wa.me/${s.whatsappNumber}${
                      s.whatsappMessage ? `?text=${encodeURIComponent(s.whatsappMessage)}` : ""
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={contactRowCls}
                  >
                    <span
                      className={`${contactIconCls} group-hover:bg-[#25d366] group-hover:ring-[#25d366]`}
                      aria-hidden
                    >
                      <MessageCircle size={15} />
                    </span>
                    <span>WhatsApp: {s.whatsappNumber}</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactRowCls}
                >
                  <span className={contactIconCls} aria-hidden>
                    <MapPin size={15} />
                  </span>
                  <span className="leading-6">{s.address}</span>
                </a>
              </li>
              {s.openingHours && (
                <li className={contactRowCls}>
                  <span className={contactIconCls} aria-hidden>
                    <Clock size={15} />
                  </span>
                  <span className="leading-6">{s.openingHours}</span>
                </li>
              )}
            </ul>

          </div>

          {/* ---------- Link groups (admin-managed) ---------- */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.id} className="min-w-0">
                <h3 className="text-[15px] font-bold uppercase tracking-wider text-white">
                  {group.title}
                </h3>
                <span
                  className="mt-1.5 block h-0.5 w-6 rounded-full bg-blue-500"
                  aria-hidden
                />

                <ul className="mt-3 space-y-1">
                  {group.links.map((item) => {
                    const href = toHref(item.link);
                    const external = isExternal(href);
                    const scheme = isScheme(href);
                    const cls =
                      "-mx-2 inline-flex rounded-md px-2 py-1 text-[15px] text-slate-400 transition-colors duration-200 hover:text-white";
                    const inner = <>{item.name}</>;

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

            {/* Always-present quick help column so an empty admin config
                never leaves this area blank on small screens. */}
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold uppercase tracking-wider text-white">
                সহায়তা
              </h3>
              <span
                className="mt-1.5 block h-0.5 w-6 rounded-full bg-blue-500"
                aria-hidden
              />
              <ul className="mt-3 space-y-1">
                {[
                  { name: "নোটিশ", href: "/notice" },
                  { name: "সকল কোর্স", href: "/courses" },
                  { name: "যোগাযোগ", href: "/contact" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="-mx-2 inline-flex rounded-md px-2 py-1 text-[15px] text-slate-400 transition-colors duration-200 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="mt-7 flex flex-col items-center gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-between">
          <p className="text-center text-[13.5px] text-slate-500 sm:text-left">
            © {new Date().getFullYear()} {s.businessName || "Mahi Computer"}. সর্বস্বত্ব সংরক্ষিত।{" "}
            <span className="hidden text-slate-600 sm:inline">
              · Gulshan, Dhaka
              </span>
          </p>

          {/* Social icons — live in the copyright bar, right of the text */}
          {social.length > 0 && (
            <ul className="flex items-center gap-2.5">
              {social.map((item) => {
                // Derive a readable label ("facebook") from the icon filename.
                const platform =
                  item.icon.split("/").pop()?.replace(/\.\w+$/, "") || item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="group flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:ring-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      <Image
                        src={item.icon}
                        alt=""
                        aria-hidden
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="text-[13.5px] text-slate-500 transition-colors hover:text-slate-300"
            >
              স্টাফ লগইন
            </Link>
            <span className="h-3 w-px bg-white/10" aria-hidden />
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
