import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // A single pooled connection: concurrent new connections to the Neon
  // pooler time out from this environment, so let Prisma queue queries instead.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
