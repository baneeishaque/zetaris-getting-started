# Data dictionary

This document describes every field, dimension code, Zetaris column, and decode rule used by the Eurostat
`une_rt_m` registration. It is intentionally exhaustive: the source is a sparse JSON-stat object, and most
implementation mistakes come from treating its dynamic-key objects as arrays or maps without checking the
shape.

## Source JSON-stat fields

The live PL/T response has 11 top-level fields.

| Field | Type | Meaning |
| :--- | :--- | :--- |
| `version` | string | JSON-stat version. Observed `2.0`. |
| `class` | string | Object class. Observed `dataset`. |
| `label` | string | Dataset title: "Unemployment by sex and age - monthly data". |
| `source` | string | Source agency. Observed `ESTAT`. |
| `updated` | string | Source update timestamp, `2026-10-21T11:00:00+0200`. |
| `value` | object of string to number | Sparse observations. Keys are stringified flat indices; values are rates or levels. |
| `status` | object of string to string | Optional observation status flags. Keys are stringified flat indices; values are codes such as `b`, `d`, `p`, `u`. |
| `id` | array of string | Dimension order: `freq`, `s_adj`, `age`, `unit`, `sex`, `geo`, `time`. |
| `size` | array of number | Dimension cardinalities. Full dataset: `[1, 3, 3, 2, 3, 38, 525]`. |
| `dimension` | object of string to dimension | Per-dimension category index and labels. |
| `extension` | object | Structural metadata, annotations, no-data positions, and status labels. |

### `dimension` object

Each entry under `dimension` has this shape:

| Field | Type | Meaning |
| :--- | :--- | :--- |
| `label` | string | Human-readable dimension name, such as "Time frequency". |
| `category` | object | Category metadata. |
| `category.index` | object of string to number | Maps a category code or period label to its integer position. |
| `category.label` | object of string to string | Maps a category code or period label to a human-readable label. |

For the time dimension, `category.index` maps a period such as `2026-08` to an integer. The key is already
human-readable, so decoding time does not require `category.label`.

### `extension` object

| Field | Type | Meaning |
| :--- | :--- | :--- |
| `extension.agencyId` | string | `ESTAT`. |
| `extension.id` | string | `UNE_RT_M`. |
| `extension.version` | string | `1.0` for the extension payload. |
| `extension.lang` | string | `EN`. |
| `extension.datastructure` | object | `{id: "UNE_RT_M", agencyId: "ESTAT", version: "156.0"}`. |
| `extension.annotation` | array | 19 annotation objects. Includes DOI, explanatory links, ESMS links, observation count, period bounds, and update timestamps. |
| `extension.positions-with-no-data` | object | Per-dimension arrays of positions with no data. For the PL slice, only `time` is non-empty: 169 indices. |
| `extension.status.label` | object of string to string | Maps status codes to labels. Observed `b`, `d`, `p`, `u`. |

The annotation types observed in the PL/T response are:

| Annotation type | Meaning |
| :--- | :--- |
| `CREATED` | Dataset creation timestamp. |
| `DISSEMINATION_DOI_XML` | DOI identifier payload. |
| `DISSEMINATION_EXPLANATORY_LINK` | Link to the information note PDF. |
| `DISSEMINATION_OBJECT_TYPE` | `DATASET`. |
| `DISSEMINATION_TIMESTAMP_DATA` | Data update timestamp. |
| `DISSEMINATION_TIMESTAMP_GLOBAL` | Global update timestamp. |
| `DISSEMINATION_TIMESTAMP_PLANNED` | Planned update timestamp. |
| `ESMS_HTML` | ESMS metadata page. |
| `ESMS_SDMX` | ESMS SDMX download. |
| `FOOTNOTE` | Footnote workbook. |
| `OBS_COUNT` | `757828` for the full dataset. |
| `OBS_PERIOD_OVERALL_LATEST` | `2026-09`. |
| `OBS_PERIOD_OVERALL_OLDEST` | `1983-01`. |
| `SOURCE_INSTITUTIONS` | `Eurostat`. |
| `UPDATE_DATA` | Data update timestamp. |
| `UPDATE_FOOTNOTES` | Footnote update timestamp. |
| `UPDATE_STRUCTURE` | Structure update timestamp. |

## Dimension codes

### Fixed dimensions

