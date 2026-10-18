-- Admin-managed CEO section image (falls back to the bundled image when empty)
ALTER TABLE "SiteSetting" ADD COLUMN "ceoImageUrl" TEXT NOT NULL DEFAULT '';
