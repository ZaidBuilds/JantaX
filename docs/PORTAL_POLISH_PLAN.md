# JantaX Portal Polish — Master Plan

> Goal: Make every page feel like one killer product. Consistent palette, flawless app flow, premium UX.

## 1. Audit Summary (What we found)

### App Flow (Current)
`/` (Home) → `/search?q=` → `/pin/:pinCode` → `/module/:id?pin=` → Detail (e.g. `/module/school?id=...`) → `/maps`, `/compare`, `/schools`
- Search handles PIN vs text intelligently, but no validation UX.
- PIN is the spine: Home, PinDashboard, MapExplorer, Module Dashboards all read `pin` context.
- ModuleRouter covers 15 modules via `MODULE_REGISTRY.isLive` — all live but dashboards have mismatched styling.

### Killer Palette (Current vs Target)
**Current:** `--color-primary: #0f2d59` (navy), `--color-accent: #f97316` (orange), bg `#f8fafc`/`#ffffff`, border `#e2e8f0`. Status colors defined but not systematically used.
**Problems:** Tailwind config empty → no utility classes. Inline styles bypass tokens. Modules use random hexes. No accent gradients, no dark text hierarchy consistency.

**Target — "Killer Palette v2":**
- **Navy Spine:** `primary 900 #0f2d59`, `800 #1a4d8f`, `700 #2563eb`, `50 #eff6ff`
- **Orange Energy:** `accent 500 #f97316`, `400 #fb923c`, `600 #ea580c`, `glow rgba(249,115,22,0.08)`
- **Slate Neutrals:** `slate 900 #0f172a`, `600 #475569`, `400 #94a3b8`, `100 #f1f5f9`, `50 #f8fafc`
- **Semantic:** Success `#10b981`, Warning `#f59e0b/#d97706`, Danger `#ef4444`, Info `#0ea5e9`, Purple `#8b5cf6`, Cyan `#06b6d4`, Pink `#ec4899`
- Applied via CSS variables + Tailwind extend so every page logs same tokens.

### Page Matrix
| Page | File | Issues | Fix Priority |
|------|------|--------|--------------|
| **AppNav + Footer** | `src/App.tsx` | Fixed 480px search, no mobile drawer, raw select, no blur, inconsistent padding | P0 |
| **Home** | `pages/Home.tsx` | Tiles OK but flat, no hover elevation gradient, hero not animated, summary hardcoded widths | P0 |
| **PinDashboard** | `pages/PinDashboard.tsx` | Inline overload, SVG gauge wrong dash, hardcoded trend, not responsive at 768px | P0 |
| **Search** | `pages/SearchPage.tsx` | Mock data only, sidebar `hidden md:block` relies on Tailwind not configured, pagination wrong | P1 |
| **MapExplorer** | `pages/MapExplorer.tsx` | `calc(100vh -60px)` fragile, sidebars not collapsible on mobile, legend not sticky | P1 |
| **SchoolsDirectory** | `pages/SchoolsDirectory.tsx` | Pagination fake `7437`, filters not wired, emoji cards | P1 |
| **Compare** | `pages/ComparePage.tsx` | Hardcoded schools, tabs not functional, no empty state | P1 |
| **SchoolModule** | `modules/school/...` | Mismatched `project-card` vs `glass-card`, metric badges inconsistent | P1 |
| **InfraModule** | `modules/infra/...` | White text on white bg bug (`color:#ffffff` on light card), chart colors drift | P0 |
| **11 other modules** | `modules/*/components` | Each has own header style, no shared template | P1 |

---

## 2. Design System Upgrade

### A. Tailwind Config
- Extend `theme.colors` to map CSS variables: `primary`, `accent`, `slate`, `success` etc.
- Add `fontFamily: { heading: Outfit, body: Inter }`
- Add `boxShadow: { glass, premium }`, `borderRadius`, `keyframes`
- Content paths already correct.

### B. index.css v2 (Single Source of Truth)
- Keep `:root` but add full token scale (50-900), add `--gradient-primary: linear-gradient(135deg, #0f2d59 0%, #1a4d8f 100%)`, `--gradient-accent: linear-gradient(135deg, #f97316 0%, #ea580c 100%)`, `--gradient-mesh: radial gradients`.
- Replace generic `.glass-card` hover with `transform + border + shadow + after gradient line`
- Add utilities: `.killer-card`, `.killer-gradient-text`, `.killer-badge`, `.shimmer`, `.skeleton`
- Add responsive breakpoints: `640, 768, 1024, 1280`
- Add animations: `fadeIn, slideUp, pulseDot, shimmer`
- Add accessibility: `:focus-visible` ring everywhere, `prefers-reduced-motion`

