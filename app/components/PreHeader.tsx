import type { SocialView } from "@/lib/types";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

interface PreHeaderProps {
  social?: SocialView[];
}

const CONTACT = {
  phone: "+8801711102944",
  email: "info@mahicomputerbd.com",
};

/** Slim utility bar above the navbar: contact details + social links. */
const PreHeader = ({ social = [] }: PreHeaderProps) => {
  return (
    <div className="hidden border-b border-white/10 bg-[#07294D] sm:block">
      <div className="mx-auto flex h-9 max-w-350 items-center justify-between px-6">
        <div className="flex items-center gap-5 text-[13px] text-slate-300">
          <a
            href={`tel:${CONTACT.phone.replace(/[\s()-]/g, "")}`}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Phone size={13} className="text-blue-300" aria-hidden />
            {CONTACT.phone}
          </a>
          <span aria-hidden className="h-3 w-px bg-white/20" />
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Mail size={13} className="text-blue-300" aria-hidden />
            {CONTACT.email}
          </a>
        </div>

        {social.length > 0 && (
          <div className="flex items-center gap-1">
            {social.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                aria-label={item.id}
                className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/15"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt=""
                  aria-hidden
                  className="h-3.5 w-3.5 object-contain"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreHeader;
