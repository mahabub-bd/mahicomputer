import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { CourseView } from "@/lib/types";

interface MegaMenuProps {
  menuLink: CourseView[];
  menu: string;
}

const MegaMenu = ({ menuLink, menu }: MegaMenuProps) => {
  if (menuLink.length === 0) return null;

  // Switch to a two-column layout once the list gets long.
  const wide = menuLink.length > 8;

  return (
    <div
      className={`features-mega-menu ${
        wide ? "w-[min(90vw,640px)]" : "w-[min(90vw,330px)]"
      }`}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_24px_60px_-15px_rgba(15,35,75,0.30)]">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Explore courses
          </p>
          <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-[11px] font-bold text-blue-700">
            {menuLink.length}
          </span>
        </div>

        <ul className={`p-2 ${wide ? "grid grid-cols-2 gap-x-1" : "flex flex-col"}`}>
          {menuLink.map((item) => (
            <li key={item.link}>
              <Link
                href={`/${menu}/${item.link}`}
                className="group/course flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-blue-50"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold text-slate-800 transition-colors group-hover/course:text-blue-700">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-400">
                    {item.tag} · {item.duration} months
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
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0b3a6d] to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View all courses
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
