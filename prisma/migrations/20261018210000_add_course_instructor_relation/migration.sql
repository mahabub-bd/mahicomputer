-- Real Course -> Instructor relation; the denormalized instructorName/
-- instructorPhotoUrl columns stay as a display copy kept in sync on save.
ALTER TABLE "Course" ADD COLUMN "instructorId" TEXT;

-- Backfill: link existing courses to instructors by (case-insensitive) name.
UPDATE "Course" c
SET "instructorId" = i.id
FROM "Instructor" i
WHERE c."instructorId" IS NULL
  AND lower(trim(c."instructorName")) = lower(trim(i."name"));

ALTER TABLE "Course"
  ADD CONSTRAINT "Course_instructorId_fkey"
  FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Course_instructorId_idx" ON "Course"("instructorId");
