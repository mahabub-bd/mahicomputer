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
  ChevronUp,
  CircleHelp,
  ExternalLink,
  GraduationCap,
  Handshake,
  Images,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  PanelBottom,
  Settings,
  Star,
  UserCheck,
  UserCog,
  Users,
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
    ],
  },
];

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

  const logout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  // Segment-aware: a link is active only when the path equals it or
  // continues with "/", so /admin/newsletters does not also highlight
  // /admin/newsletter (Subscriber list).
  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const displayName = user?.name || "Admin";
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 bg-slate-900 px-4 py-3 text-slate-100 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-1.5 hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>
        <Image
          src={logodark}
          alt="Mahi Computer logo"
          width={32}
          height={32}
          className="h-10 w-10 rounded-md object-contain"
        />
        <p className="text-base font-semibold">Admin Panel</p>
      </div>

      {/* Backdrop behind the mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-100 transition-transform duration-200 lg:w-56 lg:translate-x-0 xl:w-72 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-700 px-6 py-4 lg:px-4 xl:px-6">
          <Image
            src={logodark}
            alt="Mahi Computer logo"
            width={134}
            height={67}
            className="mx-auto h-14 w-auto max-w-44 shrink-0 object-contain object-left lg:h-12 xl:h-14"
            priority
          />
        </div>
      {/* The nav scrolls when the viewport is too short. min-h-0 lets the
          flex child shrink, and the fade below hints that there is more
          below the fold instead of cutting a link in half. */}
      <div className="relative min-h-0 flex-1">
        <nav className="admin-sidebar-scroll h-full overflow-y-auto p-3">
          {sections.map(({ label, links }) => (
            <div key={label ?? "main"} className="mb-1">
              {label && (
                <p className="px-3 pb-0.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {label}
                </p>
              )}
              <div className="space-y-1">
                {links.map(({ href, label, exact, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition ${
                      isActive(href, exact)
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-slate-900 via-slate-900/85 to-transparent"
        />
      </div>

      <div className="relative border-t border-slate-700 p-3" ref={menuRef}>
        {menuOpen && (
          <div className="absolute bottom-16 left-3 right-3 rounded-lg border border-slate-700 bg-slate-800 py-2 shadow-xl">
            <div className="border-b border-slate-700 px-4 py-2">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <Link
              href="/"
              className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              <ExternalLink size={15} />
              View site
            </Link>
            <button
              onClick={logout}
              disabled={loggingOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2 text-left text-sm text-rose-300 hover:bg-slate-700 disabled:opacity-50"
            >
              <LogOut size={15} />
              {loggingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-800"
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
          <span className="text-slate-400">
            {menuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