| Dimension | Full codes | Registered slice | Notes |
| :--- | :--- | :--- | :--- |
| `freq` | `M` | `M` | Monthly only. |
| `s_adj` | `NSA`, `SA`, `TC` | `SA` | The registered slice is seasonally adjusted, not calendar adjusted. |
| `age` | `TOTAL`, `Y_LT25`, `Y25-74` | `TOTAL` | `Y_LT25` is under 25; `Y25-74` is 25 to 74. |
| `unit` | `THS_PER`, `PC_ACT` | `PC_ACT` | `THS_PER` is thousands of persons; `PC_ACT` is a percentage of the labour force. |
| `sex` | `T`, `M`, `F` | `T` | Total, males, females. |
| `geo` | 38 categories | `PL` | See the full table below. |
| `time` | 525 months | 525 months | `1983-01` to `2026-09`. |

### Geography codes

The following table lists every `geo` category in the full dataset. The counts and ranges are for the fixed
slice `sex=T`, `age=TOTAL`, `unit=PC_ACT`, `s_adj=SA`. They are useful for choosing additional registrations
without re-querying the API.

| Code | Label | Values | First | Last | Missing |
| :--- | :--- | ---: | :--- | :--- | ---: |
| `EU27_2020` | European Union - 27 countries (from 2020) | 320 | 2000-01 | 2026-08 | 205 |
| `EA21` | Euro area - 21 countries (from 2026) | 320 | 2000-01 | 2026-08 | 205 |
| `BE` | Belgium | 485 | 1986-04 | 2026-08 | 40 |
| `BG` | Bulgaria | 320 | 2000-01 | 2026-08 | 205 |
| `CZ` | Czechia | 404 | 1993-01 | 2026-08 | 121 |
| `DK` | Denmark | 524 | 1983-01 | 2026-08 | 1 |
| `DE` | Germany | 428 | 1991-01 | 2026-08 | 97 |
| `EE` | Estonia | 319 | 2000-02 | 2026-08 | 206 |
| `IE` | Ireland | 525 | 1983-01 | 2026-09 | 0 |
| `EL` | Greece | 341 | 1998-04 | 2026-08 | 184 |
| `ES` | Spain | 485 | 1986-04 | 2026-08 | 40 |
| `FR` | France | 524 | 1983-01 | 2026-08 | 1 |
| `HR` | Croatia | 320 | 2000-01 | 2026-08 | 205 |
| `IT` | Italy | 524 | 1983-01 | 2026-08 | 1 |
| `CY` | Cyprus | 320 | 2000-01 | 2026-08 | 205 |
| `LV` | Latvia | 341 | 1998-04 | 2026-08 | 184 |
| `LT` | Lithuania | 344 | 1998-01 | 2026-08 | 181 |
| `LU` | Luxembourg | 524 | 1983-01 | 2026-08 | 1 |
| `HU` | Hungary | 368 | 1996-01 | 2026-08 | 157 |
| `MT` | Malta | 320 | 2000-01 | 2026-08 | 205 |
| `NL` | Netherlands | 525 | 1983-01 | 2026-09 | 0 |
| `AT` | Austria | 380 | 1995-01 | 2026-08 | 145 |
| `PL` | Poland | 356 | 1997-01 | 2026-08 | 169 |
| `PT` | Portugal | 524 | 1983-01 | 2026-08 | 1 |
| `RO` | Romania | 356 | 1997-01 | 2026-08 | 169 |
| `SI` | Slovenia | 368 | 1996-01 | 2026-08 | 157 |
| `SK` | Slovakia | 344 | 1998-01 | 2026-08 | 181 |
| `FI` | Finland | 465 | 1988-01 | 2026-09 | 60 |
| `SE` | Sweden | 525 | 1983-01 | 2026-09 | 0 |
| `IS` | Iceland | 284 | 2003-01 | 2026-08 | 241 |
| `NO` | Norway | 452 | 1989-01 | 2026-08 | 73 |
| `CH` | Switzerland | 198 | 2010-01 | 2026-06 | 327 |
| `UK` | United Kingdom | 453 | 1983-01 | 2020-09 | 72 |
| `BA` | Bosnia and Herzegovina | 67 | 2021-01 | 2026-07 | 458 |
| `MK` | North Macedonia | 248 | 2006-01 | 2026-08 | 277 |
| `TR` | Türkiye | 259 | 2005-01 | 2026-07 | 266 |
| `US` | United States | 523 | 1983-01 | 2026-08 | 2 |
| `JP` | Japan | 524 | 1983-01 | 2026-08 | 1 |

