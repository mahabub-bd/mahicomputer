-- Course detail page content (fully DB-driven course pages)
ALTER TABLE "Course" ADD COLUMN "description" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Course" ADD COLUMN "modules" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Course" ADD COLUMN "prerequisite" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Course" ADD COLUMN "seats" TEXT NOT NULL DEFAULT '';
