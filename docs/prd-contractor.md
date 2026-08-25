# Product Requirements Document (PRD)
## Project: Municipal Contractor Scorecard (NagarContractor / RoadWatch)
**Author & Lead Architect:** Civic Intelligence & Governance Tech Taskforce  
**Status:** Approved for Implementation  
**Version:** 1.0.0  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Accountability Gap
Traditional civic grievance apps (such as *IChangeMyCity*, municipal 1912 hotlines, or FixMyStreet portals) treat municipal infrastructure defects—especially potholes, road cave-ins, and drainage washouts—as isolated, anonymous events. Citizens complain about a pothole, the municipal corporation patches it haphazardly, and 4 weeks later during the monsoon, the same stretch disintegrates again.

**Crucial Missing Link:**
- **Zero Attribution:** Citizens never see **who built the road**, what the sanctioned budget was (e.g., ₹4.2 Crores from public funds), or the contractor's legal obligations under the **Defect Liability Period (DLP)**.
- **Tender Cartelization & Monopolies:** The same contractor often wins 80%+ of road tenders in the same municipal ward year after year despite a 60%+ monsoon failure rate.
- **Defect Liability Evaporation:** Indian Road Congress (IRC) SP:98 and state municipal codes require 3 to 5 years DLP during which the contractor MUST repair damages at their own cost. Without transparency, municipal engineers release the 5-10% retention bank guarantee without ever holding the contractor accountable, spending fresh taxpayer money on repeat resurfacing.

### 1.2 Product Vision
**Municipal Contractor Scorecard** is an open civic intelligence and public audit platform that merges:
1. State e-Procurement tenders (Karnataka e-Proc, MahaTenders, CPP Portal, GeM)
2. Municipal Work Orders (sanctioned amounts, bitumen grade specs, contractor entity, DLP dates)
3. Defect Liability Period (DLP) tracker & Indian Road Congress (IRC) quality benchmarks
4. Real-time Citizen Ground-Truth reports (potholes, water-logging, asphalt stripping)

**Core Citizen Action:**  
*"This contractor has failed 11 roads in my zone. Demand blacklisting, withhold DLP retention funds, and file an RTI/Vigilance show-cause notice with 1 click."*

---

## 2. Target User Personas & Use Cases

| Persona | Needs & Goals | Core Actions on Platform |
|---|---|---|
| **Active Citizen / Resident** | Wants safe, pothole-free roads; wants to know who is responsible for the bad road outside their house. | Look up their street/ward on the GIS map, see contractor name, DLP expiration, log pothole with photo attribution. |
| **RWA & Ward Committee Member** | Needs hard data to question the Municipal Executive Engineer & Corporator during monthly ward meetings. | Generate Ward Contractor Monopoly Dossiers, download 1-click Ward Committee Resolution Briefings. |
| **Investigative Journalist / Civic Activist** | Needs evidence of tender cartelization, single-bid awards, repeat blacklisted contractors operating under aliases. | Analyze Contractor Hall of Shame, Cartelization Matrix, HHI Monopoly Index, and public funds payout records. |
| **Municipal Vigilance Officer / MLA** | Needs objective performance indices to enforce blacklisting, invoke bank guarantees, and blacklist errant agencies. | Audit DLP compliance rate, review monsoon failure ratios across wards, export non-compliance dossiers. |

---

## 3. Data Architecture & Domain Model

### 3.1 Data Entities & Schema

1. **Contractor Entity (`Contractor`)**
   - `id`: string
   - `name`: string (e.g., "Vanguard Infra Projects Pvt Ltd", "Sri Balaji Roadworks & Const.")
   - `registrationNumber`: string (e.g., "PWD-CL-1-KA-8849")
   - `directors`: string[]
   - `integrityScore`: number (0–100 calculated metric)
   - `riskTier`: 'HIGH_RISK' | 'MODERATE' | 'COMPLIANT' | 'EXEMPLARY'
   - `monsoonFailureRate`: number (percentage of paved roads developing severe potholes within 1st monsoon)
   - `dlpViolationRate`: number (percentage of repairs neglected during Defect Liability Period)
   - `wardMonopolyIndex`: number (percentage of tenders won in primary ward)
   - `totalContractsValue`: number (in INR ₹ Crores)
   - `totalRoadsBuilt`: number (in kilometers & road counts)
   - `activeDlpViolations`: number
   - `blacklistingHistory`: array of historical suspension/show-cause notices

