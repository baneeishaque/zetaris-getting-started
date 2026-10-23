# [Eurostat database analysis, dossier, and Angular CRUD application] (v1)

## Rule Compliance Reference

- Agent Planning Rule — plan before action, maximum
  literal detail, versioning, task synchronization, and approval gates.
- Markdown Generation Skill — 120-character lines,
  fenced code languages, aligned tables, and lint verification.
- Markdown Generation Rules Additions —
  MD013 handling, fence hygiene, and lint-fix order.
- Planning Artifact Naming —
  session-scoped artifact names and local-only status.
- Markdown Lint Workflow — fix-then-audit
  sequence for generated Markdown.
- Repository operating rules — connect first, preflight, dry-run, verify, and keep credentials out
  of reports.
- Contributing conventions — source packages, documentation placement, and license checks.
- Connection guide and client setup — REST and SQL
  helper contracts.
- Lightning SQL companion — JSON-stat decode technique and confirmed
  platform limits.
- Project paths — keep platform credentials server-side and out of browser code.
- REST cookbook and source catalog
  — onboarding and verification conventions.

## Change History

| Timestamp | Summary of Changes | Rationale |
| :--- | :--- | :--- |
| `[2026-10-23 19:20]` | Initial plan after repository, source, Zetaris, and tooling recon; four user decisions locked. | First version; no prior plan exists. |

## User Questions & Answers

- **Q1 — Where should the Eurostat dossier live?**
  - **A:** `docs/data-sources/eurostat/`. Durable reference material belongs under `docs/`; `open_data/` remains the
    owner of the onboarding SQL and catalog rows.
- **Q2 — Which read/persistence architecture should the app use?**
  - **A:** Pure Angular plus `localStorage`. Angular calls the public Eurostat REST API directly (CORS is open) and
    persists saved-series records in the browser. No BFF, no SQLite, and no Zetaris key in the app.
  - **Follow-up — What happens to the onboarded `EUROSTAT_REST` database?**
    - **A:** It remains the SQL access path and the subject of the dossier. The app does not use it. The separation is
      documented so readers do not assume the app and the Zetaris objects share a runtime.
- **Q3 — What should users create, update, and delete, given Eurostat observations are read-only?**
  - **A:** Saved series plus notes. Each record stores a name, a note, a country/sex filter pair, and timestamps.
    Observations remain read-only.
- **Q4 — Where should the Angular app live?**
  - **A:** `examples/eurostat-crud/`, matching the existing `examples/pudl-chart/` convention.
- **Q5 — Does this plan modify the live Zetaris database or the onboarding SQL?**
  - **A:** No. The plan documents the current state, including drift in the 2026-09-19 script comments. Any live
    change is a separate, explicitly approved task.

## 1. Executive Summary

This plan delivers two artifacts and one integration pass:

1. A verified, eight-document Eurostat data-source dossier under `docs/data-sources/eurostat/`. It records the live
   source shape, the registered Zetaris objects, coverage and quality limits, operating procedures, and licensing.
2. A standalone Angular 22.2.4 application under `examples/eurostat-crud/`. It reads unemployment observations from
   the public Eurostat API and provides create, read, update, and delete operations for locally saved series records.
3. Discoverability edits: root README map, the REST source catalog's Eurostat license row, and a lint configuration
   for the new Markdown.

No implementation file is created or modified until the approval gate in §12 is passed. No commit or push is part of
this plan.

## 2. Starting Point and Primary Goal

The user's original request, carried forward verbatim in intent:

- Analyse the Eurostat database.
- Create a maximum-detail, structured document in the correct folder structure using industry-standard names.
- Create a simple Angular CRUD application using the Eurostat database REST interface.
- Plan first, following the agent planning rules, and wait for approval before implementation.

The primary goal remains the dossier plus the Angular CRUD application. Documentation corrections and repository
integration are supporting actions, not replacements for that goal.

## 3. Pre-Plan Findings (Verified)

### 3.1 Repository state

- Working tree: `$ZETARIS_REPO`.
- Branch: `main`; HEAD: `6a2fbaa Add a permissions guide and publish it on the site (#35)`.
- Pre-existing working-tree state, not created by this task:
  - `M .env.example`
  - `?? key.txt`
- Existing planning directory: `docs/plans/` (tracked), with `docs/plans/archive/` and `docs/plans/recipes/`.
- No `docs/data-sources/` directory exists.
- No `examples/eurostat-crud/` directory exists.
- No `.vscode/settings.json` exists at the repository root.
- No root `.markdownlint-cli2.jsonc` or `.markdownlint.jsonc` exists.
- Root `.gitignore` already ignores `node_modules/`, `dist/`, and `.env.local`.
- The generated Angular `.gitignore` will cover `/.angular/cache`, `/dist`, and `/node_modules`.

### 3.2 Live Eurostat source

- Dataset: `une_rt_m` — "Unemployment by sex and age - monthly data".
- Source agency: `ESTAT`.
- Dataset JSON-stat version: `2.0`.
- Data structure: `UNE_RT_M`, agency `ESTAT`, version `156.0`.
- DOI: `10.2908/UNE_RT_M`.
- Source timestamp: `2026-10-21T11:00:00+0200`.
- Full dataset observation count: `757828` (from `OBS_COUNT`).
- Overall period range: `1983-01` to `2026-09` (from `OBS_PERIOD_OVERALL_OLDEST` and
  `OBS_PERIOD_OVERALL_LATEST`).
- Registered slice: Poland, total sex, total age, percentage of active population, seasonally adjusted.
- Registered slice observations: 356; first `1997-01` (11.8), last `2026-08` (3.4).
- 2026-09 exists as a time category but has no value.
- No-data positions for the registered slice: 169, specifically indices `0`–`167` and `524`.
- Status flags for the registered slice: `2009-01` = `b` (break in time series), `2009-12` = `d`
  (definition differs).
- CORS: open (`Access-Control-Allow-Origin: *`).
- Invalid dimension codes do not produce an HTTP error; they produce an empty category and an empty value object.

Exact endpoint used for the registered slice:

```text
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA
```

### 3.3 Coverage of the app's country/sex allowlist

The app will offer five countries and three sex codes. Counts are identical across the three sex codes for each
country. Values verified on 2026-10-23:

| Country | Sex codes | Values | First period | Last period | Missing positions |
| :--- | :--- | ---: | :--- | :--- | ---: |
| Poland (PL) | T, M, F | 356 | 1997-01 | 2026-08 | 169 |
| Germany (DE) | T, M, F | 428 | 1991-01 | 2026-08 | 97 |
| France (FR) | T, M, F | 524 | 1983-01 | 2026-08 | 1 |
| Spain (ES) | T, M, F | 485 | 1986-04 | 2026-08 | 40 |
| Italy (IT) | T, M, F | 524 | 1983-01 | 2026-08 | 1 |

