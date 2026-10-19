import { prisma } from "@/lib/prisma";
import InstructorsList from "../../_components/InstructorsList";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ edit?: string }> };

const InstructorsAdminPage = async ({ searchParams }: Props) => {
  const { edit } = await searchParams;
  const instructors = await prisma.instructor.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { courses: true } } },
  });
  return <InstructorsList instructors={instructors} editId={edit} />;
};

export default InstructorsAdminPage;
