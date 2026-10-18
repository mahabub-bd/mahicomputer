import type { SiteSettingsView } from "@/lib/types";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from ".";
import styles from "../styles/style";

interface ContactProps {
  settings?: SiteSettingsView;
}

const Contact = ({ settings }: ContactProps) => {
  const s = {
    email: settings?.email?.trim() || "",
    phone: settings?.phone?.trim() || "",
    address: settings?.address?.trim() || "",
  };

  const channels = [
    {
      icon: Mail,
      label: "Email Us",
      value: s.email,
      href: `mailto:${s.email}`,
      external: false,
    },
    {
      icon: Phone,
      label: "Make A Call",
      value: s.phone,
      href: `tel:${s.phone.replace(/\s+/g, "")}`,
      external: false,
    },
    {
      icon: MapPin,
      label: "Corporate Office",
      value: s.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="section-shell relative bg-linear-to-br from-pink-50 via-blue-50 to-white"
    >
      <div className={`${styles.boxWidth} mx-auto px-4 sm:px-6`}>
        <h2
          className={`${styles.heading2} section-title text-center font-bangla`}
          data-aos="fade-up"
        >
          যোগাযোগ করুন
        </h2>
        <p
          className="mx-auto mt-3 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          ট্রেনিং সংক্রান্ত যে কোন বিষয়ে জানতে ইমেইল বা মেসেজ করুন
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-2 xl:gap-12">
          <div className="flex flex-col gap-4" data-aos="fade-right">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noreferrer" : undefined}
                className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <c.icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {c.label}
                  </span>
                  <span className="mt-1 block wrap-break-word text-[16px] font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-700">
                    {c.value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8"
            data-aos="fade-left"
          >
            <h3 className="text-[20px] font-bold text-slate-900">
              Send us a message
            </h3>
            <p className="mt-1 text-[14px] text-slate-500">
              Fill in the form and our team will reach out soon.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <div className="sm:flex hidden lg:block absolute shape-3" aria-hidden />
    </section>
  );
};

export default Contact;
