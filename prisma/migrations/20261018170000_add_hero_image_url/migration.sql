-- Admin-managed Hero section background image (bundled image used when empty)
ALTER TABLE "SiteSetting" ADD COLUMN "heroImageUrl" TEXT NOT NULL DEFAULT '';
