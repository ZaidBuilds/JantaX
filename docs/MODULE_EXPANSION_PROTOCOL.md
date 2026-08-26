# JantaX — Module Expansion & Platform Extension Protocol

This document establishes the master architectural contract and standard operating procedure for scaling **JantaX** as a unified, citizen-first civic intelligence platform across India.

---

## 1. Core Operating Principle

1. **JantaX is NOT an official government portal** and does not replace official government websites or dispute statutory records.
2. **Civic Discovery & Accountability Layer**: JantaX discovers, aggregates, normalizes, connects, explains, visualizes, and monitors legitimately reusable public information from official government databases and permitted sources.
3. **Citizen Action Routing**: Where citizen grievances or service failures occur, JantaX prepares structured drafts and directs citizens to the authorized official government portal (e.g., CPGRAMS / DARPG, state CM helpline, department nodal officer).

---

## 2. Platform Architecture: Location-First Spine

Every domain module attaches to the common canonical location hierarchy anchored by Indian Postal PIN codes (`/pin/[code]`):

```
                       /pin/[code] (Locality OS Hub)
                                    │
     ┌──────────────┬───────────────┼──────────────┬──────────────┐
     │              │               │              │              │
  /school        /works          /health        /rera          /pds
 (Schools)    (Public Works)   (Hospitals)     (Housing)     (Ration)
     │              │               │              │              │
  /power         /land           /air          /courts        /police
(Electricity)  (Mutation)     (Pollution)     (Judiciary)    (Stations)
```

---

## 3. The 15-Stage Module Contract

Every module added to JantaX MUST implement the complete end-to-end pipeline:

```
SOURCE
  ↓
INGESTION (API / PDF / CSV / Web Crawler)
  ↓
RAW DATA STORAGE (Immutable)
  ↓
HASH & CHANGE DETECTION (SHA-256)
  ↓
PARSING & EXTRACTION (OCR / Tabula / Cheerio)
  ↓
SCHEMA VALIDATION (Zod / Confidence Thresholds)
  ↓
NORMALIZATION & UNIT STANDARDIZATION
  ↓
ENTITY RESOLUTION (UDISE ID / CIN / RERA Reg / FPS Code)
  ↓
LOCATION MAPPING (PIN / District / State)
  ↓
CANONICAL DATABASE (Postgres Prisma)
  ↓
FRESHNESS BADGING & VERSION SNAPSHOTS
  ↓
ANALYTICS & SCORING ALGORITHMS
  ↓
REST API ENDPOINTS
  ↓
RESPONSIVE UI & BENTO DASHBOARDS
  ↓
EVIDENCE GALLERY & ZERO-CLS CONTAINERS
  ↓
OFFICIAL ACTION LAYER (CPGRAMS Drafts)
  ↓
DATA MONITORING & ANOMALY QUARANTINE
```

---

## 4. Source Governance & Integrity Rules

- **Source Attribution**: Disclose publisher, ministry, update cycle, pipeline, license, limitations, and direct portal URL for every source.
- **Evidence Hierarchy**: Explicitly distinguish between:
  1. `OFFICIAL PRIMARY RECORD`
  2. `INDEPENDENT RESEARCH DATA`
  3. `COMMUNITY REPORT`
  4. `VERIFIED EVIDENCE-BACKED REPORT`
- **Neutral Language Mandate**: Never label an entity "corrupt" or "fraud" without an official gazette decree, CAG audit finding, or High Court judgment. Use evidence-based status: `Delayed`, `Extended`, `Incomplete`, `Under Review`, `Completed`, `Verified`.
- **Zero Stale Caching**: Display explicit freshness badges (`✓ Live Data`, `⚡ Cached Xm ago`, `⚠ Stale Source Sync Required`).

---

## 5. Master Module Map (20 Civic Domains)

