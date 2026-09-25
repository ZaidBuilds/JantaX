-- AlterTable
ALTER TABLE "Pincode" ADD COLUMN     "districtId" TEXT;

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lgdCode" INTEGER,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "pinCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistrictAlias" (
    "key" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "DistrictAlias_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "DatasetRecord" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "state" TEXT,
    "districtId" TEXT,
    "pincode" VARCHAR(6),
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "period" TEXT,
    "observedAt" TIMESTAMP(3),
    "data" JSONB NOT NULL,
    "rawDocumentId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatasetRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "District_lgdCode_key" ON "District"("lgdCode");

-- CreateIndex
CREATE INDEX "District_state_idx" ON "District"("state");

-- CreateIndex
CREATE INDEX "DistrictAlias_districtId_idx" ON "DistrictAlias"("districtId");

-- CreateIndex
CREATE INDEX "DatasetRecord_datasetId_pincode_idx" ON "DatasetRecord"("datasetId", "pincode");

-- CreateIndex
CREATE INDEX "DatasetRecord_datasetId_districtId_idx" ON "DatasetRecord"("datasetId", "districtId");

-- CreateIndex
CREATE INDEX "DatasetRecord_datasetId_state_idx" ON "DatasetRecord"("datasetId", "state");

-- AddForeignKey
ALTER TABLE "DistrictAlias" ADD CONSTRAINT "DistrictAlias_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE CASCADE ON UPDATE CASCADE;

