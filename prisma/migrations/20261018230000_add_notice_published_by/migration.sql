-- Track which admin user published each notice (nullable: legacy notices
-- have no known publisher).
ALTER TABLE "Notice" ADD COLUMN "publishedById" TEXT;

ALTER TABLE "Notice"
  ADD CONSTRAINT "Notice_publishedById_fkey"
  FOREIGN KEY ("publishedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
