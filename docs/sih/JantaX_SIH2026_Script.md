# JantaX — SIH 2026 Idea Submission (Content + Speaker Script)

**Anchor PS:** SIH26202 — *Student Innovation* · **Theme:** Smart Automation · **Category:** Software · **Org:** AICTE
**Fallback PS (if college wants a defined ministry problem):** SIH26133 — Public healthcare accessibility (Govt of Maharashtra, HealthTech)

> Fill these before submitting: **[Team Name]**, **[Team ID]**, **[College / University]**, **[6 members + leader]**.

---

## Slide 1 — Title

- Smart India Hackathon 2026
- **Problem Statement ID:** SIH26202
- **PS Title:** Student Innovation — intelligent use of resources; combine AI to explore various data sources and get valuable insights
- **Theme:** Smart Automation  ·  **Category:** Software
- **Idea:** **JantaX — India, explained by where you live.**
- Team: **[Team Name]**  ·  Team ID: **[Team ID]**  ·  **[College]**

**Say (30s):** "We are team [Team Name]. Public information about our own neighbourhood already exists — but it is scattered across dozens of government portals. JantaX brings it to one place, starting from a PIN code."

---

## Slide 2 — Proposed Solution

**The idea:** One platform that answers a single question — *"What is happening around me?"* A citizen enters a PIN code and sees the public record for their locality across sectors (schools, health, roads, housing, welfare, tenders), every fact carrying its source and its last-updated date.

**How it addresses the problem:**
- Turns fragmented public data into one locality-first view — no need to know which ministry owns what.
- **Discover → Understand → Verify the source.** Nothing is presented without provenance.

**Innovation & uniqueness (what makes it not-just-another-portal):**
- **Source-first:** every record shows origin + publication/retrieval date + freshness.
- **Official record ≠ ground reality** — the two are shown side by side, never merged.
- **Neutral:** pro-transparency, not pro/anti any party.
- **Multilingual + mobile-first**, built as a public utility, not a dashboard.

**Say:** "We are not picking one sector. The insight is the *platform*: one PIN, and the whole civic picture — with the source shown for every number."

---

## Slide 3 — Technical Approach

**Stack (working prototype):**
- Frontend: React 18 + TypeScript + Vite + Tailwind + React-Leaflet (maps)
- Backend: Node/Express 5 + Prisma 6 + PostgreSQL; JWT auth
- Quality: Vitest + Playwright (89 tests passing), Docker, Vercel

**Methodology — the ingestion pipeline:**
`Fetch → Validate (zod) → Normalize → Map to location (PIN/district) → Version + timestamp → Publish` — with raw source records kept separate from derived views, and a source registry per record.

**Screenshot:** real running prototype (home / PIN search).

**Say:** "This is running today. The core is a location engine plus a source-tagged data layer — one architecture that every new sector plugs into."

---

## Slide 4 — Feasibility & Viability

**Feasibility:**
- Built entirely on **open government data (GODL-India licensed)** — legally reusable.
- Working prototype already live; PIN-first design scales one district at a time.

**Challenges & risks → mitigation:**
- *Data freshness / stale records* → triple timestamp + "stale >90d" flag; never show old data as current.
- *Source licensing* → source registry records licence + attribution before ingestion.
- *Scale of 19k PINs / many portals* → start with one state, reusable connectors.
- *Trust / misuse* → official vs ground-reality kept separate; evidence before any claim.

**Say:** "Feasible because we are not creating data — we are organising data that is already public and already ours to reuse."

---

## Slide 5 — Impact & Benefits

**Target users:** parents, ordinary citizens, homebuyers, students, journalists, NGOs, researchers.

**Benefits:**
- *Social:* citizens understand local public services without navigating five portals — stronger, better-informed participation.
- *Economic:* homebuyers and small businesses check public records before decisions; researchers get normalised, sourced data.
- *Governance:* transparency and accountability that **strengthen — not replace** official systems.

**Stat callout:** 1 PIN → 12+ civic sectors, one screen, every record sourced.

**Say:** "The benefit is simple: a citizen can trust what they see, because they can see where it came from."

---

## Slide 6 — References

- data.gov.in — National Open Data Platform (GODL-India licence)
- UDISE+ (Ministry of Education) — school data
- PMGSY / NHAI — rural & national roads
- NHM / HMIS (Ministry of Health) — health facilities
- State RERA authorities — housing/project records
- NFSA / PDS portal — food security
- DARPG / CPGRAMS — public grievance data
- CPCB — air quality
- Smart India Hackathon 2026 — sih.gov.in
- Project repository: github.com/ZaidBuilds/JantaX

**Say:** "Every source here is public and openly licensed — the references slide is the proof our platform stands on real data."
