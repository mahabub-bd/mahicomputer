import type { BusinessSettingsView, SocialLink } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Power,
} from "lucide-react";
import type { ReactNode } from "react";
import SectionCard from "./SectionCard";
import SocialList from "./SocialList";

interface BusinessSettingsViewProps {
  settings: BusinessSettingsView;
  socialLinks: SocialLink[];
}

/** Shared tile chrome — white icon chip, label above the value. */
const InfoTile = ({
  icon: Icon,
  label,
  value,
  wide = false,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  wide?: boolean;
}) => {
  const empty = value === "" || value === null || value === undefined;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
        <Icon size={16} aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-slate-800 wrap-break-word">
          {empty ? <span className="text-slate-400">—</span> : value}
        </div>
      </div>
    </div>
  );
};

/** Widget state pill shown beside the WhatsApp card title. */
const WidgetPill = ({ on }: { on: boolean }) => (
  <span
    className={`ml-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
      on
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : "bg-slate-100 text-slate-500 ring-slate-300"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${on ? "bg-emerald-500" : "bg-slate-400"}`}
      aria-hidden
    />
    {on ? "Widget on" : "Widget off"}
  </span>
);

/**
 * Read-only overview of the business settings singleton plus the social links
 * module. The identity / WhatsApp fields are edited in a modal owned by
 * `BusinessSettingsEditButton`; social links keep their own add + edit modals
 * (they are a list, not a singleton).
 */
const BusinessSettingsView = ({ settings, socialLinks }: BusinessSettingsViewProps) => {
  const phone = settings.phone.trim();
  const email = settings.email.trim();
  const mapUrl = settings.mapEmbedUrl.trim();
  const whatsapp = settings.whatsappNumber.trim();
  const preset = settings.whatsappMessage.trim();

  return (
    <div className="space-y-6">
      <SectionCard title="Business profile">
        {/* Identity strip — the values every public page header / footer pulls */}
        <div className="flex items-center gap-3.5 rounded-xl border border-blue-100/70 bg-linear-to-r from-blue-50/80 to-cyan-50/40 px-4 py-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-blue-500 to-cyan-500 text-white shadow-sm ring-1 ring-white/50">
            <Building2 size={20} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">
              {settings.businessName.trim() || "Business name not set"}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              Used in the footer, contact page and page titles.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoTile
            icon={Phone}
            label="Phone"
            value={
              phone ? (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-blue-600 hover:underline"
                >
                  {phone}
                </a>
              ) : (
                ""
              )
            }
          />
          <InfoTile
            icon={Mail}
            label="Email"
            value={
              email ? (
                <a href={`mailto:${email}`} className="hover:text-blue-600 hover:underline">
                  {email}
                </a>
              ) : (
                ""
              )
            }
          />
          <InfoTile icon={MapPin} label="Address" value={settings.address} wide />
          <InfoTile icon={Clock} label="Opening hours" value={settings.openingHours} wide />
          <InfoTile
            icon={Navigation}
            label="Google Maps embed"
            wide
            value={
              mapUrl ? (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex max-w-full items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <span className="truncate font-mono text-xs">{mapUrl}</span>
                  <ExternalLink size={13} className="shrink-0" aria-hidden />
                </a>
              ) : (
                <span className="text-xs text-slate-400">
                  No embed URL — the location section is hidden on the public site.
                </span>
              )
            }
          />
        </div>
      </SectionCard>

      <SectionCard title="WhatsApp chat" meta={<WidgetPill on={settings.whatsappEnabled} />}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <InfoTile
              icon={Phone}
              label="Number"
              value={whatsapp ? `+${whatsapp}` : ""}
            />
            <InfoTile
              icon={Power}
              label="Widget"
              value={
                settings.whatsappEnabled
                  ? "Shown bottom-right on every public page"
                  : "Hidden on the public site"
              }
            />
          </div>

          {/* Preview of the bubble a visitor sends when they tap the widget */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Preset message
            </p>
            {preset ? (
              <div className="mt-2 flex justify-end">
                <p className="max-w-[22rem] rounded-2xl rounded-tr-sm bg-emerald-50 px-3.5 py-2.5 text-sm text-slate-700 ring-1 ring-emerald-100 wrap-break-word">
                  {preset}
                  <span className="mt-1 block text-right text-[10px] text-emerald-600/70">
                    Just now ✓✓
                  </span>
                </p>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                No preset message — the chat opens empty.
              </p>
            )}
            <p className="mt-2 text-xs text-slate-400">
              Sent by the visitor when they tap the WhatsApp widget.
            </p>
          </div>
        </div>

        {!whatsapp && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-100">
            No WhatsApp number is set — the widget and the footer WhatsApp row stay hidden
            even when the toggle is on.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Social links" meta={`(${socialLinks.length})`}>
        <SocialList links={socialLinks} embedded />
      </SectionCard>
    </div>
  );
};

export default BusinessSettingsView;
