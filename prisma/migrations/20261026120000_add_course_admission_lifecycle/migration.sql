-- CreateEnum
CREATE TYPE "CourseAdmission" AS ENUM ('UPCOMING', 'OPEN', 'RUNNING', 'COMPLETED');

-- AlterTable
-- Default OPEN so every course that existed before this migration keeps
-- accepting applications exactly as before.
ALTER TABLE "Course" ADD COLUMN "admission" "CourseAdmission" NOT NULL DEFAULT 'OPEN';
