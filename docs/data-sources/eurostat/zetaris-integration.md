# Zetaris integration

This document describes the Eurostat registration that already exists in the Zetaris instance. It is a
single-country slice of `une_rt_m`, not a general Eurostat connector. The raw REST table is backed by the
public endpoint; the three views decode or expose parts of the JSON-stat response.

## Object inventory

| Object | Type | Identifier | Purpose |
| :--- | :--- | :--- | :--- |
| Eurostat database | Lightning database | `EUROSTAT_REST` (id 917) | Registration container. |
| Eurostat container | Schemastore container | `eurostat` | Holds the decoded views. |
| Raw slice | REST table | `EUROSTAT_REST.une_rt_m_pl` | JSON-stat response for Poland, total sex, total age, `PC_ACT`, `SA`. |
| Metadata view | Schemastore view | `eurostat.une_rt_m_pl_metadata_table` | Dataset label, source, update timestamp, geo labels, time index map. |
| Snapshot view | Schemastore view | `eurostat.une_rt_m_pl_snapshot_table` | Three fixed rate columns. |
| Series view | Schemastore view | `eurostat.une_rt_m_pl_series_table` | One `(period, rate)` row per populated month. |

The raw table name is written as `EUROSTAT_REST.une_rt_m_pl` in the registration and referenced as
`eurostat_rest.une_rt_m_pl` in the view definitions. Zetaris identifiers are case-insensitive in these
examples; use the casing shown in the object inventory when writing new SQL.

## Registration request

The source is registered with `CREATE LIGHTNING REST TABLE`. The exact request block from
[`07_eurostat_create.sql`](../../../open_data/rest_apis/sql/non_rate_limited/07_eurostat_create.sql) is:

```sql
CREATE LIGHTNING REST TABLE une_rt_m_pl FROM EUROSTAT_REST REQUEST(
    endpoint "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&lang=EN",
    method "get",
    response_type "json",
    http_encoding "URLENCODED"
) HEADER (
) BODY ();
```

The request has no headers and no body. The endpoint fixes the slice; there are no runtime parameters. To
register a different country or sex, create a separate REST table with a different URL and table name.

The database and container are created first:

```sql
CREATE LIGHTNING DATABASE EUROSTAT_REST DESCRIBE BY "Eurostat REST API JSON-stat source";
CREATE SCHEMASTORE CONTAINER eurostat;
```

## View definitions

### Metadata view

```sql
CREATE SCHEMASTORE VIEW une_rt_m_pl_metadata_table WITH CONTAINER eurostat AS
SELECT
    label AS dataset_label,
    source AS dataset_source,
    updated AS last_updated,
    dimension.geo.category.label AS geo_labels,
    dimension.time.category.index AS time_index_map
FROM eurostat_rest.une_rt_m_pl;
```

This view is safe to query without `explode()`. It returns one row with:

| Column | Type | Observed value |
| :--- | :--- | :--- |
| `dataset_label` | string | `Unemployment by sex and age - monthly data` |
| `dataset_source` | string | `ESTAT` |
| `last_updated` | string | `2026-10-21T11:00:00+0200` |
| `geo_labels` | `struct<PL:string>` | `{"PL":"Poland"}` |
| `time_index_map` | struct with 525 `bigint` fields | Period-to-index map, including `2026-09` |

`time_index_map` is a struct, not a map. It is convenient for direct backtick access, but it is not directly
`explode()`-able without JSON coercion.

### Snapshot view

```sql
CREATE SCHEMASTORE VIEW une_rt_m_pl_snapshot_table WITH CONTAINER eurostat AS
SELECT
    value.`168` AS rate_1997_01,
    value.`510` AS rate_2025_07,
    value.`522` AS rate_2026_07
FROM eurostat_rest.une_rt_m_pl;
```

The view has exactly three columns. It is a spot check, not a wide-format snapshot. The indices are:

| Column | Flat index | Period | Observed value |
| :--- | ---: | :--- | ---: |
| `rate_1997_01` | 168 | 1997-01 | 11.8 |
| `rate_2025_07` | 510 | 2025-07 | 3.1 |
| `rate_2026_07` | 522 | 2026-07 | 3.4 |

