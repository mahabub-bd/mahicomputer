-- DropIndex
DROP INDEX IF EXISTS "Course_categoryId_idx";

-- DropIndex
DROP INDEX IF EXISTS "Course_instructorId_idx";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "authorId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Instructor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
