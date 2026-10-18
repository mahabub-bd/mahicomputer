-- Real Course -> Category relation.
ALTER TABLE "Course" ADD COLUMN "categoryId" TEXT;

-- Safe backfill: only link courses whose tag exactly (case-insensitive)
-- matches a category title; the rest are assigned from the admin panel.
UPDATE "Course" c
SET "categoryId" = cat.id
FROM "Category" cat
WHERE c."categoryId" IS NULL
  AND lower(trim(c."tag")) = lower(trim(cat.title));

ALTER TABLE "Course"
  ADD CONSTRAINT "Course_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");
