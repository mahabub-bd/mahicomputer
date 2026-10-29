import { getSession } from "@/lib/auth";
import { getBusinessSettings, getGalleryItems, getSiteSettings, getSocialLinks } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import {
  Bell,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Handshake,
  Images,
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
import GalleryPreview from "../_components/dashboard/GalleryPreview";
import QuickActions from "../_components/dashboard/QuickActions";
import RecentCourses from "../_components/dashboard/RecentCourses";
import RecentMessages from "../_components/dashboard/RecentMessages";
import SiteInfo, { ContactInfoItem } from "../_components/dashboard/SiteInfo";
import SocialLinksPanel from "../_components/dashboard/SocialLinksPanel";
import StatCards, { SecondaryStat, StatCard } from "../_components/dashboard/StatCards";
import WelcomeCard from "../_components/dashboard/WelcomeCard";

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
    business,
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
    }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    getGalleryItems(),
    getSocialLinks(),
    getSiteSettings(),
    getBusinessSettings(),
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
      href: "/admin/business-settings",
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
    { label: "Pending enrollments", value: newEnrollmentCount, Icon: GraduationCap, tone: "text-violet-600" },
  ];

  const quickActions = [
    { label: "Add course", href: "/admin/courses", Icon: BookOpen },
    { label: "Add category", href: "/admin/categories", Icon: LayoutGrid },
    { label: "Add instructor", href: "/admin/instructors", Icon: Users },
    { label: "Add review", href: "/admin/reviews", Icon: Star },
    { label: "Add partner", href: "/admin/partners", Icon: Handshake },
    { label: "Add image", href: "/admin/gallery", Icon: Images },
    { label: "Add link", href: "/admin/business-settings", Icon: Share2 },
    { label: "Admissions", href: "/admin/enrollments", Icon: GraduationCap },
    { label: "Add notice", href: "/admin/notices", Icon: Bell },
    { label: "Add blog", href: "/admin/blogs", Icon: Newspaper },
    { label: "Homepage settings", href: "/admin/settings", Icon: Settings },
  ];

  const contactInfo: ContactInfoItem[] = [
    { label: "Phone", value: business.phone, Icon: Phone, href: business.phone ? `tel:${business.phone}` : undefined },
    { label: "Email", value: business.email, Icon: Mail, href: business.email ? `mailto:${business.email}` : undefined },
    { label: "Address", value: business.address, Icon: MapPin, href: undefined },
  ].filter((c) => c.value);

  return (
    <div>
      <WelcomeCard adminName={adminName} today={today} heroTitle={settings.heroTitle} />

      <StatCards cards={cards} stats={stats} />

      {/* Main grid — activity (left) · actions & info (right).
          Every cell is placed explicitly so the two columns stay balanced
          at every breakpoint: the left column holds the two activity
          sections, the right one the quick actions and the site info.
          `order-*` re-orders the panels on phones (single column) without
          changing the desktop placement. `min-w-0` lets the cells shrink
          so a wide table scrolls inside its card instead of pushing the
          whole page sideways. */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        {/* Recent courses — scrolls inside its own card */}
        <div className="order-1 min-w-0 lg:col-start-1 lg:col-end-3 lg:row-start-1">
          <RecentCourses courses={recentCourses} />
        </div>

        {/* Recent messages */}
        <div className="order-2 min-w-0 lg:col-start-1 lg:col-end-3 lg:row-start-2">
          <RecentMessages messages={recentMessages} unreadCount={unreadCount} />
        </div>

        {/* Quick actions */}
        <div className="order-3 min-w-0 lg:col-start-3 lg:row-start-1">
          <QuickActions actions={quickActions} />
        </div>

        {/* Site info */}
        <div className="order-4 min-w-0 lg:col-start-3 lg:row-start-2">
          <SiteInfo contactInfo={contactInfo} />
        </div>
      </div>

      {/* Gallery + social */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-start-1 lg:col-end-3 lg:row-start-1">
          <GalleryPreview items={galleryItems} />
        </div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-1">
          <SocialLinksPanel links={socialLinks} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
