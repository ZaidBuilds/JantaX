# JantaX data layer

How official data gets into JantaX, what is real today, and how to connect the next source.

## What is real today

| Data | Status | Where users see it |
|---|---|---|
| **PIN directory** (India Post, 165,521 post offices, 19,486 PINs) | Connected. Committed as a static snapshot, refreshable from data.gov.in. Also builds the district spine (745 districts) | Every PIN lookup: district and state, map centre, "Post offices in this PIN" card, PIN input hints, and "use my location", which finds the PIN with the nearest centre from the static files alone |
| **Air quality** (CPCB real-time feed via data.gov.in) | Connector built and tested. Needs a data.gov.in API key and a hosted API server | "Live: stations nearest your PIN" card on the Air quality module |
| **25 catalogued datasets** covering all 17 other modules (see [DATASETS.md](DATASETS.md)) | Built and tested end to end. Each switches on with one setting (16 data.gov.in resource ids, 1 CKAN id, 2 download links) or a file import (6 registers with no feed) | "Official records" panel on each module screen, "Official figures for this area" on the PIN dashboard, live status on Data sources, Data freshness and Monitoring |
| Module dashboards below the "Official records" panel | **Sample data**, labelled as such | Each module's banner says which official datasets are connected and that the other figures are samples |

**To go live, follow [GO_LIVE.md](GO_LIVE.md)**: the keys, ids, hosting and imports only you can provide, in order.

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
- Coordinates that cannot belong to the office's own state are dropped (3,600 offices), checked against a table of state and UT extents (`server/src/jobs/lib/stateBounds.ts`). For example, Vadodara offices are published at latitude 15.59, near Goa, and Bihar's Aurangabad offices at Aurangabad, Maharashtra.
- Placeholder points, meaning one coordinate given to offices in three or more districts, are dropped (3,130 offices). For example, 12.1668, 77.1066 is used for offices in Uttar Pradesh, Nagaland and Bihar.
- A PIN centre more than 250 km from the middle of its district's other PINs is dropped (57 PINs).
- Result: 274 of 19,486 PINs have no location (previously 26). Before this cleaning, 248 of them were placed in the wrong part of the country, including every Azamgarh (UP) PIN placed in Karnataka, and 1,662 more were pulled off-centre.
- Known limit: a district where about half the offices are wrong but still inside the right state can keep some wrong centres, because no independent district location is available to arbitrate. Mainpuri, UP is an example, with several PINs placed near Lalitpur.

### Air quality: how AQI is worked out

The CPCB feed publishes, per station and pollutant, the minimum, maximum and average index value for the latest hour. Following CPCB's National AQI method, a station's AQI is its highest pollutant sub-index, reported only when at least three pollutants have data and one of them is PM2.5 or PM10. Values above 500 cannot be index values, so if the feed ever switches to raw concentrations the connector warns and the API shows "No AQI" instead of a wrong number. Stations more than 100 km from a PIN are not shown as its air quality.

## The dataset catalog

Most government data arrives as a table with a state, a district, a period and some figures. Rather than a connector per source, each dataset is described once, in `server/src/data/catalog/`, as a `DatasetSpec`:

- **Where it comes from**: `access` (data.gov.in resource, CKAN resource, download link or file import), plus publisher, licence, attribution and refresh schedule.
- **What its columns are**: `fields`, each with a type (int, number, percent, date, pincode, url, …) and the column names it is published under.
- **What identifies a row**: `key`, **where it is**: `geo`, and **how the screen lists it**: `show`.

One generic connector (`server/src/data/datasetConnector.ts`) runs every spec through the same sync engine:

```
download ─ decode ─ match columns ─ convert values ─ resolve place ─ key ─ diff ─ DatasetRecord
 API/CSV/   (CSV, JSON,  (case- and     (Indian number   (state → district    (on resolved
 XLSX/file   XLSX; skips  punctuation-   and date         → PIN, via the       place, so
             title rows)  insensitive)   formats)         spine)               respellings update)
```

