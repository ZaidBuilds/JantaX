# SchoolThikkRo
## Product Requirements Document

**Version:** 1.0
**Date:** 24 August 2026
**Owner:** CJP Revolution
**Product type:** Mobile-first public accountability web app
**Pilot scope:** Government primary and upper-primary schools in 5-10 districts

## 1. Product Summary

SchoolThikkRo is a public, parent-facing school scorecard that combines official UDISE+ information with fresh, multi-parent observations. It makes the difference between "reported on paper" and "working today" visible at school level.

The first release focuses on five daily realities that parents can understand and verify quickly:

- Are teachers present today?
- Are toilets usable today?
- Was the mid-day meal served today?
- Are learning materials available?
- Is the classroom visibly ready for learning?

A school page turns these observations into a transparent score, a confidence level, a trend, and an evidence trail. The product must support accountability without exposing individual parents to retaliation.

## 2. Problem Statement

Official school data is useful but mostly static. Parents experience school quality as a daily reality: a teacher may be posted but absent, a toilet may exist but be locked, or a meal may be listed but not served. There is no simple, trusted public layer that lets a parent check a school, contribute anonymously, and see whether repeated problems are improving.

## 3. Goals and Non-goals

### Goals

1. Help a parent find and understand a nearby government school in under two minutes.
2. Capture structured, low-friction observations that can be compared over time.
3. Show both the current signal and how trustworthy that signal is.
4. Make repeated service failures visible to communities, journalists, and officials.
5. Preserve anonymity and reduce the risk of retaliation, spam, or one-person bias.
6. Create a pilot-ready foundation for an open data API and future WhatsApp flow.

### Non-goals for the pilot

- Replacing UDISE+, ASER, school inspections, or official grievance mechanisms.
- Publishing personally identifiable information about parents, children, or teachers.
- Automatically declaring an allegation as fact from one report.
- Building a full education management system for officers.
- Measuring learning outcomes with a statistically representative assessment.
- Launching nationwide coverage before moderation and verification workflows exist.

## 4. Target Users

### Primary: Parents and caregivers

Need a quick answer to "How is this school actually doing?" They may have a low-end Android phone, limited bandwidth, and limited time. They should be able to search by school, location, or QR code and submit a check-in without creating a public profile.

### Secondary: Community members and activists

Need a public evidence trail, trends, and comparable schools to identify repeated failures and support constructive local action.

### Secondary: Journalists and researchers

Need transparent definitions, timestamps, confidence levels, and downloadable structured data.

### Secondary: Education officers

Need read-only access to flagged patterns and an eventual response channel that records acknowledgement and action without allowing quiet data deletion.

## 5. Product Principles

- **Ground truth with humility:** show observations, sample size, freshness, and confidence instead of pretending crowdsourcing is perfect.
- **Anonymous by default:** protect contributors while keeping reports auditable internally.
- **Evidence over outrage:** use neutral language, structured questions, and clear dispute paths.
- **Mobile first:** one-thumb interactions, low data weight, large tap targets, fast initial load.
- **Public by design:** the useful information should not be hidden behind a login.
- **Hindi-ready:** content architecture must support Hindi and other local languages from the beginning.
- **No false precision:** do not show a score that looks scientific when there are too few reports.

## 6. MVP Scope

### 6.1 Home and school discovery

- Search by UDISE code, school name, district, block, or village/locality.
- Location-assisted nearby school list, with permission requested only when needed.
- Browse pilot districts and school type filters.
- QR deep link format: `/school/{udiseCode}`.
- Search results show school name, locality, school type, latest report age, and signal status.

### 6.2 Public school scorecard

Every school page includes:

- School identity: name, UDISE code, village, block, district, school level, management type.
- Headline status: **Needs attention**, **Mixed signals**, or **Looking steady**.
- Composite ground-truth score with an explanation of its inputs.
- Freshness: latest observation date and reporting window.
- Confidence: based on number of distinct reports, agreement, and recency.
- Four core metric cards:
  - Teacher presence
  - Toilets working
  - Mid-day meal served
  - Learning readiness
- Official vs community comparison where official data exists.
- 30-day trend visualization for the score and each metric.
- Recent observations list with date, anonymous contributor label, verification state, and optional evidence indicator.
- Report issue CTA and share/QR actions.

### 6.3 Parent check-in

