-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "businessName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "whatsappNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "whatsappMessage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "whatsappEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "openingHours" TEXT NOT NULL DEFAULT '';
