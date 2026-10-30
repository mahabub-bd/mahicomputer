"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  GraduationCap,
  Handshake,
  Images,
  Inbox,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  PanelBottom,
  ScrollText,
  Settings,
  Star,
  UserCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logodark } from "../../../public";

interface SidebarLink {
  href: string;
  label: string;
  exact?: boolean;
  Icon: LucideIcon;
}

interface SidebarSection {
  label: string | null;
  links: SidebarLink[];
}

const sections: SidebarSection[] = [
  {
    label: null,
    links: [
      { href: "/admin", label: "Dashboard", exact: true, Icon: LayoutDashboard },
    ],
  },
  {
    label: "Academic",
    links: [
      { href: "/admin/instructors", label: "Instructors", Icon: Users },
      { href: "/admin/notices", label: "Notices", Icon: Bell },
      { href: "/admin/newsletters", label: "Newsletters", Icon: Mail },
      { href: "/admin/blogs", label: "Blogs", Icon: Newspaper },
      { href: "/admin/faqs", label: "FAQ", Icon: CircleHelp },
    ],
  },
  {
    label: "Course & Admission",
    links: [
      { href: "/admin/courses", label: "Courses", Icon: BookOpen },
      { href: "/admin/categories", label: "Categories", Icon: LayoutGrid },
      { href: "/admin/batches", label: "Batches", Icon: Layers },
      { href: "/admin/enrollments", label: "Admissions", Icon: GraduationCap },
      { href: "/admin/students", label: "Students", Icon: UserCheck },
    ],
  },
  {
    label: "Website",
    links: [
      { href: "/admin/gallery", label: "Gallery", Icon: Images },
      { href: "/admin/reviews", label: "Reviews", Icon: Star },
      { href: "/admin/partners", label: "Partners", Icon: Handshake },
      { href: "/admin/nav-links", label: "Nav links", Icon: Menu },
      { href: "/admin/footer-links", label: "Footer links", Icon: PanelBottom },
    ],
  },
  {
    label: "Inbox",
    links: [
      { href: "/admin/messages", label: "Messages", Icon: Mail },
      { href: "/admin/newsletter", label: "Subscriber list", Icon: Inbox },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/admin/business-settings", label: "Business settings", Icon: Building2 },
      { href: "/admin/settings", label: "Homepage settings", Icon: Settings },
      { href: "/admin/users", label: "Admin users", Icon: UserCog },
      { href: "/admin/audit-log", label: "Audit log", Icon: ScrollText },
    ],
  },
];

/** Section key — the label doubles as the group's state key. */
const sectionKey = (section: SidebarSection) => section.label ?? "main";

interface SidebarProps {
  user?: { name: string; email: string; imageUrl?: string | null } | null;
}

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Segment-aware: a link is active only when the path equals it or
  // continues with "/", so /admin/newsletters does not also highlight
  // /admin/newsletter (Subscriber list).
  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  // Close the user menu on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  // Escape closes the popover and the mobile drawer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  const displayName = user?.name || "Admin";
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 bg-slate-900 px-4 py-3 text-slate-100 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          className="rounded-lg p-1.5 transition hover:bg-white/10"
        >
          <Menu size={22} />
        </button>
        <Image
          src={logodark}
          alt="Mahi Computer logo"
          width={32}
          height={32}
          className="h-9 w-9 rounded-md object-contain"
        />
        <p className="text-base font-semibold">Admin Panel</p>
      </div>

      {/* Backdrop behind the mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-[1px] lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-100 transition-transform duration-200 lg:w-64 lg:translate-x-0 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand — doubles as the way back to the dashboard */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-4 py-3.5">
          <Link
            href="/admin"
            onClick={() => setDrawerOpen(false)}
            className="min-w-0 rounded-lg transition hover:opacity-90"
          >
            <Image
              src={logodark}
              alt="Mahi Computer logo"
              width={134}
              height={67}
              className="h-12 w-auto max-w-40 object-contain object-left"
              priority
            />
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* The nav scrolls when the viewport is too short. min-h-0 lets the
            flex child shrink, and the fade below hints that there is more
            below the fold instead of cutting a link in half. */}
        <div className="relative min-h-0 flex-1">
          <nav className="admin-sidebar-scroll h-full overflow-y-auto px-2.5 py-2">
            {sections.map((section) => {
              const key = sectionKey(section);
              return (
                <div key={key} className="mb-1.5">
                  {section.label && (
                    <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {section.label}
                    </p>
                  )}
                  <ul className="space-y-0.5">
                    {section.links.map(({ href, label, exact, Icon }) => {
                      const active = isActive(href, exact);
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            onClick={() => setDrawerOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={`group relative flex items-center gap-3 rounded-lg px-3 py-1 text-[15px] transition duration-150 ${
                              active
                                ? "bg-blue-600/15 font-medium text-white"
                                : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                            }`}
                          >
                            {active && (
                              <span
                                aria-hidden
                                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-blue-400"
                              />
                            )}
                            <Icon
                              size={18}
                              aria-hidden
                              className={`shrink-0 ${
                                active
                                  ? "text-blue-300"
                                  : "text-slate-400 transition group-hover:text-slate-300"
                              }`}
                            />
                            <span className="truncate">{label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-slate-900 via-slate-900/85 to-transparent"
          />
        </div>

        <div className="relative border-t border-slate-800 p-2.5" ref={menuRef}>
          {menuOpen && (
            <div className="absolute bottom-16 left-2.5 right-2.5 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 py-1.5 shadow-2xl shadow-black/40">
              <div className="border-b border-slate-700 px-3.5 py-2.5">
                <p className="truncate text-sm font-medium text-white">{displayName}</p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
              <Link
                href="/"
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-700/70 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                <ExternalLink size={15} aria-hidden />
                View site
              </Link>
              <button
                onClick={logout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-rose-300 transition hover:bg-slate-700/70 disabled:pointer-events-none disabled:opacity-50"
              >
                <LogOut size={15} aria-hidden />
                {loggingOut ? "Logging out…" : "Logout"}
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition hover:bg-white/5"
          >
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full bg-white object-contain p-0.5"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {initials}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-white">
                {displayName}
              </span>
              <span className="block truncate text-xs text-slate-400">{user?.email}</span>
            </span>
            <ChevronDown
              size={16}
              aria-hidden
              className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
