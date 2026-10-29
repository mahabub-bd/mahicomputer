import type { BusinessSettingsView, SocialView } from "@/lib/types";
import { Clock, Globe, Mail, MapPin, MessageSquareQuote, Phone } from "lucide-react";
import { ContactForm } from ".";

/** Static office hours (PreHeader-style fallback info). */
const OFFICE_HOURS = {
  days: "শনিবার – বৃহস্পতিবার",
  time: "সকাল ৯টা – রাত ৮টা",
};

interface ContactProps {
  settings?: BusinessSettingsView;
  social?: SocialView[];
}

const Contact = ({ settings, social = [] }: ContactProps) => {
  const s = {
    email: settings?.email?.trim() || "",
    phone: settings?.phone?.trim() || "",
    address: settings?.address?.trim() || "",
  };

  const channels = [
    {
      icon: Mail,
      label: "ইমেইল করুন",
      value: s.email,
      href: `mailto:${s.email}`,
      external: false,
    },
    {
      icon: Phone,
      label: "কল করুন",
      value: s.phone,
      href: `tel:${s.phone.replace(/\s+/g, "")}`,
      external: false,
    },
    {
      icon: MapPin,
      label: "অফিসের ঠিকানা",
      value: s.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="section-shell relative scroll-mt-24 overflow-hidden bg-linear-to-b from-blue-50/80 via-blue-50/30 to-white"
    >
      {/* Soft brand glows */}
      <span
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-[#EC1B24]/8 blur-3xl"
        aria-hidden
      />

      <div className="w-full px-4 sm:px-6 2xl:max-w-[1536px] 2xl:mx-auto">
        {/* Section header */}
        <p
          className="text-center font-bangla text-[13px] font-bold uppercase tracking-[0.2em] text-blue-600"
          data-aos="fade-up"
        >
          যোগাযোগ
        </p>
        <h2
          className="section-title mt-2 text-center font-bangla"
          data-aos="fade-up"
          data-aos-delay="60"
        >
          যোগাযোগ করুন
        </h2>
        <div
          className="mx-auto mt-4 h-1 w-16 rounded-full bg-blue-600/70"
          aria-hidden
        />
        <p
          className="mx-auto mt-4 max-w-2xl text-center font-bangla text-[16px] leading-7 text-slate-500"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          ট্রেনিং সংক্রান্ত যে কোন বিষয়ে জানতে ইমেইল বা মেসেজ করুন
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 xl:gap-12">
          <div className="flex flex-col justify-between gap-4" data-aos="fade-right">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noreferrer" : undefined}
                className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/10"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600/20">
                  <c.icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block font-bangla text-[13px] font-semibold text-slate-400">
                    {c.label}
                  </span>
                  <span className="mt-1 block wrap-break-word text-[16px] font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-700">
                    {c.value}
                  </span>
                </span>
              </a>
            ))}

            {social.length > 0 && (
              <div
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                data-aos="fade-right"
                data-aos-delay="150"
              >
                <p className="font-bangla text-[13px] font-semibold text-slate-500">
                  সোশ্যাল মিডিয়ায় আমাদের ফলো করুন
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  {social.map((item) => (
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.id}
                      title={item.id}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:ring-blue-600"
                    >
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          aria-hidden
                          className="h-4.5 w-4.5 object-contain"
                        />
                      ) : (
                        <Globe size={18} className="text-blue-600" aria-hidden />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div
              className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 ring-1 ring-blue-100">
                <Clock size={20} aria-hidden />
              </span>
              <span>
                <span className="block font-bangla text-[13px] font-semibold text-slate-500">
                  অফিস সময়
                </span>
                <span className="mt-0.5 block font-bangla text-[15px] font-bold text-slate-800">
                  {OFFICE_HOURS.days} · {OFFICE_HOURS.time}
                </span>
              </span>
            </div>
          </div>

          <div
            className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50"
            data-aos="fade-left"
          >
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <MessageSquareQuote size={20} aria-hidden />
                </span>
                <span>
                  <h3 className="font-bangla text-[20px] font-bold text-slate-900">
                    আমাদের বার্তা পাঠান
                  </h3>
                  <p className="mt-1 font-bangla text-[14px] leading-6 text-slate-500">
                    ফর্মটি পূরণ করুন — আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                  </p>
                </span>
              </div>
              <div className="mt-6 flex flex-1 flex-col justify-start">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
