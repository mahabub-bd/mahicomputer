"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CourseView } from "@/lib/types";

interface MobileSubMenuProps {
  menuLink: CourseView[];
  menu: string;
  /** Row label, e.g. "Courses". */
  label: string;
  /** Resolved href for the row's main link. */
  href: string;
  /** Highlight the row for the current route (mirrors the desktop nav). */
  active?: boolean;
  /** Close the parent drawer after navigating. */
  onNavigate: () => void;
}

/**
 * Expandable "Courses" row for the mobile drawer.
 * Row = link (navigates) + separate chevron button (expands), so we never
 * nest a clickable toggle inside an anchor.
 */
const MobileSubMenu = ({
  menuLink,
  menu,
  label,
  href,
  active = false,
  onNavigate,
}: MobileSubMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (menuLink.length === 0) return null;

  return (
    <div>
      <div
        className={`flex items-center rounded-xl transition-colors ${
          active ? "bg-blue-50" : "hover:bg-slate-50"
        }`}
      >
        <Link
          href={href}
          onClick={onNavigate}
          className={`flex-1 px-3 py-2.5 text-[15px] font-semibold transition-colors ${
            active ? "text-blue-700" : "text-slate-700 hover:text-blue-700"
          }`}
        >
          {label}
        </Link>
        <button
          type="button"
          aria-label={isOpen ? `Hide ${label}` : `Show ${label}`}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-700"
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* grid-rows 0fr → 1fr animates the height without a hardcoded max-height */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <ul className="min-h-0 overflow-hidden pl-3">
          {menuLink.map((item) => (
            <li key={item.link} className="mt-1.5 first:mt-2">
              <Link
                href={`/${menu}/${item.link}`}
                onClick={onNavigate}
                className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="truncate">{item.title}</span>
                <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                  {item.duration} mo
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileSubMenu;
