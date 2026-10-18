-- Admin account avatar (uploaded via /api/admin/upload).
ALTER TABLE "User" ADD COLUMN "imageUrl" TEXT NOT NULL DEFAULT '';
