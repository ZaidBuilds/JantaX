# JantaX — UI/UX Audit vs Reference Images
Generated: 2026-05-11 | Route & Component Forensics

## 1) Reference Design Extracted (from screenshots)

### Global Shell (all pages)
- **Nav Top:** JantaX (orange X) left, center search pill `Search by PIN code / School / Builder / Contractor / Project / Location` with `/` shortcut, right cluster: `📍 110001 ▾` (PIN switcher), `हिंदी ▾` (lang), 🔔 with red 3 badge, avatar. Below: secondary nav `Home | Explore ▾ | Compare | Maps | Reports | About` (icon + label, active underline).
- **Theme:** Pure white canvas `#fff` + very light slate page `#f8fafc` inside cards, border `#eef2f7` / `#e2e8f0`, card radius `12-16px`, subtle shadow `0 1px 3px rgba(0,0,0,.04)`.
- **Palette locked from reference:**
  - Primary navy: `#0f2d59` (titles, active nav)
  - Accent orange: `#f97316` (less used in this page, reserved for CTA)
  - Status: Green `#10b981` (Good), Blue `#2563eb`/`#3b82f6` (Regular), Light blue `#0ea5e9`, Amber `#f59e0b/#d97706`, Red `#ef4444`, Purple `#8b5cf6`, Slate text `#0f172a` / `#475569` / `#94a3b8`.
  - Donut colors: Teacher Qualification uses `B.Ed+ #10b981 (green 80%) + #f59e0b (0%) + #3b82f6 (20%) + grays` ; Gender uses `#8b5cf6`/`#3b82f6`.

### Page: School Profile — Teachers & Staffing (main reference, high fidelity)
- **Layout:** 3-column inside container `max 1200`: Left `260px` sticky sidebar, Center `flex-1` (2 cards + table + 3 bottom cards), Right `320px` sidebar. Footer bar `100% Open Data | Citizen Powered | Non-Partisan | For Every Indian` across bottom.
- **Left Sidebar:**
  - `← Back to School Profile` pill
  - Nav 12 items with icons, active = Teachers & Staffing (`bg #eff6ff`, `text #1d4ed8`, icon blue)
  - Card `Teachers to Students Ratio 31:1 Good` (State 28:1, National 26:1)
  - Card `Data Sources: UDISE+ 24 Aug 2026, DISE 18 Aug, School Information Form 12 Aug` + link
- **Header:** Breadcrumb `Home > Schools > School Profile > Teachers & Staffing` + top-right actions `Follow / Share / Report an Issue (dark navy)`.
  - Hero card: left photo (school building, badge `18 Photos`), right: title `Govt. Primary School Narela Sector A9 Verified (green pill)`, meta 2 rows (location, UDISE, School ID, Type, Management, Medium, Est Year), tags `Co-educational Day School Delhi Education Department` (light blue pills).
- **Stats Strip (7 cols):** Total Teachers 5, Regular 4, Para 1, Student Teacher Ratio 31:1 Good, Pupil Teacher Ratio 31:1 Good, Vacant 0 Well Staffed, Female 3 60% — each with tinted icon circle (`bg #eff6ff/#fef3c7/#dcfce7/#f3e8ff` etc).
- **Teacher Details Table:** Tabs `All Teachers | Regular | Para | Subject Allocation`, header `#`, Name, Designation, Qualification, Experience, Gender, Subject/Class, Status (`Regular green pill / Para amber`), Source & Date. 5 rows + `View Full Teacher List & Details →` link.
- **Bottom Row (3 cards):** Staffing Status (list 5 rows), Experience Distribution (bar chart 0-5=~2, 6-10=1, 11-20=2, 20+=0), Gender Distribution (donut 5 total, Female 3 purple 60%, Male 2 blue 40%).
- **Right Rail:**
  - Teacher Qualification donut (5 total green/blue, legend 5 rows with dot + count + %)
  - Training & Development 2x2 grid (Teachers Trained 3/5 60%, Last Training ICT May 2026, Next Foundational Literacy Sep 2026, Hours 14) + `View Training History →`
  - Notes card (2 lines tiny, `Report Data Issue →`)

