import { getSession } from "@/lib/auth";
import { getGalleryItems, getSiteSettings, getSocialLinks } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import {
  Bell,
  BookOpen,
  GraduationCap,
  Eye,
  EyeOff,
  Handshake,
  Images,
  Inbox,
  LayoutGrid,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Settings,
  Share2,
  Star,
  Users,
} from "lucide-react";
<<<<<<< HEAD
import GalleryPreview from "../_components/dashboard/GalleryPreview";
import QuickActions from "../_components/dashboard/QuickActions";
import RecentCourses from "../_components/dashboard/RecentCourses";
import RecentMessages from "../_components/dashboard/RecentMessages";
import SiteInfo, { type ContactInfoItem } from "../_components/dashboard/SiteInfo";
import StatCards, {
  type SecondaryStat,
  type StatCard,
} from "../_components/dashboard/StatCards";
import WelcomeCard from "../_components/dashboard/WelcomeCard";
import SocialLinksPanel from "../_components/dashboard/SocialLinksPanel";
=======
import Link from "next/link";
import type { ReactNode } from "react";
>>>>>>> 8b57dd81f4b6274869ff3d96c8916c651ef76d20

export const dynamic = "force-dynamic";

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
    prisma.course.findMany({
      orderBy: { updatedAt: "desc" },
      take: 10,
      include: {
        instructor: { select: { name: true, imageUrl: true } },
        category: { select: { title: true } },
      },
    }),
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

  const cards: StatCard[] = [
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

  const stats: SecondaryStat[] = [
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
    { label: "Add blog", href: "/admin/blogs", Icon: Newspaper },
    { label: "Site settings", href: "/admin/settings", Icon: Settings },
  ];

  const contactInfo: ContactInfoItem[] = [
    { label: "Phone", value: settings.phone, Icon: Phone, href: settings.phone ? `tel:${settings.phone}` : undefined },
    { label: "Email", value: settings.email, Icon: Mail, href: settings.email ? `mailto:${settings.email}` : undefined },
    { label: "Address", value: settings.address, Icon: MapPin, href: undefined },
  ].filter((c) => c.value);

  return (
    <div>
      <WelcomeCard adminName={adminName} today={today} heroTitle={settings.heroTitle} />

      <StatCards cards={cards} stats={stats} />

      {/* Main row — activity (left) · actions & info (right).
          items-start keeps each column its natural height; Recent messages
          sits under Recent courses so the left column isn't left with a
          tall empty gap beside the Quick actions stack. */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
<<<<<<< HEAD
        {/* min-w-0 lets this column shrink below the table's min width, so
            the overflow-x-auto inside RecentCourses actually scrolls instead
            of the whole page overflowing on mobile. */}
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <RecentCourses courses={recentCourses} />
          <RecentMessages messages={recentMessages} unreadCount={unreadCount} />
=======
        <div className="space-y-6 lg:col-span-2">
          {/* Recent courses */}
          <div>
            <SectionHeading title="Recent courses" href="/admin/courses" />
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
              {/* min-w keeps the table scrollable on mobile instead of
                  squeezing the columns together on small screens. */}
              <table className="w-full min-w-140 text-left text-sm">
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
>>>>>>> 8b57dd81f4b6274869ff3d96c8916c651ef76d20
        </div>

        {/* Quick actions + site info share the right column */}
        <div className="space-y-6">
          <QuickActions actions={quickActions} />
          <SiteInfo contactInfo={contactInfo} />
        </div>
      </div>

      {/* Gallery + social */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        <GalleryPreview items={galleryItems} />
        <SocialLinksPanel links={socialLinks} />
      </div>
    </div>
  );
};

export default AdminDashboard;
