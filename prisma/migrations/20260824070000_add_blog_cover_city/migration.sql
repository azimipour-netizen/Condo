ALTER TABLE "BlogPost" ADD COLUMN "coverImageUrl" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "citySlug" TEXT;

CREATE INDEX "BlogPost_citySlug_idx" ON "BlogPost"("citySlug");
