-- CreateTable
CREATE TABLE "BusinessSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "businessName" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "openingHours" TEXT NOT NULL DEFAULT '',
    "mapEmbedUrl" TEXT NOT NULL DEFAULT '',
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "whatsappMessage" TEXT NOT NULL DEFAULT '',
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSetting_pkey" PRIMARY KEY ("id")
);

-- Carry the existing business values out of the SiteSetting singleton before
-- the columns are dropped, so no admin-entered data is lost.
INSERT INTO "BusinessSetting" (
    "id",
    "businessName",
    "phone",
    "email",
    "address",
    "openingHours",
    "mapEmbedUrl",
    "whatsappNumber",
    "whatsappMessage",
    "whatsappEnabled",
    "updatedAt"
)
SELECT
    1,
    "businessName",
    "phone",
    "email",
    "address",
    "openingHours",
    "mapEmbedUrl",
    "whatsappNumber",
    "whatsappMessage",
    "whatsappEnabled",
    "updatedAt"
FROM "SiteSetting"
WHERE "id" = 1;

-- AlterTable
ALTER TABLE "SiteSetting"
    DROP COLUMN "businessName",
    DROP COLUMN "phone",
    DROP COLUMN "email",
    DROP COLUMN "address",
    DROP COLUMN "openingHours",
    DROP COLUMN "mapEmbedUrl",
    DROP COLUMN "whatsappNumber",
    DROP COLUMN "whatsappMessage",
    DROP COLUMN "whatsappEnabled";