A check-in should take less than 60 seconds for the basic path.

Required step:

1. Confirm school and observation date.
2. Answer yes/no/not sure for:
   - At least one teacher present
   - Toilet usable and water available
   - Mid-day meal served
   - Blackboard/teaching surface usable
   - Textbooks or learning materials available
3. Optional: approximate attendance band (0-25%, 26-50%, 51-75%, 76-100%).
4. Optional: photo evidence with faces and identifying details blurred or excluded.
5. Consent and safety confirmation.
6. Submit anonymously.

Submission behavior:

- No public account required in MVP.
- Rate limit by device/session and use server-side abuse controls when backend exists.
- Store report status as `pending`, `verified`, `disputed`, or `rejected`.
- Never expose exact metadata that could identify a contributor.
- Show a confirmation with a private report reference, not a public identity.

### 6.4 Verification and moderation

- A metric becomes stronger when independent reports agree within a rolling window.
- Show report count and confidence band rather than a binary "true/false" label.
- Detect duplicate submissions, suspicious bursts, repeated device patterns, and contradictory evidence.
- Queue reports with photos or high-risk allegations for moderation.
- Allow a school or officer response without removing the original observation.
- Provide a correction/dispute path and preserve an audit trail.

### 6.5 Alerts and trends

- Flag a metric after repeated negative observations from multiple contributors.
- Highlight a downward 7-day or 30-day trend.
- Notify subscribed users only after consent and only for school-level changes.
- MVP can show alerts in the dashboard before push/WhatsApp delivery is added.

## 7. Scoring Model

The score is a communication aid, not an official rating.

### Metric score

For each metric, calculate the percentage of applicable verified or corroborated positive observations in the current rolling window. `Not sure` responses are excluded from the denominator.

### Composite score

Suggested MVP weighting:

- Teacher presence: 30%
- Toilet usability: 20%
- Mid-day meal: 25%
- Learning readiness: 25%

Only display a composite score when there are at least 5 usable observations across at least 3 independent reporting days. Otherwise display **Not enough recent reports** and show the available signals separately.

### Confidence

Confidence is a simple communication tier:

- **Low:** 1-4 usable reports or only one reporting day.
- **Building:** 5-14 usable reports across at least 2 days.
- **Strong:** 15+ usable reports across at least 3 days with reasonable agreement.

The UI must explain that confidence describes evidence coverage, not whether a school is good or bad.

## 8. Data Model

### School

- `udiseCode`
- `name`
- `managementType`
- `schoolLevel`
- `village`
- `block`
- `district`
- `state`
- `officialStats`: enrollment, teachers posted, toilets listed, PTR when available
- `pilotStatus`
- `updatedAt`

### Check-in

- `id`
- `schoolId`
- `observedOn`
- `answers`: teacher, toilet, meal, blackboard, materials
- `attendanceBand`
- `evidenceAssetId`
- `verificationStatus`
- `createdAt`
- `riskFlags`

### Aggregate

- `schoolId`
- `windowStart`
- `windowEnd`
- `metricScores`
- `compositeScore`
- `sampleSize`
- `reportingDays`
- `confidence`
- `trend`
- `lastCalculatedAt`

### Official comparison

Keep official data source, publication date, field definition, and import date visible. Never make a direct comparison when definitions or dates do not match.

## 9. Information Architecture

- Home: search, nearby schools, pilot district entry points, latest alerts.
- Search results: filters, school rows, freshness and signal.
- School scorecard: summary, metrics, trend, evidence, official comparison.
- Check-in flow: school confirmation, questions, evidence, consent, success.
- Alerts: repeated issues and changes for followed schools.
- Methodology: score definitions, confidence, privacy, moderation, data sources.
- About CJP Revolution: mission, contact, correction/reporting policy.

## 10. UX and Accessibility Requirements

- Responsive from 320px wide upward.
- Minimum 44px tap targets and readable contrast.
- Avoid relying on color alone; pair colors with labels and icons.
- Plain language with Hindi localization-ready keys.
- Screen-reader labels for charts and status indicators.
- Reduced-motion support.
- Forms preserve progress and show clear error states.
- Loading, empty, offline, success, and failure states for each core workflow.
- No dashboard card should hide the underlying sample size or last-updated date.

## 11. Trust, Safety, and Privacy

