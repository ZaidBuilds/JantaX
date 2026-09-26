# Dataset catalog

Generated from `server/src/data/catalog/` by `npm run data -- templates`. Do not edit by hand.

Every dataset can also be loaded from a downloaded file: `npm run data -- sync <id> --file <path>` (CSV, JSON or XLSX, optionally gzipped).
Check a resource id or a file before loading it: `npm run data -- inspect <id> [--file <path>]`.

| Dataset | Module | Level | Access | Setting | Refresh |
|---|---|---|---|---|---|
| [Local Government Directory: districts](#lgd-districts) | geography | district | Download link | `LGD_DISTRICTS_URL` | monthly |
| [Census 2011: district population](#census-2011-districts) | geography | district | data.gov.in API | `OGD_CENSUS_DISTRICTS` | annual |
| [UDISE+: schools, facilities and teachers by district](#udise-district-schools) | school | district | data.gov.in API | `OGD_UDISE_DISTRICT_SCHOOLS` | annual |
| [National Health Portal: hospital directory](#nhp-hospital-directory) | hospital | point | data.gov.in API | `OGD_NHP_HOSPITALS` | monthly |
| [Rural Health Statistics: public health facilities by district](#rhs-district-facilities) | hospital | district | data.gov.in API | `OGD_RHS_DISTRICT` | annual |
| [NFSA: fair price shops and ration cards by district](#nfsa-district-fps) | ration | district | data.gov.in API | `OGD_NFSA_DISTRICT` | monthly |
| [NFSA: foodgrain allocation and offtake by state](#nfsa-state-offtake) | ration | state | data.gov.in API | `OGD_NFSA_OFFTAKE` | monthly |
| [Jal Jeevan Mission: household tap connections by district](#jjm-district-coverage) | utility | district | data.gov.in API | `OGD_JJM_DISTRICT` | monthly |
| [Average hours of power supply by state](#power-supply-hours) | utility | state | data.gov.in API | `OGD_POWER_HOURS` | monthly |
| [PMGSY: rural road works by district](#pmgsy-district-progress) | infra | district | data.gov.in API | `OGD_PMGSY_DISTRICT` | monthly |
| [Contracts awarded on central and state procurement portals](#cppp-awards) | contractor | district | File import | — | event |
| [RERA registered projects](#rera-projects) | rera | pincode | File import | — | event |
| [MPLADS: funds released and spent by state](#mplads-state-funds) | mplads | state | data.gov.in API | `OGD_MPLADS_STATE` | quarterly |
| [MPLADS: recommended and sanctioned works](#mplads-works) | mplads | district | Download link | `MPLADS_WORKS_URL` | monthly |
| [State budgets by sector](#state-budget-sectors) | budget | state | CKAN API | `OBI_STATE_BUDGET_RESOURCE` | annual |
| [Cases pending in district and subordinate courts, by state](#court-pendency-states) | courts | state | data.gov.in API | `OGD_COURT_PENDENCY` | monthly |
| [RTI requests received and handled, by public authority](#rti-returns) | rti | national | data.gov.in API | `OGD_RTI_RETURNS` | annual |
| [CPGRAMS: public grievances by ministry](#cpgrams-ministry-disposal) | grievance | national | data.gov.in API | `OGD_CPGRAMS_MINISTRY` | monthly |
| [Swachh Survekshan: city cleanliness scores](#swachh-survekshan-cities) | nagar | district | data.gov.in API | `OGD_SWACHH_SURVEKSHAN` | annual |
| [Ward-level municipal services](#ward-services) | nagar | pincode | File import | — | event |
| [CAG audit findings by state](#cag-audit-findings) | andhbhakt | state | File import | — | event |
| [Lok Sabha 2024: constituency results](#ge2024-results) | election | state | data.gov.in API | `OGD_GE2024_RESULTS` | event |
| [Candidate affidavits: assets, liabilities and declared cases](#candidate-affidavits) | election | state | File import | — | event |
| [Polling stations](#polling-stations) | booth | pincode | File import | — | event |
| [Digital India Land Records Modernisation: progress by state](#dilrmp-progress) | land | state | data.gov.in API | `OGD_DILRMP_PROGRESS` | quarterly |

## lgd-districts

**Local Government Directory: districts.** Official list of districts with their LGD codes. Links the district spine to the codes other departments use.

- Publisher: Ministry of Panchayati Raj
- Source: https://lgdirectory.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: Local Government Directory (LGD), Ministry of Panchayati Raj.
- Access: Download link, set `LGD_DISTRICTS_URL`
- How to get it: On lgdirectory.gov.in choose Download Directory, then All Districts of India, as CSV. Import the file with --file, or set LGD_DISTRICTS_URL to a stable copy.
- Import template: `data/templates/lgd-districts.csv`
- Row key: `lgdCode` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `lgdCode` | LGD district code | int | yes | district code; district_code; district lgd code; districtcode; lgd code; district_lgd_code |
| `district` | District | text | yes | district name (in english); district_name_english; district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `state` | State | text | yes | state name (in english); state_name_english; state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `stateCode` | LGD state code | int |  | state code; state_code; state lgd code |

## census-2011-districts

**Census 2011: district population.** Population, households, literacy and sex ratio by district. Used to express other figures per person.

- Publisher: Office of the Registrar General and Census Commissioner (Ministry of Home Affairs)
- Source: https://censusindia.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Attribute the publishing ministry or department and data.gov.in, with a link to the dataset.
- Access: data.gov.in API, set `OGD_CENSUS_DISTRICTS`
- How to get it: Find it on data.gov.in: search "district wise population census 2011", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/census-2011-districts.csv`
- Row key: `state`, `district` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text | yes | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `population` | Population | int | yes | total population; total_population; persons; population_total |
| `households` | Households | int |  | no of households; number of households; total households; households_total |
| `literacyRate` | Literacy rate (%) | percent |  | literacy; literacy rate; literacy_rate; literates % |
| `sexRatio` | Sex ratio | int |  | sex ratio; sex_ratio; females per 1000 males |

## udise-district-schools

**UDISE+: schools, facilities and teachers by district.** How many schools each district has, how many have girls' toilets, electricity, drinking water and libraries, and how many teachers and pupils.

- Publisher: Department of School Education and Literacy (Ministry of Education)
- Source: https://udiseplus.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: UDISE+, Ministry of Education.
- Access: data.gov.in API, set `OGD_UDISE_DISTRICT_SCHOOLS`
- How to get it: Find it on data.gov.in: search "UDISE district wise schools facilities", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/udise-district-schools.csv`
- Row key: `state`, `district`, `year`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text | yes | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `year` | Year | text | yes | financial_year; financial year; fy; academic_year; academic year; session; reference_year; yr |
| `totalSchools` | Schools | int | yes | total schools; total_schools; no of schools; number of schools; schools_total |
| `govtSchools` | Government schools | int |  | government schools; govt schools; govt_schools; government |
| `girlsToilet` | With a girls' toilet | int |  | schools with girls toilet; girls toilet; functional girls toilet; girls_toilet |
| `electricity` | With electricity | int |  | schools with electricity; electricity; electricity connection |
| `drinkingWater` | With drinking water | int |  | schools with drinking water; drinking water; drinking_water |
| `library` | With a library | int |  | schools with library; library |
| `teachers` | Teachers | int |  | total teachers; teachers_total; no of teachers |
| `enrolment` | Pupils enrolled | int |  | total enrolment; enrolment; enrollment; total_enrolment |

## nhp-hospital-directory

**National Health Portal: hospital directory.** Public and private hospitals with their category, address, PIN code, location and beds.

- Publisher: National Health Portal (Ministry of Health and Family Welfare)
- Source: https://www.nhp.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: National Health Portal hospital directory, MoHFW.
- Access: data.gov.in API, set `OGD_NHP_HOSPITALS`
- How to get it: Find it on data.gov.in: search "hospital directory national health portal", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/nhp-hospital-directory.csv`
- Row key: `name`, `state`, `address` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `name` | Hospital | text | yes | hospital_name; hospital name; name of hospital; name |
| `category` | Category | text |  | hospital_category; hospital category; category |
| `careType` | Care type | text |  | hospital_care_type; care type; hospital care type |
| `address` | Address | text | yes | address_original_first_line; address; address line 1; address_first_line |
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text |  | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `pincode` | PIN code | pincode |  | pin; pin code; pin_code; pincode |
| `latlng` | Location | text |  | location_coordinates; location coordinates; coordinates; lat_long |
| `telephone` | Telephone | text |  | telephone; phone; contact number; mobile_number |
| `specialties` | Specialties | text |  | specialties; specialities; facilities |
| `beds` | Beds | int |  | total_num_beds; number of beds; total beds; beds |

## rhs-district-facilities

**Rural Health Statistics: public health facilities by district.** Sub-centres, primary and community health centres per district, and how many PHCs lack a doctor.

- Publisher: Ministry of Health and Family Welfare
- Source: https://hmis.mohfw.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: Health Dynamics of India (Rural Health Statistics), MoHFW.
- Access: data.gov.in API, set `OGD_RHS_DISTRICT`
- How to get it: Find it on data.gov.in: search "rural health statistics district wise sub centres PHC CHC", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/rhs-district-facilities.csv`
- Row key: `state`, `district`, `year`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text | yes | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `year` | Year | text | yes | financial_year; financial year; fy; academic_year; academic year; session; reference_year; yr |
| `subCentres` | Sub-centres | int |  | sub centres; sub-centres; subcentres; sc; number of sub centres |
| `phcs` | PHCs | int | yes | primary health centres; phc; phcs; number of phcs |
| `chcs` | CHCs | int |  | community health centres; chc; chcs; number of chcs |
| `doctorsAtPhc` | Doctors at PHCs | int |  | doctors at phcs; doctors in position at phcs; medical officers at phc |
| `phcsWithoutDoctor` | PHCs without a doctor | int |  | phcs without doctor; phcs functioning without doctor |

## nfsa-district-fps

**NFSA: fair price shops and ration cards by district.** Fair price shops, ration cards and beneficiaries covered under the National Food Security Act.

- Publisher: Department of Food and Public Distribution (Ministry of Consumer Affairs, Food and Public Distribution)
- Source: https://nfsa.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: NFSA dashboard, Department of Food and Public Distribution.
- Access: data.gov.in API, set `OGD_NFSA_DISTRICT`
- How to get it: Find it on data.gov.in: search "NFSA district wise fair price shops ration cards", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/nfsa-district-fps.csv`
- Row key: `state`, `district` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text | yes | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `fairPriceShops` | Fair price shops | int | yes | fps; fair price shops; no of fps; number of fair price shops |
| `rationCards` | Ration cards | int |  | ration cards; no of ration cards; total ration cards |
| `beneficiaries` | Beneficiaries | int |  | beneficiaries; no of beneficiaries; persons covered |
| `asOn` | As on | date |  | as_on; as on date; as_on_date; date; updated_on; last_updated; report_date |

## nfsa-state-offtake

**NFSA: foodgrain allocation and offtake by state.** Monthly foodgrain allocated to each state under NFSA and how much was lifted.

- Publisher: Department of Food and Public Distribution
- Source: https://dfpd.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Attribute the publishing ministry or department and data.gov.in, with a link to the dataset.
- Access: data.gov.in API, set `OGD_NFSA_OFFTAKE`
- How to get it: Find it on data.gov.in: search "NFSA allocation offtake state wise", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/nfsa-state-offtake.csv`
- Row key: `state`, `month`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `month` | Month | text | yes | month; period; month_year |
| `allocationTonnes` | Allocated (t) | number |  | allocation; allocation (in tonnes); allocated qty; allocation_mt |
| `offtakeTonnes` | Lifted (t) | number |  | offtake; offtake (in tonnes); lifted qty; offtake_mt |

## jjm-district-coverage

**Jal Jeevan Mission: household tap connections by district.** Rural households and how many have a functional tap connection.

- Publisher: Department of Drinking Water and Sanitation (Ministry of Jal Shakti)
- Source: https://ejalshakti.gov.in/jjmreport/JJMIndia.aspx
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: Jal Jeevan Mission, Ministry of Jal Shakti.
- Access: data.gov.in API, set `OGD_JJM_DISTRICT`
- How to get it: Find it on data.gov.in: search "Jal Jeevan Mission district wise tap connections", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/jjm-district-coverage.csv`
- Row key: `state`, `district` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text | yes | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `households` | Rural households | int | yes | total households; total rural households; households |
| `tapConnections` | With a tap connection | int |  | households with tap connection; tap connections; fhtc; households with fhtc |
| `coveragePct` | Coverage (%) | percent |  | coverage; % coverage; percentage; coverage % |
| `asOn` | As on | date |  | as_on; as on date; as_on_date; date; updated_on; last_updated; report_date |

## power-supply-hours

**Average hours of power supply by state.** Hours of electricity supplied per day in urban and rural areas.

- Publisher: Ministry of Power
- Source: https://powermin.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Attribute the publishing ministry or department and data.gov.in, with a link to the dataset.
- Access: data.gov.in API, set `OGD_POWER_HOURS`
- How to get it: Find it on data.gov.in: search "average hours of power supply rural urban state wise", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/power-supply-hours.csv`
- Row key: `state`, `period`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `period` | Period | text | yes | year; month; period; financial year |
| `urbanHours` | Urban hours a day (h) | number |  | urban; urban hours; urban (hrs); average hours urban |
| `ruralHours` | Rural hours a day (h) | number |  | rural; rural hours; rural (hrs); average hours rural |

## pmgsy-district-progress

**PMGSY: rural road works by district.** Road works and length sanctioned and completed under the Pradhan Mantri Gram Sadak Yojana, with cost and spending.

- Publisher: National Rural Infrastructure Development Agency (Ministry of Rural Development)
- Source: https://omms.nic.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: PMGSY OMMAS, Ministry of Rural Development.
- Access: data.gov.in API, set `OGD_PMGSY_DISTRICT`
- How to get it: Find it on data.gov.in: search "PMGSY district wise road works sanctioned completed", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/pmgsy-district-progress.csv`
- Row key: `state`, `district` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text | yes | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `worksSanctioned` | Works sanctioned | int | yes | no of road works sanctioned; road works sanctioned; works sanctioned; sanctioned works |
| `worksCompleted` | Works completed | int |  | no of road works completed; road works completed; works completed; completed works |
| `lengthSanctionedKm` | Length sanctioned (km) | number |  | length sanctioned (km); road length sanctioned; length sanctioned; sanctioned length |
| `lengthCompletedKm` | Length completed (km) | number |  | length completed (km); road length completed; length completed; completed length |
| `costSanctionedCr` | Cost sanctioned (₹ cr) | number |  | sanctioned cost (rs crore); sanctioned cost; cost sanctioned; value of works sanctioned |
| `expenditureCr` | Spent (₹ cr) | number |  | expenditure (rs crore); expenditure; total expenditure |
| `asOn` | As on | date |  | as_on; as on date; as_on_date; date; updated_on; last_updated; report_date |

## cppp-awards

**Contracts awarded on central and state procurement portals.** Award of contract notices: which contractor won which tender, for how much and when.

- Publisher: Central Public Procurement Portal (NIC) and state e-procurement portals (Department of Expenditure, Ministry of Finance)
- Source: https://eprocure.gov.in/cppp/
- Licence: Public notices; check each portal's terms of use before bulk reuse
- Attribution: Source: award of contract notice on the named procurement portal, with a link to it.
- Access: File import
- How to get it: Download award of contract (AOC) listings from eprocure.gov.in/cppp or the state portal and fill the template, one row per award, with the notice link in sourceUrl.
- Import template: `data/templates/cppp-awards.csv`
- Row key: `tenderId`, `contractor`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `tenderId` | Tender ID | text | yes | tender id; tender_id; tender reference number; tender ref no |
| `title` | Work | text | yes | tender title; title; work description; name of work |
| `organisation` | Awarded by | text | yes | organisation; organisation name; department; org name |
| `contractor` | Contractor | text | yes | contractor; awarded to; bidder name; name of contractor; vendor |
| `awardValue` | Contract value (₹) | number |  | contract value; awarded value; aoc value; value (rs) |
| `awardDate` | Awarded on | date |  | aoc date; award date; date of award; contract date |
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text |  | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `sourceUrl` | Notice | url | yes | source url; link; notice url; url |

## rera-projects

**RERA registered projects.** Housing projects registered with state RERAs: promoter, promised and revised completion dates, and status.

- Publisher: State Real Estate Regulatory Authorities
- Source: https://mohua.gov.in/cms/rera.php
- Licence: Public registers; check each state portal's terms of use before bulk reuse
- Attribution: Source: the named state RERA register, with a link to the project page.
- Access: File import
- How to get it: Export the registered project list from each state RERA portal (for example MahaRERA or UP RERA) and map it to the template. Most portals block automated scraping, so import files by hand.
- Import template: `data/templates/rera-projects.csv`
- Row key: `state`, `registrationNo`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `registrationNo` | Registration no. | text | yes | registration number; rera registration no; reg no; registration_no; rera no |
| `projectName` | Project | text | yes | project name; project_name; name of project |
| `promoter` | Promoter | text | yes | promoter name; promoter; developer |
| `projectType` | Type | text |  | project type; type |
| `units` | Units | int |  | total units; no of units; number of apartments; units |
| `proposedCompletion` | Promised completion | date |  | proposed date of completion; proposed completion date; completion date; original completion date |
| `revisedCompletion` | Revised completion | date |  | revised date of completion; revised completion date; extended completion date |
| `status` | Status | text |  | project status; status |
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text |  | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `pincode` | PIN code | pincode |  | pin; pin code; pin_code; pincode |
| `portalUrl` | Register page | url |  | project url; link; source url; url |

## mplads-state-funds

**MPLADS: funds released and spent by state.** Money released to Members of Parliament's local area development schemes and how much has been spent.

- Publisher: Ministry of Statistics and Programme Implementation
- Source: https://mplads.mospi.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: MPLADS, MoSPI.
- Access: data.gov.in API, set `OGD_MPLADS_STATE`
- How to get it: Find it on data.gov.in: search "MPLADS state wise funds released expenditure", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/mplads-state-funds.csv`
- Row key: `state`, `period`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `period` | Lok Sabha / period | text | yes | lok sabha; period; year; term |
| `releasedCr` | Released (₹ cr) | number | yes | funds released; amount released; released (rs crore); total released |
| `spentCr` | Spent (₹ cr) | number |  | expenditure; amount spent; expenditure incurred; utilised |
| `worksSanctioned` | Works sanctioned | int |  | works sanctioned; no of works sanctioned |
| `worksCompleted` | Works completed | int |  | works completed; no of works completed |

## mplads-works

**MPLADS: recommended and sanctioned works.** Individual works funded under MPLADS, with the MP, constituency, sanctioned amount, spending and status.

- Publisher: Ministry of Statistics and Programme Implementation
- Source: https://mplads.mospi.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: MPLADS works report, MoSPI.
- Access: Download link, set `MPLADS_WORKS_URL`
- How to get it: On the MPLADS portal, export the works report for the constituencies you cover, and import it with --file, or set MPLADS_WORKS_URL to a stable export link.
- Import template: `data/templates/mplads-works.csv`
- Row key: `workId`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `workId` | Work ID | text | yes | work id; work code; work_id; recommendation id |
| `mp` | MP | text |  | mp name; name of mp; member of parliament |
| `constituency` | Constituency | text |  | constituency; pc name; parliamentary constituency |
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text |  | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `work` | Work | text | yes | work name; work description; name of work |
| `sector` | Sector | text |  | sector; work sector; category |
| `sanctioned` | Sanctioned (₹) | number |  | sanctioned amount; amount sanctioned; sanction amount |
| `spent` | Spent (₹) | number |  | expenditure; amount spent; expenditure incurred |
| `status` | Status | text |  | work status; status |
| `sanctionDate` | Sanctioned on | date |  | sanction date; date of sanction |

## state-budget-sectors

**State budgets by sector.** Budget estimates, revised estimates and actual spending by sector for each state.

- Publisher: Open Budgets India (compiled from state budget documents)
- Source: https://openbudgetsindia.org
- Licence: As stated on the Open Budgets India dataset page (typically CC BY 4.0); confirm before publishing
- Attribution: Source: Open Budgets India, from the named state's budget documents.
- Access: CKAN API, set `OBI_STATE_BUDGET_RESOURCE` on https://openbudgetsindia.org
- How to get it: Open Budgets India runs CKAN: open the state budget dataset, open its data table resource and copy the resource id from the URL.
- Import template: `data/templates/state-budget-sectors.csv`
- Row key: `state`, `year`, `sector`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `year` | Year | text | yes | financial_year; financial year; fy; academic_year; academic year; session; reference_year; yr |
| `sector` | Sector | text | yes | sector; major head; department; head of account |
| `budgetEstimateCr` | Budget estimate (₹ cr) | number |  | be; budget estimate; budget estimates |
| `revisedEstimateCr` | Revised estimate (₹ cr) | number |  | re; revised estimate; revised estimates |
| `actualsCr` | Actual spending (₹ cr) | number |  | actuals; actual; accounts |

## court-pendency-states

**Cases pending in district and subordinate courts, by state.** Civil and criminal cases pending, including those pending for more than ten years, from the National Judicial Data Grid.

- Publisher: Department of Justice (Ministry of Law and Justice)
- Source: https://njdg.ecourts.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: National Judicial Data Grid, as published by the Department of Justice.
- Access: data.gov.in API, set `OGD_COURT_PENDENCY`
- How to get it: Find it on data.gov.in: search "pendency of cases district and subordinate courts state wise", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/court-pendency-states.csv`
- Row key: `state` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `civil` | Civil cases pending | int |  | civil; civil cases; pending civil cases |
| `criminal` | Criminal cases pending | int |  | criminal; criminal cases; pending criminal cases |
| `total` | All cases pending | int | yes | total; total pending; total cases; pending cases |
| `over10Years` | Pending over 10 years | int |  | more than 10 years; pending for more than 10 years; over 10 years |
| `asOn` | As on | date |  | as_on; as on date; as_on_date; date; updated_on; last_updated; report_date |

## rti-returns

**RTI requests received and handled, by public authority.** Requests, rejections and appeals reported by ministries and public authorities to the Central Information Commission.

- Publisher: Central Information Commission
- Source: https://cic.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: Central Information Commission annual report.
- Access: data.gov.in API, set `OGD_RTI_RETURNS`
- How to get it: Find it on data.gov.in: search "RTI applications received rejected ministry wise CIC annual report", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/rti-returns.csv`
- Row key: `authority`, `year`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `authority` | Public authority | text | yes | ministry; ministry/department; public authority; name of ministry; department |
| `year` | Year | text | yes | financial_year; financial year; fy; academic_year; academic year; session; reference_year; yr |
| `received` | Requests received | int | yes | requests received; no of requests received; rti applications received; received |
| `rejected` | Rejected | int |  | requests rejected; rejected; no of rejections |
| `firstAppeals` | First appeals | int |  | first appeals; first appeals received; appeals received |

## cpgrams-ministry-disposal

**CPGRAMS: public grievances by ministry.** Grievances received, disposed and pending for each ministry and department, with average disposal time.

- Publisher: Department of Administrative Reforms and Public Grievances
- Source: https://pgportal.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: CPGRAMS, DARPG.
- Access: data.gov.in API, set `OGD_CPGRAMS_MINISTRY`
- How to get it: Find it on data.gov.in: search "CPGRAMS grievances received disposed ministry wise", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/cpgrams-ministry-disposal.csv`
- Row key: `ministry`, `period`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `ministry` | Ministry or department | text | yes | ministry; ministry/department; name of ministry/department; department |
| `period` | Period | text | yes | year; month; period; reporting period |
| `received` | Received | int | yes | received; grievances received; total received |
| `disposed` | Disposed | int |  | disposed; grievances disposed; disposed of |
| `pending` | Pending | int |  | pending; grievances pending; closing balance |
| `avgDays` | Average disposal time (days) | number |  | average disposal time; avg disposal time (days); average days |

## swachh-survekshan-cities

**Swachh Survekshan: city cleanliness scores.** Annual cleanliness survey scores and ranks for cities and towns.

- Publisher: Ministry of Housing and Urban Affairs
- Source: https://ss-portal.sbmurban.org
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: Swachh Survekshan, MoHUA.
- Access: data.gov.in API, set `OGD_SWACHH_SURVEKSHAN`
- How to get it: Find it on data.gov.in: search "Swachh Survekshan city ranking score", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/swachh-survekshan-cities.csv`
- Row key: `state`, `city`, `year`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `city` | City | text | yes | city; city name; ulb name; ulb; name of city |
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `year` | Year | text | yes | financial_year; financial year; fy; academic_year; academic year; session; reference_year; yr |
| `rank` | Rank | int |  | rank; national rank; all india rank |
| `score` | Score | number |  | score; total score; marks obtained |
| `category` | Population category | text |  | population category; category |

## ward-services

**Ward-level municipal services.** Waste collection, streetlights and complaint handling for each ward, as published by city corporations.

- Publisher: Municipal corporations
- Source: https://smartcities.data.gov.in
- Licence: As published by each city; check the city portal's terms
- Attribution: Source: the named municipal corporation's dashboard or open data portal.
- Access: File import
- How to get it: Cities publish ward figures on their own dashboards or on smartcities.data.gov.in. Compile one row per ward into the template.
- Import template: `data/templates/ward-services.csv`
- Row key: `city`, `wardNo`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `city` | City | text | yes | city; ulb; corporation |
| `wardNo` | Ward no. | text | yes | ward no; ward number; ward_no; ward |
| `wardName` | Ward | text |  | ward name; ward_name |
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text |  | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `pincode` | PIN code | pincode |  | pin; pin code; pin_code; pincode |
| `wasteCollectionPct` | Door-to-door waste collection (%) | percent |  | door to door collection %; waste collection; d2d collection |
| `streetlightsWorkingPct` | Streetlights working (%) | percent |  | streetlights working %; functional streetlights |
| `complaintsOpen` | Open complaints | int |  | open complaints; pending complaints |
| `complaintsResolvedPct` | Complaints resolved (%) | percent |  | complaints resolved %; resolution rate |
| `asOn` | As on | date |  | as_on; as on date; as_on_date; date; updated_on; last_updated; report_date |
| `sourceUrl` | Source | url | yes | source url; link; url |

## cag-audit-findings

**CAG audit findings by state.** Findings from Comptroller and Auditor General audit reports, one row per paragraph, each linked to the report.

- Publisher: Comptroller and Auditor General of India
- Source: https://cag.gov.in
- Licence: Public audit reports; quote with citation and link to the report
- Attribution: Source: CAG audit report, with report number, paragraph and link.
- Access: File import
- How to get it: Curated by hand from reports on cag.gov.in: one row per paragraph, quoting the finding and linking the report PDF. Every row needs the report, paragraph and link.
- Import template: `data/templates/cag-audit-findings.csv`
- Row key: `reportId`, `para`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `reportId` | Report | text | yes | report no; report number; report_id |
| `reportTitle` | Report title | text | yes | report title; title |
| `year` | Year | text | yes | financial_year; financial year; fy; academic_year; academic year; session; reference_year; yr |
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `department` | Department | text | yes | department; ministry; audited entity |
| `para` | Paragraph | text | yes | para; para no; paragraph |
| `finding` | Finding | text | yes | finding; observation; summary |
| `amountCr` | Amount involved (₹ cr) | number |  | amount involved; amount (rs crore); money value |
| `sourceUrl` | Report link | url | yes | source url; report url; link; url |

## ge2024-results

**Lok Sabha 2024: constituency results.** Votes for each candidate in each parliamentary constituency in the 2024 general election.

- Publisher: Election Commission of India
- Source: https://results.eci.gov.in
- Licence: Public election results from the Election Commission of India
- Attribution: Source: Election Commission of India.
- Access: data.gov.in API, set `OGD_GE2024_RESULTS`
- How to get it: Find it on data.gov.in: search "general election 2024 constituency wise results", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>. ECI also publishes results files on eci.gov.in; import one with --file.
- Import template: `data/templates/ge2024-results.csv`
- Row key: `state`, `constituency`, `candidate` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `constituency` | Constituency | text | yes | pc name; constituency; parliamentary constituency; pc_name |
| `candidate` | Candidate | text | yes | candidate; candidate name; name of candidate |
| `party` | Party | text |  | party; party name |
| `votes` | Votes | int | yes | total votes; votes; votes polled; evm votes |
| `voteSharePct` | Vote share (%) | percent |  | % of votes; vote share; vote share %; percentage of votes |

## candidate-affidavits

**Candidate affidavits: assets, liabilities and declared cases.** What candidates declared in their nomination affidavits.

- Publisher: Election Commission of India
- Source: https://affidavit.eci.gov.in
- Licence: Public affidavits filed with the ECI; compiled datasets (for example ADR) have their own terms
- Attribution: Source: candidate affidavit filed with the Election Commission of India, with a link to it.
- Access: File import
- How to get it: Compile from affidavits on affidavit.eci.gov.in (one row per candidate, with the affidavit link). If you use a compiled source such as ADR/MyNeta, check its reuse terms first.
- Import template: `data/templates/candidate-affidavits.csv`
- Row key: `state`, `constituency`, `candidate`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `constituency` | Constituency | text | yes | constituency; pc name; ac name |
| `candidate` | Candidate | text | yes | candidate; candidate name |
| `party` | Party | text |  | party |
| `assets` | Declared assets (₹) | number |  | total assets; assets |
| `liabilities` | Declared liabilities (₹) | number |  | liabilities; total liabilities |
| `declaredCases` | Declared criminal cases | int |  | criminal cases; declared criminal cases; cases |
| `sourceUrl` | Affidavit | url | yes | source url; affidavit url; link; url |

## polling-stations

**Polling stations.** Polling stations in each assembly constituency, with their building and location.

- Publisher: Chief Electoral Officers of the states
- Source: https://voters.eci.gov.in
- Licence: Public lists published by each Chief Electoral Officer
- Attribution: Source: polling station list published by the named state's Chief Electoral Officer.
- Access: File import
- How to get it: Each state CEO website publishes polling station lists per assembly constituency (usually PDF or Excel). Convert them to the template and import with --file.
- Import template: `data/templates/polling-stations.csv`
- Row key: `state`, `acNo`, `psNo`

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `district` | District | text | yes | district_name; district name; name of district; name of the district; districtname; dist_name; district_english |
| `acNo` | Assembly constituency no. | int | yes | ac no; ac number; ac_no |
| `acName` | Assembly constituency | text |  | ac name; assembly constituency; ac_name |
| `psNo` | Polling station no. | int | yes | ps no; part no; polling station no; ps_no |
| `psName` | Polling station | text | yes | ps name; polling station name; name of polling station |
| `location` | Building | text |  | location; building; address |
| `pincode` | PIN code | pincode |  | pin; pin code; pin_code; pincode |
| `lat` | Latitude | number |  | latitude; lat |
| `lng` | Longitude | number |  | longitude; long; lng |

## dilrmp-progress

**Digital India Land Records Modernisation: progress by state.** How much of each state's land records, maps and registration have been computerised and linked.

- Publisher: Department of Land Resources (Ministry of Rural Development)
- Source: https://dilrmp.gov.in
- Licence: [Government Open Data License - India (GODL)](https://data.gov.in/government-open-data-license-india)
- Attribution: Source: DILRMP MIS, Department of Land Resources.
- Access: data.gov.in API, set `OGD_DILRMP_PROGRESS`
- How to get it: Find it on data.gov.in: search "DILRMP progress computerisation of land records state wise", open the dataset, choose the API tab and copy the resource id (the UUID in /resource/<id>). Check the columns with: npm run data -- inspect <dataset id>.
- Import template: `data/templates/dilrmp-progress.csv`
- Row key: `state` (each download replaces the previous one)

| Column | Meaning | Type | Required | Also accepted |
|---|---|---|---|---|
| `state` | State | text | yes | state_name; state name; state_ut; state/ut; state / ut; name of state; name of the state; states/uts; state_ut_name; statename; state_english |
| `recordsComputerisedPct` | Records computerised (%) | percent | yes | computerisation of land records; record of rights computerised; ror computerised % |
| `mapsDigitisedPct` | Maps digitised (%) | percent |  | digitization of cadastral maps; cadastral maps digitised %; maps digitised |
| `registrationLinkedPct` | Registration linked (%) | percent |  | integration of registration; registration integrated %; sro integrated |
| `asOn` | As on | date |  | as_on; as on date; as_on_date; date; updated_on; last_updated; report_date |
