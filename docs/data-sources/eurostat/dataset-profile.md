# Dataset profile: `une_rt_m`

## Identity

| Field | Value |
| :--- | :--- |
| Dataset code | `une_rt_m` |
| Dataset title | Unemployment by sex and age - monthly data |
| Producer | Eurostat, the statistical office of the European Union |
| Source agency code | `ESTAT` |
| Data structure | `UNE_RT_M` |
| Data structure agency | `ESTAT` |
| Data structure version | `156.0` |
| JSON-stat version | `2.0` |
| DOI | `10.2908/UNE_RT_M` |
| Source timestamp | `2026-10-21T11:00:00+0200` |
| Metadata last certified | `2026-01-08` |
| Metadata last posted | `2026-01-08` |
| Metadata last update | `2026-01-08` |
| Frequency | Monthly |
| Reference period | Calendar month |
| Statistical unit | Persons |
| Unit of measure | Percentage of the labour force (`PC_ACT`) |
| Seasonal adjustment | Seasonally adjusted (`SA`) for the registered slice |
| Age class | Total (`TOTAL`) for the registered slice |

## Statistical concept

The dataset measures **unemployment** using the International Labour Organization definitions used by the
European Union Labour Force Survey (EU-LFS). The relevant concepts are:

- **Unemployed persons** are persons aged 15 to 74 who were not employed during the reference week, had
  actively sought work during the past four weeks, and were ready to begin working immediately or within two
  weeks.
- **Employed persons** are persons who worked at least one hour for pay or profit during the reference week,
  or who were temporarily absent from such work.
- **The labour force** (active population) is the sum of employed and unemployed persons.
- **The unemployment rate** is the number of unemployed persons as a percentage of the labour force.

The dataset is monthly. Quarterly and annual unemployment is published separately in the LFS main indicators
collection. The monthly series is produced with methods specific to the indicator, including temporal
disaggregation and seasonal adjustment; it is not a simple monthly resampling of the quarterly LFS.

For the registered Zetaris slice the rate is expressed as `PC_ACT`, "Percentage of population in the labour
force". The dataset also contains `THS_PER` ("Thousand persons") for unemployment levels, but the Zetaris
registration selects only `PC_ACT`.

## Dimensions

The full dataset has seven dimensions. The registered Zetaris slice fixes six of them and keeps the time axis.

| Dimension | Label | Full size | Codes | Labels |
| :--- | :--- | ---: | :--- | :--- |
| `freq` | Time frequency | 1 | `M` | Monthly |
| `s_adj` | Seasonal adjustment | 3 | `NSA` | Unadjusted data (neither seasonally nor calendar adjusted) |
| `s_adj` | Seasonal adjustment | 3 | `SA` | Seasonally adjusted data, not calendar adjusted data |
| `s_adj` | Seasonal adjustment | 3 | `TC` | Trend cycle data |
| `age` | Age class | 3 | `TOTAL` | Total |
| `age` | Age class | 3 | `Y_LT25` | Less than 25 years |
| `age` | Age class | 3 | `Y25-74` | From 25 to 74 years |
| `unit` | Unit of measure | 2 | `THS_PER` | Thousand persons |
| `unit` | Unit of measure | 2 | `PC_ACT` | Percentage of population in the labour force |
| `sex` | Sex | 3 | `T` | Total |
| `sex` | Sex | 3 | `M` | Males |
| `sex` | Sex | 3 | `F` | Females |
| `geo` | Geopolitical entity (reporting) | 38 | See [`data-dictionary.md`](data-dictionary.md) | 2 aggregates and 36 countries |
| `time` | Time | 525 | `1983-01` to `2026-09` | Calendar months |

The dimension order in the response is:

```text
["freq", "s_adj", "age", "unit", "sex", "geo", "time"]
```

The corresponding size vector for the full dataset is:

```text
[1, 3, 3, 2, 3, 38, 525]
```

The product of the size vector is 1,077,300 possible cells. The full dataset contains 757,828 populated
values, or 70.3% of the possible cells. The remainder are absent because countries start at different dates,
because some combinations are not published, or because the latest month is not yet available for every
country.

## Coverage

### Registered Zetaris slice

The registered slice is Poland, total sex, total age, percentage of the labour force, seasonally adjusted,
monthly. It has 356 populated months out of 525 time positions.

