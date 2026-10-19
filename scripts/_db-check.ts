import { config } from "dotenv";
config({ path: ".env" });
import { prisma } from "@/lib/prisma";
async function main() {
  try { console.log("count:", await prisma.faq.count()); }
  catch (e) { console.log("FAILED:", (e as { code?: string }).code); }
  await prisma.$disconnect().catch(() => {});
}
main();
