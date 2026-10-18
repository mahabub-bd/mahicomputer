import { prisma } from "@/lib/prisma";
import EnrollmentsList from "../../_components/EnrollmentsList";
import PageHeader from "../../_components/PageHeader";

export const dynamic = "force-dynamic";

const EnrollmentsAdminPage = async () => {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = enrollments.filter((e) => !e.read).length;

  return (
    <div>
      <PageHeader
        title="Enrollments"
        description={
          enrollments.length > 0
            ? `${enrollments.length} total · ${unread} new`
            : "Enroll Now form submissions"
        }
      />
      <EnrollmentsList enrollments={enrollments} />
    </div>
  );
};

export default EnrollmentsAdminPage;
