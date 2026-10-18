/**
 * Inserts the Google reviews (from prisma/seed-data/review.ts) into the database
 * without touching any other reviews. Idempotent: Google rows (id "google-*")
 * are replaced, every other review keeps its relative order, shifted after
 * the Google ones. Run: npx tsx scripts/sync-google-reviews.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { review } from "../prisma/seed-data/review";
import { PrismaClient } from "../app/generated/prisma/client";

const googleReviews = review.filter((r) => r.id.startsWith("google-"));

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Replace any previous Google rows, keep everything else.
  await prisma.review.deleteMany({
    where: { id: { startsWith: "google-" } },
  });

  // Push existing reviews after the Google ones, preserving relative order.
  const others = await prisma.review.findMany({
    where: { id: { not: { startsWith: "google-" } } },
    orderBy: { order: "asc" },
  });
  for (const [i, r] of others.entries()) {
    await prisma.review.update({
      where: { id: r.id },
      data: { order: googleReviews.length + i },
    });
  }

  await prisma.review.createMany({
    data: googleReviews.map((r, i) => ({
      id: r.id,
      name: r.name,
      title: r.title,
      content: r.content,
      course: r.course,
      rating: r.rating,
      imageUrl: r.img,
      order: i,
    })),
  });

  const total = await prisma.review.count();
  console.log(`Synced ${googleReviews.length} Google reviews. Total reviews: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
