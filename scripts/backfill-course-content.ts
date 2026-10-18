import { prisma } from "../lib/prisma";
import { courseContent } from "../prisma/course-content";

async function main() {
  let updated = 0;
  for (const [slug, content] of Object.entries(courseContent)) {
    const result = await prisma.course.updateMany({
      where: { slug },
      data: {
        description: content.description,
        modules: content.modules,
        prerequisite: content.prerequisite,
        seats: content.seats,
      },
    });
    updated += result.count;
    if (result.count === 0) console.warn("no course for slug:", slug);
  }
  console.log("updated courses:", updated);
  await prisma.$disconnect();
}
main().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
