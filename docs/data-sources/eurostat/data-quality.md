# Data quality and verification

## Verification ledger

All checks below were run on **2026-10-23** against the live Eurostat API and the registered Zetaris instance.

| Check | Expected | Observed | Verdict |
| :--- | :--- | :--- | :--- |
| Live PL/T `value` count | 356 | 356 | PASS |
| Live PL/T distinct periods | 356 | 356 | PASS |
| Live PL/T first period | `1997-01` | `1997-01` | PASS |
| Live PL/T last period | `2026-08` | `2026-08` | PASS |
| Live PL/T no-data positions | 169 | 169 | PASS |
| Live PL/T status entries | 2 | `2009-01=b`, `2009-12=d` | PASS |
| Source `updated` | `2026-10-21T11:00:00+0200` | Same | PASS |
| Zetaris series rows | 356 | 356 | PASS |
| Zetaris distinct periods | 356 | 356 | PASS |
| Zetaris first/last | `1997-01` / `2026-08` | Same | PASS |
| Zetaris metadata timestamp | `2026-10-21T11:00:00+0200` | Same | PASS |
| Zetaris snapshot values | `11.8`, `3.1`, `3.4` | Same | PASS |
| Full dataset values | 757,828 | 757,828 | PASS |
| Full dataset status flags | 11,291 | 11,291 | PASS |
| Full dataset time categories | 525 | 525 | PASS |
| CORS | `Access-Control-Allow-Origin: *` | Present | PASS |
| Invalid `age=Y15-74` | Empty category and value | Empty | PASS (documented quirk) |
| Invalid `geo=XX` | Empty category and value | Empty | PASS (documented quirk) |

## Coverage of the five-country comparison

Fixed dimensions: `sex=T`, `age=TOTAL`, `unit=PC_ACT`, `s_adj=SA`. Counts are identical for `M` and `F`.

| Country | Values | First | Last | Missing | Missing explanation |
| :--- | ---: | :--- | :--- | ---: | :--- |
| Poland (`PL`) | 356 | 1997-01 | 2026-08 | 169 | 168 leading months + 2026-09 |
| Germany (`DE`) | 428 | 1991-01 | 2026-08 | 97 | 96 leading months + 2026-09 |
| France (`FR`) | 524 | 1983-01 | 2026-08 | 1 | 2026-09 |
| Spain (`ES`) | 485 | 1986-04 | 2026-08 | 40 | 39 leading months + 2026-09 |
| Italy (`IT`) | 524 | 1983-01 | 2026-08 | 1 | 2026-09 |

The full 38-category geography table, with counts and ranges, is in
[`data-dictionary.md`](data-dictionary.md).

## Missing data

### Registered PL slice

The PL slice has 525 time positions and 356 populated values. The 169 missing positions are:

- `1983-01` through `1996-12`: 168 leading months before the Polish series starts.
- `2026-09`: the latest time position, present in the axis but not yet populated.

The source reports these explicitly:

```json
{
  "extension": {
    "positions-with-no-data": {
      "time": [0, 1, 2, "...", 166, 167, 524]
    }
  }
}
```

The array has 169 entries: indices `0`–`167` and `524`.

### Full dataset

The full dataset has 757,828 values across 1,077,300 possible cells. Its
`extension.positions-with-no-data` arrays are empty for every dimension, including `time`. A missing value is
therefore indicated by the absence of a key from `value`, not by an explicit no-data list.

The full dataset's 38 geography categories have very different start dates. For example, Ireland, the
Netherlands, and Sweden have values from `1983-01`; Poland and Romania start in `1997-01`; Bosnia and
Herzegovina starts in `2021-01`; Switzerland's series ends in `2026-06`. These are country-specific coverage
differences, not data corruption.

## Contiguity

For the five-country comparison, the number of populated values equals the number of months between the first
and last populated month:

| Country | Expected months | Observed values | Duplicate periods |
| :--- | ---: | ---: | :--- |
| Poland | 356 | 356 | 0 |
| Germany | 428 | 428 | 0 |
| France | 524 | 524 | 0 |
| Spain | 485 | 485 | 0 |
| Italy | 524 | 524 | 0 |

The PL check is also confirmed in Zetaris:

```text
COUNT(*) = 356
COUNT(DISTINCT period) = 356
MIN(period) = 1997-01
MAX(period) = 2026-08
```

There are no duplicate periods and no interior gaps in the PL series.

## PL/T series profile

| Statistic | Value |
| :--- | :--- |
| Count | 356 |
| First | `1997-01` = 11.8 |
| Latest | `2026-08` = 3.4 |
| Previous month | `2026-07` = 3.4 |
| Year-over-year | `2025-08` = 3.2; change +0.2 |
| Minimum | `2023-02` = 2.6 |
| Maximum | `2002-08` = 20.5 |
| Mean | 9.47 |
| Median | 9.50 |
| Change since first | -8.4 percentage points |

The series is not monotonic. It rose to a peak of 20.5 in 2002-08, fell through the 2010s, and reached its
minimum of 2.6 in 2023-02 before settling near 3.4 in 2026.

## Status flags

### Full-dataset distribution

| Code | Label | Count |
| :--- | :--- | ---: |
| `b` | break in time series | 1,307 |
| `d` | definition differs (see metadata) | 846 |
| `p` | provisional | 5,832 |
| `u` | low reliability | 3,306 |
| **Total** | | **11,291** |

### Five-country flags