Status flags by country (sex `T`; the same positions apply to `M` and `F`):

| Country | Status positions |
| :--- | :--- |
| PL | `2009-01` = b; `2009-12` = d |
| DE | `2005-03` = d; `2009-01` = b |
| FR | `1995-12` = d; `2003-01` = b; `2021-01` = d |
| ES | `1995-12` = d |
| IT | `1983-01` through `1991-12` = p (provisional); `2004-01` = b |

### 3.4 Registered Zetaris objects

- Lightning database: `EUROSTAT_REST` (id 917).
- SchemaStore container: `eurostat`.
- REST table: `EUROSTAT_REST.une_rt_m_pl`.
- Views:
  - `eurostat.une_rt_m_pl_metadata_table`
  - `eurostat.une_rt_m_pl_snapshot_table`
  - `eurostat.une_rt_m_pl_series_table`

Verified shapes:

- `EUROSTAT_REST.une_rt_m_pl` has 11 top-level fields: `class`, `dimension`, `extension`, `id`, `label`, `size`,
  `source`, `status`, `updated`, `value`, `version`.
- `une_rt_m_pl_metadata_table` columns: `dataset_label` (string), `dataset_source` (string), `last_updated` (string),
  `geo_labels` (struct with `PL`), `time_index_map` (struct with one `bigint` per time category, including
  `2026-09`).
- `une_rt_m_pl_snapshot_table` columns: `rate_1997_01`, `rate_2025_07`, `rate_2026_07` — exactly three columns. It is
  a low-risk spot-check view, not a full wide-format snapshot.
- `une_rt_m_pl_series_table` columns: `period` (string), `unemployment_rate_pct` (double); 356 rows.

Verification result on 2026-10-23:

- Series-view rows: 356.
- Source value keys for PL/T/TOTAL/PC_ACT/SA: 356.
- Distinct periods: 356.
- First/last: `1997-01` / `2026-08`.

### 3.5 Documentation drift found during recon

The onboarding scripts are historical records dated 2026-09-19. They are not edited by this plan.

- `07_eurostat_create.sql` says 355 rows through `2026-07`; the live source now has 356 rows through `2026-08`.
- The script says `2026-08` was not published as of 2026-09-19; it is published now. `2026-09` is the new empty
  position.
- `07_eurostat_select.sql` examples 2 and 3 use the three-column snapshot view and therefore end at `2026-07`.
  The full `une_rt_m_pl_series_table` ends at `2026-08`.
- The `une_rt_m_pl_snapshot_table` name can be misread as a full wide table. It is a three-column spot check.

The dossier will state the current verified state and label the script values as the 2026-09-19 baseline.

### 3.6 Tooling

- `mise` is available. Installed Node versions: `18.20.8` and `26.10.0`. No global default is set.
- Angular CLI `22.2.4` requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`. Node `26.10.0` satisfies this.
- The app will be scaffolded with `mise x node@26 -- npx --yes @angular/cli@22.2.4`.
- Angular 22 defaults confirmed by a dry scaffold: standalone components, strict TypeScript, Vitest, `app.ts`,
  `app.config.ts`, `app.routes.ts`, `app.html`, `app.css`, and `app.spec.ts`.
- `markdownlint-cli2` is available at `markdownlint-cli2`.
- Python 3 and the repository's `scripts/preflight.py`, `scripts/run_sql.py`, and `scripts/onboard.py` are available.

### 3.7 Planning artifact identity

- Session ID: `local-session`.
- Filename session segment: `local-session` (the `ses_` prefix is omitted).
- Session name slug: `eurostat-data-dossier-and-angular-crud` (the session title is null, so the slug is derived from
  this goal).
- Plan: `docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_implementation-plan_v1.md`.
- Task: `docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_task.md`.
- Both paths are excluded locally through `.git/info/exclude`; they must never be committed.

## 4. Scope

### 4.1 In scope

- Live-source analysis of `une_rt_m` for the registered PL slice and the app's five-country allowlist.
- Eight Markdown documents under `docs/data-sources/eurostat/`.
- One Angular 22.2.4 application under `examples/eurostat-crud/`.
- App features:
  - List saved series.
  - Create a saved series with name, note, country, and sex.
  - Read a saved series with a chart and observation table.
  - Update a saved series.
  - Delete a saved series with an in-page confirmation.
  - Persist records in `localStorage`.
  - Fetch observations from the public Eurostat API.
- Root README map update, REST catalog license/dossier link update, and `.markdownlint-cli2.jsonc` creation.
- Verification: Markdown lint, Angular build, Angular unit tests, live-source fetch, and a browser smoke test.

### 4.2 Out of scope

- Editing the live Zetaris database, the REST table, views, or onboarding SQL.
- Fixing the three-column snapshot view or adding `2026-08` to it.
- A Node/Express BFF, SQLite, server-side persistence, authentication, or multi-user sync.
- Using `ZETARIS_API_KEY` in the app or browser.
- Publishing the dossier through `website/build.mjs`.
- Committing or pushing any change.
- Creating a walkthrough or commit preview. Those follow only if the user requests execution and later asks for them.

### 4.3 Locked decisions

| Decision | Locked value |
| :--- | :--- |
| Dossier location | `docs/data-sources/eurostat/` |
| App location | `examples/eurostat-crud/` |
| App framework | Angular 22.2.4, standalone, strict, zoneless, Vitest |
| App read path | Public Eurostat REST API |
| App persistence | Browser `localStorage` |
| CRUD entity | Saved series plus notes |
| Observation editability | Read-only |
| Country allowlist | PL, DE, FR, ES, IT |
| Sex allowlist | T, M, F |
| Fixed dimensions | `freq=M`, `age=TOTAL`, `unit=PC_ACT`, `s_adj=SA` |
| Server/BFF | None |
| Zetaris key in app | None |
| Commit/push | None |

## 5. Target File Map

All paths are absolute. `NEW` means create; `MOD` means modify in place.

### 5.1 Planning artifacts (local-only, never committed)

```text
$ZETARIS_REPO/docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_implementation-plan_v1.md  NEW
$ZETARIS_REPO/docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_task.md  NEW
```

### 5.2 Eurostat dossier (committed content)

```text
$ZETARIS_REPO/docs/data-sources/eurostat/README.md  NEW
$ZETARIS_REPO/docs/data-sources/eurostat/dataset-profile.md  NEW
$ZETARIS_REPO/docs/data-sources/eurostat/data-dictionary.md  NEW
$ZETARIS_REPO/docs/data-sources/eurostat/api-reference.md  NEW
$ZETARIS_REPO/docs/data-sources/eurostat/zetaris-integration.md  NEW
$ZETARIS_REPO/docs/data-sources/eurostat/data-quality.md  NEW
$ZETARIS_REPO/docs/data-sources/eurostat/operations-runbook.md  NEW
$ZETARIS_REPO/docs/data-sources/eurostat/license-and-attribution.md  NEW
```

### 5.3 Angular application (committed content)

```text
$ZETARIS_REPO/examples/eurostat-crud/README.md  NEW (replaces generated README)
$ZETARIS_REPO/examples/eurostat-crud/angular.json  NEW (generated, then reviewed)
$ZETARIS_REPO/examples/eurostat-crud/package.json  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/package-lock.json  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/tsconfig.json  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/tsconfig.app.json  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/tsconfig.spec.json  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/.editorconfig  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/.gitignore  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/.prettierrc  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/.vscode/extensions.json  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/.vscode/launch.json  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/.vscode/tasks.json  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/public/favicon.ico  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/src/index.html  NEW (generated, then modified)
$ZETARIS_REPO/examples/eurostat-crud/src/main.ts  NEW (generated)
$ZETARIS_REPO/examples/eurostat-crud/src/styles.css  NEW (generated, then modified)
$ZETARIS_REPO/examples/eurostat-crud/src/app/app.ts  NEW (generated, then modified)
$ZETARIS_REPO/examples/eurostat-crud/src/app/app.html  NEW (generated, then modified)
$ZETARIS_REPO/examples/eurostat-crud/src/app/app.css  NEW (generated, then modified)
$ZETARIS_REPO/examples/eurostat-crud/src/app/app.config.ts  NEW (generated, then modified)
$ZETARIS_REPO/examples/eurostat-crud/src/app/app.routes.ts  NEW (generated, then modified)
$ZETARIS_REPO/examples/eurostat-crud/src/app/app.spec.ts  NEW (generated, then modified)
$ZETARIS_REPO/examples/eurostat-crud/src/app/core/eurostat/eurostat.models.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/core/eurostat/eurostat.service.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/core/eurostat/eurostat.service.spec.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/core/eurostat/eurostat.fixture.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/core/series/saved-series.model.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/core/series/series-store.service.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/core/series/series-store.service.spec.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-list/series-list.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-list/series-list.html  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-list/series-list.css  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-list/series-list.spec.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-form/series-form.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-form/series-form.html  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-form/series-form.css  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-form/series-form.spec.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-detail/series-detail.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-detail/series-detail.html  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-detail/series-detail.css  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/features/series-detail/series-detail.spec.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/shared/rate-chart/rate-chart.ts  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/shared/rate-chart/rate-chart.html  NEW
$ZETARIS_REPO/examples/eurostat-crud/src/app/shared/rate-chart/rate-chart.css  NEW
```

### 5.4 Repository integration (committed content)

```text
$ZETARIS_REPO/README.md  MOD
$ZETARIS_REPO/open_data/rest_apis/rest-api-sources.md  MOD
$ZETARIS_REPO/.markdownlint-cli2.jsonc  NEW
```

### 5.5 Explicitly unchanged

```text
$ZETARIS_REPO/open_data/rest_apis/sql/non_rate_limited/07_eurostat_create.sql
$ZETARIS_REPO/open_data/rest_apis/sql/non_rate_limited/07_eurostat_select.sql
$ZETARIS_REPO/website/build.mjs
$ZETARIS_REPO/docs/plans/FUTURES.md
$ZETARIS_REPO/CONTRIBUTING.md
```

## 6. Phase 1 — Eurostat Analysis and Dossier

### 6.1 Step 1 — Create the local scratch folder and verify the repo baseline

Exact commands:

```bash
cd $ZETARIS_REPO
mkdir -p $SCRATCH/local-session
git status --short
git branch --show-current
```

Pass criteria:

- `git status --short` shows only the pre-existing `M .env.example` and `?? key.txt`.
- Branch is `main`.

### 6.2 Step 2 — Fetch and validate the live source

Exact commands:

```bash
cd $ZETARIS_REPO
curl -sS 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA' \
  -o $SCRATCH/local-session/eurostat_pl_t.json
