/**
 * Wires the blog module into the site navigation — without touching anything
 * else, unlike `db:seed`, which deleteMany()s every nav and footer row first.
 *
 *   1. top nav: adds a "Blog" item right after "Notice"
 *   2. footer:  repoints the dead "#blog" anchor to /blogs
 *
 * Idempotent — safe to run repeatedly (an existing Blog nav item is detected,
 * and the shift below only runs when it actually inserts). Re-run with:
 *
 *     npx tsx scripts/add-blog-links.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
});
const prisma = new PrismaClient({ adapter });

const HREF = "/blogs";

async function main() {
  /* ---------- top nav ---------- */
  const existing = await prisma.navLink.findFirst({
    where: { href: { in: [HREF, "blogs", "#blogs"] } },
  });

  if (existing) {
    console.log(`Nav: already present — "${existing.title}" -> ${existing.href}`);
  } else {
    const links = await prisma.navLink.findMany({ orderBy: { order: "asc" } });
    const idx = links.findIndex((l) => l.title.trim().toLowerCase() === "notice");
    // Anchor after Notice when it exists, otherwise append to the end.
    const anchor = idx >= 0 ? links[idx] : links[links.length - 1];

    if (anchor) {
      // Make room: everything after the anchor shifts down by one.
      await prisma.navLink.updateMany({
        where: { order: { gt: anchor.order } },
        data: { order: { increment: 1 } },
      });
    }

    await prisma.navLink.create({
      data: {
        title: "Blog",
        href: HREF,
        cssClass: "nothoverable",
        order: anchor ? anchor.order + 1 : 0,
      },
    });
    console.log(
      `Nav: added "Blog" -> ${HREF} after "${anchor?.title ?? "(start)"}"`,
    );
  }

  /* ---------- footer ---------- */
  const footer = await prisma.footerLink.updateMany({
    where: { name: "Blog", href: { in: ["#blog", "blog", "/blog"] } },
    data: { href: HREF },
  });
  console.log(
    footer.count > 0
      ? `Footer: repointed ${footer.count} "Blog" link(s) -> ${HREF}`
      : 'Footer: "Blog" already points elsewhere — left as-is',
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
