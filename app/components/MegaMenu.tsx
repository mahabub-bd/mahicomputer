import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ADMISSION_META } from "@/lib/admission";
import type { CourseView } from "@/lib/types";

interface MegaMenuProps {
  menuLink: CourseView[];
  menu: string;
}

const MegaMenu = ({ menuLink, menu }: MegaMenuProps) => {
  if (menuLink.length === 0) return null;

  // Switch to a multi-column layout once the list gets long.
  const wide = menuLink.length > 8;

  return (
    <div
      className={`features-mega-menu ${
        wide
          ? "w-[min(90vw,660px)] lg:w-[min(90vw,990px)]"
          : "w-[min(90vw,390px)]"
      }`}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_24px_60px_-15px_rgba(15,35,75,0.30)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            কোর্স দেখুন
          </p>
          <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-[11px] font-bold text-blue-700">
            {menuLink.length} টি কোর্স
          </span>
        </div>

        <ul
          className={`p-2 ${
            wide
              ? "grid grid-cols-2 gap-x-1 lg:grid-cols-3"
              : "flex flex-col"
          }`}
        >
          {menuLink.map((item) => (
            <li key={item.link}>
              <Link
                href={`/${menu}/${item.link}`}
                className="group/course flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {item.courseImg && (
                  <span className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-100">
                    <Image
                      src={item.courseImg}
                      alt={item.courseImgalt || item.title}
                      width={56}
                      height={40}
                      className="h-full w-full object-cover transition duration-300 group-hover/course:scale-110"
                    />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-slate-800 transition-colors group-hover/course:text-blue-700">
                    {item.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-400">
                    <span className="truncate">
                      {item.tag} · {item.duration} months
                    </span>
                    {/* Lifecycle label — "ভর্তি চলছে" stands out when open. */}
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        ADMISSION_META[item.admission ?? "OPEN"].adminPill
                      }`}
                    >
                      {ADMISSION_META[item.admission ?? "OPEN"].label}
                    </span>
                  </span>
                </span>
                <ChevronRight
                  size={16}
                  className="shrink-0 text-slate-300 transition group-hover/course:translate-x-0.5 group-hover/course:text-blue-600"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t border-slate-100 p-2">
          <Link
            href={`/${menu}`}
            className="group/all mx-auto inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#0b3a6d] to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:px-7"
          >
            সব কোর্স দেখুন
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover/all:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
