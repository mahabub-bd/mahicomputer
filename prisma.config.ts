import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prisma 7 no longer auto-loads env files; Next.js uses .env.local.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // CLI (migrate/introspect) uses the direct, non-pooled connection
  datasource: {
    url: env("DIRECT_URL"),
  },
});
