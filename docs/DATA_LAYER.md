# JantaX data layer

How official data gets into JantaX, what is real today, and how to connect the next source.

## What is real today

| Data | Status | Where users see it |
|---|---|---|
| **PIN directory** (India Post, 165,521 post offices, 19,486 PINs) | Connected. Committed as a static snapshot, refreshable from data.gov.in | Every PIN lookup: district and state, map centre, "Post offices in this PIN" card, PIN input hints |
| **Air quality** (CPCB real-time feed via data.gov.in) | Connector built and tested. Needs a data.gov.in API key and a hosted API server | "Live: stations nearest your PIN" card on the Air quality module |
| Everything else (schools, works, courts, RTI, MPLADS, wards, RERA, contractors, ration, hospitals, budget, elections, booths, CM claims) | **Sample data.** No connector yet | Each module shows a "Sample data" notice; the PIN dashboard labels its example cards and offline counts |

The snapshot in `public/data/pins/` came from the `india-pincode` npm package (v2.5.9, published 16 Mar 2026), which republishes the India Post directory in the same schema. It is labelled that way on the site. Run the refresh below with an API key to replace it with a copy taken straight from data.gov.in.

## What the review found

Before this change the app looked data-backed but was not:

- **The API server could not start.** Four route files had template literals stripped out (`\ \ School in \, \,`), and the server had 100 type errors.
- **The API was misrouted.** Eleven routers declaring `/` and `/:id` were all mounted at `/api`, so `/api/search` was handled by the locations router and `/api/moderation` by the evidence router. `/api/pincode/:code` crashed on a column that does not exist.
- **The database could not be built from migrations.** The one migration predated about 25 tables in the schema, including the whole provenance layer the sync engine writes to.
- **No real source was connected.** The only connector fed two hard-coded schools. Every module's numbers came from a hash of the PIN (`pinSeed`), and the PIN resolver knew 22 of India's 406 postal prefixes.
- **The site claimed otherwise.** The Sources page showed "Active Sync" for six sources, the Data freshness page showed 446,470 records at 99.8% health, the seed script stamped every source as synced "now", and the banner implied sample data appeared only when the service was down.
- **Sample data named real people.** Three sitting MPs and some 20 officials were attached to invented spending gaps and delays. They are now role labels ("Sample representative A", "CPIO (sample 1)").

All of the above is fixed. See "Follow-ups" for what is still open.

## How the pipeline works

```
source ─ fetch ─ raw copy ─ change check ─ parse ─ validate ─ normalise ─ diff ─ upsert ─ publish
          │        │            │                     │                                 │
   data.gov.in   RawDocument  skip if identical   ValidationResult              Source.status,
   API or file   (+ gz file)  to last good sync   (errors, warnings)            lastSuccessfulSync
```

- **Connectors** live in `server/src/jobs/connectors/`. Each implements `SourceConnector` (`fetch`, `parse`, `validate`, `normalize`, `detectChanges`, `sync`) and carries its provenance (`server/src/jobs/sources.ts`).
- **Sync engine** (`server/src/jobs/syncEngine.ts`) runs the steps above. A failure at any step leaves existing data untouched. Change detection compares with the last *successful* sync, so a failed run never blocks the next one. A missing API key is reported as `not_configured`, not as a broken source.
- **Scheduler** (`server/src/jobs/scheduler.ts`) runs hourly jobs at :10 and everything else at 02:00 IST. It is on when `SYNC_SCHEDULE=on` or `NODE_ENV=production`, never runs two copies of a job, and skips connectors whose config is incomplete.
- **Provenance tables**: `Source` (who publishes it, licence, status), `RawDocument` (every download, its hash and an optional gzipped copy), `ParsedDocument`, `ValidationResult`.
- **Safety rules**: the PIN directory deletes offices only when a download looks complete (at least 100,000 rows and 90% of what is stored); readings older than 30 days are pruned; the data.gov.in key is redacted from every stored URL.

### Data quality rules in the PIN directory connector

- Field names are matched loosely (`officename`, `Office Name` and `office_name` are the same field), so the API and the CSV download both work.
- "NA", blank and "-" are treated as missing. 715 offices are published with district and state "NA": 609 are filled from offices that share their PIN, and 106 are skipped rather than guessed.
- Coordinates outside India's bounding box, or swapped, are dropped (14,617 offices). A PIN's location is the median of its offices, so one mis-geocoded office cannot move it.

### Air quality: how AQI is worked out

The CPCB feed publishes, per station and pollutant, the minimum, maximum and average index value for the latest hour. Following CPCB's National AQI method, a station's AQI is its highest pollutant sub-index, reported only when at least three pollutants have data and one of them is PM2.5 or PM10. Values above 500 cannot be index values, so if the feed ever switches to raw concentrations the connector warns and the API shows "No AQI" instead of a wrong number. Stations more than 100 km from a PIN are not shown as its air quality.