python3 -m json.tool $SCRATCH/local-session/eurostat_pl_t.json > /dev/null
python3 - <<'PY'
import json
from pathlib import Path
p = Path('$SCRATCH/local-session/eurostat_pl_t.json')
d = json.loads(p.read_text())
assert d['class'] == 'dataset'
assert d['source'] == 'ESTAT'
assert d['updated'] == '2026-10-21T11:00:00+0200'
assert len(d['value']) == 356
assert len(d['extension']['positions-with-no-data']['time']) == 169
assert d['status'] == {'312': 'b', '323': 'd'}
assert d['id'] == ['freq', 's_adj', 'age', 'unit', 'sex', 'geo', 'time']
assert d['size'] == [1, 1, 1, 1, 1, 1, 525]
print('source-ok', len(d['value']), d['updated'])
PY
```

Pass criteria: `source-ok 356 2026-10-21T11:00:00+0200`.

### 6.3 Step 3 — Generate the coverage table

Run the exact script in Appendix A. Its output is the source of truth for:

- per-country/per-sex counts, first period, last period, and missing count;
- status positions per country;
- PL/T summary statistics: count, minimum, maximum, mean, median, latest value, year-over-year change, and change
  since the first observation.

Pass criteria: output matches the verified tables in §3.3. Any difference is recorded in the dossier and the plan is
revised before writing final values.

### 6.4 Step 4 — Verify the Zetaris objects

Exact commands:

```bash
cd $ZETARIS_REPO
python3 scripts/preflight.py
python3 scripts/run_sql.py -e "SELECT COUNT(*) AS n, MIN(period) AS first_period, MAX(period) AS last_period, COUNT(DISTINCT period) AS distinct_periods FROM eurostat.une_rt_m_pl_series_table"
python3 scripts/run_sql.py -e "SELECT period, unemployment_rate_pct FROM eurostat.une_rt_m_pl_series_table ORDER BY period DESC LIMIT 5"
python3 scripts/run_sql.py -e "SELECT dataset_label, dataset_source, last_updated FROM eurostat.une_rt_m_pl_metadata_table"
python3 scripts/run_sql.py -e "SELECT rate_1997_01, rate_2025_07, rate_2026_07 FROM eurostat.une_rt_m_pl_snapshot_table"
python3 scripts/run_sql.py -e "DESCRIBE eurostat.une_rt_m_pl_series_table"
python3 scripts/run_sql.py -e "DESCRIBE eurostat.une_rt_m_pl_snapshot_table"
```

Pass criteria:

- Preflight reports ready.
- Series view: `n=356`, `first_period=1997-01`, `last_period=2026-08`, `distinct_periods=356`.
- Latest rows end at `2026-08`.
- Metadata `last_updated` is `2026-10-21T11:00:00+0200`.
- Snapshot view returns the three expected columns.
- Series view types are `period string` and `unemployment_rate_pct double`.
- Snapshot view types are `rate_1997_01 double`, `rate_2025_07 double`, `rate_2026_07 double`.

### 6.5 Step 5 — Write the dossier

Each file must use the exact headings and content requirements below. All facts come from §3 and the Phase 1
outputs. No session IDs, local-only paths, or planning-artifact references are allowed in these files.

#### 6.5.1 `README.md`

Required sections:

1. `# Eurostat unemployment data source`
2. Status line: verified on 2026-10-23; source updated 2026-10-21; Zetaris registration and app both present.
3. `## What this dossier covers`
4. `## Quick facts` — table with dataset, agency, DSD, JSON-stat version, frequency, unit, adjustment, age, sex,
   countries, Zetaris objects, source timestamp, PL/T coverage, DOI, and license.
