-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('UPCOMING', 'RUNNING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE');

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "schedule" TEXT NOT NULL DEFAULT '',
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "status" "BatchStatus" NOT NULL DEFAULT 'UPCOMING',
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchStudent" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatchStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassSession" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "topic" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BatchStudent_batchId_enrollmentId_key" ON "BatchStudent"("batchId", "enrollmentId");

-- CreateIndex
CREATE INDEX "BatchStudent_enrollmentId_idx" ON "BatchStudent"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_sessionId_enrollmentId_key" ON "Attendance"("sessionId", "enrollmentId");

-- AddForeignKey
ALTER TABLE "BatchStudent" ADD CONSTRAINT "BatchStudent_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchStudent" ADD CONSTRAINT "BatchStudent_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSession" ADD CONSTRAINT "ClassSession_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ClassSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
