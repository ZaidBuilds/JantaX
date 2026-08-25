# JantaX — Master Definitions 03→10 (Blocks for #11+ Build)

> Sequence locked: 01 Audit ✓ 02 Reference ✓ → 03-10 define now → 11+ build. No jump to #18 while #06 undefined.

## 03 Product Boundaries (15 modules)

**Core spine (M1):** PIN `110001` typed → `resolvePincode` → `Pincode` row (state/district/region/lat/lng) → hub.
**Live via DB (7):** `school (UDISE+), infra (MoSPI/PMGSY/NHAI), contractor (GeM/CPPP), andhbhakt (StateCmClaim), hospital (HMIS), rera (State RERA), ration (PdsShop)` — P0 to keep live. **Mock-but-PIN-resilient (8):** `nagar (Ward+Review), budget (PincodeBudget), utility (DiscomFeeder), rti (RtiLog), pollution (AqiStation), land (TehsilOffice), election (CandidateSpend), grievance (CpgramsMonthly)` — deterministic per PIN, no blank, citations shown. `pds` is `ration` alias (spec-m5). All 15 `isLive:true` in `moduleRegistry` — no `ComingSoon` dead.

**Out of scope:** Replacing 1912/CPGRAMS/UDISE+, auto-declaring allegation true from 1 report, PII storage, nationwide full-text search before ingestion stable, native app (PWA later).

## 04 Source/Data Governance (GODL)

**License:** Union/State data GODL (CAG, UDISE+, HMIS, RERA, DARPG CPGRAMS, CPCB, GeM/CPPP/e-Proc, ECI/ADR, SLDC, Bhulekh masked, Budget PDFs) → cite `Portal + Report No./Para + Publication Date + Field definition + lastUpdated` per card. ADR/PRS/OBI CC-BY → attribution link. Citizen photos CC0 with consent.
**Provenance per card:** `sourceUrl (tweet/PIB/CAG PDF) + sourceType + claimedBy/designation/date/occasion + cagReportRef + verificationSource + realityDate` + budget `allocated vs spent`. **No standalone allegation** — dual side-by-side.
**Freshness:** Triple stamp `Observed + Source + Recalc (24 Aug 2026)` + `stale >90d amber` + `lastUpdated` footer. **Rate limit:** IP bucket + Turnstile.
**Corrections:** `Report Data Issue → POST /api/corrections` → `disputed` state, audit trail never deletes original, 72h SLA, queue `requireRole(MODERATOR)`.

## 05 Canonical DB (Prisma 6, Postgres)

**Extend `schema.prisma` (keep 7, add 8):**

