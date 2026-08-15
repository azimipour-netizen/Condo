-- CreateTable
CREATE TABLE "PropertyQuestion" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyQuestion_propertyId_idx" ON "PropertyQuestion"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyQuestion_userId_idx" ON "PropertyQuestion"("userId");

-- CreateIndex
CREATE INDEX "PropertyAnswer_questionId_idx" ON "PropertyAnswer"("questionId");

-- AddForeignKey
ALTER TABLE "PropertyQuestion" ADD CONSTRAINT "PropertyQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAnswer" ADD CONSTRAINT "PropertyAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PropertyQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAnswer" ADD CONSTRAINT "PropertyAnswer_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
