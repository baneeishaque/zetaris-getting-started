# Operations runbook

This runbook covers the Eurostat `une_rt_m` registration and the public API. It does not create, modify, or
delete anything unless a step explicitly says so. Run read-only checks first, and get approval before any
mutation.

## Prerequisites

| Requirement | Why |
| :--- | :--- |
| Python 3.9 or later | Runs `scripts/preflight.py`, `scripts/run_sql.py`, and `scripts/onboard.py`. |
| `.env.local` | Holds `ZETARIS_REST_URL`, `ZETARIS_API_KEY`, `ZETARIS_USERNAME`, `ZETARIS_PASSWORD`, and `ZETARIS_USER_AGENT`. |
| Zetaris REST access | The registration and verification queries use the REST channel. |
| `curl` | Fetches the live JSON-stat response. |
| `python3` standard library | Parses JSON without extra packages. |
| Network access to `ec.europa.eu` | Required for live verification and refresh. |

No Node.js runtime is required for the data source or the Zetaris checks. The optional Angular example
needs Node.js 26; see [`examples/eurostat-crud/README.md`](../../../examples/eurostat-crud/README.md).

## Preflight

Run this before any Zetaris work:

```bash
cd /path/to/zetaris-getting-started
python3 scripts/preflight.py
```

Expected result:

```text
[PASS] env file: /path/to/zetaris-getting-started/.env.local
[PASS] ZETARIS_API_KEY: set
[PASS] ZETARIS_USERNAME: set
[PASS] ZETARIS_PASSWORD: set
[PASS] ZETARIS_USER_AGENT: set, in the form app_name user@domain.tld
[PASS] REST datasources: HTTP 200
[PASS] REST SELECT 1
[INFO] lightning databases: EUROSTAT_REST, ...
READY
```

If preflight fails, stop and report the missing item. Do not create credentials or change the endpoint to work
around a failure.

## Verify the live source

### Fetch the registered slice

```bash
cd /path/to/zetaris-getting-started
curl -sS --compressed \
  'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA' \
  -o /tmp/eurostat_pl_t.json
```

### Check the count, range, missing positions, and status

```bash
python3 - <<'PY'
import json

with open('/tmp/eurostat_pl_t.json', encoding='utf-8') as handle:
    data = json.load(handle)

time_index = data['dimension']['time']['category']['index']
index_to_period = {position: period for period, position in time_index.items()}
values = data['value']
keys = sorted(int(key) for key in values)
missing = data['extension']['positions-with-no-data']['time']
status = data['status']

print('updated', data['updated'])
print('values', len(values))
print('first', index_to_period[keys[0]])
print('last', index_to_period[keys[-1]])
print('missing', len(missing))
print('status', status)
PY
```

Expected:

```text
updated 2026-10-21T11:00:00+0200
values 356
first 1997-01
last 2026-08
missing 169
status {'312': 'b', '323': 'd'}
```

If the values differ, record the new count, first/last period, missing count, and status. Update the
verification ledger in [`data-quality.md`](data-quality.md) before drawing conclusions.

### Check the API contract

```bash
curl -sSI \
  'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA' \
  | sed -n '1,20p'
```

Expected headers include:

```text
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## Verify the Zetaris registration

### Count and range

```bash
python3 scripts/run_sql.py -e "SELECT COUNT(*) AS n, MIN(period) AS first_period, MAX(period) AS last_period, COUNT(DISTINCT period) AS distinct_periods FROM eurostat.une_rt_m_pl_series_table"
```

Expected:

```text
['356', '1997-01', '2026-08', '356']
```

### Latest rows

```bash
python3 scripts/run_sql.py -e "SELECT period, unemployment_rate_pct FROM eurostat.une_rt_m_pl_series_table ORDER BY period DESC LIMIT 5"
```

Expected:

```text
['2026-08', '3.4']
['2026-07', '3.4']
['2026-06', '3.4']
['2026-05', '3.4']
['2026-04', '3.3']
```

### Metadata

```bash
python3 scripts/run_sql.py -e "SELECT dataset_label, dataset_source, last_updated, geo_labels FROM eurostat.une_rt_m_pl_metadata_table"
```

Expected:

```text
['Unemployment by sex and age - monthly data', 'ESTAT', '2026-10-21T11:00:00+0200', '{"PL":"Poland"}']
```

### Snapshot

```bash
python3 scripts/run_sql.py -e "SELECT rate_1997_01, rate_2025_07, rate_2026_07 FROM eurostat.une_rt_m_pl_snapshot_table"
```

Expected:

```text
['11.8', '3.1', '3.4']
```

### Types

```bash
python3 scripts/run_sql.py -e "DESCRIBE eurostat.une_rt_m_pl_series_table"
python3 scripts/run_sql.py -e "DESCRIBE eurostat.une_rt_m_pl_snapshot_table"
python3 scripts/run_sql.py -e "DESCRIBE eurostat.une_rt_m_pl_metadata_table"
```

Expected:

```text
series:   period string, unemployment_rate_pct double
snapshot: rate_1997_01 double, rate_2025_07 double, rate_2026_07 double
metadata: dataset_label string, dataset_source string, last_updated string,
          geo_labels struct<PL:string>, time_index_map struct<...525 fields>