The series view includes `2026-08`, but the snapshot view does not. Do not use the snapshot view as the
latest-value source.

### Series view

```sql
CREATE SCHEMASTORE VIEW une_rt_m_pl_series_table WITH CONTAINER eurostat AS
SELECT
    time_label AS period,
    CAST(rate_value AS DOUBLE) AS unemployment_rate_pct
FROM eurostat_rest.une_rt_m_pl
LATERAL VIEW explode(from_json(to_json(value), 'map<string,double>')) AS time_key, rate_value
LATERAL VIEW explode(from_json(to_json(dimension.time.category.index), 'map<string,bigint>')) AS time_label, time_index_value
WHERE CAST(time_key AS INT) = time_index_value;
```

Both dynamic-key objects are coerced with `from_json(to_json(...))`. A plain `explode()` fails because
Zetaris infers both objects as structs, not maps. The join compares the stringified flat index in `value`
with the integer time index.

The view has two columns:

| Column | Type | Meaning |
| :--- | :--- | :--- |
| `period` | string | Calendar month in `YYYY-MM` form. |
| `unemployment_rate_pct` | double | Unemployment rate as a percentage of the labour force. |

It has 356 rows, one per populated month. It does not carry the source status flags.

## Verified state

Observed on 2026-10-23 against the live Zetaris instance:

| Check | Result |
| :--- | :--- |
| `EUROSTAT_REST.une_rt_m_pl` selected fields | `class=dataset`, `source=ESTAT`, `updated=2026-10-21T11:00:00+0200`, `version=2.0` |
| Metadata row | Label, source, timestamp, and `geo_labels` as expected |
| Series row count | 356 |
| Series distinct periods | 356 |
| Series first period | `1997-01` |
| Series last period | `2026-08` |
| Snapshot values | `11.8`, `3.1`, `3.4` |
| Series view types | `period string`, `unemployment_rate_pct double` |
| Snapshot view types | `rate_1997_01 double`, `rate_2025_07 double`, `rate_2026_07 double` |
| Metadata view types | `dataset_label string`, `dataset_source string`, `last_updated string`, `geo_labels struct<PL:string>`, `time_index_map struct<...525 fields>` |

## Verification queries

Run the preflight first:

```bash
cd /path/to/zetaris-getting-started
python3 scripts/preflight.py
```

Then run the checks one at a time:

```bash
python3 scripts/run_sql.py -e "SELECT COUNT(*) AS n, MIN(period) AS first_period, MAX(period) AS last_period, COUNT(DISTINCT period) AS distinct_periods FROM eurostat.une_rt_m_pl_series_table"
python3 scripts/run_sql.py -e "SELECT period, unemployment_rate_pct FROM eurostat.une_rt_m_pl_series_table ORDER BY period DESC LIMIT 5"
python3 scripts/run_sql.py -e "SELECT dataset_label, dataset_source, last_updated, geo_labels FROM eurostat.une_rt_m_pl_metadata_table"
python3 scripts/run_sql.py -e "SELECT rate_1997_01, rate_2025_07, rate_2026_07 FROM eurostat.une_rt_m_pl_snapshot_table"
python3 scripts/run_sql.py -e "DESCRIBE eurostat.une_rt_m_pl_series_table"
python3 scripts/run_sql.py -e "DESCRIBE eurostat.une_rt_m_pl_snapshot_table"
```

Expected outputs:

| Query | Expected |
| :--- | :--- |
| Count/range | `n=356`, `first_period=1997-01`, `last_period=2026-08`, `distinct_periods=356` |
| Latest rows | `2026-08` = 3.4, `2026-07` = 3.4, `2026-06` = 3.4, `2026-05` = 3.4, `2026-04` = 3.3 |
| Metadata | Label, `ESTAT`, `2026-10-21T11:00:00+0200`, `{"PL":"Poland"}` |
| Snapshot | `11.8`, `3.1`, `3.4` |
| Series describe | `period string`, `unemployment_rate_pct double` |
| Snapshot describe | Three `double` columns |

## Known drift from the 2026-09-19 scripts

The onboarding scripts are historical records. They were correct on 2026-09-19 and are not edited by this
dossier.