| ID | Module Name | Slug | Citizen Question | Primary Source |
|---|---|---|---|---|
| 01 | **Locality OS** | `pin` | *What is the state of civic services in my area?* | Aggregated Multi-source |
| 02 | **State CAG vs CM** | `andhbhakt` | *How do state budget claims compare to ground audits?* | CAG Reports, State Budgets |
| 03 | **Contractor Scorecard** | `contractor` | *Who gets public contracts and what is their delivery record?* | CPPP, GeM, Debarment Gazettes |
| 04 | **RERA Delays** | `rera` | *Is my housing project delayed and has the builder faced penalties?* | State RERA Portals |
| 05 | **Welfare Bottleneck** | `ration` | *Why is my welfare disbursement or ration delayed?* | PDS Portals, NFSA, DBT |
| 06 | **PHC Reality** | `hospital` | *Are doctors and medicines available at my local health center?* | HMIS, NHM Facility Registry |
| 07 | **School File** | `school` | *Is my government school meeting RTE infrastructure standards?* | UDISE+, ASER Reports |
| 08 | **Courts & Judicial Delay** | `courts` | *How many cases are pending in my local district court?* | eCourts Services, NJDG |
| 09 | **MPLADS / MLALADS** | `mplads` | *Where has my MP/MLA spent local area development funds?* | MPLADS Portal, State Assemblies |
| 10 | **MSME Compliance Maze** | `nagar` | *What licenses and municipal NOCs are required to operate legally?* | Municipal Portals, FSSAI, Udyam |
| 11 | **Power & DISCOM** | `utility` | *What is the frequency of outages and tariff billing breakdown?* | National Power Portal, DISCOMs |
| 12 | **Land & Mutation** | `land` | *What is the status of land records and registry compliance?* | Bhulekh, State Land Revenue |
| 13 | **Air & Water Pollution** | `pollution` | *What are the real-time AQI and industrial effluent levels?* | CPCB, State PCBs, SAFAR |
| 14 | **Exams & Recruitment** | `election` | *Are exam schedules on time and has there been paper leak history?* | UPSC, SSC, State PSCs |
| 15 | **PDS / Ration Shop** | `pds` | *Is my local Fair Price Shop functioning and what is my entitlement?* | Annavitran, NFSA |
| 16 | **Police & FIR Guidance** | `police` | *Which police station covers my sector and how do I file an e-FIR?* | CCTNS, State Police Portals |
| 17 | **RTI Clock** | `rti` | *How long does this public authority take to answer RTI appeals?* | RTI Online, CIC Annual Reports |
| 18 | **EPFO & Pension Delay** | `epfo` | *What is the standard processing window for my PF/pension claim?* | EPFO Public Statistics, CPGRAMS |
| 19 | **FSSAI Food Inspections** | `fssai` | *Which food businesses near me hold active regulatory licenses?* | FoSCoS Public Register |
| 20 | **Booth & Electoral Roll** | `booth` | *Who is my Booth Level Officer (BLO) and how do I verify my voter entry?* | ECI NVSP, CEO Portals |

---

## 6. Extension Protocol for New Modules

When building a new module, **do not write code immediately**. First submit the **18-Point Blueprint**:

1. **Module Specification**: Name, citizen question, user personas, problem solved.
2. **Citizen Question**: Clear, plain-language problem statement.
3. **Data Sources**: Official open data, APIs, gazettes, documents.
4. **Source Permissions & Licensing**: GODL-India, NDSAP, fair-use analysis.
5. **Canonical Entities**: Primary stable identifiers (UDISE, CIN, RERA Reg, FPS code).
6. **Database Schema**: Additions to Prisma schema with composite indexes.
7. **Ingestion Pipeline**: Ingestion connector, hash detection, schema validation.
8. **REST APIs**: Endpoints under `/api/` with rate limiting and authentication.
9. **URL Routes**: Frontend routes (`/module/`, `/pin/[code]/module`).
10. **UI Pages & Layouts**: Landing, search, profile, timeline, evidence.
11. **PIN Dashboard Integration**: Aggregation card in `/pin/[code]`.
12. **Universal Search Integration**: Indexing into global search bar with filters.
13. **Map Integration**: Geo-coordinates, clustering, viewport filtering.
14. **Evidence Model**: Photo/document uploads, 4-tier confidence rating.
15. **Action Layer**: Authority identification, structured CPGRAMS drafts.
16. **Privacy & Legal Safety**: PII redaction, non-defamation neutrality rules.
17. **Testing Strategy**: Unit, integration, E2E, data integrity, UI tests.
18. **Step-by-Step Implementation Sequence**: Execution roadmap.