5. `## Two ways to use this data` — public REST API (the app) and Zetaris SQL (the registered objects). State clearly
   that the app does not call Zetaris.
6. `## Documents` — table linking the other seven files with one-line descriptions.
7. `## Verification summary` — 356 source values, 356 series rows, 356 distinct periods, 356-month contiguity,
   snapshot-view limits.
8. `## Attribution` — short text plus link to `license-and-attribution.md`.
9. `## Maintenance` — link to `operations-runbook.md`; state that the 2026-09-19 onboarding script comments are a
   historical baseline.

#### 6.5.2 `dataset-profile.md`

Required sections:

1. `# Dataset profile: une_rt_m`
2. `## Identity` — dataset code, label, agency, DOI, DSD ID/agency/version, JSON-stat version, source timestamp.
3. `## Statistical concept` — unemployment rate as a percentage of the labour force; monthly; seasonally adjusted,
   not calendar adjusted; total age; total/ male/ female sex.
4. `## Dimensions` — table with `freq`, `s_adj`, `age`, `unit`, `sex`, `geo`, `time`; include exact labels
   (`PC_ACT` = "Percentage of population in the labour force"; `SA` = "Seasonally adjusted data, not calendar
   adjusted data").
5. `## Coverage` — the §3.3 table; state that the full dataset has 757,828 observations while the registered slice
   has 356.
6. `## Time coverage` — overall 1983-01 to 2026-09; registered slice 1997-01 to 2026-08; 2026-09 empty; why the
   registered slice starts in 1997.
7. `## Update and revision` — source timestamp; dataset version 2.0 vs DSD version 156.0; no vintage storage; the app
   displays the source timestamp.
8. `## Methodology` — EU Labour Force Survey basis; link to the ESMS page and the explanatory note PDF; do not invent
   methodology details beyond the source links.
9. `## Scope and limitations` — one country in Zetaris; five countries in the app; read-only observations; status
   flags and breaks.
10. `## Related material` — API reference, data dictionary, quality, runbook, license.

#### 6.5.3 `data-dictionary.md`

Required sections:

1. `# Data dictionary`
2. `## Source JSON-stat fields` — table for `version`, `class`, `label`, `source`, `updated`, `value`, `status`,
   `id`, `size`, `dimension`, `extension`, `extension.datastructure`, `extension.annotation`,
   `extension.positions-with-no-data`, `extension.status`.
3. `## Dimension codes` — table of each dimension, app value, valid codes used here, and exact labels.
4. `## Zetaris object map` — REST table and three views; state row/column counts.
5. `## REST table fields` — the 11 top-level fields and their types; summarize the large structs by shape and state
   that `value` has 356 populated dynamic keys and `dimension.time.category.index` has 525 keys.
6. `## Metadata view` — five columns and semantics; `time_index_map` is a struct with 525 fields, not a map.
7. `## Snapshot view` — exactly three columns; explain that it is a spot check and ends at 2026-07.
8. `## Series view` — two columns, one row per published value, 356 rows.
9. `## Missing and status semantics` — `positions-with-no-data` vs absent `value` keys; top-level `status` vs
   `extension.status.label`; `b`, `d`, `p`.
10. `## Decode technique` — `from_json(to_json(value), 'map<string,double>')` and the matching time-index coercion;
    the equality join on index; why plain `explode()` fails.
11. `## Example rows` — at least one metadata row, one snapshot row, and three series rows (first, 2009-01, latest).

#### 6.5.4 `api-reference.md`

Required sections:

1. `# Eurostat Statistics API reference`
2. `## Endpoint` — base URL and dataset path; GET; no key; CORS.
3. `## Parameters` — table for `format`, `lang`, `freq`, `s_adj`, `age`, `unit`, `sex`, `geo`, `time`; app values and
   allowlists.
4. `## Exact request URLs` — PL/T and the app URL template; include the full PL/T URL.
5. `## Response shape` — top-level keys and dimension/value/status/extension meaning.
6. `## JSON-stat decoding` — step-by-step algorithm: invert `category.index`, compute the flat index with `id` and
   `size`, read `value`, sort by period.
7. `## Invalid codes` — silent empty result, not an HTTP error; validate against the allowlist client-side.
8. `## Errors and limits` — HTTP errors, network/CORS errors, no published rate limit, app cache TTL 5 minutes,
   one request per country/sex load.
9. `## Examples` — curl for PL/T; a short response excerpt; a note that `value` keys are stringified indices.
10. `## References` — Eurostat API guide, JSON-stat spec, ESMS page.

#### 6.5.5 `zetaris-integration.md`

Required sections:

1. `# Zetaris integration`
2. `## Object inventory` — database, container, REST table, views.
3. `## Registration request` — the exact endpoint, method, response type, and encoding from the create script.
4. `## View definitions` — plain-language description of each view and the exact decode expression.
5. `## Verification queries` — the Phase 1 SQL, with expected outputs.
6. `## Verified state (2026-10-23)` — 356 rows, first/last, metadata timestamp, snapshot columns.
7. `## Known drift from the 2026-09-19 scripts` — the four bullets in §3.5.
8. `## Limits` — PL-only, fixed filters, dynamic struct access, snapshot view is not a full wide table, no history.
9. `## How to add another country` — either register a new REST table in the same pattern or use the public API;
   no live change is made here.
10. `## Security` — Zetaris key stays in `.env.local` and is used only by the repository's SQL helpers; the app has
    no key.

#### 6.5.6 `data-quality.md`

Required sections:

1. `# Data quality and verification`
2. `## Verification ledger` — table of date, check, expected, observed, verdict.
3. `## Coverage` — the §3.3 table.
4. `## Missing data` — 169 PL, 97 DE, 1 FR, 40 ES, 1 IT; 2026-09 empty; explain reporting lag.
5. `## Contiguity` — expected 356 months from 1997-01 to 2026-08; observed 356; no duplicate periods.
6. `## Status flags` — the §3.3 status table; explain `b`, `d`, `p`; state that flags are attached to observations,
   not dropped.
7. `## Seasonal adjustment` — SA series; do not compare to non-seasonally-adjusted series without stating the
   difference.
8. `## Revisions` — source may revise; no vintages; app shows source timestamp.
9. `## Known source quirks` — invalid `age=Y15-74` returns empty; valid age codes are `TOTAL`, `Y_LT25`, `Y25-74`;
   the snapshot view is a three-column spot check.
10. `## Validation queries` — SQL and curl commands a maintainer can rerun.

#### 6.5.7 `operations-runbook.md`

Required sections:

1. `# Operations runbook`
2. `## Prerequisites` — Python 3, `.env.local`, `jq` optional, Node 26 for the app.
3. `## Verify the live source` — curl and Python count; expected 356.
4. `## Verify the Zetaris registration` — preflight and the six SQL checks.
5. `## Refresh the registration` — dry-run first, then execute, then verify; literal commands using
   `scripts/onboard.py`.
6. `## Run the app` — install, start, open `http://localhost:4200`.
7. `## Reset local app data` — browser devtools command to remove
   `eurostat-crud.saved-series.v1` and its corrupt backup key.
8. `## Troubleshooting` — CORS, empty data, invalid country/sex, 404, Node version, localStorage parse failure.
9. `## Security and credentials` — app needs no key; Zetaris key only in `.env.local`; never paste it into the app or
   docs.
10. `## Change log` — table of verification dates and results.

#### 6.5.8 `license-and-attribution.md`

Required sections:

1. `# License and attribution`
2. `## Official policy` — editorial content is CC BY 4.0; statistical data reuse is authorised with source
   acknowledgement under Commission Decision 2011/833/EU; individual datasets may add conditions.
3. `## Exceptions` — third-party material, non-EU/EFTA/candidate-country data, certain trade data, logos and
   trademarks; link to the official notice.
4. `## Required attribution` — exact recommended text: "Source: Eurostat, une_rt_m (unemployment rate, monthly),
   extracted 2026-10-23. Data © European Union."
5. `## Dataset citation` — dataset label, DOI `10.2908/UNE_RT_M`, and the Eurostat data-browser link.
6. `## No affiliation` — this repository is not affiliated with or endorsed by Eurostat.
7. `## Catalog correction` — state that this document supersedes the "not independently confirmed" wording in
   `open_data/rest_apis/rest-api-sources.md` section 7 and link to the official notice.

### 6.6 Step 6 — Integrate the dossier

Exact edits:

1. `README.md`:
   - Add a `docs/data-sources/` row to the repository map.
   - Add an `examples/eurostat-crud/` row next to the PUDL chart.
   - Link the dossier README from the documentation table.
2. `open_data/rest_apis/rest-api-sources.md` section 7:
   - Replace the "commonly understood to align with CC-BY 4.0, but this has not been independently confirmed" text
     with the official policy summary and a link to
     `../../docs/data-sources/eurostat/license-and-attribution.md`.
   - Add "Full dossier: `../../docs/data-sources/eurostat/README.md`."
   - Do not change the status column; the source remains `Verified`.
3. Do not edit `07_eurostat_create.sql`, `07_eurostat_select.sql`, or `website/build.mjs`.

### 6.7 Step 7 — Create the lint configuration

Create `$ZETARIS_REPO/.markdownlint-cli2.jsonc` with:

```jsonc
{
    // 120-character limit; code blocks and tables are exempt.
    "config": {
        "MD013": {
            "line_length": 120,
            "code_blocks": false,
            "tables": false,
        },
        "MD007": {
            "indent": 2,
        },
        "MD029": {
            "style": "ordered",
        },
        "MD046": {
            "style": "fenced",
        },
        "MD033": {
            "allowed_elements": ["br"],
        },
    },
}
```

Note: the repository currently has no root Markdown lint config and its existing README does not pass the default
80-character rule. The new config applies to the files verified in §9, not to a repository-wide lint sweep.

### 6.8 Step 8 — Verify Phase 1

Exact commands:

```bash
cd $ZETARIS_REPO
markdownlint-cli2 "docs/data-sources/eurostat/*.md" \
  "README.md" \
  "open_data/rest_apis/rest-api-sources.md"
```

Pass criteria:

- Exit code 0.
- All eight dossier files exist.
- Every relative link in the dossier resolves to an existing file or a valid external URL.
- No session ID, `$SCRATCH/` path, or planning-artifact reference appears in any dossier file.
- No Eurostat observation is presented as editable.

## 7. Phase 2 — Angular CRUD Application

### 7.1 Architecture

```text
Browser (Angular 22)
  ├── EurostatService
  │     └── GET https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m
  │           (public, CORS, no key)
  ├── SeriesStoreService
  │     └── localStorage key: eurostat-crud.saved-series.v1
  └── Routed pages
        ├── /series           list saved records
        ├── /series/new       create
        ├── /series/:id       read + chart + table + delete
        └── /series/:id/edit  update
```

No server. No Zetaris. No secrets. The app is a static Angular build.

### 7.2 Scaffold

Exact commands:

```bash
cd $ZETARIS_REPO
mise x node@26 -- npx --yes @angular/cli@22.2.4 new eurostat-crud \
  --directory examples/eurostat-crud \
  --defaults \
  --skip-git \
  --style=css \
  --routing \
  --ssr=false \
  --zoneless \
  --strict \
  --test-runner=vitest \
  --package-manager=npm \
  --prefix=app
cd $ZETARIS_REPO/examples/eurostat-crud
mise x node@26 -- npm install
```

Pass criteria:

- `examples/eurostat-crud/package.json` exists and contains Angular `^22.2.0`, CLI `^22.2.4`, TypeScript `~6.0.2`,
  and Vitest `^5.0.0`.
- `npm install` exits 0.
- `ng version` reports Angular CLI 22.2.4 and Node 26.x.

### 7.3 Data model

`src/app/core/series/saved-series.model.ts` defines exactly:

```ts
export const GEO_CODES = ['PL', 'DE', 'FR', 'ES', 'IT'] as const;
export type GeoCode = (typeof GEO_CODES)[number];

export const SEX_CODES = ['T', 'M', 'F'] as const;
export type SexCode = (typeof SEX_CODES)[number];

export interface SeriesFilters {
  geo: GeoCode;
  sex: SexCode;
}

export interface SavedSeries {
  id: string;
  name: string;
  note: string;
  filters: SeriesFilters;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSeriesInput {
  name: string;
  note: string;
  filters: SeriesFilters;
}

export interface Observation {
  period: string;
  rate: number;
}

export interface SeriesData {
  datasetLabel: string;
  source: string;
  updated: string;
  observations: Observation[];
}
```

`src/app/core/eurostat/eurostat.models.ts` defines the JSON-stat response types:

```ts
export interface JsonStatCategory {
  index: Record<string, number>;
  label: Record<string, string>;
}

export interface JsonStatDimension {
  category: JsonStatCategory;
  label: string;
}

export interface JsonStatDataset {
  version: string;
  class: 'dataset';
  label: string;
  source: string;
  updated: string;
  value: Record<string, number>;
  status?: Record<string, string>;
  id: string[];
  size: number[];
  dimension: Record<string, JsonStatDimension>;
  extension?: {
    status?: { label?: Record<string, string> };
    'positions-with-no-data'?: { time?: number[] };
  };
}
```

### 7.4 Eurostat service contract

`src/app/core/eurostat/eurostat.service.ts`:

- Injectable, `providedIn: 'root'`.
- Constructor injects `HttpClient`.
- `getSeries(filters: SeriesFilters): Promise<SeriesData>`.
- Cache: `Map<string, { data: SeriesData; fetchedAt: number }>`; TTL 300,000 ms; key `${geo}:${sex}`.
- URL construction:
  - Base: `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m`.
  - Query: `format=JSON`, `lang=EN`, `freq=M`, `s_adj=SA`, `age=TOTAL`, `unit=PC_ACT`, `sex=<sex>`, `geo=<geo>`.
- Validation:
  - `response.class === 'dataset'`.
  - `response.id` includes `time`; `response.size.length === response.id.length`.
  - `response.dimension.time.category.index` and `response.value` are objects.
- Decode:
  - Build `indexToPeriod` by inverting `dimension.time.category.index`.
  - Compute the JSON-stat flat index for each time position with all other dimensions at index 0:
    `flat = Σ index[d] * stride[d]`, where `stride` is the product of later dimension sizes.
  - Include only positions where `value[String(flat)]` is a finite number.
  - Sort ascending by period.
- Return `{ datasetLabel: response.label, source: response.source, updated: response.updated, observations }`.
- Throw `EurostatDataError` for malformed shapes, empty observations, network errors, and HTTP errors. The error
  message includes the country and sex codes.
- Do not log the response or any credential.

Exact URL template:

```text
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&freq=M&s_adj=SA&age=TOTAL&unit=PC_ACT&sex={sex}&geo={geo}
```

### 7.5 Local storage contract

`src/app/core/series/series-store.service.ts`:

- Injectable, `providedIn: 'root'`.
- Signals:
  - `private readonly _series = signal<SavedSeries[]>(this.load());`
  - `readonly series = this._series.asReadonly();`
  - `readonly loadWarning = signal<string | null>(null);`
- Storage key: `eurostat-crud.saved-series.v1`.
- Corrupt backup key: `eurostat-crud.saved-series.v1.corrupt`.
- Envelope:

```json
{
  "version": 1,
  "items": [
    {
      "id": "8f14e45f-ea8b-4c1d-9f2a-3b5c7d9e1f20",
      "name": "Poland total",
      "note": "Baseline series.",
      "filters": { "geo": "PL", "sex": "T" },
      "createdAt": "2026-10-23T19:20:00.000Z",
      "updatedAt": "2026-10-23T19:20:00.000Z"
    }
  ]
}
```

- Load:
  - Parse JSON; if parsing fails, copy the raw value to the corrupt key, set `loadWarning`, and start empty.
  - Validate `version === 1` and `Array.isArray(items)`.
  - Drop items whose `id`, `name`, filters, or timestamps are invalid; set `loadWarning` if any were dropped.
- Create:
  - Trim `name`; require 1–80 characters.
  - Trim `note`; allow 0–2,000 characters.
  - Require `geo` in `GEO_CODES` and `sex` in `SEX_CODES`.
  - Set `id = crypto.randomUUID()`, `createdAt = updatedAt = new Date().toISOString()`.
  - Persist, then return the record.
- Update:
  - Find by id; return `undefined` if absent.
  - Apply the same validation; set `updatedAt`; persist.
- Delete:
  - Remove by id; persist; return whether a record was removed.
- List order: `updatedAt` descending, then `name` ascending.
- Cross-tab: listen for the `storage` event for the key and reload the signal.
- Never store observations or fetched data in `localStorage`.

### 7.6 Routes and components

`src/app/app.routes.ts`:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'series' },
  {
    path: 'series',
    loadComponent: () =>
      import('./features/series-list/series-list').then((m) => m.SeriesList),
  },
  {
    path: 'series/new',
    loadComponent: () =>
      import('./features/series-form/series-form').then((m) => m.SeriesForm),
    data: { mode: 'create' },
  },
  {
    path: 'series/:id',
    loadComponent: () =>
      import('./features/series-detail/series-detail').then((m) => m.SeriesDetail),
  },
  {
    path: 'series/:id/edit',
    loadComponent: () =>
      import('./features/series-form/series-form').then((m) => m.SeriesForm),
    data: { mode: 'edit' },
  },
  { path: '**', redirectTo: 'series' },
];
```

Component requirements:

- `App` (`app.ts`, `app.html`, `app.css`):
  - Standalone; imports `RouterOutlet`, `RouterLink`, and `RouterLinkActive`.
  - Header with brand link to `/series` and a "New saved series" link to `/series/new`.
  - Main `router-outlet`.
  - Footer with attribution and a link to the Eurostat copyright notice.
  - `ChangeDetectionStrategy.OnPush`.
- `SeriesList`:
  - Reads `store.series()`.
  - Empty state with a "Create your first saved series" link.
  - Table or card list: name, country label, sex label, latest saved update timestamp, note preview.
  - Link to `/series/:id`.
  - No delete action on this page.
- `SeriesForm`:
  - Standalone; imports `ReactiveFormsModule`, `RouterLink`.
  - Reactive form with `name` (required, maxLength 80), `geo` (select), `sex` (select), `note` (maxLength 2000).
  - `mode` from route data: `create` or `edit`.
  - Edit mode: read `:id`, load record; if absent, show a not-found panel with a link back.
  - Submit label: "Create saved series" or "Save changes".
  - Cancel link to `/series` or `/series/:id`.
  - On success, navigate to `/series/:id`.
  - Show field-level validation messages and a form-level error for storage failures.
- `SeriesDetail`:
  - Standalone; imports `RateChart`, `RouterLink`, `DatePipe` or a local formatter.
  - Resolve `:id`; if absent, show not-found.
  - Display name, country/sex labels, created/updated timestamps, note.
  - Fetch observations on load; show loading, error with retry, and empty states.
  - Render `RateChart` with the observations.
  - Render a table of the latest 24 observations, newest first; "Show all" toggles the full set.
  - Show the source `updated` timestamp and the attribution line.
  - "Edit" link to `/series/:id/edit`.
  - "Delete" button toggles an inline confirmation panel; "Delete permanently" calls `store.delete(id)` and
    navigates to `/series`; "Cancel" closes the panel.
- `RateChart`:
  - Standalone; `observations = input.required<Observation[]>()`.
  - Inline SVG `viewBox="0 0 600 180"`; `polyline`; min/max labels; first/last period labels.
  - Use `role="img"` and an `aria-label` that includes the country/sex label passed as an input or a generic
    "Unemployment rate over time".
  - No chart library.
- Global:
  - `app.config.ts` adds `provideHttpClient(withFetch())`.
  - `app.html` and `index.html` set the title "Eurostat unemployment CRUD".
  - `styles.css` defines a system font stack, readable contrast, focus-visible outlines, and responsive layout.

### 7.7 UI copy and attribution

- Every page that displays data includes: "Source: Eurostat, une_rt_m (unemployment rate, monthly)."
- The detail page includes: "Data may be revised by Eurostat. Saved series and notes are stored only in this
  browser."
- The empty state includes: "Observations are read-only. You can save a named view and notes locally."
- Country labels: Poland, Germany, France, Spain, Italy.
- Sex labels: Total, Male, Female.

### 7.8 App README

Replace the generated `examples/eurostat-crud/README.md` with:

1. `# Eurostat unemployment CRUD example`
2. What it demonstrates: read-only public data plus local CRUD.
3. Why there is no backend: CORS, no key, browser-only persistence.
4. Data scope table.
5. Run commands.
6. Build and test commands.
7. Storage keys and reset instructions.
8. Limitations: one browser, no sync, no auth, source revisions, five-country allowlist.
9. Attribution and license link.
10. Link back to `docs/data-sources/eurostat/README.md`.