`Missing` is `525` minus the number of populated values. It includes leading months before a country's series
starts, the empty latest month, and any country-specific gaps. The full dataset reports an empty
`positions-with-no-data.time` array; absence from `value` is the signal.

## Zetaris object map

| Object | Type | Purpose |
| :--- | :--- | :--- |
| `EUROSTAT_REST` | Lightning database (id 917) | Registration container for the Eurostat REST source. |
| `eurostat` | Schemastore container | Holds the decoded views. |
| `EUROSTAT_REST.une_rt_m_pl` | REST table | Raw JSON-stat response for the fixed PL slice. |
| `eurostat.une_rt_m_pl_metadata_table` | View | Dataset label, source, update timestamp, geo labels, and time index map. |
| `eurostat.une_rt_m_pl_snapshot_table` | View | Three fixed rate columns for a low-risk spot check. |
| `eurostat.une_rt_m_pl_series_table` | View | Fully decoded `(period, rate)` rows. |

## REST table fields

`EUROSTAT_REST.une_rt_m_pl` has 11 top-level fields.

| Field | Shape | Notes |
| :--- | :--- | :--- |
| `class` | string | `dataset`. |
| `dimension` | struct | Nested dimension metadata. Contains `freq`, `s_adj`, `age`, `unit`, `sex`, `geo`, `time`. |
| `extension` | struct | Annotations, data structure, no-data positions, and status labels. |
| `id` | array of string | Dimension order. |
| `label` | string | Dataset title. |
| `size` | array of number | Dimension sizes for the fixed slice: `[1, 1, 1, 1, 1, 1, 525]`. |
| `source` | string | `ESTAT`. |
| `status` | struct | Dynamic-key status flags for two PL months. |
| `updated` | string | Source timestamp. |
| `value` | struct | Dynamic-key values for 356 months. |
| `version` | string | `2.0`. |

The dynamic-key fields are inferred as structs, not maps. `value` has one field per populated flat index;
`dimension.time.category.index` has one field per time category. This is the reason the decode view applies
`from_json(to_json(...))` before `explode()`.

## Metadata view

`eurostat.une_rt_m_pl_metadata_table` has five columns.

| Column | Type | Meaning |
| :--- | :--- | :--- |
| `dataset_label` | string | "Unemployment by sex and age - monthly data". |
| `dataset_source` | string | `ESTAT`. |
| `last_updated` | string | `2026-10-21T11:00:00+0200`. |
| `geo_labels` | `struct<PL:string>` | `{"PL":"Poland"}`. |
| `time_index_map` | struct with 525 `bigint` fields | Maps every period label, including `2026-09`, to its integer index. |

`time_index_map` is a struct, not a map. It is convenient for a human or for direct field access by period
label, but it is not directly `explode()`-able without the same JSON coercion used for `value`.

## Snapshot view

`eurostat.une_rt_m_pl_snapshot_table` has exactly three columns.

| Column | Type | Period | Value |
| :--- | :--- | :--- | ---: |
| `rate_1997_01` | double | 1997-01 | 11.8 |
| `rate_2025_07` | double | 2025-07 | 3.1 |
| `rate_2026_07` | double | 2026-07 | 3.4 |

The view is a spot check. It is not a wide-format table and it does not include `2026-08`, even though the
series view does. The column names encode the period, so adding a month requires a schema change.

## Series view

`eurostat.une_rt_m_pl_series_table` has two columns.

| Column | Type | Meaning |
| :--- | :--- | :--- |
| `period` | string | Calendar month in `YYYY-MM` form. |
| `unemployment_rate_pct` | double | Unemployment rate as a percentage of the labour force. |

The view has 356 rows, one per populated month, from `1997-01` to `2026-08`. It does not carry status flags.
If a consumer needs the flags, it must read the raw `status` struct from `EUROSTAT_REST.une_rt_m_pl` or the API.

## Missing and status semantics

### Missing values

There are two different signals:

1. **`extension.positions-with-no-data`** is an explicit list of positions that the source declares as having
   no data. For the PL slice, `time` has 169 positions: `0` through `167` and `524`. The other dimensions have
   empty arrays.
2. **Absence from `value`** is the general signal. The full dataset reports an empty
   `positions-with-no-data.time` array, so a missing flat index is simply not present in `value`.

