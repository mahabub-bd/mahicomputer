import { prisma } from "@/lib/prisma";
import PageHeader from "../../_components/PageHeader";
import StudentsList from "../../_components/StudentsList";

export const dynamic = "force-dynamic";

const StudentsAdminPage = async () => {
  const [students, courses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { status: "APPROVED" },
      orderBy: { studentId: "asc" },
    }),
    prisma.course.findMany({
      select: { title: true, price: true, installmentPlan: true },
    }),
  ]);

  const withDue = students.filter((s) => {
    const course = courses.find((c) => c.title === s.course);
    return (s.courseFee || course?.price || 0) - s.discount - s.paidAmount > 0;
  }).length;

  return (
    <div>
      <PageHeader
        title="Students"
        description={
          students.length > 0
            ? `${students.length} enrolled · ${withDue} with dues`
            : "Approved admissions with a student ID"
        }
      />
      <StudentsList
        students={students}
        courses={courses.map((c) => ({
          title: c.title,
          price: c.price,
          installmentPlan: c.installmentPlan,
        }))}
      />
    </div>
  );
};

export default StudentsAdminPage;