```

## Refresh the registration

The manifest id is `eurostat`. Use `onboard.py` so the dependency order and the create script are resolved from
the manifest rather than typed by hand.

### Show the plan

```bash
cd /path/to/zetaris-getting-started
python3 scripts/onboard.py plan eurostat
```

### Dry run

```bash
python3 scripts/onboard.py run eurostat --dry-run
```

Review the statement list. The create script includes:

- `CREATE LIGHTNING DATABASE EUROSTAT_REST`
- `CREATE SCHEMASTORE CONTAINER eurostat`
- `CREATE LIGHTNING REST TABLE une_rt_m_pl`
- Three `CREATE SCHEMASTORE VIEW` statements

### Re-run with skip-exists

After approval, and only if the objects already exist or the intent is to refresh the registration:

```bash
python3 scripts/onboard.py run eurostat --skip-exists
```

`--skip-exists` skips duplicate-object errors. Without it, the run stops at the first object that already
exists. A refresh does not rewrite the view definitions if they already exist; to change a view, drop and
recreate it deliberately.

### Verify after refresh

Re-run the count, range, metadata, snapshot, and type checks above. Compare the live source count with the
Zetaris count. They must match.

## Teardown

Teardown is destructive. Get explicit approval before running it.

### Show the teardown plan

```bash
python3 scripts/onboard.py teardown eurostat
```

### Execute

```bash
python3 scripts/onboard.py teardown eurostat --yes
```

The runner drops the views it can derive from the create script. It leaves REST/file registrations, Lightning
databases, and SchemaStore containers for manual cleanup and lists them in its output. The create script's own
teardown section comments out only the three `DROP VIEW` statements. The REST table and `EUROSTAT_REST`
database are removed through the Zetaris Data Explorer.

Do not use `--drop-namespace` for this source; it is a USL option and there is no USL namespace here.

## Troubleshooting

| Symptom | Likely cause | Action |
| :--- | :--- | :--- |
| Preflight 401 | Bad `ZETARIS_API_KEY` | Re-check `.env.local`; do not print the key. |
| Preflight 400 | Bad `X-Org-ID` or non-UUID `X-Request-ID` | Check the REST helper configuration. |
| `Operation not permitted` before HTTP | Local network restriction | Request elevated execution for the read-only preflight; do not change the endpoint. |
| Empty API result | Invalid dimension code | Check `age`, `sex`, `geo`, `unit`, and `s_adj` against the valid codes. |
| `dimension.age.category.index = {}` | Invalid age, such as `Y15-74` | Use `TOTAL`, `Y_LT25`, or `Y25-74`. |
| `value = {}` | Invalid code or no data for the slice | Re-check the URL; the API returns HTTP 200 even for empty results. |
| CORS error in a browser | Eurostat changed CORS, Zetaris was called cross-origin, or the request is malformed | Check the response headers. The example app uses the same-origin `/zetaris-api` dev proxy; a production app needs a reverse proxy or BFF. |
| Series view empty | View creation failed or the raw table is empty | Check `DESCRIBE` and `SELECT * FROM eurostat_rest.une_rt_m_pl LIMIT 1`. |
| `DATATYPE_MISMATCH` on `explode()` | Dynamic-key object was not coerced | Apply `from_json(to_json(...), 'map<...>')` to both `value` and `dimension.time.category.index`. |
| Latest row is `2026-07` | Querying the snapshot view | Use `une_rt_m_pl_series_table`; the snapshot view ends at `2026-07`. |
| Latest row is `2026-08`, but `2026-09` is expected | Normal reporting lag | Check the source `updated` timestamp and the next release. |
| Count mismatch | Source revised or registration stale | Re-run the live count and the Zetaris count; refresh if needed. |

## Security

- Keep `ZETARIS_API_KEY` in `.env.local`. Never print it, paste it into a document, or commit it.
- The example app accepts a runtime key in `sessionStorage` for local development only. A production app
  needs a server-side credential boundary.
- The Eurostat API needs no key. Do not add one.
- Do not commit `.env.local`, downloaded responses, or query outputs that contain credentials.
- Use the least-privileged Zetaris account that can read the objects. Creating, dropping, and granting are
  administrative actions.
- Do not run teardown or refresh commands without explicit approval.

## Change log

| Date | Change | Evidence |
| :--- | :--- | :--- |
| 2026-10-23 | Initial verification of the live source, Zetaris series view, metadata view, and snapshot view. | 356 values, 356 rows, metadata timestamp, snapshot values. |
| 2026-10-23 | Documented the 2026-09-19 script drift. | Live source has 356 values through 2026-08; script says 355 through 2026-07. |
| 2026-10-23 | Corrected the licence reference to the official copyright notice. | Old `/about/policies/copyright` URL returns 404. |