2. **Work Order / Tender (`WorkOrder`)**
   - `id`: string
   - `tenderNumber`: string (e.g., "BBMP/2024-25/RD-W151/089")
   - `procurementPortal`: 'e-Procurement' | 'GeM' | 'Municipal Work Order' | 'State PWD'
   - `title`: string (e.g., "Asphalting & Micro-surfacing of 80ft Road, 4th Block Koramangala")
   - `wardId`: string
   - `wardName`: string (e.g., "Ward 151 - Koramangala", "Ward 174 - HSR Layout")
   - `zone`: string (e.g., "South Zone", "K-West Ward Mumbai")
   - `contractorId`: string
   - `contractorName`: string
   - `sanctionedAmount`: number (₹ Lakhs)
   - `awardedDate`: string (ISO)
   - `completionDate`: string (ISO)
   - `dlpExpiryDate`: string (ISO)
   - `dlpStatus`: 'ACTIVE_DLP_PROTECTED' | 'DLP_EXPIRED' | 'DLP_BREACH_UNRESOLVED'
   - `specifications`: { `bitumenGrade`: 'VG-30' | 'VG-40' | 'CRMB-55', `thicknessMm`: number, `pavementType`: 'Bituminous Concrete' | 'PQC / White-Topping' | 'Interlocking Paver' }
   - `roadSegmentGeo`: GeoJSON / LatLng polyline & bounding coordinates

3. **Road Quality & Failure Incidents (`RoadFailureReport`)**
   - `id`: string
   - `workOrderId`: string
   - `roadName`: string
   - `wardId`: string
   - `contractorId`: string
   - `reportedDate`: string
   - `defectType`: 'Pothole Cluster' | 'Asphalt Stripping / Ravelling' | 'Drainage Inundation' | 'Trench Cave-in' | 'Edge Cracking'
   - `severity`: 'CRITICAL_HAZARD' | 'HIGH' | 'MEDIUM'
   - `isDlpCovered`: boolean (whether incident happened while contractor is under legal warranty)
   - `contractorAttributed`: boolean
   - `status`: 'CITIZEN_FLAGGED' | 'VERIFIED' | 'SHOW_CAUSE_ISSUED' | 'RECTIFIED_BY_CONTRACTOR' | 'DEFAULTED'
   - `upvotes`: number
   - `evidencePhotoUrl`: string
   - `gpsCoordinates`: { `lat`: number, `lng`: number }

4. **Ward Intelligence (`WardProfile`)**
   - `id`: string
   - `number`: number
   - `name`: string
   - `zone`: string
   - `totalRoadLengthKm`: number
   - `totalRoadBudgetCr`: number
   - `dominantContractor`: { `name`: string, `sharePercent`: number }
   - `monsoonDamageIndex`: number (0-10)
   - `activePotholesCount`: number
   - `dlpCoveredPotholes`: number

---

## 4. Key Functional Modules & Features

### 4.1 Executive Dashboard & Transparency Command Center
- Real-time aggregation of municipal road spending vs. failure metrics.
- High-level KPIs:
  - Total Public Capital Monitored (₹ Crores)
  - Work Orders Tracked across e-Procurement + GeM
  - Active DLP Violations (Where contractor is refusing/delaying mandated free repairs)
  - Monsoon Failure Index (% of new roads failing in 1st rainfall)
  - Cartel Alert Flags (Single-bidder or rotating collusion patterns)

### 4.2 Contractor Hall of Shame & Scorecard Leaderboard
- Comprehensive ranking based on an automated **Composite Integrity & Risk Score** (0–100):
  - *Factors:* Monsoon Breakdown Speed, Unresolved Citizen Reports under DLP, Bid Concentration/Cartelization, Historical Penalties.
- Filtering by City/Municipality (Bengaluru BBMP, Mumbai BMC, Delhi MCD, Hyderabad GHMC, Pune PMC, Chennai GCC).
- Contractor Deep-Dive Dossier:
  - Complete list of awarded roads with interactive map previews.
  - Bitumen quality audit (e.g., used cheaper VG-30 instead of mandated polymer-modified bitumen on high-density corridors).
  - Ward monopoly heatmap.

### 4.3 Interactive Ward & Road GIS Map (The "Who Built My Road?" Explorer)
- Interactive vector map rendering municipal ward boundaries and color-coded road segments:
  - 🟢 **Green:** Safe / Under Active Warranty & Intact
  - 🟡 **Amber:** Minor Defect / Approaching DLP Expiry
  - 🔴 **Red:** Severe Monsoon Failure / Active DLP Breach by Contractor
  - 🟣 **Purple:** Monopoly Zone / Tender Cartel Hotspot
