import { config } from "dotenv";
config({ path: ".env.local" }); // optional override
config({ path: ".env" }); // project env (remote Postgres)

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";

/**
 * Creates (or resets) an admin user without touching the rest of the data.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts <email> "<name>" "<password>"
 * Example:
 *   npx tsx scripts/create-admin.ts admin@example.john "John Doe" "S3cret!"
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = (process.argv[2] || "").toLowerCase().trim();
  const name = (process.argv[3] || "").trim();
  const password = process.argv[4] || "";

  if (!email || !password) {
    console.error(
      "Usage: npx tsx scripts/create-admin.ts <email> \"<name>\" \"<password>\""
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    // An existing account gets its name + password refreshed.
    update: { name: name || undefined, passwordHash },
    create: { email, name: name || "Admin", passwordHash },
  });

  console.log(`✔ Admin ready: ${user.email} (${user.name})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