- Anonymous public reporting; no public names, phone numbers, faces, or exact device data.
- Photo guidance and automated redaction before publication.
- Clear distinction between observation, corroborated signal, and official response.
- Threat/report escalation protocol for retaliation concerns.
- Data minimization and retention policy documented before pilot launch.
- Moderators must be able to quarantine content without erasing audit history.
- Avoid defamatory wording; use neutral labels such as "reported" and "needs review".

## 12. Technical Plan

### Phase 1: clickable/product prototype

- React + Vite + TypeScript.
- Local fixture data for a realistic pilot district.
- Client-side routes or view state for home, school scorecard, and check-in.
- SVG/CSS charting only if it remains accessible and lightweight.
- No real submissions or personally identifying data.

### Phase 2: pilot backend

- Supabase/Postgres for schools, reports, aggregates, moderation, and audit events.
- Object storage with image processing/redaction pipeline.
- Scheduled aggregate calculation.
- Admin moderation view with role-based access.
- Rate limiting, bot protection, and abuse monitoring.

### Phase 3: distribution and open data

- WhatsApp check-in adapter.
- School QR generation and printable assets.
- Public read-only API with documented field definitions.
- Hindi and pilot-district language packs.
- Export for journalists/researchers with privacy-safe aggregation.

## 13. Success Metrics

### Pilot activation

- 70% of pilot schools have at least one report by week 4.
- 40% have at least 5 usable reports per month by week 8.
- Median check-in completion time under 60 seconds.

### Trust and quality

- At least 60% of reports corroborated by an independent report or evidence review.
- Less than 5% of public reports removed for abuse after moderation.
- Correction requests acknowledged within 72 hours.
- Parent-reported confidence in usefulness measured by a lightweight post-check-in question.

### Impact signals

- Repeated alerts receive a documented response from the relevant local authority or community group.
- School-level negative trends show measurable response activity within the pilot period.
- Retention: 25% of first-time contributors return within 30 days.

## 14. Rollout Plan

### Milestone 0: Prototype

Build the public home, search, scorecard, check-in experience, methodology page, and seeded pilot data. Validate usability with 5-10 parents.

### Milestone 1: Controlled pilot

Select 5-10 districts with local partners. Import school registry data, train moderators, publish privacy and correction policies, and run a closed beta.

### Milestone 2: Public pilot

Launch school QR entry points, community outreach, district dashboards, and weekly moderation review. Publish anonymized data quality reports.

### Milestone 3: Expansion

Add WhatsApp, more languages, officer response workflow, and open API once the signal quality and safety process are reliable.

## 15. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Retaliation against reporters | Anonymous defaults, metadata minimization, safety escalation, delayed aggregation |
| Coordinated or fake reports | Rate limits, independent-report weighting, anomaly detection, moderation queue |
| Defamation or unfair school labeling | Neutral language, confidence tiers, dispute flow, no low-sample composite score |
| Low parent participation | QR entry, under-60-second flow, WhatsApp adapter, local partners |
| Official data mismatch | Show source/date/definition and avoid false comparisons |
| Privacy leakage in photos | Consent, upload screening, redaction, manual review for publication |
| Score gaming | Versioned scoring model, audit events, transparent methodology |
| Digital divide | Low-bandwidth web, Hindi-first copy, assisted community reporting |

## 16. Open Questions Before Production

1. Which 5-10 districts and languages are in the pilot?
2. Which organization owns moderation and safety escalation?
3. What legal/privacy review is required for photos and school-level allegations?
4. Which UDISE+ fields and release are licensed/available for import?
5. Should reports expire or remain visible indefinitely?
6. What is the response SLA for schools and education officers?
7. Which identity or anti-abuse mechanism is acceptable without weakening anonymity?
8. Who can change scoring weights, and how is each version communicated?

## 17. Prototype Acceptance Criteria

- A parent can search for a school and open a scorecard with seeded data.
- Scorecard clearly separates community signals from official figures.
- Scorecard shows score, confidence, freshness, trend, and recent observations.
- Parent can complete and submit a five-question check-in in the prototype.
- Submission produces a visible confirmation and does not expose identity.
- Empty/low-confidence data is explained instead of represented as a misleading score.
- Layout is usable at mobile and desktop widths.
- The prototype has a visible methodology/privacy route before pilot data is treated as real.