### Other Reference Thumbnails (low res but pattern)
- **Overview / Health Score pages:** Gauge circle top-left (health 85, 62 etc), 5–6 small metric pills, photo gallery, ground truth vs official side-by-side.
- **Schools Directory:** Top 5 category pills (Health etc), left filters (District, Block, search), result list with thumbnail left, Hindi title, UDISE, students/teachers, health 62-85, attendance pill, `View Details →`.
- **Compare:** Top entity pills `Schools | Contractors | Projects | RERA | Areas`, selected 3 schools row + `+ Add another school`, left categories `Overview | Infrastructure | Teachers | Attendance`, matrix table with sticky Parameter col.
- **Map Explorer:** Left categories checkboxes (Schools, Public Works, RERA...), Location Level radios, center map with cluster pins color-coded, right `Selected Area PIN 110001` stats, `Area Health Score`, `Most Reported Issue`, `View Full Area Dashboard →`, bottom `India at a Glance` ribbon dark navy with counts.

## 2) Current Implementation Audit

### Frontend — What Works ✅
- Router: `BrowserRouter` + `ModuleRouter` correctly lazy-loads 15 modules, `LanguageContext` 10 langs, `PinContext` with detectLocation + follow, `useCatalog` hook wired.
- AppNav we rebuilt (sticky, mobile drawer, global footer) — now matches reference shell 90%.
- Home, PinDashboard, Search, MapExplorer, SchoolsDirectory, Compare scaffolds exist and build passes.
- School list/dashboard can fetch `api.getSchools(pinCode)` and render `SchoolDashboard.tsx` grid vs district.
- Tailwind + index.css tokens extended (Glass, premium shadows, killer gradients).
- Server builds and Prisma schema covers all domains.

### Frontend — Broken / Gap 🔴
| Area | Issue | Severity |
|------|-------|----------|
| **SchoolDetail `Teachers & Staffing`** | Current `SchoolDetail.tsx` renders generic `Overview | Infra | Timeline | Evidence | Compare | Report` tabs. Reference demands **Teachers-specific** layout: 7-stat strip, qualification donut, training grid, experience bars, gender donut, left nav 12 items, right rail. Counters not connected. No per-teacher table with real API fields. | **P0** |
| **School Profile Overview** | Missing health circular gauge variant that reference shows (large 85 green). Current generic score `32px` inside white card. | P1 |
| **Left Nav on School Profile** | No persistent sidebar; back button only. Reference needs Overview / Infra / Teachers & Staffing ... 12-item nav + ratio + data sources cards. | P0 |
| **Teacher Data Model** | `SchoolRecord` only has aggregates (`teachersWorking/sanctioned`, metrics `yes/no`). Reference needs **actual roster**: name, designation, qualification (`B.Ed M.A`), experience yrs, gender, subject/class, status `Regular/Para`, source date. Backend `School` model has no `Teacher` child table. | **P0 Blocker** |
| **Training & Qualification** | No tables for `Teacher Qualification` distribution or `Training & Development` (hours, last/next program). Backend lacks those entities. | P0 |
| **Header Details** | Missing `Verified` pill, `18 Photos` badge, `Co-educational Day School` tags, Est Year, Medium, Management row. Photo handling not wired. | P1 |
| **Counters Sync** | `Total Teachers (Working) 5` etc should derive from roster, not static stat cards. Currently `SchoolDashboard` uses `teachersWorking` only. Pupil/Student ratios same (31:1) hardcoded in reference — need calc `studentsEnrolled / teachersWorking`. | P1 |
| **Schools Directory vs Reference** | Our `SchoolsDirectory` renders list but mismatch: reference has top 5 category pills (Health etc) + district/block filters + image + score large + sub-ratings (Infra/Teachers/Attendance) with color. Current uses no pills, score inline, filter sidebar incomplete. | P1 |
| **Map Explorer** | Our `MapExplorer` uses OSM iframe bbox calc, works, but pins not rendered (legend dots only), cluster counts static. Reference shows many colored pins on map + `India at a Glance` bottom counts live. Not wired to API `hospital/pds/rera` counts. | P1 |
| **Compare** | Our `ComparePage` hardcoded `schoolsData` 3 static schools, not fetching real school records. Needs to accept `?ids=` query and fetch via `api.getRecord`. | P2 |
| **Theme Drift** | Some cards still use emoji or pure white `color:#fff` bug (fixed infra once but check others). Need systematic `verify → locked palette` audit. | P1 |
| **Responsive** | Reference tightly uses 12-column at 1280, collapses to single at 768 with sidebars stacking under. Our CSS added basic stacking but needs polished breakpoints + skeleton states. | P2 |

