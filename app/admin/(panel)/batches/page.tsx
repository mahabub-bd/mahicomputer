import { prisma } from "@/lib/prisma";
import PageHeader from "../../_components/PageHeader";
import BatchesList from "../../_components/BatchesList";

export const dynamic = "force-dynamic";

const BatchesAdminPage = async () => {
  const [batches, courses] = await Promise.all([
    prisma.batch.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: { _count: { select: { students: true, sessions: true } } },
    }),
    prisma.course.findMany({ select: { title: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Batches"
        description={
          batches.length > 0
            ? `${batches.length} batches`
            : "Class batches — groups of students running a course on a schedule"
        }
      />
      <BatchesList batches={batches} courses={courses} />
    </div>
  );
};

export default BatchesAdminPage;
