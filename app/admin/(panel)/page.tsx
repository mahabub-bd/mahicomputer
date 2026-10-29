import { getSession } from "@/lib/auth";
import { getBusinessSettings, getGalleryItems, getSiteSettings, getSocialLinks } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import {
  Bell,
  BookOpen,
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
import AttentionStrip, { AttentionItem } from "../_components/dashboard/AttentionStrip";
import GalleryPreview from "../_components/dashboard/GalleryPreview";
import QuickActions from "../_components/dashboard/QuickActions";
import RecentCourses from "../_components/dashboard/RecentCourses";
import RecentMessages from "../_components/dashboard/RecentMessages";
import SiteOverview, { ContactInfoItem } from "../_components/dashboard/SiteOverview";
import StatCards, { StatCard } from "../_components/dashboard/StatCards";
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
    enrollmentCount,
    pendingEnrollmentCount,
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
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "PENDING" } }),
    prisma.course.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: {
        category: { select: { title: true } },
        instructor: { select: { name: true } },
      },
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

  /* What needs a decision today — rendered above the inventory counters. */
  const attention: AttentionItem[] = [
    {
      label: "Pending admissions",
      count: pendingEnrollmentCount,
      href: "/admin/enrollments",
      Icon: GraduationCap,
      wrap: "border-violet-200/70 bg-violet-50/60 text-violet-900",
      chip: "bg-violet-100 text-violet-700",
    },
    {
      label: "Unread messages",
      count: unreadCount,
      href: "/admin/messages",
      Icon: Mail,
      wrap: "border-blue-200/70 bg-blue-50/60 text-blue-900",
      chip: "bg-blue-100 text-blue-700",
    },
    {
      label: "Courses hidden",
      count: hiddenCount,
      href: "/admin/courses",
      Icon: EyeOff,
      wrap: "border-amber-200/70 bg-amber-50/60 text-amber-900",
      chip: "bg-amber-100 text-amber-700",
    },
  ];

  const cards: StatCard[] = [
    {
      label: "Courses",
      value: courseCount,
      hint: `${publishedCount} published · ${hiddenCount} hidden`,
      href: "/admin/courses",
      Icon: BookOpen,
    },
    {
      label: "Admissions",
      value: enrollmentCount,
      hint: pendingEnrollmentCount > 0 ? `${pendingEnrollmentCount} awaiting review` : "All reviewed",
      href: "/admin/enrollments",
      Icon: GraduationCap,
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

      <AttentionStrip items={attention} />

      <StatCards cards={cards} />

      {/* Main grid — activity (left, 2 cols) · shortcuts & site info (right rail).
          `min-w-0` lets each cell shrink so a wide table scrolls inside its
          card instead of pushing the page sideways. */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RecentCourses courses={recentCourses} />
        </div>
        <div className="min-w-0">
          <QuickActions actions={quickActions} />
        </div>

        <div className="min-w-0 lg:col-span-2">
          <RecentMessages messages={recentMessages} unreadCount={unreadCount} />
        </div>
        <div className="min-w-0">
          <SiteOverview contactInfo={contactInfo} links={socialLinks} />
        </div>
      </div>

      <div className="mt-8">
        <GalleryPreview items={galleryItems} />
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        {messageCount} messages received · {enrollmentCount} admissions ·{" "}
        {courseCount} courses in the catalogue
      </p>
    </div>
  );
};

export default AdminDashboard;