Do not infer missingness from a zero or an empty string. The source uses absent keys, not sentinel values.

### Status codes

| Code | Label | Full-dataset count | Meaning |
| :--- | :--- | ---: | :--- |
| `b` | break in time series | 1,307 | The series has a break at this observation. |
| `d` | definition differs (see metadata) | 846 | The definition differs from the standard; consult metadata. |
| `p` | provisional | 5,832 | The value is provisional and may be revised. |
| `u` | low reliability | 3,306 | The value has low reliability. |

The top-level `status` object is keyed by the same flat index as `value`. The `extension.status.label` object
maps the codes to their labels; it does not carry per-observation flags.

### Status flags in the five-country comparison

| Country | Flagged months | Codes |
| :--- | ---: | :--- |
| Poland | 2 | `2009-01` = b; `2009-12` = d |
| Germany | 2 | `2005-03` = d; `2009-01` = b |
| France | 3 | `1995-12` = d; `2003-01` = b; `2021-01` = d |
| Spain | 1 | `1995-12` = d |
| Italy | 109 | `1983-01`–`1991-12` = p (108 months); `2004-01` = b |

The flags are attached to the observations. The Zetaris series view drops them, so a SQL consumer that needs
to exclude provisional or low-reliability values must join back to the raw REST table.

## Decode technique

### Flat index

JSON-stat stores observations in a flat array (or, here, a sparse object keyed by the flat index). The flat
index is:

```text
flat = sum(index[d] * stride[d])
stride[d] = product(size[d + 1 :])
```

For the registered PL slice, every dimension except `time` has size 1, so the flat index equals the time
index. `2026-08` has time index `523`, so its flat index is `523`.

For the full dataset, the stride vector is:

```text
[1077300, 359100, 119700, 59850, 19950, 525, 1]
```

For the full-dataset cell `freq=M`, `s_adj=SA`, `age=TOTAL`, `unit=PC_ACT`, `sex=T`, `geo=PL`,
`time=2026-08`, the indices are `0, 1, 0, 1, 0, 22, 523`, and the flat index is:

```text
1*359100 + 1*59850 + 22*525 + 523 = 431023
```

### SQL decode

The registered series view uses two coercions and an equality join:

```sql
SELECT
    time_label AS period,
    CAST(rate_value AS DOUBLE) AS unemployment_rate_pct
FROM eurostat_rest.une_rt_m_pl
LATERAL VIEW explode(from_json(to_json(value), 'map<string,double>')) AS time_key, rate_value
LATERAL VIEW explode(from_json(to_json(dimension.time.category.index), 'map<string,bigint>')) AS time_label, time_index_value
WHERE CAST(time_key AS INT) = time_index_value;
```

Both `value` and `dimension.time.category.index` must be coerced. A plain `explode()` on either field fails
with a `DATATYPE_MISMATCH` because both are inferred as structs, not maps. The join compares the stringified
flat index in `value` with the integer time index.

### Python decode

A minimal, dependency-free decoder for the registered slice:

```python
import json
from urllib.request import urlopen

URL = (
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m"
    "?format=JSON&lang=EN&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA"
)

with urlopen(URL, timeout=60) as response:
    dataset = json.load(response)

time_index = dataset["dimension"]["time"]["category"]["index"]
index_to_period = {position: period for period, position in time_index.items()}
rows = sorted(
    (index_to_period[int(key)], value)
    for key, value in dataset["value"].items()
)
for period, value in rows[-3:]:
    print(period, value)
```

The decoder assumes the filtered slice has size 1 on every non-time dimension. For a multi-dimension slice,
compute the flat index with the stride formula instead of treating the `value` key as a time index.

## Example rows

### Metadata view row

```text
dataset_label: Unemployment by sex and age - monthly data
dataset_source: ESTAT
last_updated: 2026-10-21T11:00:00+0200
geo_labels: {"PL":"Poland"}
```

### Snapshot view row

```text
rate_1997_01: 11.8
rate_2025_07: 3.1
rate_2026_07: 3.4
```

### Series view rows

| `period` | `unemployment_rate_pct` | Note |
| :--- | ---: | :--- |
| `1997-01` | 11.8 | First populated month. |
| `2009-01` | 7.4 | Status `b` in the raw source. |
| `2009-12` | 9.1 | Status `d` in the raw source. |
| `2026-08` | 3.4 | Latest populated month. |
