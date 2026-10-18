-- Social links are managed via the SocialLink model (admin → Social),
-- not via SiteSetting. Drop the duplicated SiteSetting columns.
ALTER TABLE "SiteSetting"
  DROP COLUMN "facebookUrl",
  DROP COLUMN "youtubeUrl",
  DROP COLUMN "linkedinUrl";
