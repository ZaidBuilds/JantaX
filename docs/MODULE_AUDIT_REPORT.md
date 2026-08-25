# JantaX — Full Platform Architecture & Module Audit
**Date:** 2026-05-11  **Scope:** All 15 Modules + Core + Backend + Routers
**Stack:** React 18 + Vite 5 + TS 5.2 + Tailwind 3.4 + Express 5 + Prisma 6 + Postgres

---

## 1. Platform Architecture (End-to-End)

```
Browser
  ├─ index.html → main.tsx → App.tsx
  │     ├─ LanguageProvider (10 langs) + PinProvider (follow/detect)
  │     ├─ AppNav (2-deck, mobile drawer) + GlobalFooter + page-enter anim
  │     └─ Routes (lazy + Suspense skeleton)
  │           ├─ / → Home (search + 6 tiles + glance + explore)
  │           ├─ /search?q=, /pin/:pinCode, /maps, /compare, /schools
  │           └─ /module/* → ModuleRouter (15 live)
  ├─ core: registry, api.ts, hooks (useCatalog/usePinSearch/useLocalDB), utils (pinResolver/coordinates/schoolTeachersMock)
  └─ dist (vite) → Vercel/GitHub Pages

Server (port 4000)
  ├─ express + cors + json(10mb)
  ├─ middleware/auth → optional Bearer parse (public GET allowed)
  ├─ /health, / (ok)
  ├─ /api/auth → register/login/me (JWT 7d, bcrypt)
  ├─ /api/pincode/:code → counts (7 tables) + lat/lng/region
  ├─ /api/pincode/:code/records?module= → school/infra/rera/hospital/pds/grievance/contractor (PRISMA_MODULES 7)
  ├─ /api/records/:module/:id → single
  ├─ /api/reports → POST (pending + media), GET /reports/:id, GET /pending-count
  └─ /api/moderation → GET moderation queue, PATCH review (MODERATOR)

DB (Prisma)
  Pincode (spine) → School, InfraProject, ReraProject, Hospital, PdsShop, Grievance, CitizenReport/Follow
  Contractor (orphan, no pincode FK), User, EvidenceMedia, Follow
  Missing tables for 8 modules → mock-only frontends
```

