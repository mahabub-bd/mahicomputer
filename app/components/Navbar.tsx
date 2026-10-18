"use client";

import EnrollButton from "@/app/_components/EnrollButton";
import type { CourseView, NavLinkView, SocialView } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { logo } from "../../public";
import { MegaMenu, PreHeader, TogglerMenu } from "../components";
import { navLinks as staticNavLinks } from "../constants";
import useScroll from "../hooks/useScroll";
import styles from "../styles/style";

interface NavbarProps {
  courses?: CourseView[];
  social?: SocialView[];
  navLinks?: NavLinkView[];
}

/** "#about" -> "/#about", "notice" -> "/notice", "/" stays "/". */
const toHref = (id: string) =>
  id.startsWith("#") ? `/${id}` : id.startsWith("/") ? id : `/${id}`;

const Navbar = ({
  courses = [],
  social,
  navLinks = staticNavLinks,
}: NavbarProps) => {
  const [active, setActive] = useState("Home");

  const { scrolled } = useScroll();

  return (
    <>
      <PreHeader social={social} />
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
              const isActive = active === nav.title;

              return (
                <li key={nav.id} className={`${nav.class} nav-font relative`}>
                  <Link
                    href={toHref(nav.id)}
                    onClick={() => setActive(nav.title)}
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

          <TogglerMenu courses={courses} navLinks={navLinks} social={social} />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
