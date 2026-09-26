# Going live with real data

Everything that moves government data into JantaX is built and tested: 27 sources, the sync engine, the API, and the screens that show it. What is left is what only you can do: create accounts, fill in keys and dataset ids, choose hosting, and import the registers that have no feed. This page lists all of it in order.

Each step names the command that proves it worked. Nothing is switched on until its setting is filled in, and a dataset that is not switched on shows "Not connected yet" on the site. It never shows invented figures.

## 1. Accounts and keys (about 15 minutes)

| What | Where | Setting |
|---|---|---|
| data.gov.in API key (free) | data.gov.in → sign in → My Account → API key | `DATA_GOV_IN_API_KEY` |
| Postgres 16 database | Render (in `render.yaml`), Neon, Supabase or any managed Postgres | `DATABASE_URL` |
| API hosting | Render web service from `Dockerfile.api` (blueprint: `render.yaml`), or Railway / Fly / any Docker host | — |
| Frontend hosting | Vercel (`vercel.json`, already used) | `VITE_API_URL` = the API's public URL |
| Login secret | Generate 32+ random characters (Render does this for you) | `JWT_SECRET` |

## 2. Deploy

**API** (Render): New → Blueprint → pick this repo. It creates the database and the `jantax-api` service, generates `JWT_SECRET` and asks for `DATA_GOV_IN_API_KEY`. The container applies migrations on every start. Check: `https://<api>/health` returns `healthy`.

Any other Docker host:

```bash
docker build -f Dockerfile.api -t jantax-api .
docker run -p 4000:4000 -e DATABASE_URL=... -e JWT_SECRET=... -e DATA_GOV_IN_API_KEY=... jantax-api
```

**Frontend** (Vercel): set `VITE_API_URL` to the API URL and redeploy. Check: open `/transparency/freshness`. It should say "Status as of …, read from the JantaX data service" instead of "isn't reachable".

**Refresh schedule**: choose one:

- `SYNC_SCHEDULE=on` on the API server (the default in production). It works when the server runs all the time; free plans that sleep will miss runs.
- GitHub Actions `Data sync` workflow (`.github/workflows/data-sync.yml`). Add repository secrets `DATABASE_URL` and `DATA_GOV_IN_API_KEY`, plus a repository variable for each dataset setting you fill in (step 4). It runs hourly and syncs only what is due. If you use it, set `SYNC_SCHEDULE=off` on the server. Scheduled workflows run from the default branch only, so this starts after the PR is merged.

## 3. Load the geography spine first (one time)

Every dataset is matched to districts through the PIN directory, so load it before anything else. Run these from a machine with the repo and `DATABASE_URL` pointing at production, or from the workflow's "Run workflow" button with the dataset id.

```bash
npx prisma migrate deploy
npm run data -- sync india-post-pincode-directory      # 165k post offices → 19.5k PINs → ~745 districts
npm run data -- sync lgd-districts --file lgd.csv      # official district codes (download in step 4)
npm run data -- sync census-2011-districts             # needs OGD_CENSUS_DISTRICTS
npm run data -- export-pins                            # optional: refresh the static PIN files in public/data/pins
```

Check: `npm run data -- datasets --module geography` shows both as `[live]`, and the LGD step logs how many districts it linked. Districts it could not match are listed by name rather than guessed.

## 4. Switch on each dataset

For every dataset, one command tells you what it still needs:

```bash
npm run data -- datasets                 # state, rows, last sync and what is missing, for all 25
```

### 4a. data.gov.in datasets (16): fill in a resource id

Resource ids change when ministries re-publish, so they are settings rather than hard-coded values. For each one:

1. Search data.gov.in with the phrase in the table, open the best match (latest year, widest coverage) and copy the UUID from its API tab.
2. Put it in `.env`, or set it as a variable in your host / workflow.
3. Check the columns before storing anything: `npm run data -- inspect <dataset id>`. It prints which column feeds which field, which required fields are missing and a sample of resolved rows. If a column has an unexpected name, add it to that field's `from` list in `server/src/data/catalog/` and run `npm run data -- templates`.
4. Load it: `npm run data -- sync <dataset id>`.

| Setting | Dataset id | Search data.gov.in for |
|---|---|---|
| `OGD_CENSUS_DISTRICTS` | census-2011-districts | district wise population census 2011 |
| `OGD_UDISE_DISTRICT_SCHOOLS` | udise-district-schools | UDISE district wise schools facilities |
| `OGD_NHP_HOSPITALS` | nhp-hospital-directory | hospital directory national health portal |
| `OGD_RHS_DISTRICT` | rhs-district-facilities | rural health statistics district wise sub centres PHC CHC |
| `OGD_NFSA_DISTRICT` | nfsa-district-fps | NFSA district wise fair price shops ration cards |
| `OGD_NFSA_OFFTAKE` | nfsa-state-offtake | NFSA allocation offtake state wise |
| `OGD_JJM_DISTRICT` | jjm-district-coverage | Jal Jeevan Mission district wise tap connections |
| `OGD_POWER_HOURS` | power-supply-hours | average hours of power supply rural urban state wise |
| `OGD_PMGSY_DISTRICT` | pmgsy-district-progress | PMGSY district wise road works sanctioned completed |
| `OGD_MPLADS_STATE` | mplads-state-funds | MPLADS state wise funds released expenditure |
| `OGD_COURT_PENDENCY` | court-pendency-states | pendency of cases district and subordinate courts state wise |
| `OGD_RTI_RETURNS` | rti-returns | RTI applications received rejected ministry wise CIC annual report |
| `OGD_CPGRAMS_MINISTRY` | cpgrams-ministry-disposal | CPGRAMS grievances received disposed ministry wise |
| `OGD_SWACHH_SURVEKSHAN` | swachh-survekshan-cities | Swachh Survekshan city ranking score |
| `OGD_GE2024_RESULTS` | ge2024-results | general election 2024 constituency wise results |
| `OGD_DILRMP_PROGRESS` | dilrmp-progress | DILRMP progress computerisation of land records state wise |

