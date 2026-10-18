-- Enrollment approval workflow: pending -> approved/declined by admin
CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

ALTER TABLE "Enrollment" ADD COLUMN "status" "EnrollmentStatus" NOT NULL DEFAULT 'PENDING';
