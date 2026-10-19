/**
 * Seeds 2 sample Bangla newsletter issues into the Newsletter table.
 *
 * Idempotent — skips titles that already exist:
 *
 *     npx tsx scripts/seed-newsletters.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 30000 }),
});

const ISSUES = [
  {
    title: "অক্টোবর মাসের নিউজলেটার — নতুন ব্যাচ ও অফার",
    body: `আলহামদুলিল্লাহ! এই অক্টোবরে আমাদের প্রতিষ্ঠানে ৩টি নতুন ব্যাচ শুরু হচ্ছে — কম্পিউটার অফিস অ্যাপ্লিকেশন, গ্রাফিক্স ডিজাইন এবং ওয়েব ডিজাইন ও ডেভেলপমেন্ট। আসন সীমিত, তাই আগে ভর্তি হলে আগে সুবিধা।

এই মাসের বিশেষ অফার: যে শিক্ষার্থী একসাথে দুটি কোর্সে ভর্তি হবে, তার দ্বিতীয় কোর্সের ফি-তে ২০% ছাড় পাবে। অফারটি চলবে মাস শেষ পর্যন্ত।

গত মাসে আমাদের ৪৫ জন শিক্ষার্থী সফলভাবে কোর্স শেষ করে সার্টিফিকেট পেয়েছে। সবাইকে অভিনন্দন! তাদের মধ্যে কেউ কেউ এরই মধ্যে ফ্রিল্যান্সিং মার্কেটপ্লেসে কাজ শুরু করেছে।

ভর্তি ও বিস্তারিত জানতে কল করুন: +8801711102944।`,
    order: 0,
  },
  {
    title: "শীতকালীন ফ্রি সেমিনার — ফ্রিল্যান্সিং ক্যারিয়ার গাইড",
    body: `আগামী শুক্রবার বিকেল ৪টায় আমাদের প্রতিষ্ঠানে অনুষ্ঠিত হবে ফ্রি সেমিনার — "ফ্রিল্যান্সিং দিয়ে ক্যারিয়ার: কোথা থেকে শুরু করবেন?"।

সেমিনারে থাকছে: মার্কেটপ্লেসে কাজ পাওয়ার কৌশল, কোন স্কিলে বেশি ডলার, এবং শিক্ষার্থীদের সাকসেস স্টোরি। অংশগ্রহণ সম্পূর্ণ ফ্রি, তবে আসন সীমিত — আগেই রেজিস্ট্রেশন করে নিন।

সবার উপস্থিতির জন্য আমন্ত্রণ জানাচ্ছি। ধন্যবাদ।`,
    order: 1,
  },
];

async function main() {
  const existing = await prisma.newsletter.findMany({ select: { title: true } });
  const titles = new Set(existing.map((n) => n.title));
  const missing = ISSUES.filter((i) => !titles.has(i.title));

  if (missing.length === 0) {
    console.log("sample newsletters already present — skip");
    return;
  }

  for (const issue of missing) {
    await prisma.newsletter.create({
      data: { ...issue, published: true },
    });
    console.log(`created: ${issue.title}`);
  }
  console.log(`seeded ${missing.length} newsletters (table has ${existing.length + missing.length} total)`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