---

## 3. App Shell (AppNav + Footer + Layout)

### AppNav Redesign
- **Top Deck:** Logo (JantaX + tagline) left, Center search (responsive: full width on mobile, 480px on desktop) with `/` shortcut hint, Right: LanguageToggle (pill) + Bell + Avatar → on mobile collapses to hamburger.
- **Bottom Deck:** Pill nav: Home · Explore · Compare · Maps · Reports · About + Module Switcher (styled select with chevron). Active state: underline + primary color, not just color.
- **Behavior:** `position: sticky`, `backdrop-filter: blur(12px)`, `border-bottom: 1px solid rgba(226,232,240,0.8)`, shadow on scroll.
- **Mobile:** Hamburger opens drawer (Sheet) with search, nav links, module list, language, footer badges. Drawer uses `translateX` animation, focus trap.
- **A11y:** `role="navigation"`, `aria-current="page"`, keyboard navigable search.

### Global Footer (New)
- Appears on ALL pages (move from Home-only to `AppRoutes` wrapper).
- 3 columns: Brand + tagline + social, Explore links (Schools, Public Works, Contractors, RERA), Legal + badges (100% Open Data, Citizen Powered, Non-Partisan).
- Background `slate-50`, border-top `slate-200`, killer accent line at top: `height 3px gradient`.

### Layout Wrapper
- `main` gets `min-height: calc(100vh - nav - footer)` and `background: var(--bg-primary)` with subtle mesh radial.

---

## 4. Page-by-Page Polish

#### Home
- Hero: `India, Explained by Where You Live.` with gradient word, tagline 1rem, search pill with shadow `0 8px 32px rgba(15,45,89,0.08)`, focus ring on input, location btn with icon animation.
- Popular searches: pill hover lifts 1px, active scale.
- Module tiles (6): icon circle with soft bg `color15`, hover: `translateY(-6px)`, `border-color: color30`, `shadow premium`, icon scale 1.05.
- 10 Things box: header with PIN badge + location dot, grid 2→4 cols responsive, metric cards with icon bg, hover.
- Explore gallery: image zoom on hover `scale(1.05)`, badge top-left with color, title 1-line clamp, desc 2-line clamp.
- Recent Reports + Trending Issues: side-by-side on desktop, stacked on mobile, table row hover.
- Reporting banner: gradient `135deg navy→blue`, noise texture, button `accent` with shadow.
- Add skeleton loaders for catalog-driven metrics.

#### PinDashboard
- Breadcrumbs clickable.
- Header: PIN `2rem` + Change PIN (pill secondary) + actions (Share, Download, Locate) → on mobile wraps to 2 rows.
- Left aside 260px → on <1024 stacks above main (order changes).
- At a Glance 5 cards: icon top, value 1.8rem, alert pill with status color.
- Area Health: Fix SVG: `r=46`, `circum=289`, `dash = areaHealth/100 * 200` for half-circle (135deg start). Add animation on mount.
- Health Trend: Keep placeholder but label “Trend based on ground reports” + tooltip.
- Category Overview 5 cols → responsive 1 col on mobile, 2 on tablet.
- Map: iframe + overlay District label + zoom controls with `+ -` and `locate` icon, loading skeleton.
- Issues + Updates: card hover, issue status pill color-coded.

#### Search
- Real sidebar filters (already present) → make `Apply Filters` actually filter (already does via state), fix `Clear All`, make Mobile drawer use same sidebar component (DRY).
- Fix Tailwind `hidden md:block` by ensuring tailwind generates it (config upgrade fixes).
- Pagination: compute from filtered total / PAGE_SIZE, not maxLen. Fix empty states with illustration + “Clear filters” CTA.
- Cards: unify padding, image 90px, badge top-right, View Details → navy pill.

#### MapExplorer
- Layout: `height: calc(100vh - var(--nav-height) - 60px)` where `--nav-height` is 96px (2 rows). Use flex: left 280 fixed, center flex-1, right 300 fixed. On <1024: left collapses to toggle, right becomes bottom sheet.
- Add category toggles with colored dots matching legend.
- Legend as floating glass card with blur.
- Right pane: PIN summary with live counts, Area Health with circular mini gauge.

