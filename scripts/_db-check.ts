import { config } from "dotenv";
config({ path: ".env" });
import { prisma } from "@/lib/prisma";
async function main() {
  try { console.log("count:", await prisma.faq.count()); }
  catch (e: any) { console.log("FAILED:", e.code); }
  await prisma.$disconnect().catch(() => {});
}
main();