- **Geography spine** (`server/src/data/geography.ts`, `districts.ts`): districts are built from the PIN directory. Names from other datasets are matched exactly, then through stored aliases (for example LGD spellings), then with word order ignored ("24 Paraganas North" = "North 24 Parganas", "Paschim" = "West"), then by one unambiguous near-spelling within the state. Renamed districts (Gurgaon → Gurugram, Allahabad → Prayagraj) are built in. Anything else stays at state level rather than being guessed. The LGD dataset attaches official district codes and records its spellings as aliases.
- **Storage**: one `DatasetRecord` table (dataset, key, state, district, PIN, coordinates, period, typed `data`), indexed by dataset and place.
- **Validation**: a file missing a required column is rejected outright, with the columns it does have. Rows missing a key field are dropped and counted. A geography match rate below 90% is reported. A snapshot less than 80% of the previous one never deletes rows.
- **API** (`server/src/routes/data.ts`):
  - `GET /api/data/catalog` returns every dataset and feed: state, rows, last sync, last error, and what is missing.
  - `GET /api/data/:id?pin=|district=|state=` returns rows at the closest level the data offers (PIN, then district, then state, then national), with publisher, licence and fetch date.
  - `GET /api/area/:pin[?module=]` returns everything for one PIN.
  - `POST /api/admin/data/:id/import` lets an admin upload a file, with `?dryRun=1` to check the mapping first.

### Adding a dataset

1. Add a spec to the right file in `server/src/data/catalog/` (copy a similar one). Put the setting name in `access`, and describe how to find the resource in `find`.
2. Run `npm run data -- templates` to write its import template and update `docs/DATASETS.md`, and add the setting to `.env.example` and `.github/workflows/data-sync.yml`. The tests fail until all three agree.
3. Check a real download: `npm run data -- inspect <id> [--file <path>]`.
4. The module screen picks it up automatically. There is no UI change.

## Runbook

```bash
cp .env.example .env              # set DATABASE_URL; add DATA_GOV_IN_API_KEY and dataset settings
npx prisma migrate deploy
npm run data -- sources           # the PIN directory and air quality connectors
npm run data -- datasets          # every catalogued dataset: state, rows, what is missing
npm run data -- inspect <id>      # fetch (or --file) and show how the columns map, without storing
npm run data -- sync <id>         # load one source (--file, --force, --dry-run, --max N)
npm run data -- sync-all --due    # load everything configured whose schedule says it is due
npm run data -- templates --check # import templates and DATASETS.md match the catalog (CI runs this)
npm run data -- set-role <email> ADMIN
```

**Refresh the PIN directory from data.gov.in** (monthly):

```bash
npm run data -- sync india-post-pincode-directory --dry-run --max 50   # check the key and field names first
npm run data -- sync india-post-pincode-directory                     # also rebuilds the district spine
npm run data -- export-pins                                           # rewrite public/data/pins
```

Or from the dataset's CSV download: `npm run data -- sync india-post-pincode-directory --file path/to/directory.csv`, then `export-pins --via "CSV download from data.gov.in, <date>"`.

**Resource ids**: none of the data.gov.in ids could be checked from the build environment, whose network blocks government domains. The PIN directory and air quality ids are defaults that can be overridden (`PINCODE_DIRECTORY_RESOURCE_ID`, `CPCB_AQI_RESOURCE_ID`). Catalogued datasets have no default: you fill in each id after checking it with `inspect`.

**Tests**: `npm test` runs parser, geography, field, decoding, catalog-consistency and formatting tests. `TEST_DATABASE_URL=postgresql://... npm test` also runs both connectors, a catalogued dataset, the data API and the admin import against a real database (CI does this).

## Source matrix

Likely official sources for each module, how they are published, and a rough effort to connect. Terms of use should be checked per source before any scraping.

| Module | Official source | Published as | Effort |
|---|---|---|---|
| PIN directory | India Post, All India Pincode Directory (data.gov.in) | API and CSV | **Done** |
| Air quality | CPCB real-time AQI (data.gov.in) | API, hourly | **Built**, needs key and hosting |
| All modules below | See the catalog: [DATASETS.md](DATASETS.md) | | **Catalogued**: each needs its setting or import ([GO_LIVE.md](GO_LIVE.md)) |
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
3. **Host the API server** (with Postgres) so live feeds reach users: `Dockerfile.api` and `render.yaml` are ready, see [GO_LIVE.md](GO_LIVE.md).
4. **100 PINs** have no office with a published district, so they are missing from the directory until India Post fixes the data.
