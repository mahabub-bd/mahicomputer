import type { SiteSettingsView, SocialView } from "@/lib/types";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

interface PreHeaderProps {
  social?: SocialView[];
  settings?: SiteSettingsView;
}

const CONTACT = {
  phone: "+8801711102944",
  email: "info@mahicomputerbd.com",
  location: "গুলশান, ঢাকা",
};

/** Slim utility bar above the navbar: contact details + social links. */
const PreHeader = ({ social = [], settings }: PreHeaderProps) => {
  const phone = settings?.phone?.trim() || CONTACT.phone;
  const email = settings?.email?.trim() || CONTACT.email;
  const location = settings?.address?.trim() || CONTACT.location;

  return (
    <div className="hidden border-b border-white/10 bg-[#07294D] sm:block">
      <div className="mx-auto flex h-10 max-w-350 2xl:max-w-[1536px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Contact details — each extra item needs more room, so they drop
            out one by one on narrow screens instead of overflowing. */}
        <div className="flex min-w-0 items-center gap-4 font-bangla text-[13px] text-blue-100/80 lg:gap-5">
          <a
            href={`tel:${phone.replace(/[\s()-]/g, "")}`}
            className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-white"
          >
            <Phone size={13} className="text-blue-300" aria-hidden />
            {phone}
          </a>

          <span aria-hidden className="hidden h-3.5 w-px bg-white/15 md:block" />
          <a
            href={`mailto:${email}`}
            className="hidden min-w-0 items-center gap-1.5 transition-colors hover:text-white md:flex"
          >
            <Mail size={13} className="shrink-0 text-blue-300" aria-hidden />
            <span className="truncate">{email}</span>
          </a>

          <span aria-hidden className="hidden h-3.5 w-px bg-white/15 lg:block" />
          <span className="hidden min-w-0 items-center gap-1.5 text-blue-100/60 lg:flex">
            <MapPin size={13} className="shrink-0 text-rose-300" aria-hidden />
            <span className="truncate">{location}</span>
          </span>
        </div>

        {/* Admission status + social links */}
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 font-bangla text-[12px] font-semibold text-emerald-200 ring-1 ring-emerald-300/20 md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden />
            ভর্তি চলছে
          </span>

          {social.length > 0 && (
            <div className="flex items-center gap-2.5">
              <span className="hidden font-bangla text-[12px] text-blue-100/50 lg:inline">
                ফলো করুন
              </span>
              <div className="flex items-center gap-1">
                {social.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    aria-label={item.id}
                    title={item.id}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  >
                    {item.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.icon}
                        alt=""
                        aria-hidden
                        className="h-3.5 w-3.5 object-contain"
                      />
                    ) : (
                      <Globe size={14} className="text-blue-100" aria-hidden />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreHeader;
