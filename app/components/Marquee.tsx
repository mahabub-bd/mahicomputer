import type { SiteSettingsView } from "@/lib/types";
import { BadgeCheck, Megaphone } from "lucide-react";

interface MarqueeProps {
  settings?: SiteSettingsView;
}

const MarqueeList = ({ items, hidden = false }: { items: string[]; hidden?: boolean }) => (
  <ul
    className="flex w-max shrink-0 items-center"
    aria-hidden={hidden || undefined}
  >
    {items.map((item) => (
      <li
        key={item}
        className="flex items-center gap-2.5 whitespace-nowrap px-5 py-2.5 font-bangla text-[15px] font-normal text-blue-100/90"
      >
        <BadgeCheck size={16} className="shrink-0 text-amber-400" aria-hidden />
        {item}
      </li>
    ))}
  </ul>
);

const Marquee = ({ settings }: MarqueeProps) => {
  const items = settings?.marqueeItems?.filter((s) => s.trim()) ?? [];

  return (
    <section
      role="marquee"
      aria-label="প্রতিষ্ঠানের ঘোষণা"
      className="flex items-center gap-3 overflow-hidden border-b border-white/10 bg-[#101f38] pl-3 pr-2 sm:pl-4"
    >
      {/* Static label chip */}
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 font-bangla text-[12px] font-bold text-slate-900 sm:px-4">
        <Megaphone size={14} aria-hidden />
        <span className="hidden vxs:inline">ঘোষণা</span>
      </span>

      {/* Scrolling track (pauses on hover, seamless loop) */}
      <div className="marquee relative flex-1 overflow-hidden">
        {/* Edge fades */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-[#101f38] to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-[#101f38] to-transparent"
        />

        <div className="marquee-track flex w-max items-center">
          <MarqueeList items={items} />
          {/* Duplicated copy drives the seamless loop; hidden from AT */}
          <MarqueeList items={items} hidden />
        </div>
      </div>
    </section>
  );
};

export default Marquee;
