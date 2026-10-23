# Eurostat Statistics API reference

## Endpoint

| Property | Value |
| :--- | :--- |
| Base URL | `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/` |
| Dataset path | `une_rt_m` |
| Method | `GET` |
| Authentication | None |
| Registration | None |
| Response format | JSON-stat 2.0 when `format=JSON` |
| CORS | Enabled (`Access-Control-Allow-Origin: *`) |
| Typical content type | `application/json` |

The canonical request for the registered Zetaris slice is:

```text
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA
```

## Parameters

| Parameter | Required | Values used here | Meaning |
| :--- | :--- | :--- | :--- |
| `format` | Recommended | `JSON` | Return JSON-stat instead of SDMX or another format. |
| `lang` | Recommended | `EN` | Language for labels and metadata. |
| `freq` | Optional | `M` | Monthly frequency. The dataset contains only `M`. |
| `s_adj` | Optional | `SA` | Seasonal adjustment. Full codes: `NSA`, `SA`, `TC`. |
| `age` | Optional | `TOTAL` | Age class. Full codes: `TOTAL`, `Y_LT25`, `Y25-74`. |
| `unit` | Optional | `PC_ACT` | Unit. Full codes: `THS_PER`, `PC_ACT`. |
| `sex` | Optional | `T` | Sex. Full codes: `T`, `M`, `F`. |
| `geo` | Optional | `PL` | Geography. Full dataset has 38 categories. |
| `time` | Optional | Omitted | Time filter. The registration returns the full 525-month axis. |

Omitting a dimension returns all of its categories. The API does not require every dimension to be filtered.
The registered Zetaris slice fixes six dimensions and leaves `time` unfiltered.

### Fixed dimensions in the registration

| Dimension | Value | Why |
| :--- | :--- | :--- |
| `freq` | `M` | The dataset is monthly. |
| `s_adj` | `SA` | The registration uses the headline seasonally adjusted series. |
| `age` | `TOTAL` | The registration uses the total age class. |
| `unit` | `PC_ACT` | The registration uses rates, not levels. |
| `sex` | `T` | The registration uses the total sex. |
| `geo` | `PL` | The registration is a Poland example. |

## Exact request URLs

### Registered slice

```text
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&geo=PL&sex=T&age=TOTAL&unit=PC_ACT&s_adj=SA
```

### Browser template

```text
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&freq=M&s_adj=SA&age=TOTAL&unit=PC_ACT&sex={sex}&geo={geo}
```

Replace `{sex}` with `T`, `M`, or `F`, and `{geo}` with a supported country code such as `PL`, `DE`, `FR`,
`ES`, or `IT`.

### Full dataset

```text
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN
```

The full response is about 10 MB uncompressed at the time of verification. It is useful for exploration but
too large for a browser page that only needs one series.

## Response shape

A filtered response has 11 top-level fields:

```text
version, class, label, source, updated, value, status, id, size, dimension, extension
```

### Top-level fields

| Field | Type | Notes |
| :--- | :--- | :--- |
| `version` | string | `2.0`. |
| `class` | string | `dataset`. |
| `label` | string | Dataset title. |
| `source` | string | `ESTAT`. |
| `updated` | string | Source timestamp. |
| `value` | object | Sparse observations keyed by stringified flat index. |
| `status` | object | Optional status flags keyed by the same flat index. |
| `id` | array | Dimension order. |
| `size` | array | Dimension cardinalities. |
| `dimension` | object | Category indexes and labels per dimension. |
| `extension` | object | Annotations, no-data positions, and status labels. |

### Filtered slice dimensions

For the PL/T request, `id` and `size` are:

```text
id:   ["freq", "s_adj", "age", "unit", "sex", "geo", "time"]
size: [1, 1, 1, 1, 1, 1, 525]
```

The time axis has 525 categories, but only 356 have values. `value` is sparse; it does not contain keys for
the 169 empty positions.

### Response excerpt

```text
{
  "version": "2.0",
  "class": "dataset",
  "label": "Unemployment by sex and age - monthly data",
  "source": "ESTAT",
  "updated": "2026-10-21T11:00:00+0200",
  "value": {
    "168": 11.8,
    "169": 11.5,
    ...
    "523": 3.4
  },
  "status": {
    "312": "b",
    "323": "d"
  },
  "id": ["freq", "s_adj", "age", "unit", "sex", "geo", "time"],
  "size": [1, 1, 1, 1, 1, 1, 525],
  "dimension": {
    "time": {
      "label": "Time",
      "category": {
        "index": {
          "1983-01": 0,
          ...
          "1997-01": 168,
          ...
          "2026-08": 523,
          "2026-09": 524
        },
        "label": {
          "1983-01": "1983-01",
          ...
        }
      }
    },
    ...
  },
  "extension": {
    "datastructure": {
      "id": "UNE_RT_M",
      "agencyId": "ESTAT",
      "version": "156.0"
    },
    "positions-with-no-data": {
      "time": [0, 1, ..., 167, 524]
    },
    "status": {
      "label": {
        "b": "break in time series",
        "d": "definition differs (see metadata)"
      }
    }
  }
}
```