```prisma
model StateCmClaim { id String @id @default(cuid()) stateCode String @db.VarChar(2) category String claimTitleHi String claimTitleEn String claimSource String claimDetails String @db.Text realityTitleHi String realityTitleEn String realityDetails String @db.Text cagReportRef String realitySeverity String lastUpdated DateTime @updatedAt @@index([stateCode, category]) }
model MunicipalWard { id String @id @default(cuid()) pincode String @db.VarChar(6) wardNo String garbageClaimedSla String waterClaimedSla String drainageClaimedSla String citizenReviews WardReview[] }
model WardReview { id String @id @default(cuid()) wardId String serviceCategory String actualRating Int feedbackText String? reportedAt DateTime @default(now()) ward MunicipalWard @relation(fields: [wardId], references: [id]) }
model PincodeBudget { id String @id @default(cuid()) pincode String @unique @db.VarChar(6) financialYear String totalRevenueCr Float totalAllocatedCr Float allocations BudgetSectorAllocation[] }
model BudgetSectorAllocation { id String @id @default(cuid()) budgetId String sectorNameEn String sectorNameHi String allocatedCr Float utilizedCr Float stalledProjects Int @default(0) budget PincodeBudget @relation(fields: [budgetId], references: [id]) }
model RegionalAqiStation { id String @id @default(cuid()) pincode String @db.VarChar(6) stationName String aqiValue Int dominantPollutant String lastUpdated DateTime @updatedAt pcbNotices SpcbNotice[] }
model SpcbNotice { id String @id @default(cuid()) stationId String industryName String noticeType String violationReason String @db.Text issueDate String station RegionalAqiStation @relation(fields: [stationId], references: [id]) }
model TehsilOffice { id String @id @default(cuid()) pincode String @db.VarChar(6) tehsilName String district String promisedSlaDays Int @default(45) mutationRecords LandMutationRecord[] }
model LandMutationRecord { id String @id @default(cuid()) tehsilId String surveyNumber String daysTaken Int status String appliedDate String tehsil TehsilOffice @relation(fields: [tehsilId], references: [id]) }
model DiscomFeeder { id String @id @default(cuid()) pincode String @db.VarChar(6) feederName String substationName String promisedSupplyHours Int @default(24) outageLogs FeederOutageLog[] }
model FeederOutageLog { id String @id @default(cuid()) feederId String outageMinutes Int faultType String faultTypeHi String logDate String feeder DiscomFeeder @relation(fields: [feederId], references: [id]) }
model CandidateSpendRecord { id String @id @default(cuid()) pincode String @db.VarChar(6) candidateName String party String constituency String declaredSpend Float estimatedSpend Float sourceAffidavit String }
model CpgramsMonthlyRecord { id String @id @default(cuid()) recordType String rank Int name String nameHi String totalGrievances Int resolvedCount Int pendingCount Int avgDisposalDays Int backlogOver30Days Int worstCategoryEn String worstCategoryHi String reportMonth String lastUpdated DateTime @updatedAt }
```

**Fixes:** `Contractor` add `pincodeCode String? @db.VarChar(6) + Pincode? relation + pasture: ContractorProject[]` per spec-m3; `Pincode` add `budget? PincodeBudget, aqiStations, tehsils, feeders` etc.; keep `CitizenReport+EvidenceMedia+Follow+User`.

**Migration:** `prisma migrate dev --name canonical-15` + `seed.ts` from `rawSeedData.ts` + CAG PDFs (GODL).

## 06 Ingestion/Sync Engine