### Backend — What Works ✅
- Express + CORS + JSON limits, `/health`, auth JWT middleware, `prisma` client.
- Routes: `GET /api/pincode/:code` (counts by 7 tables), `GET /api/pincode/:code/records?module=` (aggregates schools/infra/rera/hospital/pds/grievance/contractor correctly), `GET /api/records/:module/:id` (single), `POST /api/reports` (PENDING, media), `GET /api/reports/:id`.
- Prisma models cover Pincode + 6 domains + CitizenReport + Follow + User, migrations present.
- Seed likely has `110001` etc.

### Backend — Broken / Gap 🔴
| Route / Model | Issue |
|---------------|-------|
| **School → Teacher roster** | No `Teacher` model. Cannot serve per-teacher rows. Need `Teacher` table or JSON `teachers` field on `School`. Reference needs 5 teachers per school with fields. Workaround: generate deterministic mock roster in `records.ts` mapper. |
| **Training & Qualification** | No `TeacherTraining` or `Qualification` aggregate. Need to augment `School` shape with `teacherQualification: {bEdAbove, gradBEd, grad, others, belowGrad}`, `training: {trainedThisYear, total, lastProgram, nextProgram, hours}`. |
| **Counts not wired on frontend** | `MapExplorer` bottom ribbon uses hardcoded `2.15L Schools` etc, not from `api.getPincode` counts. Home glance uses `useCatalog` but Pin numbers OK. Need to wire `getPincode` stats. |
| **Follow / Report flows** | Frontend `Follow` is local context, not calling backend `POST /api/pincode` follow. `Report an Issue` CTA not wired to `POST /api/reports`. Should connect but keep anonymous fallback if unauth. |
| **Auth** | `requireAuth` middleware auto-applied to all `/api`? `server/src/index.ts` does `app.use(requireAuth)` then auth routes, so pincode/records incorrectly require auth — should be public. Barrier if no token. |
| **Data freshness** | `Last updated: 24 Aug 2026` shown in reference; backend `updatedAt` exists but not per-field source dates. Need to surface `updatedAt` consistently. |
| **Missing search API** | `SearchPage` currently uses hardcoded mock arrays; no backend `/api/search?q=` that spans RERA/infra/contractor. Could reuse `/api/pincode/:code/records` but search needs global. For now keep mock but themed. |

## 3) Barriers / Risks
- **Data Model Mismatch** is #1: Adding Prisma migration for Teacher in this task risks DB rebuild in dev; safer to mock-synth roster inside API mapper without migration, then later migrate.
- **Design System Drift:** Switching all pages to exact reference needs consistent `12px radius, 1px #f1f5f9 border, 8px gap` — already mostly locked but need verification.
- **Performance:** 3-column Teachers page at 1200px can overflow on 1024; must add stacking at `1100px`.
- **Images:** Reference uses school building photos; our seed uses unsplash but badge `18 Photos` must be dynamic.

## 4) Action Plan (execution sequence)
1. **Lock tokens & helpers** — derive palette from reference, create shared components + mock generators (Teacher roster, qualification, training) + fix auth guard to allow public GET.
2. **Rebuild School Profile Teachers & Staffing** — new layout (left nav, center hero + stats strip + table + staffing/experience/gender, right rail qualification/training/notes) 100% pixel-match, roster mocked per schoolId, wired to `api.getRecord`.
3. **Enhance School Overview & sub-tabs** to reuse same layout shell, adding health gauge variant where needed.
4. **Polish Directory / Compare / Maps** to thumbnail references (pills, pins, counters).
5. **Wire counters & flows**: Follow → local+api attempt, Report → POST, Map bottom counts from `/api/pincode`.
6. **Smoke build + responsive QA** at 1280/768/375.

