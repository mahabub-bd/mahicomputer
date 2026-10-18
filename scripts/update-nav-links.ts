import { config } from "dotenv";
config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Nav titles that now route to dedicated pages instead of home-page anchors. */
const UPDATES: Record<string, string> = {
  About: "/about",
  Services: "/services",
  Feedback: "/feedback",
  Gallery: "/gallery",
  Contact: "/contact",
};

async function main() {
  const links = await prisma.navLink.findMany();
  let updated = 0;

  for (const link of links) {
    const href = UPDATES[link.title];
    if (!href || link.href === href) continue;
    await prisma.navLink.update({
      where: { id: link.id },
      data: { href },
    });
    updated++;
    console.log(`updated "${link.title}": ${link.href} -> ${href}`);
  }

  console.log(
    updated ? `${updated} nav link(s) updated` : "nav links already up to date — skip"
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("ERROR code:", (e as { code?: string }).code);
  console.error(
    "ERROR full:",
    JSON.stringify({ message: e instanceof Error ? e.message : String(e) }, null, 2)
  );
  process.exit(1);
});