**Replace `autoUpdater.ts` fake hash** → `server/src/jobs/cron.ts` (node-cron nightly 02:00 IST): `MoSPI Flash / PMGSY / NHAI (Infra) → InfraProject`, `UDISE+ CSV (School) → School`, `State RERA scraper (proxy, CAPTCHA retry) → ReraProject`, `HMIS → Hospital`, `ePOS → PdsShop`, `DARPG monthly PDF → CpgramsMonthlyRecord + Grievance`, `CPCB → AqiStation`, `SLDC → FeederOutageLog`, `Bhulekh masked → LandMutationRecord`, `ECI/ADR → CandidateSpend`. Steps: `fetch → staging → zod validate → dedup by pincodeCode+udiseCode/reraNumber → upsert → versioned `lastUpdated` + `sourceUrl` + `auditEvent`. Queue via `bullmq` (or `pg-boss`) `aggregate-recalc` → recompute `groundTruthScore/confidence` + `contractor integrityScore`. Remove `autoUpdater` after cron live (keep `hashSeed` only as offline mock fallback gated by `NODE_ENV !== production`).

## 07 Evidence + Verification

**Anonymous:** `submittedBy` = `SHA-256(deviceToken+IP+salt)` + `EvidenceMedia.url` is S3/Supabase presigned key (not client URL), `MAX_MEDIA 10 / MAX_CAPTION 2000`, `1 photo per IP/hour` for `PHC`, EXIF stripped via `sharp` + face redaction worker, MIME `image/jpeg|png` + 5MB, virus scan ClamAV. **States:** `PENDING → APPROVED/REJECTED/FLAGGED` (moderator). **Scoring:** per `prd-school-scale` 30/20/25/25 weight, only show composite `≥5 reports across 3 days` else `Not enough` + `confidence low(1-4)/building(5-14)/strong(15+ across 3 days + agreement)` + `sampleSize/reportingDays/agreementRate/distinctContributors/calculatedAt/scoringVersion`. **Trend:** rolling 30d % + `upvotes` (ward residents). **Retention:** private `contributors_private` separate, public projection coarse `window` never exact timestamp.

## 08 Accountability/Action System

**Citizen dossier generator:** per `prd-contractor` 4.4/4.5: `Share on WhatsApp` (templated `shareService` single), `1-Click RTI Sec 6(1)` (bitumen core-cut, retention proof), `Vigilance/Lokayukta` draft (tenderNo, DLP clause IRC SP:98, penal sections), `Ward Committee Agenda` (dominantContractor share%). **State CM:** WhatsApp card `PIN + location + Claim vs Reality + contractor/officer + sourceUrl`. **School:** `Report Data Issue` + parental check-in `<60s` 5-question. **Govt Response:** read-only `Response` model `acknowledged→action → verified` per `prd-school` 6.4, never deletes original, delay `Filed→Resolved + delayDays`.

## 09 Backend Architecture

**Stack:** Express 5 + `helmet` + `cors({origin: VITE_URL})` + `express-rate-limit (100/15m anon, 1000 auth)` + `morgan→pino` + `zod` validation + `prisma` + `S3/Supabase storage` + `bullmq` + `Turnstile`. **Auth:** `optionalAuth` global (parses Bearer → `req.user?`), `requireAuth` only on `POST /api/reports` (anon allowed with hash) + `requireRole(MODERATOR/ADMIN)` on `PATCH /api/reports/:id/review` + `GET /api/moderation` + `POST /api/admin/pincode` (was public auto-create → fix to admin-only). **Error:** global `errorHandler(err,req,res,next)` JSON `{error, code, details?}` + `asyncHandler` wrapper, Prisma `P2002→409`, JWT `401`, zod `400`. **Validation:** `isValidIndianPincode` + zod schemas per route. **Logging:** `pino` + `prisma log:['error','warn']` + requestId. **Security:** `bcrypt 10 rounds` + JWT 7d + `helmet` + `CORS` + `rateLimit` + `input sanitize` + `helmet` hide `x-powered-by`.

## 10 Frontend/Design System

**Tokens:** `index.css :root` already locked killer palette `navy #0f2d59 + blue #2563eb + orange #f97316 + slate + status green/amber/red/purple` + `glass-card/killer-card/dash-header-card/progress-track/filter-pill/photo-card/card-ribbon`. **Needs split:** `tokens.css` + `components.css` + `utilities.css` + Storybook. **Shell:** `src/shell/AppNav.tsx + GlobalFooter.tsx` (2-deck sticky blur, drawer, footer 3-col `Explore/JantaX`, skip link). **Loaders:** `ErrorBoundary` (class) + `OfflineBanner` (when `api mock fallback` → toast `Offline mock`) + `EmptyState` (no results + `Clear filters`) + `Loader` (skeleton) + `Stale` badge. **Routers:** keep `lazy+Suspense` + `ErrorBoundary` per route, add `GET /api/v1/schools?query=` pagination + `pincode` full 19k table (replace 25-prefix map). **A11y:** `aria-current`, 44px taps, reduced-motion, Hindi `lang` toggle.

> Next: #11 Build global shell (extract already polished) → #12 Loaders → #13 Home → #14 Search → #15 PIN → #16 Maps → #17 Compare → #18 School → #19 Infra → #20 Contractor → #21 RERA → #22 Reports → #23 Govt Action → #24 Transparency → #25 Admin → #26 Sync → #27 Security/review → #28 Testing → #29 Perf → #30 QA — strictly in order, blocked until 06 cron + 05 DB landed.

