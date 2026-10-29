-- AlterTable
-- Added nullable first so the existing rows can be backfilled below.
ALTER TABLE "AuditLog" ADD COLUMN "serial" TEXT;

-- Backfill: YYYYMMDD (business day in Asia/Dhaka — Prisma stores UTC-naive
-- timestamps) + zero-padded daily sequence, oldest first. Matches the format
-- lib/audit.ts writes for new entries.
WITH numbered AS (
    SELECT
        "id",
        to_char(
            ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Dhaka',
            'YYYYMMDD'
        ) AS day,
        ROW_NUMBER() OVER (
            PARTITION BY (("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Dhaka')::date
            ORDER BY "createdAt", "id"
        ) AS seq
    FROM "AuditLog"
)
UPDATE "AuditLog" AS l
SET "serial" = n.day || lpad(n.seq::text, 3, '0')
FROM numbered AS n
WHERE l."id" = n."id";

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "serial" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuditLog_serial_key" ON "AuditLog"("serial");