#### SchoolsDirectory
- Filters: wire “Clear All” + make Checkboxes functional.
- Stats 5 cards: use lucide icons not emojis, color-matched borders.
- List cards: thumbnail 120x90, badge for schoolLevel with computed bg, health score large + label, sub-ratings with icons, “View Details” pill.
- Pagination: build `Pagination` component (Prev / 1 2 3 ... 7437 / Next) with disabled states, derive page count from `filteredSchools.length / PAGE_SIZE`.
- Add Sort dropdown wiring (Health Score High→Low, Low→High, Name).

#### Compare
- Entity tabs: make clickable → set state `entityType`, show placeholder “Contractors compare coming soon”.
- Category sidebar: active highlight with left accent border.
- Table: sticky header, sticky first col, zebra rows, overflow-x scroll with shadow fade.
- Add / Download: mock download generates CSV from current data.

#### Module Dashboards (14 modules)
- Shared template: `DashHeader` (left accent 4px, title + Hindi, desc, dataSource pill), `DashSearchRow` (input + btn + location hint), `DashTabGroup` (pill bg), `DashPanelGrid` (claim vs reality), `DashCard`, `CardRibbon`, `CardFooter`, `FilterPill`, `PhotoCard`.
- Audit `Dashboard.tsx` infra bug: `color:#ffffff` on light card → change to `var(--text-primary)`.
- Apply killer palette: each module’s accent color used only for icon/bg, not for text on white; primary navy for headers universally.

---

## 5. Component & Interaction Polish

- **Buttons:** `.btn-primary` (navy, shadow on hover, active scale 0.98), `.btn-accent` (orange), `.btn-ghost` (transparent border), all with `focus-visible` ring.
- **Inputs:** `form-input` with `border 1px`, `focus: border primary + ring`, error state `border danger`.
- **Cards:** `glass-card` + `killer-card` variant with top gradient line on hover.
- **Badges:** `status-badge` with border 1px + bg 8% opacity, uppercase 0.7rem.
- **Skeletons:** shimmer `linear-gradient 90deg transparent → white 50% → transparent` animated.
- **Empty States:** centered icon 48px muted, title, desc, CTA button.
- **Toasts:** bottom-right stack, auto-dismiss 3s, success (green), error (red), info (blue).
- **Transitions:** global `0.25s cubic-bezier(0.16,1,0.3,1)` for hover, `0.4s` for page fade-in.

---

## 6. App Flow Verification Checklist

- [ ] Home search: valid PIN → `/pin/:pin` else → `/search?q=`
- [ ] Home popular tags + module tiles → correct route with `?pin=`
- [ ] PinDashboard: Share (Web Share API → clipboard → WhatsApp fallback) works, Download generates TXT, Follow toggles, Change PIN navigates, Map zoom works, View Details navigates to module.
- [ ] Search: filters, pagination, tab counts, mobile drawer open/close, View Details/Profile navigates.
- [ ] MapExplorer: PIN input updates pin context + map, category toggles filter counts, zoom, View Full Dashboard navigates.
- [ ] SchoolsDirectory: search + filter + sort + pagination + View Details (`/module/school?id=`) + Report Issue.
- [ ] Compare: category switch, add school placeholder, download CSV.
- [ ] Infra/School detail: back button restores list, claim vs reality visible, photos load.
- [ ] All pages: LanguageToggle persists to localStorage, nav active state correct, footer visible.

---

## 7. Implementation Order (Phased)

**Phase 1 — Foundation (1 commit):** tailwind.config.js + index.css (tokens, utilities, animations)
**Phase 2 — Shell (1 commit):** App.tsx (Nav + Footer + Layout)
**Phase 3 — Core Pages (2 commits):** Home, PinDashboard
**Phase 4 — Secondary Pages (1 commit):** Search, SchoolsDirectory, MapExplorer, Compare
**Phase 5 — Modules (1 commit):** shared dashboard template + infra fix + unify headers
**Phase 6 — QA (1 commit):** build, responsive, a11y, flow smoke test

---

## 8. Risks & Mitigations
- **Risk:** Inline styles override new tokens → Mitigation: use `!important` only on overrides, gradually replace inline with classes.
- **Risk:** Mobile drawer logic breaks navigation → Test with Playwright `test:e2e`.
- **Risk:** OSM iframe bbox miscalc → Keep fallback “Map unavailable” gracefully.
- **Risk:** Mock data vs live API divergence → Keep `useCatalog` as single source for Home/Pin counts, Search stays mock but themed.

---

*Generated: 2026-05-11 — ZaidBuilds / JantaX Portal Polish*