The excerpt is illustrative; the real `value` object has 356 entries and the real `dimension.time.category.index`
has 525 entries.

## JSON-stat decoding

### Algorithm

1. Read `id` and `size`.
2. Build `stride[d] = product(size[d + 1:])`.
3. Invert `dimension.time.category.index` so the integer position maps to a period label.
4. For each time position, compute the flat index with the other dimensions fixed at index `0`:

   ```text
   flat = time_position * stride[time_dimension]
   ```

   This is valid for a request that filters every non-time dimension to one category. The registered slice
   does exactly that.
5. Read `value[String(flat)]`.
6. Keep only finite numeric values.
7. Sort ascending by period label.

For the registered slice, every non-time dimension has size 1, so the flat index equals the time position.
`2026-08` has position `523`, so its value is `value["523"]`.

### TypeScript decoder for a filtered request

```ts
export interface JsonStatDataset {
  version: string;
  class: "dataset";
  label: string;
  source: string;
  updated: string;
  value: Record<string, number>;
  status?: Record<string, string>;
  id: string[];
  size: number[];
  dimension: Record<string, {
    label: string;
    category: {
      index: Record<string, number>;
      label: Record<string, string>;
    };
  }>;
  extension?: {
    status?: { label?: Record<string, string> };
    "positions-with-no-data"?: { time?: number[] };
  };
}

export interface Observation {
  period: string;
  rate: number;
}

export function decodeSeries(dataset: JsonStatDataset): Observation[] {
  const timeDimension = dataset.id.indexOf("time");
  if (timeDimension === -1) {
    throw new Error("JSON-stat response has no time dimension");
  }

  const strides = dataset.size.map((_, index) =>
    dataset.size.slice(index + 1).reduce((product, size) => product * size, 1),
  );
  const timeIndex = dataset.dimension.time.category.index;
  const observations: Observation[] = [];

  for (const [period, position] of Object.entries(timeIndex)) {
    const flat = position * strides[timeDimension];
    const value = dataset.value[String(flat)];
    if (typeof value === "number" && Number.isFinite(value)) {
      observations.push({ period, rate: value });
    }
  }

  return observations.sort((left, right) => left.period.localeCompare(right.period));
}
```

### Python decoder for a filtered request

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
print(rows[0], rows[-1])
```

### General flat-index decoder

For a response with more than one non-time category, compute the flat index with the full formula:

```text
flat = sum(category_index[d] * stride[d] for d in dimensions)
```

Do not assume that the `value` key is a time index unless every other dimension has size 1.

## Invalid codes

Eurostat does **not** return an HTTP error for an invalid dimension code. It returns HTTP 200 with an empty
category and an empty value object. Verified examples:

| Request | Observed |
| :--- | :--- |
| `age=Y15-74` | `dimension.age.category.index = {}`; `value = {}` |
| `geo=XX` | `dimension.geo.category.index = {}`; `value = {}` |

This looks like "no data available" rather than "wrong parameter". Validate codes against the allowlists before
requesting. The valid age codes are `TOTAL`, `Y_LT25`, and `Y25-74`; `Y15-74` is not valid for this dataset.

## Errors, CORS, and limits

### HTTP and network errors

- A malformed URL or unsupported format can return a 4xx response.
- A server-side problem can return a 5xx response.
- A network failure or a CORS change appears as a browser fetch rejection, not as a JSON error.
- The API does not use an API key, so there is no 401 path for this source.

### CORS

The live response includes:

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With
```

This permits direct browser requests. If Eurostat changes the CORS policy, a browser client needs a proxy or
a server-side component. The repository's registered Zetaris table is not a browser proxy.

### Rate limits and caching

The source is public and does not publish a numeric rate limit in the response. Treat it as a shared public
service:

- Request one series at a time.
- Cache responses for a short period, such as five minutes.
- Do not loop over all 38 countries and 3 sex codes on every page load.
- Do not fetch the full 10 MB dataset for a single-series view.

The full dataset is 757,828 values and is not appropriate for a browser page that needs one country/sex pair.

## Data freshness and revisions

- `updated` is the authoritative source timestamp for the current vintage.
- The latest PL month is `2026-08`; `2026-09` is present but empty.
- Eurostat publishes monthly data approximately 31 days after the reference month.
- Routine revisions, annual seasonal-adjustment reviews, and major revisions can change historical values.
- The API does not expose a vintage history. Store the `updated` value alongside any derived artifact if
  reproducibility matters.

## References

- [Eurostat API Statistics guide](https://wikis.ec.europa.eu/display/EUROSTATHELP/API+Statistics+-+data+query)
- [JSON-stat specification](https://json-stat.org/)
- [Eurostat ESMS metadata for `une_rt_m`](https://ec.europa.eu/eurostat/cache/metadata/en/une_rt_m_esms.htm)
- [Eurostat copyright notice](https://ec.europa.eu/eurostat/en/help/copyright-notice)
- [Dataset DOI](https://doi.org/10.2908/UNE_RT_M)
