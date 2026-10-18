import { prisma } from "@/lib/prisma";
import InstructorsList from "../../_components/InstructorsList";

export const dynamic = "force-dynamic";

const InstructorsAdminPage = async () => {
  const instructors = await prisma.instructor.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { courses: true } } },
  });
  return <InstructorsList instructors={instructors} />;
};

export default InstructorsAdminPage;