### 7.9 Tests

Use Vitest through Angular's `ng test` builder. Required specs:

- `eurostat.service.spec.ts`:
  - Parses a minimal fixture into sorted observations.
  - Omits missing values.
  - Rejects a malformed response.
  - Rejects an empty observation set.
  - Uses the cache on a second call.
- `series-store.service.spec.ts`:
  - Starts empty.
  - Creates, reads, updates, and deletes a record.
  - Persists across a new service instance.
  - Sorts by `updatedAt` descending.
  - Drops invalid stored items and sets `loadWarning`.
  - Backs up corrupt JSON and starts empty.
  - Rejects blank names and invalid filters.
- `series-list.spec.ts`:
  - Empty state renders.
  - Saved records render with country/sex labels.
- `series-form.spec.ts`:
  - Create mode requires a name.
  - Create mode stores a record and navigates.
  - Edit mode loads and updates a record.
- `series-detail.spec.ts`:
  - Renders name, note, chart, and table with a mocked `EurostatService`.
  - Shows an error state when the service rejects.
  - Delete confirmation calls the store and navigates.
- `app.spec.ts`:
  - App shell renders the brand and navigation.

Test commands:

```bash
cd $ZETARIS_REPO/examples/eurostat-crud
mise x node@26 -- npm test -- --watch=false
mise x node@26 -- npm run build
```

