-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "transactionId" TEXT NOT NULL DEFAULT '';
