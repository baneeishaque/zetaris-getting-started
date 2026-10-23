# Eurostat unemployment data source

Verified reference for the Eurostat dataset `une_rt_m`, "Unemployment by sex and age - monthly data". The
source was last updated on **2026-10-21T11:00:00+0200** and was verified against the live API and the registered
Zetaris objects on **2026-10-23**.

This dossier is the detailed companion to the short catalog entry in
[`open_data/rest_apis/rest-api-sources.md`](../../../open_data/rest_apis/rest-api-sources.md) and the onboarding
scripts in [`open_data/rest_apis/sql/non_rate_limited/`](../../../open_data/rest_apis/sql/non_rate_limited/).
It records what the source contains, how to query it, how the Zetaris views decode it, what is missing, and how
the data may be reused.

## What this dossier covers

- The statistical concept, dimensions, and full code inventory of `une_rt_m`.
- The exact public REST request and the JSON-stat 2.0 response shape.
- The registered Zetaris objects: one REST table and three views.
- Coverage, missing values, status flags, revision behaviour, and known source quirks.
- A repeatable verification and refresh runbook.
- The official Eurostat copyright and attribution rules.

## Quick facts

| Item | Value |
| :--- | :--- |
| Dataset code | `une_rt_m` |
| Dataset title | Unemployment by sex and age - monthly data |
| Producer | Eurostat (`ESTAT`) |
| Frequency | Monthly (`freq=M`) |
| Unit | `PC_ACT` — percentage of population in the labour force |
| Adjustment | `SA` — seasonally adjusted, not calendar adjusted |
| Age class | `TOTAL` |
| Sex codes | `T`, `M`, `F` |
| Geography in Zetaris | Poland only (`PL`) |
| Geography in the full dataset | 2 aggregates and 36 countries (38 categories) |
| Time range, full dataset | `1983-01` to `2026-09` (525 months) |
| Time range, PL slice | `1997-01` to `2026-08` (356 populated months) |
| Observations, full dataset | 757,828 |
| Observations, PL slice | 356 |
| Data structure | `UNE_RT_M`, agency `ESTAT`, version `156.0` |
| JSON-stat version | `2.0` |
| DOI | `10.2908/UNE_RT_M` |
| Source timestamp | `2026-10-21T11:00:00+0200` |
| Zetaris database | `EUROSTAT_REST` (id 917) |
| Zetaris container | `eurostat` |
| Zetaris REST table | `EUROSTAT_REST.une_rt_m_pl` |
| Zetaris views | `une_rt_m_pl_metadata_table`, `une_rt_m_pl_snapshot_table`, `une_rt_m_pl_series_table` |
| API access | Public, no key, no registration, CORS enabled |
| Licence | Reuse authorised with source acknowledgement; editorial content CC BY 4.0 |

## Two ways to use this data

### 1. Public REST API

The API is the canonical source and the only path that can return any country, sex, age, unit, or adjustment
combination without a new registration. It returns JSON-stat 2.0, a sparse, dynamic-key format rather than an
array of records. See [`api-reference.md`](api-reference.md) for the request contract and a decoder.

### 2. Zetaris SQL

The registered objects expose one fixed slice: Poland, total sex, total age, percentage of the labour force,
seasonally adjusted, monthly. The `une_rt_m_pl_series_table` view decodes the sparse JSON-stat value object into
one row per published month. The metadata and snapshot views are low-risk helpers that avoid `explode()`.

The Zetaris objects are registered REST tables inside Zetaris, not a browser proxy. The public API remains
the canonical source for arbitrary slices; the SQL-facing story is the registered table and views. The
optional [`examples/eurostat-crud`](../../../examples/eurostat-crud/README.md) Angular app reads the PL/T
views through a same-origin development proxy because Zetaris does not send CORS headers. See
[`zetaris-integration.md`](zetaris-integration.md).

## Documents

