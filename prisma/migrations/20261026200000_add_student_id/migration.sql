-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN "studentId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Enrollment_studentId_idx" ON "Enrollment"("studentId");
