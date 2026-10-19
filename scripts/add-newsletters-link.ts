/**
 * Adds a "Newsletters" item to the top nav right after "Blog", pointing to
 * /newsletters. Footer untouched.
 *
 * Idempotent — safe to run repeatedly:
 *
 *     npx tsx scripts/add-newsletters-link.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 30000 }),
});

const HREF = "/newsletters";

async function main() {
  const existing = await prisma.navLink.findFirst({
    where: { href: { in: [HREF, "newsletters", "#newsletters"] } },
  });

  if (existing) {
    console.log(`Nav: already present — "${existing.title}" -> ${existing.href}`);
    return;
  }

  const links = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
  const idx = links.findIndex((l) => l.title.trim().toLowerCase() === "blog");
  // Anchor after Blog when it exists, otherwise after Notice, else append.
  let anchor = idx >= 0 ? links[idx] : undefined;
  if (!anchor) {
    const nIdx = links.findIndex((l) => l.title.trim().toLowerCase() === "notice");
    anchor = nIdx >= 0 ? links[nIdx] : links[links.length - 1];
  }

  if (anchor) {
    await prisma.navLink.updateMany({
      where: { order: { gt: anchor.order } },
      data: { order: { increment: 1 } },
    });
  }

  await prisma.navLink.create({
    data: {
      title: "Newsletters",
      href: HREF,
      cssClass: "nothoverable",
      order: anchor ? anchor.order + 1 : 0,
    },
  });
  console.log(
    `Nav: added "Newsletters" -> ${HREF} after "${anchor?.title ?? "(start)"}"`
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
