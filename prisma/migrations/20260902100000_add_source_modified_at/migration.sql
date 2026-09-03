-- Prisma's own `updatedAt` is bumped on every write regardless of whether any
-- field actually changed, so a routine sync touch moves it even when nothing
-- about the listing did. sourceModifiedAt carries AMPRE's real
-- ModificationTimestamp instead, for lastmod accuracy (sitemap.ts) and any
-- future "genuinely changed since" logic. Nullable: existing rows get it on
-- their next sync.
ALTER TABLE "Property" ADD COLUMN "sourceModifiedAt" TIMESTAMP(3);