| Document | What it answers |
| :--- | :--- |
| [`dataset-profile.md`](dataset-profile.md) | What the dataset measures, its dimensions, coverage, methodology, and revisions |
| [`data-dictionary.md`](data-dictionary.md) | Every source field, dimension code, Zetaris column, and JSON-stat decode rule |
| [`api-reference.md`](api-reference.md) | How to call the API, read the response, handle errors, and decode JSON-stat |
| [`zetaris-integration.md`](zetaris-integration.md) | What is registered in Zetaris, how the views work, and what is known to drift |
| [`data-quality.md`](data-quality.md) | Coverage tables, missing data, status flags, revisions, and validation evidence |
| [`operations-runbook.md`](operations-runbook.md) | Exact commands to verify, refresh, and troubleshoot the source |
| [`license-and-attribution.md`](license-and-attribution.md) | Official reuse rules, exceptions, and the exact citation format |

## Verification summary

The following results were observed on 2026-10-23.

| Check | Result |
| :--- | :--- |
| Live PL/T JSON values | 356 |
| Live PL/T distinct periods | 356 |
| Live PL/T first/last period | `1997-01` / `2026-08` |
| Live PL/T no-data positions | 169 (`0`–`167` and `524`) |
| Zetaris series rows | 356 |
| Zetaris distinct periods | 356 |
| Zetaris first/last period | `1997-01` / `2026-08` |
| Metadata `last_updated` | `2026-10-21T11:00:00+0200` |
| Snapshot values | `11.8`, `3.1`, `3.4` for 1997-01, 2025-07, 2026-07 |
| Full dataset values | 757,828 |
| Full dataset status flags | 11,291 |
| Full dataset time categories | 525 |
| Eurostat API CORS | `Access-Control-Allow-Origin: *`; Zetaris sends no CORS headers |

## Key findings and limits

- **2026-09 is present but empty for Poland.** The time axis ends at `2026-09`, but the PL slice's last
  populated month is `2026-08`. This is a normal reporting lag, not a gap.
- **The PL slice starts in 1997-01.** The 169 missing positions are the leading months from `1983-01` to
  `1996-12`, plus the empty `2026-09` position.
- **The Zetaris snapshot view is only three columns.** `une_rt_m_pl_snapshot_table` contains
  `rate_1997_01`, `rate_2025_07`, and `rate_2026_07`. It is a spot check, not a wide-format table.
- **The 2026-09-19 onboarding scripts are a historical baseline.** The live source now has 356 values through
  `2026-08`; the script comments still describe 355 values through `2026-07`. The scripts are not edited by
  this dossier.
- **Zetaris exposes one slice only.** Other countries and sex codes require a new REST table registration or a
  direct API call.
- **Status flags are attached to observations.** Poland has two flagged months (`2009-01` break in series,
  `2009-12` definition differs). Italy has 109 flagged months in the total-sex slice.
- **Values can be revised.** Eurostat runs routine monthly revisions, an annual seasonal-adjustment review, and
  occasional major revisions. The dossier records the source timestamp rather than assuming immutability.

## Attribution

Eurostat requires source acknowledgement when statistical data are reused. A suitable citation for this
dataset is:

```text
Source: 10.2908/UNE_RT_M, 2026-10-23.
```

For a customised extract, such as the Poland slice, use:

```text
Source: Eurostat, une_rt_m (unemployment rate, monthly),
https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table, accessed 2026-10-23.
```

If the data are modified or translated, state that clearly and include a disclaimer that Eurostat is not
responsible for the changes. See [`license-and-attribution.md`](license-and-attribution.md) for the official
policy, exceptions, and the commercial-reuse restrictions that apply to non-EU countries.

## Maintenance

- Re-run the checks in [`operations-runbook.md`](operations-runbook.md) after a Eurostat release or before
  relying on a new month.
- Update the verification ledger in [`data-quality.md`](data-quality.md) with the date and observed values.
- Keep the `2026-09-19` script comments as a baseline; do not silently rewrite history in the onboarding SQL.
- If the Zetaris snapshot view is ever widened, update [`zetaris-integration.md`](zetaris-integration.md) and
  [`data-quality.md`](data-quality.md) together.
