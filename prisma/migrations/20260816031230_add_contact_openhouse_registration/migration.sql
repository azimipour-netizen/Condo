-- AlterTable
ALTER TABLE "SavedSearch" ADD COLUMN     "alertsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastAlertedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "OpenHouseRegistration" (
    "id" TEXT NOT NULL,
    "openHouseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenHouseRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpenHouseRegistration_openHouseId_idx" ON "OpenHouseRegistration"("openHouseId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenHouseRegistration_openHouseId_email_key" ON "OpenHouseRegistration"("openHouseId", "email");

-- CreateIndex
CREATE INDEX "ContactInquiry_createdAt_idx" ON "ContactInquiry"("createdAt");

-- CreateIndex
CREATE INDEX "ContactInquiry_read_idx" ON "ContactInquiry"("read");

-- AddForeignKey
ALTER TABLE "OpenHouseRegistration" ADD CONSTRAINT "OpenHouseRegistration_openHouseId_fkey" FOREIGN KEY ("openHouseId") REFERENCES "OpenHouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
