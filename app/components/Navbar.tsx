"use client";

import EnrollButton from "@/app/_components/EnrollButton";
import type { CourseView, NavLinkView, SiteSettingsView, SocialView } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { useState } from "react";
import { logo } from "../../public";
import { MegaMenu, PreHeader, TogglerMenu } from "../components";
import useScroll from "../hooks/useScroll";

interface NavbarProps {
  courses?: CourseView[];
  social?: SocialView[];
  navLinks?: NavLinkView[];
  settings?: SiteSettingsView;
}

/** "#about" -> "/#about", "notice" -> "/notice", "/" stays "/". */
const toHref = (id: string) =>
  id.startsWith("#") ? `/${id}` : id.startsWith("/") ? id : `/${id}`;

/**
 * Which nav item lights up for the current URL.
 *
 * Real routes are derived from the pathname, so a hard load of e.g.
 * /courses never leaves "Home" highlighted. In-page sections ("#courses")
 * can't be read from the pathname, so they follow the click while we're on
 * "/" — and light up for their route ("/courses") anywhere else, which is
 * what the mega menu's "View all courses" link points at.
 */
const isNavActive = (
  nav: NavLinkView,
  href: string,
  pathname: string,
  section: string | null,
) => {
  if (href.startsWith("/#")) {
    const route = `/${nav.id.slice(1)}`;
    return pathname === "/"
      ? section === nav.title
      : pathname === route || pathname.startsWith(`${route}/`);
  }
  if (href === "/") return pathname === "/" && section === null;
  return pathname === href || pathname.startsWith(`${href}/`);
};

const Navbar = ({
  courses = [],
  social,
  navLinks = [],
  settings,
}: NavbarProps) => {
  const pathname = usePathname();

  // Only section links write this; cleared as soon as a real route opens.
  // (Adjust-during-render pattern instead of an effect.)
  const [section, setSection] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    // Coming home to "/#courses" keeps the section lit; anything else resets.
    if (pathname !== "/" && section !== null) setSection(null);
  }

  const { scrolled } = useScroll(8);
  const phone = settings?.phone?.trim() || "";

  return (
    <>
      <PreHeader social={social} settings={settings} />

      {/*
        A real sticky header that stays in the document flow. The old version
        toggled a global `position: fixed` class, which yanked the bar out of
        the flow and jumped the whole page down by its own height the moment
        it appeared.
      */}
      <div
        id="home"
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-slate-200/80 bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-md"
            : "border-slate-100/70 bg-white/85 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-350 items-center px-4 2xl:max-w-[1536px] sm:px-6 lg:h-19">
          {/* ---------- Brand ---------- */}
          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="Mahi Computer — home"
          >
            <Image
              src={logo}
              alt="Mahi Computer"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 lg:h-12"
              priority
            />
          </Link>

          {/* ---------- Desktop links ----------
              The full list only fits from lg (1200px) up — below that the
              drawer takes over instead of squeezing nine items into a
              tablet-width bar. */}
          <ul className="list-none hidden flex-1 items-stretch justify-center lg:flex lg:h-19">
            {navLinks.map((nav) => {
              const hasDropdown = (nav.class ?? "").includes("feature-hoverable");
              const href = toHref(nav.id);
              const isActive = isNavActive(nav, href, pathname, section);

              return (
                <li
                  key={nav.id}
                  className={
                    // Deliberately NOT "relative": the mega menu must anchor
                    // to the sticky navbar bar (see .features-mega-menu in
                    // globals.css), not to this off-center <li>.
                    `${nav.class} nav-font flex items-center`
                  }
                >
                  <Link
                    href={href}
                    onClick={() =>
                      setSection(href.startsWith("/#") ? nav.title : null)
                    }
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex items-center rounded-full px-3 py-2 text-[14.5px] font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 xl:px-3.5 xl:text-[15px] ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100 hover:text-blue-800"
                    }`}
                  >
                    {nav.title}
                  </Link>

                  {hasDropdown && courses.length > 0 && (
                    <MegaMenu menuLink={courses} menu="courses" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* ---------- Actions ---------- */}
          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            {/* Call us — icon only until there is room for the number */}
            {phone && (
              <a
                href={`tel:${phone.replace(/[\s()-]/g, "")}`}
                className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-[13.5px] font-semibold text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 lg:inline-flex"
              >
                <Phone size={15} className="text-blue-600" aria-hidden />
                <span className="hidden xl:inline">{phone}</span>
                <span className="sr-only xl:hidden">ফোন করুন</span>
              </a>
            )}

            <EnrollButton
              courses={courses.map((c) => c.title)}
              className="hidden items-center gap-2 rounded-full bg-linear-to-r from-blue-700 to-blue-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-md shadow-blue-700/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg md:inline-flex lg:px-5"
            />

            <TogglerMenu
              courses={courses}
              navLinks={navLinks}
              social={social}
              settings={settings}
            />
          </div>
        </nav>

        {/* Brand accent line that fades in with the condensed header */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-blue-500/60 to-transparent transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </>
  );
};

export default Navbar;
