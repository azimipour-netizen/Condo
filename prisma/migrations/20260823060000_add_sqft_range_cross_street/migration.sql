-- Size range fallback (AMPRE's LivingAreaRange) and cross streets, both
-- previously fetched only on the single-listing detail view — search and
-- sync never selected these fields from AMPRE, so they were silently null
-- everywhere else, including for the AI assistant's search results.
ALTER TABLE "Property" ADD COLUMN "sqftRange" TEXT;
ALTER TABLE "Property" ADD COLUMN "crossStreet" TEXT;
