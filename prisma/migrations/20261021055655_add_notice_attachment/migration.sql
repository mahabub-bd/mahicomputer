-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "attachmentName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "attachmentUrl" TEXT NOT NULL DEFAULT '';