| Country | Flagged months | Details |
| :--- | ---: | :--- |
| Poland | 2 | `2009-01` = b; `2009-12` = d |
| Germany | 2 | `2005-03` = d; `2009-01` = b |
| France | 3 | `1995-12` = d; `2003-01` = b; `2021-01` = d |
| Spain | 1 | `1995-12` = d |
| Italy | 109 | `1983-01`–`1991-12` = p (108 months); `2004-01` = b |

The flags are stored in the top-level `status` object, keyed by the same flat index as `value`. The
`extension.status.label` object only maps codes to labels. The Zetaris series view does not carry the flags,
so a SQL consumer that needs to exclude provisional or low-reliability values must join back to the raw REST
table.

### Interpretation

- `b` means a break in the time series. Comparisons across the break should be made with care.
- `d` means the definition differs from the standard. Read the ESMS metadata before comparing the value with
  other countries.
- `p` means provisional. The value may be revised.
- `u` means low reliability. The estimate is based on a small sample or otherwise uncertain.

Italy's 108 provisional months from 1983-01 to 1991-12 are the largest block in the five-country comparison.
A consumer that treats all Italian history as equally reliable would overstate confidence in the 1980s and
early 1990s.

## Seasonal adjustment

The registered slice uses `SA`, "Seasonally adjusted data, not calendar adjusted data". The full dataset also
contains:

- `NSA`: unadjusted data, neither seasonally nor calendar adjusted.
- `TC`: trend cycle data.

Do not compare an `SA` series with an `NSA` series without stating the difference. The `SA` series is the
headline monthly indicator, but the `NSA` series is the one that is temporally consistent with the published
quarterly LFS. The ESMS notes that the headline figures in the monthly unemployment news release are
seasonally adjusted.

## Revisions

The source is a current-vintage dataset. Revisions are not optional; they are part of the production process.

### Routine revisions

- New validated data update the already disseminated series.
- Aggregates and components are revised together.
- Monthly series are kept temporally consistent with the quarterly LFS.
- Seasonal adjustment models are reviewed annually, and the annual review can revise seasonally adjusted
  history.
- For routine revisions, data are considered final after six months.

### Major revisions affecting this dossier

| Country | Revision | Published |
| :--- | :--- | :--- |
| Poland | Data revised from January 2019 to June 2023 due to Census 2021 revisions | 2024-03-01 |
| Germany | Data revised back to 2009 due to Census 2021 revisions | 2025-06-03 |
| France | Data revised back to 2003 due to the inclusion of Mayotte | 2026-10-01 |
| Spain | Data revised from January 2021 to December 2023 due to Census 2021 revisions | 2024-05-03 |

The France revision was published on 2026-10-01, less than a month before this verification. It is the most
recent major revision in the five-country set.

### Unscheduled revisions

Eurostat corrects validated errors as soon as the correct data are available. The ESMS records unscheduled
revisions for Lithuania in 2021–2023; those do not affect the five-country comparison but illustrate that the
source can change outside the routine calendar.

## Known source quirks

1. **Invalid codes return empty data, not an HTTP error.** `age=Y15-74` and `geo=XX` both return HTTP 200 with
   an empty category index and an empty `value` object.
2. **The latest time position can be empty.** `2026-09` is in the axis but has no value for the registered
   slice or the five-country comparison.
3. **The snapshot view is three columns.** It is not a wide table and it ends at `2026-07`.
4. **The series view drops status flags.** Use the raw REST table or the API if flags matter.
5. **The full dataset includes non-EU countries.** The United States and Japan are present. Eurostat's general
   reuse permission does not cover commercial reuse of data for countries outside the EU, EFTA, and official
   EU acceding and candidate countries. See [`license-and-attribution.md`](license-and-attribution.md).
6. **The value keys are stringified flat indices.** They are not time labels. For a filtered slice with all
   non-time dimensions at size 1, the key equals the time index; for a multi-dimension slice, it does not.

## Validation commands

### Live source

```bash
curl -sS --compressed \
  'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA' \
  -o /tmp/eurostat_pl_t.json
python3 - <<'PY'
import json
with open('/tmp/eurostat_pl_t.json', encoding='utf-8') as handle:
    data = json.load(handle)
print('values', len(data['value']))
print('no-data', len(data['extension']['positions-with-no-data']['time']))
print('status', data['status'])
PY
```

Expected:

```text
values 356
no-data 169
status {'312': 'b', '323': 'd'}
```

### Zetaris

```bash
python3 scripts/preflight.py
python3 scripts/run_sql.py -e "SELECT COUNT(*) AS n, MIN(period) AS first_period, MAX(period) AS last_period, COUNT(DISTINCT period) AS distinct_periods FROM eurostat.une_rt_m_pl_series_table"
python3 scripts/run_sql.py -e "SELECT period, unemployment_rate_pct FROM eurostat.une_rt_m_pl_series_table ORDER BY period DESC LIMIT 5"
```

Expected:

```text
n=356, first_period=1997-01, last_period=2026-08, distinct_periods=356
2026-08 3.4
2026-07 3.4
2026-06 3.4
2026-05 3.4
2026-04 3.3
```

## Quality verdict

The registered PL slice is complete and internally consistent: 356 values, 356 distinct periods, no duplicate
periods, no interior gaps, and an exact match between the live source and the Zetaris series view. The main
quality caveats are the two status-flagged months, the current-vintage revision model, and the fact that the
Zetaris views do not expose status flags. For the five-country comparison, France and Italy are effectively
complete, Germany and Spain have well-understood start dates, and Poland has the largest leading gap. The
source's overall accuracy is assessed as high by Eurostat, with the caveats described in the ESMS metadata.
