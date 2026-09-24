-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

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

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('DETECTED', 'EVIDENCE_COLLECTED', 'AUTHORITY_IDENTIFIED', 'GRIEVANCE_DRAFTED', 'GRIEVANCE_SUBMITTED', 'AWAITING_RESPONSE', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('DRAFT', 'SUBMITTED_TO_OFFICIAL', 'AWAITING_RESPONSE', 'RESPONSE_RECEIVED', 'APPEALED', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ResolutionStatus" AS ENUM ('PROPOSED', 'VERIFIED_BY_CITIZEN', 'VERIFIED_BY_OFFICIAL', 'VERIFIED_BY_BOTH', 'REJECTED');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');

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
    "isSample" BOOLEAN NOT NULL DEFAULT false,
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
    "isSample" BOOLEAN NOT NULL DEFAULT false,
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
    "isSample" BOOLEAN NOT NULL DEFAULT false,
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
    "isSample" BOOLEAN NOT NULL DEFAULT false,
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
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdsShop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CpgramGrievance" (
    "id" TEXT NOT NULL,
    "pincodeCode" TEXT NOT NULL,
    "ministry" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "filedDate" TIMESTAMP(3) NOT NULL,
    "resolvedDate" TIMESTAMP(3),
    "delayDays" INTEGER NOT NULL DEFAULT 0,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CpgramGrievance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "pincodeCode" TEXT,
    "status" "IssueStatus" NOT NULL DEFAULT 'DETECTED',
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueDetail" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "severity" "IssueSeverity",
    "impactArea" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorityResolver" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "officialChannel" TEXT NOT NULL,
    "submissionUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorityResolver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grievance" (
    "id" TEXT NOT NULL,
    "grievanceId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "authorityResolverId" TEXT,
    "officialChannel" TEXT NOT NULL,
    "draft" TEXT NOT NULL,
    "status" "GrievanceStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedToOfficial" BOOLEAN NOT NULL DEFAULT false,
    "officialReferenceNumber" TEXT,
    "submittedAt" TIMESTAMP(3),
    "officialResponse" TEXT,
    "responseDate" TIMESTAMP(3),
    "appealAvailable" BOOLEAN NOT NULL DEFAULT false,
    "followUpAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grievance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrievanceTimeline" (
    "id" TEXT NOT NULL,
    "grievanceId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" TEXT,
    "metadata" JSONB,

    CONSTRAINT "GrievanceTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resolution" (
    "id" TEXT NOT NULL,
    "resolutionId" TEXT NOT NULL,
    "issueId" TEXT,
    "grievanceId" TEXT,
    "description" TEXT NOT NULL,
    "status" "ResolutionStatus" NOT NULL DEFAULT 'PROPOSED',
    "verifiedByCitizen" BOOLEAN NOT NULL DEFAULT false,
    "verifiedByOfficial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "followUpId" TEXT NOT NULL,
    "grievanceId" TEXT,
    "issueId" TEXT,
    "description" TEXT NOT NULL,
    "status" "FollowUpStatus" NOT NULL DEFAULT 'PENDING',
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
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
    "isSample" BOOLEAN NOT NULL DEFAULT false,
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
    "isSample" BOOLEAN NOT NULL DEFAULT false,
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
CREATE TABLE "StateCmClaim" (
    "id" TEXT NOT NULL,
    "stateCode" VARCHAR(2) NOT NULL,
    "category" TEXT NOT NULL,
    "claimTitleHindi" TEXT NOT NULL,
    "claimTitleEn" TEXT NOT NULL,
    "claimSource" TEXT NOT NULL,
    "claimDetails" TEXT NOT NULL,
    "realityTitleHindi" TEXT NOT NULL,
    "realityTitleEn" TEXT NOT NULL,
    "realityDetails" TEXT NOT NULL,
    "cagReportRef" TEXT NOT NULL,
    "realitySeverity" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StateCmClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MunicipalWard" (
    "id" TEXT NOT NULL,
    "pincode" VARCHAR(6) NOT NULL,
    "wardNo" TEXT NOT NULL,
    "garbageClaimedSla" TEXT NOT NULL,
    "waterClaimedSla" TEXT NOT NULL,
    "drainageClaimedSla" TEXT NOT NULL,

    CONSTRAINT "MunicipalWard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WardReview" (
    "id" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "serviceCategory" TEXT NOT NULL,
    "actualRating" INTEGER NOT NULL,
    "feedbackText" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WardReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PincodeBudget" (
    "id" TEXT NOT NULL,
    "pincode" VARCHAR(6) NOT NULL,
    "financialYear" TEXT NOT NULL,
    "totalRevenueCr" DOUBLE PRECISION NOT NULL,
    "totalAllocatedCr" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PincodeBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetSectorAllocation" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "sectorNameEn" TEXT NOT NULL,
    "sectorNameHi" TEXT NOT NULL,
    "allocatedCr" DOUBLE PRECISION NOT NULL,
    "utilizedCr" DOUBLE PRECISION NOT NULL,
    "stalledProjects" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BudgetSectorAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionalAqiStation" (
    "id" TEXT NOT NULL,
    "pincode" VARCHAR(6) NOT NULL,
    "stationName" TEXT NOT NULL,
    "aqiValue" INTEGER NOT NULL,
    "dominantPollutant" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegionalAqiStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpcbNotice" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "industryName" TEXT NOT NULL,
    "noticeType" TEXT NOT NULL,
    "violationReason" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,

    CONSTRAINT "SpcbNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TehsilOffice" (
    "id" TEXT NOT NULL,
    "pincode" VARCHAR(6) NOT NULL,
    "tehsilName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "promisedSlaDays" INTEGER NOT NULL DEFAULT 45,

    CONSTRAINT "TehsilOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandMutationRecord" (
    "id" TEXT NOT NULL,
    "tehsilId" TEXT NOT NULL,
    "surveyNumber" TEXT NOT NULL,
    "daysTaken" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "appliedDate" TEXT NOT NULL,

    CONSTRAINT "LandMutationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscomFeeder" (
    "id" TEXT NOT NULL,
    "pincode" VARCHAR(6) NOT NULL,
    "feederName" TEXT NOT NULL,
    "substationName" TEXT NOT NULL,
    "promisedSupplyHours" INTEGER NOT NULL DEFAULT 24,

    CONSTRAINT "DiscomFeeder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeederOutageLog" (
    "id" TEXT NOT NULL,
    "feederId" TEXT NOT NULL,
    "outageMinutes" INTEGER NOT NULL,
    "faultType" TEXT NOT NULL,
    "faultTypeHi" TEXT NOT NULL,
    "logDate" TEXT NOT NULL,

    CONSTRAINT "FeederOutageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSpendRecord" (
    "id" TEXT NOT NULL,
    "pincode" VARCHAR(6) NOT NULL,
    "candidateName" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "constituency" TEXT NOT NULL,
    "declaredSpend" DOUBLE PRECISION NOT NULL,
    "estimatedSpend" DOUBLE PRECISION NOT NULL,
    "sourceAffidavit" TEXT NOT NULL,

    CONSTRAINT "CandidateSpendRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CpgramsMonthlyRecord" (
    "id" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameHi" TEXT NOT NULL,
    "totalGrievances" INTEGER NOT NULL,
    "resolvedCount" INTEGER NOT NULL,
    "pendingCount" INTEGER NOT NULL,
    "avgDisposalDays" INTEGER NOT NULL,
    "backlogOver30Days" INTEGER NOT NULL,
    "worstCategoryEn" TEXT NOT NULL,
    "worstCategoryHi" TEXT NOT NULL,
    "reportMonth" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CpgramsMonthlyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractorProject" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "workOrderNo" TEXT NOT NULL,
    "workName" TEXT NOT NULL,
    "workNameHi" TEXT NOT NULL,
    "sanctionedLakhs" DOUBLE PRECISION NOT NULL,
    "paymentReleased" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "delayMonths" INTEGER NOT NULL DEFAULT 0,
    "defectReports" INTEGER NOT NULL DEFAULT 0,
    "isSample" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContractorProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "source_id" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "department" TEXT,
    "government_level" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "api_url" TEXT,
    "dataset_url" TEXT,
    "source_type" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "terms_url" TEXT,
    "attribution_requirement" TEXT NOT NULL,
    "reuse_permission" TEXT NOT NULL,
    "data_sensitivity" TEXT NOT NULL,
    "update_frequency" TEXT NOT NULL,
    "expected_refresh_interval" TEXT NOT NULL,
    "last_checked" TIMESTAMP(3) NOT NULL,
    "last_successful_sync" TIMESTAMP(3),
    "last_published_date" TEXT,
    "parser_version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("source_id")
);

-- CreateTable
CREATE TABLE "RawDocument" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "storage_path" TEXT,
    "status" TEXT NOT NULL,
    "error" TEXT,

    CONSTRAINT "RawDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParsedDocument" (
    "id" TEXT NOT NULL,
    "raw_document_id" TEXT NOT NULL,
    "parsed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "row_count" INTEGER NOT NULL,
    "parsed_json" JSONB,

    CONSTRAINT "ParsedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationResult" (
    "id" TEXT NOT NULL,
    "parsed_document_id" TEXT NOT NULL,
    "is_valid" BOOLEAN NOT NULL,
    "errors" JSONB,
    "warnings" JSONB,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValidationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataPoint" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "observed_at" TEXT,
    "source_published_at" TEXT,
    "recalc_at" TEXT NOT NULL,
    "scoring_version" TEXT,
    "sample_size" INTEGER,
    "reporting_days" INTEGER,
    "agreement_rate" DOUBLE PRECISION,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataPoint_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "CpgramGrievance_pincodeCode_idx" ON "CpgramGrievance"("pincodeCode");

-- CreateIndex
CREATE INDEX "CpgramGrievance_ministry_idx" ON "CpgramGrievance"("ministry");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_issueId_key" ON "Issue"("issueId");

-- CreateIndex
CREATE INDEX "Issue_issueId_idx" ON "Issue"("issueId");

-- CreateIndex
CREATE INDEX "Issue_entityType_entityId_idx" ON "Issue"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Issue_pincodeCode_idx" ON "Issue"("pincodeCode");

-- CreateIndex
CREATE INDEX "Issue_status_idx" ON "Issue"("status");

-- CreateIndex
CREATE UNIQUE INDEX "IssueDetail_issueId_key" ON "IssueDetail"("issueId");

-- CreateIndex
CREATE INDEX "IssueDetail_issueId_idx" ON "IssueDetail"("issueId");

-- CreateIndex
CREATE INDEX "AuthorityResolver_entityType_idx" ON "AuthorityResolver"("entityType");

-- CreateIndex
CREATE INDEX "AuthorityResolver_authority_idx" ON "AuthorityResolver"("authority");

-- CreateIndex
CREATE UNIQUE INDEX "Grievance_grievanceId_key" ON "Grievance"("grievanceId");

-- CreateIndex
CREATE INDEX "Grievance_grievanceId_idx" ON "Grievance"("grievanceId");

-- CreateIndex
CREATE INDEX "Grievance_issueId_idx" ON "Grievance"("issueId");

-- CreateIndex
CREATE INDEX "Grievance_authorityResolverId_idx" ON "Grievance"("authorityResolverId");

-- CreateIndex
CREATE INDEX "Grievance_status_idx" ON "Grievance"("status");

-- CreateIndex
CREATE INDEX "Grievance_submittedToOfficial_idx" ON "Grievance"("submittedToOfficial");

-- CreateIndex
CREATE INDEX "GrievanceTimeline_grievanceId_idx" ON "GrievanceTimeline"("grievanceId");

-- CreateIndex
CREATE INDEX "GrievanceTimeline_occurredAt_idx" ON "GrievanceTimeline"("occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Resolution_resolutionId_key" ON "Resolution"("resolutionId");

-- CreateIndex
CREATE INDEX "Resolution_resolutionId_idx" ON "Resolution"("resolutionId");

-- CreateIndex
CREATE INDEX "Resolution_issueId_idx" ON "Resolution"("issueId");

-- CreateIndex
CREATE INDEX "Resolution_grievanceId_idx" ON "Resolution"("grievanceId");

-- CreateIndex
CREATE INDEX "Resolution_status_idx" ON "Resolution"("status");

-- CreateIndex
CREATE UNIQUE INDEX "FollowUp_followUpId_key" ON "FollowUp"("followUpId");

-- CreateIndex
CREATE INDEX "FollowUp_followUpId_idx" ON "FollowUp"("followUpId");

-- CreateIndex
CREATE INDEX "FollowUp_grievanceId_idx" ON "FollowUp"("grievanceId");

-- CreateIndex
CREATE INDEX "FollowUp_issueId_idx" ON "FollowUp"("issueId");

-- CreateIndex
CREATE INDEX "FollowUp_status_idx" ON "FollowUp"("status");

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
CREATE INDEX "StateCmClaim_stateCode_category_idx" ON "StateCmClaim"("stateCode", "category");

-- CreateIndex
CREATE INDEX "MunicipalWard_pincode_idx" ON "MunicipalWard"("pincode");

-- CreateIndex
CREATE INDEX "WardReview_wardId_idx" ON "WardReview"("wardId");

-- CreateIndex
CREATE UNIQUE INDEX "PincodeBudget_pincode_key" ON "PincodeBudget"("pincode");

-- CreateIndex
CREATE INDEX "BudgetSectorAllocation_budgetId_idx" ON "BudgetSectorAllocation"("budgetId");

-- CreateIndex
CREATE INDEX "RegionalAqiStation_pincode_idx" ON "RegionalAqiStation"("pincode");

-- CreateIndex
CREATE INDEX "SpcbNotice_stationId_idx" ON "SpcbNotice"("stationId");

-- CreateIndex
CREATE INDEX "TehsilOffice_pincode_idx" ON "TehsilOffice"("pincode");

-- CreateIndex
CREATE INDEX "LandMutationRecord_tehsilId_idx" ON "LandMutationRecord"("tehsilId");

-- CreateIndex
CREATE INDEX "DiscomFeeder_pincode_idx" ON "DiscomFeeder"("pincode");

-- CreateIndex
CREATE INDEX "FeederOutageLog_feederId_idx" ON "FeederOutageLog"("feederId");

-- CreateIndex
CREATE INDEX "CandidateSpendRecord_pincode_idx" ON "CandidateSpendRecord"("pincode");

-- CreateIndex
CREATE INDEX "CpgramsMonthlyRecord_recordType_rank_idx" ON "CpgramsMonthlyRecord"("recordType", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "ContractorProject_workOrderNo_key" ON "ContractorProject"("workOrderNo");

-- CreateIndex
CREATE INDEX "ContractorProject_contractorId_idx" ON "ContractorProject"("contractorId");

-- CreateIndex
CREATE INDEX "Source_source_type_status_idx" ON "Source"("source_type", "status");

-- CreateIndex
CREATE INDEX "Source_organization_source_name_idx" ON "Source"("organization", "source_name");

-- CreateIndex
CREATE INDEX "RawDocument_source_id_fetched_at_idx" ON "RawDocument"("source_id", "fetched_at");

-- CreateIndex
CREATE UNIQUE INDEX "ParsedDocument_raw_document_id_key" ON "ParsedDocument"("raw_document_id");

-- CreateIndex
CREATE INDEX "ParsedDocument_parsed_at_idx" ON "ParsedDocument"("parsed_at");

-- CreateIndex
CREATE UNIQUE INDEX "ValidationResult_parsed_document_id_key" ON "ValidationResult"("parsed_document_id");

-- CreateIndex
CREATE INDEX "DataPoint_source_id_entity_id_idx" ON "DataPoint"("source_id", "entity_id");

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
ALTER TABLE "CpgramGrievance" ADD CONSTRAINT "CpgramGrievance_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueDetail" ADD CONSTRAINT "IssueDetail_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_authorityResolverId_fkey" FOREIGN KEY ("authorityResolverId") REFERENCES "AuthorityResolver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrievanceTimeline" ADD CONSTRAINT "GrievanceTimeline_grievanceId_fkey" FOREIGN KEY ("grievanceId") REFERENCES "Grievance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resolution" ADD CONSTRAINT "Resolution_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resolution" ADD CONSTRAINT "Resolution_grievanceId_fkey" FOREIGN KEY ("grievanceId") REFERENCES "Grievance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_grievanceId_fkey" FOREIGN KEY ("grievanceId") REFERENCES "Grievance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceMedia" ADD CONSTRAINT "EvidenceMedia_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CitizenReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardReview" ADD CONSTRAINT "WardReview_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "MunicipalWard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetSectorAllocation" ADD CONSTRAINT "BudgetSectorAllocation_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "PincodeBudget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpcbNotice" ADD CONSTRAINT "SpcbNotice_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "RegionalAqiStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandMutationRecord" ADD CONSTRAINT "LandMutationRecord_tehsilId_fkey" FOREIGN KEY ("tehsilId") REFERENCES "TehsilOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeederOutageLog" ADD CONSTRAINT "FeederOutageLog_feederId_fkey" FOREIGN KEY ("feederId") REFERENCES "DiscomFeeder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractorProject" ADD CONSTRAINT "ContractorProject_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawDocument" ADD CONSTRAINT "RawDocument_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("source_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParsedDocument" ADD CONSTRAINT "ParsedDocument_raw_document_id_fkey" FOREIGN KEY ("raw_document_id") REFERENCES "RawDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationResult" ADD CONSTRAINT "ValidationResult_parsed_document_id_fkey" FOREIGN KEY ("parsed_document_id") REFERENCES "ParsedDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataPoint" ADD CONSTRAINT "DataPoint_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Source"("source_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_pincodeCode_fkey" FOREIGN KEY ("pincodeCode") REFERENCES "Pincode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

