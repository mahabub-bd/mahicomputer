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
      <div className="mx-auto flex h-10 max-w-350 items-center justify-between px-6">
        {/* Contact details */}
        <div className="flex items-center gap-5 font-bangla text-[13px] text-blue-100/80">
          <a
            href={`tel:${phone.replace(/[\s()-]/g, "")}`}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Phone size={13} className="text-blue-300" aria-hidden />
            {phone}
          </a>
          <span aria-hidden className="h-3.5 w-px bg-white/15" />
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Mail size={13} className="text-blue-300" aria-hidden />
            {email}
          </a>
          <span aria-hidden className="h-3.5 w-px bg-white/15" />
          <span className="flex items-center gap-1.5 text-blue-100/60">
            <MapPin size={13} className="text-rose-300" aria-hidden />
            {location}
          </span>
        </div>

        {/* Social links */}
        {social.length > 0 && (
          <div className="flex items-center gap-2.5">
            <span className="font-bangla text-[12px] text-blue-100/50">
              ফলো করুন
            </span>
            <div className="flex items-center gap-1">
              {social.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  aria-label={item.id}
                  title={item.id}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-md"
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
  );
};

export default PreHeader;
