"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ExternalLink,
  GraduationCap,
  Handshake,
  Images,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  PanelBottom,
  Settings,
  Share2,
  Star,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logo } from "../../../public";

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
      { href: "/admin/courses", label: "Courses", Icon: BookOpen },
      { href: "/admin/categories", label: "Categories", Icon: LayoutGrid },
      { href: "/admin/instructors", label: "Instructors", Icon: Users },
      { href: "/admin/notices", label: "Notices", Icon: Bell },
  { href: "/admin/faqs", label: "FAQ", Icon: CircleHelp },
    ],
  },
  {
    label: "Website",
    links: [
      { href: "/admin/gallery", label: "Gallery", Icon: Images },
      { href: "/admin/reviews", label: "Reviews", Icon: Star },
      { href: "/admin/partners", label: "Partners", Icon: Handshake },
      { href: "/admin/social", label: "Social links", Icon: Share2 },
      { href: "/admin/nav-links", label: "Nav links", Icon: Menu },
      { href: "/admin/footer-links", label: "Footer links", Icon: PanelBottom },
    ],
  },
  {
    label: "Inbox",
    links: [
      { href: "/admin/messages", label: "Messages", Icon: Mail },
      { href: "/admin/enrollments", label: "Enrollments", Icon: GraduationCap },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/admin/settings", label: "Settings", Icon: Settings },
    ],
  },
];

interface SidebarProps {
  user?: { name: string; email: string } | null;
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

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const displayName = user?.name || "Admin";
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center gap-3 bg-slate-900 px-4 py-3 text-slate-100 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-1.5 hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>
        <Image
          src={logo}
          alt="Mahi Computer logo"
          width={32}
          height={32}
          className="h-8 w-8 rounded-md bg-white object-contain p-0.5"
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-100 transition-transform duration-200 lg:translate-x-0 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-4">
        <Image
          src={logo}
          alt="Mahi Computer logo"
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1"
          priority
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold leading-tight">Mahi Computer</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {sections.map(({ label, links }) => (
          <div key={label ?? "main"} className="mb-2">
            {label && (
              <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {label}
              </p>
            )}
            <div className="space-y-1">
              {links.map(({ href, label, exact, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
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

      <div className="relative border-t border-slate-700 p-3" ref={menuRef}>
        {menuOpen && (
          <div className="absolute bottom-16 left-3 right-3 rounded-lg border border-slate-700 bg-slate-800 py-2 shadow-xl">
            <div className="border-b border-slate-700 px-4 py-2">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              <ExternalLink size={15} />
              View site
            </Link>
            <button
              onClick={logout}
              disabled={loggingOut}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-rose-300 hover:bg-slate-700 disabled:opacity-50"
            >
              <LogOut size={15} />
              {loggingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-slate-800"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {initials}
          </span>
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
