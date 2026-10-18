-- Admin-managed Marquee, Why Choose Us and Map sections
ALTER TABLE "SiteSetting" ADD COLUMN "marqueeItems" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "SiteSetting" ADD COLUMN "whyTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSetting" ADD COLUMN "whySubtitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSetting" ADD COLUMN "whyFeatures" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "SiteSetting" ADD COLUMN "mapEmbedUrl" TEXT NOT NULL DEFAULT '';
