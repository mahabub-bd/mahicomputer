-- Per-course rating for CourseCard + editable CourseDetail section labels
ALTER TABLE "Course" ADD COLUMN "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.9;
ALTER TABLE "Course" ADD COLUMN "reviewCount" INTEGER NOT NULL DEFAULT 31;
ALTER TABLE "SiteSetting" ADD COLUMN "courseAboutTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSetting" ADD COLUMN "courseInsideTitle" TEXT NOT NULL DEFAULT '';
