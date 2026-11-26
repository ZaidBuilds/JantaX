# JantaX — Verified Data Sources

All IDs tested live against `api.data.gov.in` on 2026-11-19.
Registry in code: `server/src/connectors/ogdResources.ts`.
Fetch helper: `server/src/connectors/ogdClient.ts`.

## Step 0 — Get your own API key (required)

The sample key in the code is capped at **10 rows per request**.
Meerut alone has 881 schools. You need your own free key.

1. Go to https://data.gov.in and sign up / log in.
2. Open **My Account** (top right) → **Generate API Key**.
3. Paste it in `.env`: `DATA_GOV_IN_KEY="your-key"`.

## Real-data-only mode (Nov 2026)

- Live API for any PIN: `GET /api/live/:pin` and `GET /api/live/:pin/:domain`.
- Code: `server/src/live/` (pin, schools, roads, mgnrega, aqi).
- `localStore` is empty. No hand-written or cloned records.
- `ensurePincodeExists` no longer writes template schools/projects to Postgres.
- CPCB has no fake fallback. UDISE/PMGSY template connectors return `[]`.
- Sample seeding is opt-in only (`SEED_SAMPLE_DATA="true"`).

### Setup checklist

| # | What | Who | Why |
|---|---|---|---|
| 1 | data.gov.in API key in `.env` | You | Sample key: 10 rows/call, shared, throttled (HTTP 429) |
| 2 | Remove old generated DB rows. On a dev DB: `npm run db:reset` (drops ALL data, incl. users) | You | Old code wrote template schools/projects for every PIN looked up |
| 3 | Nothing else for live domains | — | All other sources need no key |

### Coverage today

| Domain | Rural PIN | Urban PIN |
|---|---|---|
| PIN profile | ✅ | ✅ |
| Schools (JJM) | ✅ village-matched | ❌ JJM covers rural only |
| Roads (PMGSY) | ✅ district | ❌ none |
| MGNREGA | ✅ district | ❌ none |
| Air quality | ✅ city or nearest station | ✅ |

## Find any dataset yourself

```bash
npm run data:find -- "hospital" "ration" --live
npm run data:find -- --probe <resource-id> district_name=Meerut
```

`--live` shows only datasets updated in the last 30 days.

## Verified live datasets (granular, frequently updated)

| Domain | Dataset | Resource ID | Level | Updates |
|---|---|---|---|---|
| Location | All India Pincode Directory | `5c2f62fe-5afa-4119-a499-fec9d604d5bd` | PIN → district | Monthly |
| Location | LGD Villages with PIN | `f17a1608-5f10-4610-bb50-a63c80d83974` | PIN → village | Monthly |
| Nagar | LGD Local Bodies with PIN | `71818d1a-c114-46cb-aa9b-56ed70d4bc4a` | PIN → municipality | Daily |
| Pollution | CPCB Real-time AQI | `3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69` | Station | Hourly |
| School | JJM Schools with Tap Connection | `3f719ae6-c346-46f9-98ff-4add5bdc1881` | Each school (9.6 lakh) | Daily |
| Infra | PMGSY Progress as on date | `d4361151-6d41-43c7-98cd-9a6cd90b5ca4` | District | Daily |
| Schemes | MGNREGA District Glance | `ee03643a-ee4c-48c2-ac30-9f2ff26ab722` | District × month | Monthly |
| Utility | Household Latrine Coverage | `55acc9bf-f002-4e5c-8616-4946973cd815` | District | Daily |
| Hospital | CGHS Wellness Centres | `8eede3a2-1652-49eb-bd7f-48ae3ea7a11e` | Centre (lat/long) | Daily |
| PDS/Prices | Daily Mandi Prices | `9ef84268-d588-465a-a308-a864a43d0070` | Market | Daily |

## Gotchas

- **Filters are case-sensitive.** `Meerut` vs `MEERUT` differ per dataset.
  Use `districtFor(key, name)` from the registry.
- **PMGSY cost fields** say "LAKHS" but values look like crores
  (Meerut: 289 roads = 147.5). Verify before showing money figures.
- **JJM school names** often hold only the village name.
  `school_id` is a JJM ID, not the UDISE code.
- Rajya Sabha datasets are one-off, state-level answers. Skip them for PIN pages.

## Not available on data.gov.in (need another source)

| Domain | Where the real data lives | Access |
|---|---|---|
| RERA projects | State RERA portals (e.g. up-rera.in) | No API; scrape or manual |
| Elections / candidates | results.eci.gov.in, affidavit.eci.gov.in | No API; bulk PDFs/CSV |
| Police / FIR | State police portals; NCRB yearly tables | District-year aggregates only |
| EPFO / FSSAI | Only national/state aggregates on OGD | No per-establishment API |
| CPGRAMS | pgportal.gov.in monthly reports | Ministry-level aggregates only |
| Land records | State Bhulekh portals | No API |
| Hospitals (full) | National Health Facility Registry (ABDM) | Needs ABDM registration |
