-- Blog module: admin-written posts shown on /blogs and /blogs/[slug].
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

ALTER TABLE "Post"
  ADD CONSTRAINT "Post_publishedById_fkey"
  FOREIGN KEY ("publishedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