Pass criteria:

- All specs pass.
- Production build exits 0 and writes `dist/eurostat-crud/browser/`.
- No test makes a real network request.

### 7.10 Browser smoke test

Exact steps:

1. Start the dev server:

```bash
cd $ZETARIS_REPO/examples/eurostat-crud
mise x node@26 -- npm start -- --host 127.0.0.1 --port 4200
```

1. Confirm the server is live:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4200/
```

Expected: `200`.

1. In a browser at `http://127.0.0.1:4200/`:
   - Create a saved series for Poland, total sex, with a note.
   - Confirm it appears in the list.
   - Open it and confirm the chart, latest observation (2026-08, 3.4), and source timestamp
     (2026-10-21T11:00:00+0200).
   - Edit the name and note; confirm the list reflects the change.
   - Delete it through the confirmation panel; confirm the list is empty.
   - Reload the page and confirm the storage state matches the last action.

2. Stop the dev server with `Ctrl+C`.

Pass criteria: all six browser steps behave as described; no console errors.

## 8. Phase 3 — Repository Integration and Final Verification

### 8.1 Root README map

Add rows to the repository map in `$ZETARIS_REPO/README.md`:

```text
docs/data-sources/   Verified data-source dossiers, starting with Eurostat
examples/eurostat-crud/  Angular CRUD example over the public Eurostat API, with local saved series
```

