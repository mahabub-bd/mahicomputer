-- Admin-managed About section image (falls back to the bundled image when empty)
ALTER TABLE "SiteSetting" ADD COLUMN "aboutImageUrl" TEXT NOT NULL DEFAULT '';