1. **Value count.** `07_eurostat_create.sql` says 355 values through `2026-07`. The live source now has 356
   values through `2026-08`.
2. **Latest month.** Caveat 2 says `2026-08` was not published on 2026-09-19. It is published now. The new
   empty position is `2026-09`.
3. **Snapshot examples.** `07_eurostat_select.sql` examples 2 and 3 use the three-column snapshot view and
   therefore end at `2026-07`. The full series view ends at `2026-08`.
4. **Snapshot name.** `une_rt_m_pl_snapshot_table` can be misread as a full wide table. It is a three-column
   spot check.
5. **Licence header.** The create script's header points to
   `https://ec.europa.eu/eurostat/about/policies/copyright`, which returns 404. The official page is
   `https://ec.europa.eu/eurostat/en/help/copyright-notice`.
6. **Catalogue wording.** `open_data/rest_apis/rest-api-sources.md` says the licence is "commonly understood
   to align with CC-BY 4.0, but this has not been independently confirmed". The official notice distinguishes
   editorial content (CC BY 4.0) from statistical data reuse (authorised with attribution under Decision
   2011/833/EU). See [`license-and-attribution.md`](license-and-attribution.md).

## Limits

- **Poland only.** The registration URL fixes `geo=PL`.
- **One sex.** The registration URL fixes `sex=T`.
- **One age class.** The registration URL fixes `age=TOTAL`.
- **One unit.** The registration URL fixes `unit=PC_ACT`.
- **One adjustment.** The registration URL fixes `s_adj=SA`.
- **No status flags in the series view.** The raw `status` struct has two entries for PL, but the decoded view
  does not expose them.
- **No history.** The registration returns the current vintage. Revisions overwrite prior values.
- **Dynamic structs.** `value`, `status`, and `dimension.time.category.index` are structs with one field per
  key. Do not treat them as maps without coercion.
- **Snapshot view is narrow.** It has three columns and ends at `2026-07`.
- **REST table is a registration, not a cache guarantee.** Treat queries as reads against the registered
  endpoint; do not assume a local copy or a vintage.

## Adding another country

There is no runtime parameter on the registered REST table. To add Germany, for example, create a second
registration with `geo=DE` and a distinct table name:

```sql
CREATE LIGHTNING REST TABLE une_rt_m_de FROM EUROSTAT_REST REQUEST(
    endpoint "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&geo=DE&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA&lang=EN",
    method "get",
    response_type "json",
    http_encoding "URLENCODED"
) HEADER (
) BODY ();
```

Then create the same three views with `de` names. This is a live change and is not part of this dossier. For
ad-hoc analysis, the public API is simpler and avoids creating one table per country.

## Browser example

[`examples/eurostat-crud`](../../../examples/eurostat-crud/README.md) reads the series and metadata
views through the Zetaris SQL REST endpoint (`POST /sql-editor/sqls/run`). Zetaris does not send
CORS headers, so the Angular development server proxies `/zetaris-api` to `ZETARIS_REST_URL`. The
app asks for the API key at runtime and keeps it in `sessionStorage`; it does not read the key from
source, `.env.local`, or `localStorage`. This is a local demonstration. A production deployment
needs a same-origin reverse proxy or a server-side BFF, and a public app must not ship a Zetaris key.

## Security

- The repository's SQL helpers read the key from `.env.local`. The example app accepts a runtime key
  in `sessionStorage` for local development only.
- Never commit or embed `ZETARIS_API_KEY` in source, a notebook, a screenshot, or a document.
- A production browser app needs a server-side credential boundary; do not expose a Zetaris key to
  public clients.
- The Eurostat endpoint itself needs no key.
- The REST table registration does not add authentication to Eurostat; it adds a Zetaris object that reads
  the public endpoint.

## Teardown

The create script comments out the teardown. If removal is explicitly approved, the views can be dropped with
SQL:

```sql
DROP VIEW eurostat.une_rt_m_pl_metadata_table;
DROP VIEW eurostat.une_rt_m_pl_snapshot_table;
DROP VIEW eurostat.une_rt_m_pl_series_table;
```

The underlying REST table and Lightning database are removed through the Zetaris Data Explorer; the script
notes that there is no SQL path for those objects. Do not run teardown as part of routine verification.
