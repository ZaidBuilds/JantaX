-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CITIZEN', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ONGOING', 'DELAYED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('PHOTO', 'VIDEO', 'DOCUMENT', 'AUDIO');

-- CreateTable
CREATE TABLE "Pincode" (
    "code" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "population" INTEGER,
    "areaType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pincode_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "pincodeCode" TEXT NOT NULL,
    "udiseCode" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "nameHindi" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "managementType" TEXT NOT NULL,
    "studentsEnrolled" INTEGER NOT NULL,
    "teachersWorking" INTEGER NOT NULL,
    "teachersSanctioned" INTEGER NOT NULL,
    "groundTruthScore" INTEGER NOT NULL,
    "officialScore" INTEGER,
    "hasToilet" BOOLEAN,
    "hasElectricity" BOOLEAN,
    "hasDrinkingWater" BOOLEAN,
    "lastCheckIn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InfraProject" (
    "id" TEXT NOT NULL,
    "pincodeCode" TEXT NOT NULL,
    "titleEnglish" TEXT NOT NULL,
    "titleHindi" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "budget" DECIMAL(14,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expectedCompletion" TIMESTAMP(3) NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "claimCompletionPct" INTEGER NOT NULL,
    "groundTruthScore" INTEGER,
    "responsibleOfficer" TEXT NOT NULL,
    "implementingAgency" TEXT NOT NULL,
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfraProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReraProject" (
    "id" TEXT NOT NULL,
    "pincodeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reraNumber" TEXT NOT NULL,
    "promoter" TEXT NOT NULL,
    "configuration" TEXT NOT NULL,
    "plannedPossession" TIMESTAMP(3) NOT NULL,
    "actualPossession" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL,
    "delayMonths" INTEGER NOT NULL DEFAULT 0,
    "complaints" INTEGER NOT NULL DEFAULT 0,
    "refundsPending" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReraProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "pincodeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "doctorPresent" BOOLEAN NOT NULL DEFAULT false,
    "bedsTotal" INTEGER NOT NULL DEFAULT 0,
    "bedsOccupied" INTEGER NOT NULL DEFAULT 0,
    "medicinesAvailable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PdsShop" (
    "id" TEXT NOT NULL,
    "pincodeCode" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "dealerName" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "quotaDistributedPct" INTEGER NOT NULL DEFAULT 0,
    "qualityOk" BOOLEAN NOT NULL DEFAULT true,
    "beneficiaries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdsShop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grievance" (
    "id" TEXT NOT NULL,
    "pincodeCode" TEXT NOT NULL,
    "ministry" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "filedDate" TIMESTAMP(3) NOT NULL,
    "resolvedDate" TIMESTAMP(3),
    "delayDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grievance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contractor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registeredState" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "totalContracts" INTEGER NOT NULL DEFAULT 0,
    "completed" INTEGER NOT NULL DEFAULT 0,
    "ongoing" INTEGER NOT NULL DEFAULT 0,
    "delayed" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CitizenReport" (
    "id" TEXT NOT NULL,
    "pincodeCode" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedBy" TEXT,
    "reviewerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CitizenReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceMedia" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "type" "EvidenceType" NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "verificationStatus" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CITIZEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "pincodeCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pincode_state_district_idx" ON "Pincode"("state", "district");

-- CreateIndex
CREATE UNIQUE INDEX "School_udiseCode_key" ON "School"("udiseCode");

-- CreateIndex
CREATE INDEX "School_pincodeCode_idx" ON "School"("pincodeCode");

-- CreateIndex
CREATE INDEX "InfraProject_pincodeCode_idx" ON "InfraProject"("pincodeCode");

-- CreateIndex
CREATE INDEX "InfraProject_status_idx" ON "InfraProject"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ReraProject_reraNumber_key" ON "ReraProject"("reraNumber");

-- CreateIndex
CREATE INDEX "ReraProject_pincodeCode_idx" ON "ReraProject"("pincodeCode");

-- CreateIndex
CREATE INDEX "Hospital_pincodeCode_idx" ON "Hospital"("pincodeCode");

-- CreateIndex
CREATE INDEX "PdsShop_pincodeCode_idx" ON "PdsShop"("pincodeCode");

-- CreateIndex
CREATE INDEX "Grievance_pincodeCode_idx" ON "Grievance"("pincodeCode");

-- CreateIndex
CREATE INDEX "Grievance_ministry_idx" ON "Grievance"("ministry");

-- CreateIndex
CREATE INDEX "Contractor_registeredState_idx" ON "Contractor"("registeredState");

-- CreateIndex
CREATE INDEX "CitizenReport_pincodeCode_idx" ON "CitizenReport"("pincodeCode");

-- CreateIndex
CREATE INDEX "CitizenReport_status_idx" ON "CitizenReport"("status");

-- CreateIndex
CREATE INDEX "EvidenceMedia_reportId_idx" ON "EvidenceMedia"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Follow_pincodeCode_idx" ON "Follow"("pincodeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_userId_pincodeCode_key" ON "Follow"("userId", "pincodeCode");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfraProject" ADD CONSTRAINT "InfraProject_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReraProject" ADD CONSTRAINT "ReraProject_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PdsShop" ADD CONSTRAINT "PdsShop_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceMedia" ADD CONSTRAINT "EvidenceMedia_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CitizenReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