**Design System:** `index.css` :root killer palette (navy #0f2d59, orange #f97316, slate, status colors), `glass-card` + `killer-card`, `skeleton/shimmer`, `pulse-dot`, `focus-ring`, 768/1024 breakpoints, prefers-reduced-motion.

---

## 2. Module-by-Module Deep Audit

| # | Module | Spec | Frontend File | Backend Model | API Endpoint | Wired? | Status & Defects |
|---|--------|------|---------------|---------------|--------------|--------|------------------|
| **M1** | **Pincode OS** (entry) | spec-m1 | `pages/Home.tsx`, `pages/PinDashboard.tsx`, `core/utils/pinResolver.ts`, `pinCoordinates.ts` | `Pincode` | `GET /api/pincode/:code` (counts) | YES | **WORKING** – Home search validates 6-digit → pin or search; glance uses `useCatalog` (school+infra only). Defect: `useCatalog` narrow (ignores 5 other live counts), `pinResolver` only 25 prefixes (Unknown for many), glance 6/8 metrics show `— Not connected`. |
| **M7** | **School** (SchoolThikkRo) | spec-m7 + prd-school + prd-scale | `modules/school/SchoolDashboard.tsx` + `SchoolDetail.tsx` (new teachers staffing 3-col) + `pages/SchoolModulePage.tsx` + `pages/SchoolsDirectory.tsx` | `School` | `GET records?module=school` + `/records/school/:id` | YES | **REBUILT ✓** – New Teachers & Staffing matches screenshot pixel (left nav 12, 7-stat strip, 5-row table, qualification/training donuts). Defect left: overview still generic, but teachers tab now live via `schoolTeachersMock.ts`. Counters live (mock per schoolId). Need: overview health gauge variant still to do. |
| **M3** | **Contractor** (Scorecard/RoadWatch) | spec-m3 + prd-contractor | `modules/contractor/ContractorApp.tsx` + 12 comps (Metrics, Leaderboard, WardMap, AiTender, CitizenAction, etc.) + `data/statesAndCities.ts` + `utils/panIndiaPincodes.ts` | `Contractor` (no FK) | `GET records?module=contractor` (ignores PIN) but **frontend calls 404s**: `/api/contractors`, `/work-orders`, `/wards`, `/defects` | YES | **BROKEN** – UI renders, `refreshData()` always warns→empty arrays, leaderboard/map/action stay blank. Pinned PincodeDashboard never shows contractor cards. Risk: no local mock fallback. |
| **M2** | **Andhbhakt State CM** | spec-m2 | `modules/andhbhakt/AndhbhaktDash.tsx` + `rawSeedData.ts` (28 states, 13 claims) | NONE | NONE | YES | **MOCK-ONLY WORKING** – Client-state claim vs CAG side-by-side works but static, no PIN link, photoDrops local only, no server persistence. UI polished? Needs killer-card + share wiring. |
| **M4** | **Budget** (PIN Budget) | spec-m4 | `modules/budget/BudgetDashboard.tsx` | NONE | NONE | YES | **MOCK-ONLY WORKING** – Region→totalTax 120/210/150 + 5 sectors 35/20/15/18/12% deterministic. Defect: no DB, no tax vs returned chart (spec wants bar `totalRevenueCr vs allocatedCr`). UI simple, needs chart + share. |
| **M5** | **Ration Welfare** | spec-m5 | `modules/ration/RationDashboard.tsx` | `PdsShop` (backend calls it `pds`) | `GET records?module=pds` + `counts.pdsShops` BUT frontend uses `ration` mismatch → returns empty | YES | **MOCK-ONLY + NAMING MISMATCH** – Dashboard hardcoded `FPS-UP-xxxx` `Dealer संजय`, `12%` discrepancy, never calls API. Fix: alias `ration→pds` or add route. |
| **M6** | **Hospital Checker** | spec-m6 | `modules/hospital/HospitalDashboard.tsx` | `Hospital` | `GET …?module=hospital` + counts | YES | **MOCK-ONLY (wasted backend)** – Never calls API, hardcoded `CHC 30 beds / reality 4`, doctor 5→1, photo drop not wired to `POST /api/reports`. |
| **M8** | **RERA Checker** | spec-m8 | `modules/rera/ReraDashboard.tsx` | `ReraProject` | `GET …?module=rera` | YES | **MOCK-ONLY** – Deterministic builder `Omaxe/Sobha`, delay 26mo, never fetches DB. |
| **M9/M12?** | **Infra** (Sarak-Pul) | — (plus infra data) | `modules/infra/InfraApp.tsx` + `Dashboard/ProjectDetail/SpineDashboard` + `data/meerutData/nationwideSpine` | `InfraProject` | `GET …?module=infra` | YES | **PARTIAL / TECH-DEBT** – Backend exists but `InfraApp` uses `useLocalDB` localStorage `bharat_vikas_projects:[]` (initial empty, mock files never auto-loaded). `resetDB()` wipes to `[]`. Trend SVG hardcoded 54→68. White bug fixed (#fff→text-primary). Needs: load DB or fetch API. |
| **M10** | **Nagar Municipal** | spec-m10 | `modules/nagar/NagarDashboard.tsx` | NONE | NONE | YES | **MOCK-ONLY** – `Ward ${pin.slice(4,6)}`, garbage 40% vs 100%, water 1.5h vs 6h, deterministic per PIN. Needs live wiring later but theme OK. |
| **M11** | **Utility Discom** | spec-m11 | `modules/utility/UtilityDashboard.tsx` | NONE | NONE | YES | **MOCK-ONLY** – Feeder `17/22/19h`, loadShedding `420/120/300` mins, static SLDC source. |
| **M??** | **RTI Tracker** | — | `modules/rti/RtiDashboard.tsx` | NONE | NONE | YES | **MOCK-ONLY** – `promised 30d vs actual 112/62/88`, rejected `42%`. |
| **M13** | **Pollution Map** | spec-m13 | `modules/pollution/PollutionDashboard.tsx` | NONE | NONE | YES | **MOCK-ONLY** – AQI `342/88/160`, `M/S Balaji Chemical closure`, static CPCB. |
| **M12** | **Land Registry** | spec-m12 | `modules/land/LandDashboard.tsx` | NONE | NONE | YES | **MOCK-ONLY** – SLA `45d vs 145/82/110`, backlog `1480/420/890`. |
| **M14** | **Election/Exam** | spec-m14 | `modules/election/ElectionDashboard.tsx` | NONE | NONE | YES | **MOCK-ONLY** – Tabs `declared 32.5L vs ADR 185L`, `SSC CGL 2023→2025`. |
| **M15** | **CPGRAMS Shame** | spec-m15 | `modules/grievance/CpgramsDashboard.tsx` + `cpgramsData.ts` | `Grievance` | `GET …?module=grievance` | YES | **MOCK-ONLY (wasted)** – Static 5 ministries +5 states + `autoUpdater.ts` delta, never calls real Grievance table. |
| **Shared** | **Compare / Maps / Search / Schools** | — | `pages/ComparePage.tsx`, `MapExplorer.tsx`, `SearchPage.tsx` | partial | partial | YES | **PARTIAL** – Home→Pin→Module flow works. Defects: Search pagination fixed but still mock arrays, Maps legend only, Compare download added but matrix hardcoded, SchoolsDirectory pagination fixed to 6/page. |

**Router Wiring:** `App.tsx: ModuleRouter switch 15 cases` → all live, `ComingSoonPage` unreachable (registry `isLive:true` for all). `moduleMap.ts PRISMA_MODULES 7` → 8 spec modules invisible to API. `records.ts: contractor findMany ignores pincode` → wrong. `api.ts RecordsResponse: pds? not ration?` → mismatch. `submitReport pincode vs pinCode` mismatch → 400.

---

## 3. Cross-Cutting Defects (Frontend + Backend)

| Layer | Defect | Impact | Fix Priority |
|-------|--------|--------|--------------|
| **API Contract** | `api.submitReport` sends `{pincode, module, category, description, media:string[]}` but server expects `{pinCode, moduleId, title, description, media:{type,url,caption}[]}` → 400 | Report Issue broken everywhere | **P0** |
| **API Missing** | `GET /api/reports?pincode=` not implemented (only `/reports/:id` + `/pending-count`) → `api.getReports` 404 | Citizen reports list empty | **P0** |
| **Catalog Narrow** | `useCatalog` merges only `school+infra`, ignoring 5 other live counts → Home glance 6× `—` | Feels disconnected | **P0** |
| **Infra Legacy** | `InfraApp` localStorage only (starts empty) → `Dashboard` shows `0 projects` until user adds via form → looks broken | Perceived dead module | **P0** |
| **Contractor 404** | 4 fetch URLs 404 → empty contractor data | Leaderboard blank | **P0** |
| **Ration naming** | `ration` vs `pds` → `records?module=ration` returns `{}` → `Rera/ Hospital/Grievance` not wired though API exists | Wasted backend | **P1** |
| **Theme drift** | Some mock dashboards still emoji-only, inline `#fff` on light card (infra fixed), inconsistent header | Not killer-polished | **P1** |
| **App Flow gaps** | `Home popular tags → /search` works, but `PinDashboard quickLinks → /module/hospital?pin=` etc land on mock pages with no PIN prefill visual; `SchoolDetail` left nav not reflected in URL → refresh loses section | Smoothness | **P1** |
| **Responsive** | `PinDashboard` left 260px fixed, `MapExplorer` 280/300 fixed, `SchoolsDirectory` 260 fixed – updated with CSS stacking at 1024 but need skeleton/empty states | Mobile polish | **P1** |

---

## 4. What Already Polished & Reliable

- Nav sticky + drawer + GlobalFooter on every page, `page-enter` anim, `skeleton` loaders.
- Home hero killer gradient, 6 tiles with icon circles, glance 8 metrics with hover, explore zoom.
- PinDashboard gauge gradient fixed (r42 197 dash), responsive stacking, share/download/follow working (clipboard + whatsapp fallback).
- School Teachers & Staffing rebuilt to screenshot (see prior report).
- Search pagination per-tab, SchoolsDirectory 6/page, Compare download CSV, Map OSM bbox.
- Build passes clean (no TS errors), no missing imports.

---

## 5. Repair Plan (Execute Now)

**Phase A — Critical API/Flow (P0)**
1. `api.ts` → make `submitReport` send both `pinCode/pincode`, `moduleId/module`, `title`, `category→title` mapping; keep compat.
2. `server/routes/reports.ts` → accept both field names, add `GET /reports?pincode=` filter.
3. `records.ts` → alias `ration→pds` in module filter; fix `contractor` to return filtered mock when no FK (or return top verified).
4. `useCatalog.ts` → merge all 7 record types (`school|infra|rera|hospital|pds|grievance|contractor`) and expose per-module arrays.
5. `InfraApp.tsx` → seed `useLocalDB` initial from `nationwideSpine.ts` if empty, or optionally fetch from `api.getRecords`.
6. `ContractorApp.tsx` → add fallback mock generators (`generateMockContractors` etc from `panIndiaPincodes`/`statesAndCities`) when fetch 404 → never blank.

**Phase B — Polish 8 mock modules to Killer consistency (P1)**
- Wrap each dashboard header in `.glass-card.dash-header-card` with left accent, add `dash-search-row` where pin input exists.
- Unify stat cards (`glass-card` + top border 3px), progress tracks, filter pills, photo cards, `card-ribbon`/`card-footer-meta`.
- Replace emoji with `lucide-react` icons where appropriate, add skeletons for loading.
- Wire each dashboard's displayed numbers to `resolvePincode(pin).region` deterministic (already) but show `Last updated` + source citation per spec.
- For rera/hospital/pds/grievance where backend exists, add toggle: try API first, fallback mock.

**Phase C — App Flow Smoothness (P1)**
- Deep-link pin: `Home tiles → /module/:id?pin=` already, ensure dashboard reads `?pin=` via `useSearchParams` and presets input.
- SchoolDetail section in URL `?section=teachers` (so refresh persists) + share links include pin.
- Add `Follow` → `localStorage + optional POST /api/admin/pincode` (already public).
- Verify every `navigate()` target resolves (no 404) — table above shows all 15 wired.

**Phase D — Verification**
- `npm run build` after each phase, manual smoke: search → pin → infra/school/budget → hospital → compare → maps.