| Property | Value |
| :--- | :--- |
| Country | Poland (`PL`) |
| Sex | Total (`T`) |
| Age | Total (`TOTAL`) |
| Unit | `PC_ACT` |
| Adjustment | `SA` |
| First period | `1997-01` |
| Last period | `2026-08` |
| Populated months | 356 |
| Missing time positions | 169 |
| First value | 11.8 |
| Latest value | 3.4 |

The 169 missing positions are the leading months from `1983-01` through `1996-12` (168 positions) plus the
empty `2026-09` position.

### Five-country comparison

The following table uses the same fixed dimensions (`age=TOTAL`, `unit=PC_ACT`, `s_adj=SA`, `sex=T`) and
summarises the five countries most likely to be used in a browser example. Counts are identical for the `M`
and `F` sex codes; only the values differ.

| Country | Values | First | Last | Missing | First value | Latest | Min | Max | Mean | Median |
| :--- | ---: | :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Poland (`PL`) | 356 | 1997-01 | 2026-08 | 169 | 11.8 | 3.4 | 2.6 (2023-02) | 20.5 (2002-08) | 9.47 | 9.50 |
| Germany (`DE`) | 428 | 1991-01 | 2026-08 | 97 | 5.2 | 4.0 | 2.9 (2019-04) | 11.2 (2005-04) | 6.44 | 6.65 |
| France (`FR`) | 524 | 1983-01 | 2026-08 | 1 | 7.1 | 8.2 | 6.7 (1983-02) | 11.0 (1997-04) | 9.03 | 8.90 |
| Spain (`ES`) | 485 | 1986-04 | 2026-08 | 40 | 20.6 | 10.0 | 7.9 (2007-05) | 26.4 (2013-02) | 16.11 | 16.00 |
| Italy (`IT`) | 524 | 1983-01 | 2026-08 | 1 | 6.9 | 6.2 | 5.5 (2026-01) | 13.1 (2014-11) | 9.24 | 9.05 |

Italy's minimum is the January 2026 value, the most recent minimum in the table. France and Italy have only
one missing time position each; their series are effectively complete from 1983-01 to 2026-08. Germany's series
starts in 1991-01, after unification. Spain's series starts in 1986-04. Poland's series starts in 1997-01.

### Full dataset geography

The full dataset has 38 geography categories:

- **Aggregates:** `EU27_2020` (European Union - 27 countries from 2020) and `EA21` (Euro area - 21 countries
  from 2026).
- **Countries:** Belgium, Bulgaria, Czechia, Denmark, Germany, Estonia, Ireland, Greece, Spain, France,
  Croatia, Italy, Cyprus, Latvia, Lithuania, Luxembourg, Hungary, Malta, Netherlands, Austria, Poland,
  Portugal, Romania, Slovenia, Slovakia, Finland, Sweden, Iceland, Norway, Switzerland, United Kingdom,
  Bosnia and Herzegovina, North Macedonia, Türkiye, United States, and Japan.

The complete code list with per-country coverage is in [`data-dictionary.md`](data-dictionary.md) and
[`data-quality.md`](data-quality.md).

## Time coverage

- The full dataset's time axis runs from `1983-01` to `2026-09`, inclusive: 525 calendar months.
- The earliest values begin in `1983-01` for several countries, including Denmark, France, Italy, Luxembourg,
  the Netherlands, Sweden, the United Kingdom, and the United States.
- Ireland, the Netherlands, and Sweden have values through `2026-09` in the full dataset.
- The five-country comparison ends at `2026-08` for all five countries; `2026-09` is empty for them.
- The registered PL slice ends at `2026-08`; `2026-09` is present in the time axis but has no value.
- Country-specific start dates explain most of the missing leading months. They are not gaps in an otherwise
  continuous series.

## Update and revision

### Source update

The live dataset reports `updated` as `2026-10-21T11:00:00+0200`. The same timestamp appears in the
`UPDATE_DATA`, `UPDATE_GLOBAL`, and `UPDATE_PLANNED` annotations. The structural metadata was last updated on
`2026-10-08`; footnotes were last updated on `2026-10-09`.

The dataset version is `2.0` (JSON-stat). The data structure version is `156.0` (`UNE_RT_M`, agency `ESTAT`).
The dataset version and the data structure version are different things; do not use one as a substitute for
the other.

### Revision policy

Eurostat's monthly unemployment revision policy has three layers:

