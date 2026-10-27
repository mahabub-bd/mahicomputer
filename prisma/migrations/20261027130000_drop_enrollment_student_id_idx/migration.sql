-- DropIndex — replaces the misordered 20261026183216_payment migration.
-- Runs after 20261026200000_add_student_id creates the index, so the
-- shadow-database replay now succeeds. IF EXISTS = no-op on the live DB,
-- where the index was already dropped.
DROP INDEX IF EXISTS "Enrollment_studentId_idx";
