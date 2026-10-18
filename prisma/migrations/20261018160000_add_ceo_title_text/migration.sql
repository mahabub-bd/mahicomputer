-- Admin-managed CEO section title + message (component defaults used when empty)
ALTER TABLE "SiteSetting" ADD COLUMN "ceoTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSetting" ADD COLUMN "ceoText" TEXT NOT NULL DEFAULT '';