1. **Routine revisions.** New validated data update the already disseminated series. Aggregates and components
   are revised together. Routine revisions aim to keep the monthly series temporally consistent with the
   quarterly LFS. Seasonal adjustment models are reviewed annually, and the annual review can revise
   seasonally adjusted history.
2. **Major revisions.** These follow methodological changes, census revisions, or changes in geographical
   coverage. Breaks are flagged until break-free data are provided.
3. **Unscheduled revisions.** These correct validated errors and are documented in the news release.

For routine revisions, data are considered final after six months. The following major revisions affect the
countries in this dossier:

| Country | Revision | Published |
| :--- | :--- | :--- |
| Poland | Data revised from January 2019 to June 2023 due to Census 2021 revisions | 2024-03-01 |
| Germany | Data revised back to 2009 due to Census 2021 revisions | 2025-06-03 |
| France | Data revised back to 2003 due to the inclusion of Mayotte | 2026-10-01 |
| Spain | Data revised from January 2021 to December 2023 due to Census 2021 revisions | 2024-05-03 |

The France revision is the most recent major revision affecting a country in the five-country comparison. It
was published less than a month before this dossier's verification date, which is a reminder that the source
is not static.

## Methodology

### Data source

The EU-LFS is the main data source. Where a country compiles only quarterly LFS data, Eurostat complements it
with a monthly indicator from the national public employment authority. The monthly series is then produced
through a harmonised process.

For Poland, the ESMS states that quarterly LFS data are combined with monthly registered unemployment data
using a **Denton temporal disaggregation** model. For the most recent months, where LFS data are not yet
available, the monthly benchmark factors are forecast using **seasonal ARIMA regression** models. The
provisional estimates are the product of those factors and the available registered unemployment figures.
This is why the Polish series can be revised when new LFS data arrive.

### Seasonal adjustment

For countries that deliver monthly unemployment inputs, Eurostat performs the seasonal adjustment at a
disaggregated level (country by sex by age group, indirect approach) using **TRAMO/SEATS**. Germany uses
**X-13** for trend calculation. The registered Zetaris slice uses the `SA` series, not `NSA` or `TC`.

### Timeliness

Monthly seasonally adjusted unemployment rates are published approximately **31 days after the end of the
reference month**. The source timestamp is the authoritative record of when the current vintage was produced.

### Legal basis

The EU-LFS is governed by Regulation (EU) 2019/1700 and its implementing regulations, in particular
Commission Implementing Regulation (EU) 2019/2241. The statistical definitions follow ILO recommendations.

## Scope and limitations

- **One country in Zetaris.** The registered objects contain Poland only. The full dataset has 38 geography
  categories, but the Zetaris table is a single-country slice.
- **Fixed dimensions in Zetaris.** `sex=T`, `age=TOTAL`, `unit=PC_ACT`, and `s_adj=SA` are fixed by the
  registration URL. The full dataset has 3 sex codes, 3 age codes, 2 units, and 3 adjustment codes.
- **No microdata.** The dataset contains aggregated rates and levels, not person-level records.
- **No vintage history.** The API returns the current vintage. Revisions overwrite prior values; the source
  timestamp is the only built-in vintage marker.
- **Status flags are metadata, not filters.** The Zetaris series view does not carry the status flags. A
  consumer that needs them must read the raw `status` object from the API or the REST table.
- **The latest month can be empty.** `2026-09` is in the time axis but has no value for the registered slice
  or for the five-country comparison. Do not treat the last time position as the last observation.
- **Commercial reuse has geography limits.** Eurostat's general reuse permission does not cover commercial
  reuse of data for countries outside the EU, EFTA, and official EU acceding and candidate countries. The
  five-country comparison uses EU countries only, but the full dataset includes the United States and Japan.
  See [`license-and-attribution.md`](license-and-attribution.md).

## Related documents

- [`data-dictionary.md`](data-dictionary.md) — fields, codes, Zetaris columns, and decode rules.
- [`api-reference.md`](api-reference.md) — REST request and JSON-stat response.
- [`zetaris-integration.md`](zetaris-integration.md) — registered objects and view definitions.
- [`data-quality.md`](data-quality.md) — coverage, missing data, status flags, and validation evidence.
- [`operations-runbook.md`](operations-runbook.md) — verification and refresh commands.
- [`license-and-attribution.md`](license-and-attribution.md) — reuse rules and citation format.
