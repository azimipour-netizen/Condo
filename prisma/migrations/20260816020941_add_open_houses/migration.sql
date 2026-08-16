-- CreateTable
CREATE TABLE "OpenHouse" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenHouse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpenHouse_propertyId_idx" ON "OpenHouse"("propertyId");

-- CreateIndex
CREATE INDEX "OpenHouse_startsAt_idx" ON "OpenHouse"("startsAt");

-- AddForeignKey
ALTER TABLE "OpenHouse" ADD CONSTRAINT "OpenHouse_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