Add a documentation-table row:

```markdown
| Eurostat data source | Dataset profile, API reference, Zetaris integration, quality, runbook, and license |
```

### 8.2 REST catalog correction

In `open_data/rest_apis/rest-api-sources.md` section 7, the license line must become:

```text
- **Licence:** Reuse is authorised with source acknowledgement under the European Commission reuse policy
  (Decision 2011/833/EU); editorial content is CC BY 4.0. See the
  Eurostat license and attribution dossier.
```

Add one line:

```text
- **Full dossier:** `../../docs/data-sources/eurostat/README.md`
```

Do not change the `Verified` status or the script path.

### 8.3 Final lint and link audit

Exact commands:

```bash
cd $ZETARIS_REPO
markdownlint-cli2 "docs/data-sources/eurostat/*.md" \
  "README.md" \
  "open_data/rest_apis/rest-api-sources.md" \
  "examples/eurostat-crud/README.md"
```

Pass criteria:

- Exit code 0.
- No relative link in the changed Markdown points to a missing file.
- No dossier or app file contains a session ID or `$SCRATCH/` path.

### 8.4 No commit

Do not run `git add`, `git commit`, or `git push`. The final report lists changed files and verification results. A
commit is a separate user-authorized action.

## 9. Verification Matrix

| Check | Exact command or action | Pass criterion |
| :--- | :--- | :--- |
| Source metadata | `curl` PL/T JSON | `class=dataset`, `updated=2026-10-21T11:00:00+0200` |
| Source count | Python `len(value)` | `356` |
| Zetaris count | `run_sql.py` count query | `n=356` |
| Zetaris range | `run_sql.py` min/max query | `1997-01` to `2026-08` |
| Zetaris distinct periods | `run_sql.py` count distinct | `356` |
| Snapshot columns | `DESCRIBE` snapshot view | exactly 3 rate columns |
| Series types | `DESCRIBE` series view | `period string`, `unemployment_rate_pct double` |
| Dossier files | `ls docs/data-sources/eurostat` | 8 files |
| Markdown lint | `markdownlint-cli2` on changed Markdown | exit 0 |
| Angular install | `npm install` | exit 0 |
| Angular tests | `npm test -- --watch=false` | all pass |
| Angular build | `npm run build` | exit 0; `dist/eurostat-crud/browser/` exists |
| Dev server | `curl` localhost | HTTP 200 |
| Browser CRUD | six manual steps | create/read/update/delete/reload correct |
| Secrets | `grep` changed files for key markers | no `ZETARIS_API_KEY` value, no session ID in committed files |

