# Build Queue — JantaX

Source of truth for direction: Notion Master Blueprint + V1 Source of Truth.
Hard rule: **Rule 40 — no fabricated data.** Sample rows must be flagged `isSample`.
Stale docs (do not build from): `HANDOFF_POLISHED_PLATFORM.md`, `MODULE_AUDIT_REPORT.md`,
`PORTAL_POLISH_PLAN.md`, `UIUX_AUDIT_GAP_ANALYSIS.md`, per-module colour/branding in `spec-m*.md`.

## Phase 1 — Backend & Data Layer

| ID | Task | Status |
|----|------|--------|
| 1a | Baseline: schema validate, server tsc, unit tests | ✅ |
| 1b | Catch-up migration for the 26 tables missing from `init` | ✅ |
| 1c | `isSample` flag on seeded domain models | ✅ |
| 1d | Seed: mark sample rows, un-verify fake contractors, gate by env | ✅ |
| 1e | API: expose `isSample` + sample counts in `/api/pincode/:code` | ✅ |
| 1f | Config hardening: CORS origin, JWT secret required in prod + TRUST_PROXY rate-limit IP | ✅ |
| 1g | Scripts: `db:migrate`, `db:deploy`, `db:seed`, `prisma.seed` | ✅ |
| 1h | `.env.example` + README rewritten to match real stack | ✅ |
| 1i | Neon: migrate deploy + seed (blocked: needs Neon URL in `.env`) | ⏳ |
| 1j | Smoke-test live API endpoints against Neon | ⏳ |

## History — Antigravity Hero Effect (done)

All 6 tasks complete (R3F particles hero, `HeroBackground`, wired into `Home.tsx`, build ✓).
