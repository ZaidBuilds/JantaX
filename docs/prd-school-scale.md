# SchoolThikkRo: Real-World Pilot and Scale Plan

**Date:** 24 August 2026
**Decision:** Prove a safe reporting and response loop in 2 districts before expanding to 5-10.

## 1. What value this provides

SchoolThikkRo should create four concrete public goods:

1. **A parent decision tool:** a family can see whether basic services were recently observed at a school, how many independent reports support that signal, and when the signal was last refreshed.
2. **A local accountability record:** communities can point to repeated, dated, neutral observations instead of relying on a viral claim or a static brochure.
3. **A journalist and researcher dataset:** verified aggregates, source dates, definitions, and methodology are downloadable without exposing contributors.
4. **A response loop:** repeated gaps produce a case that a partner, school, or officer can acknowledge and update. The original observation is never silently deleted.

The product is successful when it helps a real person take a better next action: visit a school, ask a question, request a correction, report a problem, or document a response.

## 2. Pilot that can actually run

Start with **Meerut plus one contrasting district** rather than opening 10 districts immediately.

- 20-30 government primary/upper-primary schools per district.
- Mix urban, rural, Hindi-medium, girls' schools, and low-connectivity areas.
- One local NGO/community partner per district.
- 3-5 trained community verifiers per district.
- Four-week closed beta with invited parents.
- Six-to-eight-week public pilot after safety review.
- QR poster at each participating school, plus a short WhatsApp link.
- Assisted reporting through partner staff for families with limited connectivity.

### Pilot staffing

- Product/engineering owner: 1 part-time.
- District partner lead: 1 per district.
- Moderators: 2 shared across the pilot, with a published escalation contact.
- Community verifiers: 3-5 per district.
- Legal/privacy reviewer: before public photo uploads and public school-level allegations.

A pilot should not launch until someone is explicitly responsible for moderation, correction requests, retaliation concerns, and weekly data-quality review.

## 3. Public data rules

Every public signal must include:

- School UDISE code and locality.
- Observation window, not exact contributor timestamp.
- Number of usable reports.
- Number of reporting days.
- Whether reports are corroborated or moderator-reviewed.
- Official source, publication date, and field definition.
- Scoring-model version.

Use neutral states:

- `reported`: one accepted observation.
- `corroborated`: independent reports agree within the defined window.
- `reviewed`: a moderator or evidence review supports publication.
- `disputed`: a correction or disagreement is open.
- `rejected`: abusive, duplicate, unsafe, or unverifiable submission.

Never publish a named accusation about a teacher or child. Never publish precise GPS, photo EXIF, phone numbers, or exact report times.

## 4. Score that is explainable

For each metric, ignore `not sure` answers. Calculate the positive percentage from applicable reports in a rolling 30-day window.

Suggested metric weights:

- Teacher presence: 30%.
- Toilet usability: 20%.
- Mid-day meal served: 25%.
- Learning readiness: 25%, made from blackboard and materials signals.

Do not show a composite score until there are at least **5 usable reports across 3 reporting days**. Store these fields with every aggregate:

- `sampleSize`
- `reportingDays`
- `distinctContributors`
- `agreementRate`
- `confidence`
- `scoringVersion`
- `calculatedAt`

Confidence is evidence coverage, not school quality:

- Low: 1-4 usable reports or one reporting day.
- Building: 5-14 reports across at least 2 days.
- Strong: 15+ reports across at least 3 days with reasonable agreement.

## 5. Submission-to-publication workflow

1. Parent selects a school and observation date.
2. Parent answers five yes/no/not-sure questions.
3. Optional attendance band and photo intent are captured.
4. Server strips metadata and sends photos to a private redaction queue.
5. Abuse controls flag bursts, duplicate patterns, and impossible timing.
6. A report enters `pending` and is not immediately used as a strong public claim.
7. Independent agreement upgrades a signal to `corroborated`.
8. A moderator handles photos, disputes, high-risk claims, and retaliation concerns.
9. A scheduled job recalculates aggregates with a versioned scoring function.
10. Public pages read from a privacy-safe projection, never raw submissions.

## 6. Cost-aware production architecture

### Phase 1: pilot

- React/Vite frontend on Cloudflare Pages or Vercel.
- Supabase Postgres with Row Level Security.
- Supabase Storage private bucket for evidence.
- Supabase Cron or a small scheduled function for aggregates.
- Cloudflare Turnstile for bot resistance.
- Image resize, EXIF stripping, and face/document redaction in an asynchronous worker.
- Daily database export to low-cost object storage.

This keeps fixed infrastructure small while leaving a clear migration path to a separate API service.

### Core tables

- `schools`
- `official_school_snapshots`
- `checkins`
- `contributors_private`
- `evidence_assets`
- `moderation_cases`
- `school_responses`
- `aggregates`
- `audit_events`

Raw reports and contributor abuse-prevention data stay private. A public database view exposes only the school, coarse window, signal, status, sample count, confidence, and evidence indicator.

## 7. API v1

Implement after the typed local client is stable:

- `GET /api/v1/schools?query=&district=`
- `GET /api/v1/schools/{udiseCode}`
- `GET /api/v1/schools/{udiseCode}/observations`
- `GET /api/v1/schools/{udiseCode}/trend`
- `GET /api/v1/districts/{district}/summary`
- `POST /api/v1/checkins`
- `POST /api/v1/corrections`

Requirements: pagination, stable IDs, source dates, confidence fields, schema version, rate limits, and no raw contributor metadata.

## 8. Success metrics with real definitions

### Coverage

- 80% of pilot schools receive one usable report by week 4.
- 40% reach 5 usable reports across 3 days by week 8.
- Median check-in completion under 60 seconds.

### Quality

- Corroboration rate.
- Duplicate rate.
- Rejection rate.
- Dispute rate.
- Photo redaction failure rate.
- Median moderation time and correction acknowledgement time.

### Safety

- Retaliation reports.
- Privacy incidents.
- Precise-location leakage incidents.
- Reports involving children or named individuals blocked before publication.

### Impact

- Percentage of repeated alerts receiving a documented response.
- Time from repeated alert to acknowledgement.
- Percentage of corrected records resolved within 72 hours.
- Parent return rate within 30 days.
- Data downloads and API consumers, reported separately from GitHub stars.

Do not use a headline like “64% verified” until the word `verified` has an auditable definition.

## 9. Build order in this repository

1. Extract schools, reports, districts, and official snapshots into typed `src/data` fixtures.
2. Move scoring and confidence into pure functions with tests.
3. Add routes for home, school, methodology, privacy, correction, and check-in success.
4. Add API response types and a repository adapter so fixtures can be replaced by Supabase without rewriting UI components.
5. Add empty, stale, low-confidence, offline, and error states.
6. Add a real check-in payload with consent, observed date, attendance band, evidence intent, and private reference.
7. Build a small moderator queue before public photo uploads.
8. Connect Supabase with RLS, private evidence storage, audit events, and scheduled aggregates.
9. Run the two-district beta and publish a weekly data-quality report.
10. Expand to more districts only when coverage, quality, safety, and response thresholds are met.

## 10. Go/no-go gates

Do not expand beyond two districts if any of these are true:

- A contributor can be identified from a public report or image.
- Moderation has no owner or exceeds a 72-hour acknowledgement SLA.
- More than 10% of reports are duplicate or coordinated patterns.
- Parents cannot understand the difference between official data and ground observations.
- Repeated alerts produce no documented response path.
- Low-sample schools are displayed with a misleading composite score.
