import { getSession } from "@/lib/auth";
import { getGalleryItems, getSiteSettings, getSocialLinks } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  CircleHelp,
  ExternalLink,
  Eye,
  EyeOff,
  GraduationCap,
  Handshake,
  Images,
  Inbox,
  LayoutGrid,
  Mail,
  MapPin,
  Phone,
  Plus,
  Settings,
  Share2,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

/** Shared section heading: title (+ optional badge) with a right-aligned action link. */
const SectionHeading = ({
  title,
  href,
  action = "Manage",
  children,
}: {
  title: string;
  href: string;
  action?: string;
  children?: ReactNode;
}) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
      {title}
      {children}
    </h2>
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1 text-sm text-blue-600 hover:underline"
    >
      {action}
      <ArrowUpRight size={14} />
    </Link>
  </div>
);

const AdminDashboard = async () => {
  const session = await getSession();

  const [
    courseCount,
    publishedCount,
    categoryCount,
    instructorCount,
    reviewCount,
    partnerCount,
    messageCount,
    unreadCount,
    newEnrollmentCount,
    recentCourses,
    recentMessages,
    galleryItems,
    socialLinks,
    settings,
    adminUser,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.category.count(),
    prisma.instructor.count(),
    prisma.review.count(),
    prisma.partner.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.enrollment.count({ where: { status: "PENDING" } }),
    prisma.course.findMany({ orderBy: { updatedAt: "desc" }, take: 10 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    getGalleryItems(),
    getSocialLinks(),
    getSiteSettings(),
    session
      ? prisma.user.findUnique({
          where: { id: session.sub },
          select: { name: true },
        })
      : null,
  ]);

  const hiddenCount = Math.max(courseCount - publishedCount, 0);
  const adminName = adminUser?.name || "Admin";
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const cards = [
    {
      label: "Courses",
      value: courseCount,
      hint: `${publishedCount} published · ${hiddenCount} hidden`,
      href: "/admin/courses",
      Icon: BookOpen,
    },
    {
      label: "Categories",
      value: categoryCount,
      hint: "Course categories",
      href: "/admin/categories",
      Icon: LayoutGrid,
    },
    {
      label: "Instructors",
      value: instructorCount,
      hint: "Teaching staff",
      href: "/admin/instructors",
      Icon: Users,
    },
    {
      label: "Reviews",
      value: reviewCount,
      hint: "Student ratings",
      href: "/admin/reviews",
      Icon: Star,
    },
    {
      label: "Gallery",
      value: galleryItems.length,
      hint: "Home page images",
      href: "/admin/gallery",
      Icon: Images,
    },
    {
      label: "Partners",
      value: partnerCount,
      hint: "Partner logos",
      href: "/admin/partners",
      Icon: Handshake,
    },
    {
      label: "Social links",
      value: socialLinks.length,
      hint: "Footer icons",
      href: "/admin/social",
      Icon: Share2,
    },
    {
      label: "Unread messages",
      value: unreadCount,
      hint: `${messageCount} total received`,
      href: "/admin/messages",
      Icon: Mail,
    },
  ];

  const stats = [
    { label: "Published courses", value: publishedCount, Icon: Eye, tone: "text-emerald-600" },
    { label: "Hidden courses", value: hiddenCount, Icon: EyeOff, tone: "text-slate-500" },
    { label: "Total messages", value: messageCount, Icon: Inbox, tone: "text-blue-600" },
    { label: "Pending enrollments", value: newEnrollmentCount, Icon: GraduationCap, tone: "text-violet-600" },
  ];

  const quickActions = [
    { label: "Add course", href: "/admin/courses", Icon: BookOpen },
    { label: "Add category", href: "/admin/categories", Icon: LayoutGrid },
    { label: "Add instructor", href: "/admin/instructors", Icon: Users },
    { label: "Add review", href: "/admin/reviews", Icon: Star },
    { label: "Add partner", href: "/admin/partners", Icon: Handshake },
    { label: "Add image", href: "/admin/gallery", Icon: Images },
    { label: "Add link", href: "/admin/social", Icon: Share2 },
    { label: "Enrollments", href: "/admin/enrollments", Icon: GraduationCap },
    { label: "Add notice", href: "/admin/notices", Icon: Bell },
    { label: "Add FAQ", href: "/admin/faqs", Icon: CircleHelp },
    { label: "Site settings", href: "/admin/settings", Icon: Settings },
  ];

  const contactInfo = [
    { label: "Phone", value: settings.phone, Icon: Phone, href: settings.phone ? `tel:${settings.phone}` : undefined },
    { label: "Email", value: settings.email, Icon: Mail, href: settings.email ? `mailto:${settings.email}` : undefined },
    { label: "Address", value: settings.address, Icon: MapPin, href: undefined },
  ].filter((c) => c.value);

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6 overflow-hidden rounded-xl bg-slate-900 p-6 text-slate-100 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Welcome back,</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">{adminName}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <Calendar size={15} />
              {today}
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <ExternalLink size={15} />
            View site
          </Link>
        </div>
        {settings.heroTitle && (
          <p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
            {settings.heroTitle}
          </p>
        )}
      </div>

      {/* Primary stats — 2 per row on mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, hint, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md sm:p-5 sm:gap-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
              <Icon size={22} />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-semibold text-blue-700 sm:text-2xl">{value}</span>
              <span className="block truncate text-sm text-slate-500">{label}</span>
              <span className="mt-0.5 block truncate text-xs text-slate-400">{hint}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Secondary stats — 2 per row on mobile */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, tone }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <Icon size={18} className={tone} />
            <span className="text-sm text-slate-500">{label}</span>
            <span className="ml-auto text-sm font-semibold text-slate-900">{value}</span>
          </div>
        ))}
      </div>

      {/* Main row — activity (left) · actions & info (right).
          items-start keeps each column its natural height; Recent messages
          sits under Recent courses so the left column isn't left with a
          tall empty gap beside the Quick actions stack. */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Recent courses */}
          <div>
            <SectionHeading title="Recent courses" href="/admin/courses" />
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
              {/* min-w keeps the table scrollable on mobile instead of
                  squeezing the columns together on small screens. */}
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {c.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={c.imageUrl}
                              alt=""
                              className="h-10 w-16 shrink-0 rounded object-cover"
                            />
                          )}
                          <div className="min-w-0">
                            <Link
                              href={`/admin/courses/${c.id}`}
                              className="block truncate font-medium text-slate-900 hover:text-blue-600"
                            >
                              {c.title}
                            </Link>
                            <p className="truncate text-xs text-slate-400">{c.tag || c.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.price}৳</td>
                      <td className="px-4 py-3">
                        {c.published ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            Hidden
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-400">
                        {new Date(c.updatedAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))}
                  {recentCourses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No courses yet.{" "}
                        <Link href="/admin/courses" className="text-blue-600 hover:underline">
                          Add one
                        </Link>
                        .
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent messages — moved here to balance the column heights */}
          <div>
            <SectionHeading title="Recent messages" href="/admin/messages" action="View all">
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-normal text-white">
                  {unreadCount} new
                </span>
              )}
            </SectionHeading>
            {recentMessages.length === 0 ? (
              <p className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-sm">
                No messages yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 rounded-xl bg-white shadow-sm">
                {recentMessages.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {m.name}
                        {!m.read && (
                          <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[11px] text-white">
                            New
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-slate-500">{m.message}</p>
                    </div>
                    <p className="shrink-0 text-xs text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions + site info */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col gap-2 rounded-xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm transition hover:text-blue-600 hover:shadow-md"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={18} />
                  </span>
                  <span className="flex items-center gap-1">
                    {label}
                    <Plus size={13} className="text-slate-400" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Site info</h2>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              {contactInfo.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No contact info set.{" "}
                  <Link href="/admin/settings" className="text-blue-600 hover:underline">
                    Add it
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-3">
                  {contactInfo.map(({ label, value, Icon, href }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="mt-0.5 text-slate-400">
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            className="block truncate text-sm text-slate-700 hover:text-blue-600"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="truncate text-sm text-slate-700">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href="/admin/settings"
                className="mt-4 flex items-center justify-center gap-2 rounded-md border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Settings size={15} />
                Edit settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery + social */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        {/* Gallery preview */}
        <div className="lg:col-span-2">
          <SectionHeading title="Gallery" href="/admin/gallery" />
          <div className="rounded-xl bg-white p-4 shadow-sm">
            {galleryItems.length === 0 ? (
              <p className="text-sm text-slate-500">
                No gallery images yet.{" "}
                <Link href="/admin/gallery" className="text-blue-600 hover:underline">
                  Add one
                </Link>
                .
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {galleryItems.slice(0, 8).map((g) => (
                    <div
                      key={g.id}
                      className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200"
                    >
                      {g.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={g.imageUrl}
                          alt={g.alt}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {galleryItems.length} image
                  {galleryItems.length === 1 ? "" : "s"} in the home page gallery
                  {galleryItems.length > 8
                    ? ` · showing first 8`
                    : ""}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Social links */}
        <div>
          <SectionHeading title="Social links" href="/admin/social" />
          <div className="rounded-xl bg-white p-4 shadow-sm">
            {socialLinks.length === 0 ? (
              <p className="text-sm text-slate-500">
                No social links yet.{" "}
                <Link href="/admin/social" className="text-blue-600 hover:underline">
                  Add one
                </Link>
                .
              </p>
            ) : (
              <ul className="space-y-3">
                {socialLinks.map((s) => (
                  <li key={s.id} className="flex items-center gap-3">
                    {s.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.icon}
                        alt=""
                        className="h-5 w-5 shrink-0 object-contain"
                      />
                    )}
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-w-0 items-center gap-1 text-sm text-slate-700 hover:text-blue-600"
                    >
                      <span className="truncate">{s.link}</span>
                      <ExternalLink size={12} className="shrink-0 text-slate-400" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