## Runbook

```bash
cp .env.example .env              # set DATABASE_URL; add DATA_GOV_IN_API_KEY for live sources
npx prisma migrate deploy
npm run data -- sources           # connectors, schedules, config problems, last sync
```

**Refresh the PIN directory from data.gov.in** (monthly):

```bash
npm run data -- sync india-post-pincode-directory --dry-run --max 50   # check the key and field names first
npm run data -- sync india-post-pincode-directory
npm run data -- export-pins                                           # rewrite public/data/pins
```

Or from the dataset's CSV download: `npm run data -- sync india-post-pincode-directory --file path/to/directory.csv`, then `export-pins --via "CSV download from data.gov.in, <date>"`.

**Turn on live air quality**: set `DATA_GOV_IN_API_KEY` and `SYNC_SCHEDULE=on` on a hosted API server with Postgres, and point the frontend's `VITE_API_URL` at it. The first run: `npm run data -- sync cpcb-realtime-aqi --dry-run --max 50`.

**Resource ids**: the data.gov.in ids in `server/src/jobs/sources.ts` could not be checked from the build environment (its network blocks government domains). If the dry run returns an error, look up the dataset on data.gov.in and set `PINCODE_DIRECTORY_RESOURCE_ID` or `CPCB_AQI_RESOURCE_ID`.

**Tests**: `npm test` runs the parser, normaliser, AQI, scheduler and API-client tests. `TEST_DATABASE_URL=postgresql://... npm test` also runs the pipeline against a real database (CI does this).

### Adding a connector

1. Add a `SourceDefinition` to `server/src/jobs/sources.ts` (publisher, licence, refresh interval).
2. Write the connector in `server/src/jobs/connectors/`, reusing `lib/ogd.ts`, `lib/csv.ts`, `lib/normalize.ts` and `lib/bulk.ts`. Keep `readRow`, `validate` and `normalize` pure so they can be unit tested.
3. Register it in `server/src/jobs/registry.ts`, add a migration for any new tables, and add a fixture plus tests.
4. Add the module to `LIVE_FEEDS` in `src/ui/modules.tsx` only once real data reaches the page.

## Source matrix

Likely official sources for each module, how they are published, and a rough effort to connect. Terms of use should be checked per source before any scraping.

| Module | Official source | Published as | Effort |
|---|---|---|---|
| PIN directory | India Post, All India Pincode Directory (data.gov.in) | API and CSV | **Done** |
| Air quality | CPCB real-time AQI (data.gov.in) | API, hourly | **Built**, needs key and hosting |
| Roads and works | PMGSY (OMMAS reports; datasets on data.gov.in) | CSV, web reports | Medium |
| Schools | UDISE+ (Ministry of Education) | District and state reports; school-level data on the UDISE+ portal | Medium for district level, hard for school level |
| Public grievances | DARPG CPGRAMS monthly reports | PDF | Medium (PDF tables) |
| MP and MLA funds | MPLADS portal (MoSPI) | Web reports | Medium |
| Budget | Union and state budget documents; Open Budgets India | CSV, PDF | Medium |
| Hospitals | National Health Facility Registry (ABDM), HMIS | Registry and aggregate reports | Medium |
| Power and water | State SLDC and discom reliability data; Jal Jeevan Mission dashboard | Web dashboards, varies by state | Medium to hard |
| RTI | CIC annual reports, RTI Online statistics | PDF | Medium |
| Elections | ECI affidavits and results; ADR/MyNeta | Web, PDF | Medium |
| Ration shops | NFSA and state ePoS portals | Web reports, varies by state | Medium to hard |
| CM claims vs audits | CAG audit reports | PDF, quote with citation | Manual curation |
| Ward services | City open data portals, Swachh Survekshan | Varies by city | Per city |
| Contractors | CPPP and GeM award notices | Web listings | Hard |
| RERA projects | State RERA portals | Per-state sites, often with CAPTCHA | Hard |
| District courts | NJDG | Dashboards, no bulk export | Hard |
| Land records | State land record portals, DILRMP MIS | Per-state, often restricted | Hard |
| Polling booths | Chief Electoral Officer polling station lists | Per-state PDF | Hard |

## Follow-ups

1. **Real company names in sample data.** The infra, RERA and contractor samples use real firms (for example Supertech, Lodha, Brigade, L&T, Wabag) with invented delays and scores. Replace them with sample names before launch, as was done for people.
2. **CM claims** name real Chief Ministers against placeholder sources; verify against CAG reports or replace.
3. **Host the API server** (with Postgres) so live feeds reach users. The Vercel deployment serves only static files today.
4. **Geolocation** still maps a browser location to the nearest of 24 hard-coded PINs; switch it to the directory's PIN centres.
5. **100 PINs** have no office with a published district, so they are missing from the directory until India Post fixes the data.
