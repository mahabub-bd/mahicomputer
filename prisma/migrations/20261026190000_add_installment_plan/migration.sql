-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "installmentPlan" JSONB NOT NULL DEFAULT '[]';

ALTER TABLE "Enrollment" ADD COLUMN "installmentPlan" JSONB NOT NULL DEFAULT '[]';
