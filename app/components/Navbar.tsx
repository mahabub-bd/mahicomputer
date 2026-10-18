"use client";

import EnrollButton from "@/app/_components/EnrollButton";
import type { CourseView, NavLinkView, SiteSettingsView, SocialView } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logo } from "../../public";
import { MegaMenu, PreHeader, TogglerMenu } from "../components";
import useScroll from "../hooks/useScroll";
import styles from "../styles/style";

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

  const { scrolled } = useScroll();

  return (
    <>
      <PreHeader social={social} settings={settings} />
      <div
        className={`relative z-50 border-b border-slate-100 bg-white/95 backdrop-blur transition-shadow ${
          scrolled && "sticky drop-shadow-lg"
        }`}
        id="home"
      >
        <nav
          className={`${styles.boxWidth} mx-auto flex min-h-19 items-center px-4 sm:px-6`}
        >
          <Link
            href="/"
            className="shrink-0"
            aria-label="Mahi Computer — home"
          >
            <Image
              src={logo}
              alt="mahicomputer__headerlogo"
              className="h-15.5 w-35.5 object-contain"
              priority
            />
          </Link>

          <ul className="list-none hidden flex-1 items-center justify-center sm:flex">
            {navLinks.map((nav) => {
              const hasDropdown = (nav.class ?? "").includes("feature-hoverable");
              const href = toHref(nav.id);
              const isActive = isNavActive(nav, href, pathname, section);

              return (
                <li key={nav.id} className={`${nav.class} nav-font relative`}>
                  <Link
                    href={href}
                    onClick={() => setSection(href.startsWith("/#") ? nav.title : null)}
                    className={`relative inline-flex items-center px-2.5 py-6 text-[15px] font-semibold transition-colors before:absolute before:bottom-4 before:left-1/2 before:h-0.75 before:w-[calc(100%-20px)] before:-translate-x-1/2 before:rounded-full before:bg-blue-700 before:transition-transform lg:px-3 ${
                      isActive
                        ? "before:scale-x-100 text-blue-700"
                        : "before:scale-x-0 text-slate-700 hover:text-blue-700"
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

          <EnrollButton
            courses={courses.map((c) => c.title)}
            className="ml-3 hidden items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 hover:shadow-md md:inline-flex"
          />

          <TogglerMenu courses={courses} navLinks={navLinks} social={social} settings={settings} />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