## 10. Risks and Guardrails

- **CORS change:** The app relies on Eurostat's `Access-Control-Allow-Origin: *`. If Eurostat removes CORS, the app
  will fail with a network error. The README documents this and the runbook lists the symptom. A proxy/BFF would be
  a separate approved change.
- **Invalid filter codes:** Eurostat returns an empty result instead of an HTTP error. The app validates against the
  fixed allowlists before requesting. The docs record the `age=Y15-74` trap.
- **Source revisions:** Eurostat may revise values or add months. The app displays the source timestamp and never
  writes observations to storage. The dossier is dated and verified; a future refresh updates the ledger.
- **`localStorage` loss:** Clearing browser data deletes saved records. The UI states that records are browser-local.
  The README documents the reset keys.
- **Corrupt storage:** The store backs up corrupt JSON under a separate key and starts empty with a warning. It never
  silently overwrites the corrupt value.
- **Snapshot-view misreading:** The three-column `une_rt_m_pl_snapshot_table` is not a full wide table. The dossier
  labels it a spot check; the app never reads it.
- **Node version drift:** Angular CLI 22.2.4 requires Node 22.22.3+, 24.15+, or 26+. The plan pins Node 26 through
  `mise`. The README repeats the requirement.
- **Scope drift:** No live Zetaris edits, no BFF, no website publishing, no commits. Any such request requires a new
  plan version and approval.
- **Secrets:** The app has no credentials. The Zetaris key stays in `.env.local` and is used only by the existing SQL
  helpers. No key value is written to the dossier, app, tests, or report.
- **Planning artifacts:** The plan and task contain the session ID and are excluded locally. They must not be
  committed. The dossier and app must not reference them.

## 11. Execution Checklist

- [ ] Phase 1.1 — create scratch folder and confirm baseline `[created 2026-10-23 19:20]`
- [ ] Phase 1.2 — fetch and validate live source `[created 2026-10-23 19:20]`
- [ ] Phase 1.3 — generate coverage table `[created 2026-10-23 19:20]`
- [ ] Phase 1.4 — verify Zetaris objects `[created 2026-10-23 19:20]`
- [ ] Phase 1.5 — write eight dossier documents `[created 2026-10-23 19:20]`
- [ ] Phase 1.6 — integrate root README and REST catalog `[created 2026-10-23 19:20]`
- [ ] Phase 1.7 — create lint config `[created 2026-10-23 19:20]`
- [ ] Phase 1.8 — lint dossier and integrations `[created 2026-10-23 19:20]`
- [ ] Phase 2.1 — scaffold Angular app and install `[created 2026-10-23 19:20]`
- [ ] Phase 2.2 — implement models, services, and storage `[created 2026-10-23 19:20]`
- [ ] Phase 2.3 — implement routes, pages, chart, and styles `[created 2026-10-23 19:20]`
- [ ] Phase 2.4 — write app README `[created 2026-10-23 19:20]`
- [ ] Phase 2.5 — write and pass unit tests `[created 2026-10-23 19:20]`
- [ ] Phase 2.6 — production build `[created 2026-10-23 19:20]`
- [ ] Phase 2.7 — browser CRUD smoke test `[created 2026-10-23 19:20]`
- [ ] Phase 3.1 — root README and catalog edits `[created 2026-10-23 19:20]`
- [ ] Phase 3.2 — final lint and link audit `[created 2026-10-23 19:20]`
- [ ] Phase 3.3 — final report, no commit `[created 2026-10-23 19:20]`

## 12. Approval Gate

Implementation does not start until the user replies with one of:

- `Approved` — execute the plan exactly as written.
- `Approved with changes: <changes>` — revise the plan to v2 first, then execute after approval.
- `Hold` — do not execute; answer questions only.

On approval, the first action is Phase 1.1. On any material deviation, execution pauses and a v2 plan is presented
with a verbatim-superset Change History.

## Appendix A — Coverage Analysis Script

Run from the repository root. It uses only the Python standard library and writes nothing.

```bash
python3 - <<'PY'
import json
import statistics
import urllib.request
from itertools import product

BASE = (
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m"
    "?format=JSON&lang=EN&age=TOTAL&unit=PC_ACT&s_adj=SA"
)
COUNTRIES = ["PL", "DE", "FR", "ES", "IT"]
SEXES = ["T", "M", "F"]

for geo, sex in product(COUNTRIES, SEXES):
    url = f"{BASE}&geo={geo}&sex={sex}"
    with urllib.request.urlopen(url, timeout=60) as response:
        data = json.load(response)
    time_category = data["dimension"]["time"]["category"]
    index_to_period = {value: key for key, value in time_category["index"].items()}
    values = data.get("value", {})
    indexes = sorted(int(key) for key in values)
    missing = data.get("extension", {}).get("positions-with-no-data", {}).get("time", [])
    status = data.get("status", {})
    status_by_period = {
        index_to_period[int(key)]: value for key, value in status.items() if key.isdigit()
    }
    print(
        f"{geo}/{sex}: n={len(values)} "
        f"first={index_to_period[indexes[0]]} last={index_to_period[indexes[-1]]} "
        f"missing={len(missing)} status={status_by_period}"
    )

url = f"{BASE}&geo=PL&sex=T"
with urllib.request.urlopen(url, timeout=60) as response:
    data = json.load(response)
time_category = data["dimension"]["time"]["category"]
index_to_period = {value: key for key, value in time_category["index"].items()}
rows = sorted(
    (index_to_period[int(key)], value) for key, value in data["value"].items()
)
values = [value for _, value in rows]
print("PL/T summary")
print("count", len(rows))
print("first", rows[0])
print("last", rows[-1])
print("min", min(rows, key=lambda row: row[1]))
print("max", max(rows, key=lambda row: row[1]))
print("mean", round(statistics.mean(values), 2))
print("median", round(statistics.median(values), 2))
print("yoy", rows[-13], "change", round(rows[-1][1] - rows[-13][1], 1))
print("since_first", round(rows[-1][1] - rows[0][1], 1))
PY
```

## Appendix B — Exact Source and Documentation URLs

- Dataset API:
  `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m`
- Eurostat API guide:
  `https://wikis.ec.europa.eu/display/EUROSTATHELP/API+Statistics+-+data+query`
- JSON-stat specification: `https://json-stat.org/`
- ESMS metadata:
  `https://ec.europa.eu/eurostat/cache/metadata/en/une_rt_m_esms.htm`
- Copyright notice:
  `https://ec.europa.eu/eurostat/en/help/copyright-notice`
- Dataset DOI: `https://doi.org/10.2908/UNE_RT_M`
- Zetaris REST run endpoint: `${ZETARIS_REST_URL}/sql-editor/sqls/run`
- Zetaris data sources endpoint: `${ZETARIS_REST_URL}/datasource/datasources`
