import { prisma } from "@/lib/prisma";
import EnrollmentsList from "../../_components/EnrollmentsList";
import PageHeader from "../../_components/PageHeader";

export const dynamic = "force-dynamic";

const EnrollmentsAdminPage = async () => {
  const [enrollments, courses] = await Promise.all([
    prisma.enrollment.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.course.findMany({
      select: { title: true, admission: true, price: true, installmentPlan: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const unread = enrollments.filter((e) => e.status === "PENDING").length;
  const approved = enrollments.filter((e) => e.status === "APPROVED").length;

  return (
    <div>
      <PageHeader
        title="Admissions"
        description={
          enrollments.length > 0
            ? `${enrollments.length} total · ${unread} pending · ${approved} approved`
            : "Admissions and course applications"
        }
      />
      <EnrollmentsList enrollments={enrollments} courses={courses} />
    </div>
  );
};

export default EnrollmentsAdminPage;
