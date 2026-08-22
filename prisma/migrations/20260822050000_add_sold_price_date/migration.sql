-- Sold data for AVM comparables. Sourced from the VOW feed, so display of
-- soldPrice must stay gated behind login (see ComplianceConfig.showSoldPrice).
ALTER TABLE "Property" ADD COLUMN "soldPrice" DECIMAL(12,2);
ALTER TABLE "Property" ADD COLUMN "soldDate"  TIMESTAMP(3);

-- Comparable lookups scan recent sales, usually inside a bounding box.
CREATE INDEX "Property_status_soldDate_idx" ON "Property"("status", "soldDate");
CREATE INDEX "Property_status_latitude_longitude_soldDate_idx" ON "Property"("status", "latitude", "longitude", "soldDate");