- Search by Ward Number, Street Name, Landmark, or Contractor Name.
- Instant click popup: Reveals the exact contractor, tender value, date completed, and days remaining under Defect Liability.

### 4.4 Citizen Action & Evidence Dossier Generator
- The core civic empowerment engine:
  - **"This contractor has failed X roads in my zone" summary card**: Formatted for viral social media / WhatsApp RWA dissemination.
  - **1-Click RTI Application Generator** (Under Section 6(1) of RTI Act 2005): Automatically generates a ready-to-file legal RTI asking for bitumen test core-cut reports, third-party inspection certificates, and proof of retention money deductions.
  - **Formal Municipal Vigilance & Lokayukta Complaint Draft**: Cites specific tender numbers, DLP clauses, and IRC standard violations.
  - **Ward Committee Agenda Resolution**: Ready-to-print memorandum for corporators and resident welfare associations.

### 4.5 Gemini AI Work Order & Tender Scrutiny Engine
- Server-side AI intelligence powered by `@google/genai`:
  - **Work Order Red Flag Scanner**: Analyzes contract text or tenders to detect inflated rates, abbreviated DLP clauses (e.g., illegal 1-year warranty vs. IRC standard 3-year), or single-source tender tailoring.
  - **Collusion & Cartel Detector**: Analyzes bidding patterns between sister firms sharing registered addresses or director networks.
  - **Automated Citizen Legal Notice Drafter**: Generates personalized legal show-cause notices for municipal executive engineers citing specific work order IDs and penal sections.

### 4.6 Citizen Ground-Truth Logging & Crowdsourced Attribution
- Easy report submission:
  - Select road / GPS pin.
  - Select defect type (Pothole, cave-in, drainage collapse).
  - System automatically maps the coordinate to the underlying Municipal Work Order and assigns the defect directly to the contractor's public scorecard.
  - Upvoting and verification mechanism by local ward residents.

### 4.7 Side-by-Side Contractor Comparison Matrix
- Compare up to 3 contractors on:
  - Average Road Durability (months before first pothole)
  - Public Funds Handled vs. Defect Rate
  - Responsiveness to DLP Rectification Notices
  - Cartelization & Ward Concentration Index

---

## 5. Technical Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 19 + TypeScript + Vite + Tailwind CSS + Motion        │
│  - Interactive GIS Ward Map (SVG/Canvas & Coordinates)      │
│  - Contractor Scorecards & Filterable Leaderboards          │
│  - Real-Time Evidence Dossier & RTI Document Exporter       │
│  - Ground-Truth Incident Attribution Modal                   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API
┌──────────────────────────────▼──────────────────────────────┐
│                    Server Layer (Express)                   │
│  - /api/contractors (List, search, filter, ranking)         │
│  - /api/work-orders (Tenders, DLP statuses, geodata)        │
│  - /api/ward-intelligence (Monsoon failure metrics)          │
│  - /api/citizen-reports (Incident logging & verification)   │
│  - /api/ai/audit-tender (Gemini 3.7 Flash work order audit) │
│  - /api/ai/generate-action (Gemini legal notice & RTI draft)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Gemini AI Integration                      │
│  - Model: gemini-3.7-flash (Server-Side via @google/genai)  │
│  - Structured JSON validation + Legal RTI drafting           │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Visual & UX Design Principles
- **Color Palette:** High-contrast civic intelligence theme. Slate-900 / Navy charcoal dark foundation with high-visibility amber-yellow warning accents (representing road construction & hazard alerts), emerald green for compliant contractors, and crimson red for DLP breaches.
- **Typography:** Refined, authoritative display sans typography for statistical metrics, paired with dense, legible tabular typography for work order IDs, tender amounts, and legal clauses.
- **No Gimmicks:** Crisp, functional UI with actionable data density, zero fluff, instant filtering, and clean print-ready document exports.

---

## 7. Next Steps for Implementation
1. Configure full-stack server (`server.ts` with Express + Vite middleware + Gemini API endpoints).
2. Build comprehensive mock & structured datasets encompassing realistic municipal work orders (BBMP, BMC, MCD, GHMC), contractors, DLP logs, and citizen failure reports.
3. Build client-side state management, modular components, interactive map view, contractor scorecard drilldowns, AI audit tooling, and the 1-click citizen action dossier generator.
4. Verify with `lint_applet` and `compile_applet`.
