# JantaX

**Pin code dalo, hisaab lo.** A PIN-code-first civic information layer for India.
Enter a 6-digit PIN and see public records for that locality — schools, works,
health, welfare, grievances — with the source and freshness of every figure.

JantaX is **not** a government portal. It aggregates legitimately reusable public
data (mostly GODL-India), cites it, and routes citizens to the official channel.

## Data rules

- **Rule 40 — no fabricated data.** Fixture rows carry `isSample = true`; the API
  exposes it (`sampleCounts` on `/api/pincode/:code`, `isSample` on records) and
  the UI must label them "Sample data".
- Every record shows source + last-updated. `null` freshness means "no public
  record", never zero.
- Registry `dataStatus` in `src/core/registry/moduleRegistry.ts` must match reality.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite 5, React Router 7, Tailwind 3 |
| API | Express 5 on Node (run with `tsx`), JWT auth, in-memory rate limit |
| Data | Prisma 6 + PostgreSQL (Neon or local Docker) |
| Ingestion | `server/src/jobs` — connector → validate → parse → normalize → diff → upsert |
| Tests | Vitest (unit), Playwright (e2e) |

## Quick start

```bash
npm install
cp .env.example .env        # then set DATABASE_URL (Neon direct string or local Docker)
npm run db:deploy           # apply migrations
npm run db:seed             # PIN spine + source registry (+ sample rows in dev)
npm run server:dev          # API on http://localhost:4000
npm run dev                 # web on http://localhost:5173
```

Local Postgres via Docker instead of Neon: `docker compose up db` (port 5433).

## Scripts

| Script | Does |
|--------|------|
| `dev` / `build` / `preview` | Vite frontend |
| `server:dev` / `server:start` | API (watch / once) |
| `db:migrate` | Create a migration from schema changes (dev) |
| `db:deploy` | Apply pending migrations |
| `db:seed` | Run `prisma/seed.ts` |
| `db:studio` / `db:reset` | Prisma Studio / drop + re-migrate + seed |
| `test` / `test:e2e` | Vitest / Playwright |

## API (main routes)

| Route | Purpose |
|-------|---------|
| `GET /health` | Liveness |
| `GET /api/pincode/:code` | PIN info, per-domain counts, `sampleCounts`, `lastUpdated` |
| `GET /api/pincode/:code/records?module=` | Records for a PIN (`school`, `infra`, `rera`, `hospital`, `pds`, `grievance`, `contractor`) |
| `GET /api/records/:module/:id` | Single record |
| `GET /api/search?q=` | Cross-module search |
| `GET /api/sources` | Official source registry |
| `POST /api/reports` | Citizen report (moderated) |
| `/api/auth/*` | Register / login / me |
| `/api/moderation/*` | Moderator queue (role-gated) |

Full list: `server/src/index.ts`.

## Layout

```
prisma/            schema.prisma, migrations/, seed.ts
server/src/        index.ts, config.ts, routes/, middleware/, jobs/, connectors/
src/               React app — pages/, modules/, core/ (registry, api, types)
docs/              specs + PRDs (see BUILD_QUEUE.md for which are current)
```

## Status

Work is tracked in [`BUILD_QUEUE.md`](BUILD_QUEUE.md).

## License

MIT © zaidbuilds
