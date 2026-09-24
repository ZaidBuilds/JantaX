# JantaX — SIH 2026 content (Apex Builders) — accountability-first

**PS ID:** SIH26202 · **Title:** Student Innovation — intelligent use of resources; combine AI to explore various data sources and get valuable insights · **Theme:** Smart Automation · **Category:** Software · **Org:** AICTE
**Team ID:** [Team ID] · **Team:** Apex Builders
Members: Mohd Zaid (Leader), Anshul Saini, Aamir Raza, Zoya Sheikh, Anushka Rana, Aaradhiya
Institute: Swami Vivekanand Subharti University — Kailash Verma Subharti College *(confirm spelling)*

## S1 Title
Smart India Hackathon 2026 · PS ID SIH26202 · Theme Smart Automation · Category Software · Team ID [Team ID] · Team Name: Apex Builders

## S2 Proposed Solution — Idea: JantaX — India, explained by where you live
- One platform: enter a PIN code → see everything happening around you.
- Tracks your area's representatives (Gram Pradhan, Sarpanch, MLA, MP), the central & state schemes active there, and the infrastructure projects running — who represents you, what they are doing, how many projects, at what status.
- Modules (schools, health, roads, housing, welfare, tenders) feed one goal: accountability, awareness, transparency.
- Addresses the problem: public data exists but is scattered across dozens of portals; JantaX unifies it locality-first with the source on every fact.
- Innovation: source-first (every record cites its govt origin + date); official record shown beside ground reality, never merged; neutral (pro-transparency, not pro/anti party); multilingual, mobile-first.

## S3 Technical Approach
- Frontend: React 18 · TypeScript · Vite · Tailwind · Leaflet maps
- Backend: Node/Express 5 · Prisma 6 · PostgreSQL · JWT
- AI: retrieval-grounded Civic HelpBot (answers only from sourced JantaX data)
- Quality: Vitest + Playwright (89 tests) · Docker · Vercel
- Method (ingestion): Fetch → Validate (zod) → Normalise → Map to PIN/district → Version+timestamp → Publish; raw sources kept separate from derived views; source registry per record.
- Screenshot: live prototype (home / PIN search).

## S4 Feasibility & Viability
- Feasible: built on open government data (GODL-India licensed), legally reusable; working prototype already live; PIN-first, scale one district/state at a time.
- Risks → mitigation: stale data → triple timestamp + "stale >90d" flag; source licensing → registry records licence+attribution; scale (19k PINs) → reusable connectors per source; trust/misuse → official vs ground reality separated, evidence before any claim.

## S5 Impact & Benefits
- Users: citizens, parents, homebuyers, students, journalists, NGOs, researchers.
- Social: people finally know who represents them and what is being done → informed participation.
- Economic: check public records before decisions; researchers get sourced, normalised data.
- Governance: transparency + accountability that strengthen — not replace — official systems.
- Callout: 1 PIN → representatives + schemes + projects + 12 civic sectors, one screen, every record sourced.

## S6 References
data.gov.in (GODL-India) · UDISE+ (Education) · PMGSY/NHAI (Roads) · NHM/HMIS (Health) · State RERA · NFSA/PDS · DARPG/CPGRAMS · CPCB · ECI/MyNeta (representatives) · MPLADS (MoSPI) · SIH 2026 sih.gov.in · repo github.com/ZaidBuilds/JantaX
