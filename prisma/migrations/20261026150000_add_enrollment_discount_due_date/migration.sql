-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dueDate" TIMESTAMP(3);
