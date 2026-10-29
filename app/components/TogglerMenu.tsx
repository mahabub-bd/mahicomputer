"use client";

import { Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import EnrollButton from "@/app/_components/EnrollButton";
import type { BusinessSettingsView, CourseView, NavLinkView, SocialView } from "@/lib/types";
import { logo } from "@/public";
import { MobileSubMenu } from "../components";

interface TogglerMenuProps {
  courses?: CourseView[];
  navLinks?: NavLinkView[];
  social?: SocialView[];
  settings?: BusinessSettingsView;
}

/** "#about" -> "/#about", "notice" -> "/notice", "/" stays "/". */
const toHref = (id: string) =>
  id.startsWith("#") ? `/${id}` : id.startsWith("/") ? id : `/${id}`;

/** No-op subscriber for useSyncExternalStore's mounted check. */
const subscribeNoop = () => () => { };

const TogglerMenu = ({
  courses = [],
  navLinks = [],
  social = [],
  settings,
}: TogglerMenuProps) => {
  const phone = settings?.phone?.trim() || "";
  const email = settings?.email?.trim() || "";
  const [open, setOpen] = useState(false);
  // Portal target only exists after mount (SSR has no document).
  // useSyncExternalStore avoids a setState-in-effect for the mounted flag.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const pathname = usePathname();

  // Close on route change so the drawer never lingers over a new page.
  // (Adjust-during-render pattern instead of an effect.)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  // Lock scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <Menu size={22} />
      </button>

      {/* Portaled to document.body: the navbar's backdrop-blur would otherwise
          become the containing block and trap the fixed drawer at nav height. */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              onClick={close}
              aria-hidden
              className={`fixed inset-0 z-90 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            {/* Drawer */}
            <div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              inert={!open}
              className={`fixed inset-y-0 right-0 z-100 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"
                }`}
            >
              {/* Header: logo + close */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <Link
                  href="/"
                  onClick={close}
                  aria-label="Mahi Computer — home"
                >
                  <Image
                    src={logo}
                    alt="Mahi Computer"
                    className="h-9 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-blue-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links — same admin-managed list as the desktop nav */}
              <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                <ul className="space-y-1">
                  {navLinks.map((nav) => {
                    const hasDropdown = (nav.class ?? "").includes(
                      "feature-hoverable",
                    );
                    const href = toHref(nav.id);

                    const isActive = href.startsWith("/#")
                      ? pathname === `/${nav.id.slice(1)}` ||
                      pathname.startsWith(`/${nav.id.slice(1)}/`)
                      : href === "/"
                        ? pathname === "/"
                        : pathname === href ||
                        pathname.startsWith(`${href}/`);

                    if (hasDropdown && courses.length > 0) {
                      return (
                        <li key={nav.id}>
                          <MobileSubMenu
                            menuLink={courses}
                            menu="courses"
                            label={nav.title}
                            href={href}
                            active={isActive}
                            onNavigate={close}
                          />
                        </li>
                      );
                    }

                    return (
                      <li key={nav.id}>
                        <Link
                          href={href}
                          onClick={close}
                          className={`block rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors ${isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                            }`}
                        >
                          {nav.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer: CTA + contact + socials (compact) */}
              <div className="border-t border-slate-100 px-4 py-3">
                <EnrollButton
                  courses={courses.map((c) => c.title)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full bg-blue-700 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-blue-800"
                />

                <div className="mt-2.5 space-y-1.5">
                  <a
                    href={`tel:${phone.replace(/[\s()-]/g, "")}`}
                    className="flex items-center gap-2.5 text-[13px] text-slate-600 transition-colors hover:text-blue-700"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600"
                      aria-hidden
                    >
                      <Phone size={13} />
                    </span>
                    {phone}
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2.5 text-[13px] text-slate-600 transition-colors hover:text-blue-700"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600"
                      aria-hidden
                    >
                      <Mail size={13} />
                    </span>
                    {email}
                  </a>
                </div>

                {social.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-2 border-t border-slate-100 pt-2.5">
                    {social.map((item) => {
                      const platform =
                        item.icon.split("/").pop()?.replace(/\.\w+$/, "") ||
                        item.id;
                      return (
                        <Link
                          key={item.id}
                          href={item.link}
                          aria-label={platform}
                          className="group flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200 transition hover:scale-105 hover:bg-blue-50 hover:ring-blue-300"
                        >
                          <Image
                            src={item.icon}
                            alt=""
                            aria-hidden
                            width={14}
                            height={14}
                            className="h-3.5 w-3.5 object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default TogglerMenu;