A dataset published as one file per year or per state can also be loaded from its CSV/XLSX download: `npm run data -- sync <id> --file <path>`.

### 4b. Other portals (3)

| Setting | Dataset id | How |
|---|---|---|
| `LGD_DISTRICTS_URL` | lgd-districts | lgdirectory.gov.in → Download Directory → All Districts of India (CSV). The site has no stable link, so import the file with `--file` (step 3). |
| `OBI_STATE_BUDGET_RESOURCE` | state-budget-sectors | openbudgetsindia.org runs CKAN. Open a state budget dataset → its data table → copy the resource id from the URL. |
| `MPLADS_WORKS_URL` | mplads-works | mplads.mospi.gov.in works report export (XLSX). Import with `--file`, or set a stable export link. |

### 4c. File imports (6): registers with no feed

These portals publish lists and PDFs but no API, and several block automated access. Compile the file from the template, then import it. Every row carries its own source link, so each figure stays traceable.

| Dataset id | Template | Source |
|---|---|---|
| cppp-awards | `data/templates/cppp-awards.csv` | eprocure.gov.in award of contract listings, state e-procurement portals |
| rera-projects | `data/templates/rera-projects.csv` | State RERA registers (MahaRERA, UP RERA, …) |
| ward-services | `data/templates/ward-services.csv` | City dashboards, smartcities.data.gov.in |
| cag-audit-findings | `data/templates/cag-audit-findings.csv` | cag.gov.in audit reports, one row per paragraph |
| candidate-affidavits | `data/templates/candidate-affidavits.csv` | affidavit.eci.gov.in (check reuse terms of any compiled source) |
| polling-stations | `data/templates/polling-stations.csv` | State Chief Electoral Officer polling station lists |

Import from the command line (`npm run data -- sync <id> --file file.csv`) or from the browser as an admin:

```bash
npm run data -- set-role you@example.com ADMIN    # after registering in the app; then sign in again
curl -X POST "https://<api>/api/admin/data/cppp-awards/import?dryRun=1" \
  -H "Authorization: Bearer <token>" -H "Content-Type: text/csv" --data-binary @awards.csv   # check the mapping
curl -X POST "https://<api>/api/admin/data/cppp-awards/import" \
  -H "Authorization: Bearer <token>" -H "Content-Type: text/csv" --data-binary @awards.csv   # load it
```

Column names are matched loosely (case, spaces and punctuation are ignored, and common alternatives are accepted). Title rows above the header and footnotes below the table are skipped, and dates in Indian formats are read. The full column list for every dataset is in [DATASETS.md](DATASETS.md).

## 5. Check it end to end

```bash
npm run data -- datasets                       # every dataset: [live] / [needs-setting] / [needs-file] / [failing]
curl https://<api>/api/data/catalog            # the same, as the site sees it
curl https://<api>/api/area/110001             # everything known for one PIN
```

On the site:

- **Module screens** show "Official data connected" with the dataset names, and an "Official records" panel with each table, its geography (PIN, district, state or all India), the publisher, fetch date and licence.
- **PIN dashboard** shows "Official figures for this area".
- **Data freshness** and **Monitoring** show each source's state, row count and the last error.

## What happens when things go wrong

- **A download fails or looks wrong**: the previous data stays published. The dataset shows "Last refresh failed" with the reason on Data freshness and Monitoring.
- **A required column disappears**: the whole file is rejected, and the error names the missing field and lists the columns the file does have.
- **A snapshot is much smaller than the last one** (a partial download): new rows are added but nothing is deleted.
- **District names change between releases** ("Gurgaon" → "Gurugram", "Paschim Medinipur" → "Medinipur West"): rows are keyed on the resolved district, so they update in place instead of duplicating.
- **The API is down**: the site says so and shows only its labelled sample figures.

## Sources that need more than a setting

These are real limits, not missing work. Each needs a decision from you.

- **School-level UDISE+, NJDG case-level data, state land records**: no bulk export. They need a data-sharing request to the department, or permission to scrape under the portal's terms.
- **RERA portals and CPPP**: often protected by CAPTCHAs. Stick to hand-compiled imports unless you have written permission.
- **ADR/MyNeta affidavit compilations**: have their own licence. Use ECI affidavits directly, or get ADR's permission.
