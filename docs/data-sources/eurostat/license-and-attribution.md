# License and attribution

This document records the official Eurostat reuse terms and the attribution this dossier uses. It is a
summary for engineering use, not legal advice. The authoritative source is the Eurostat copyright notice:

- <https://ec.europa.eu/eurostat/en/help/copyright-notice>

## Two different regimes

Eurostat distinguishes **editorial content** from **statistical data**:

| Material | Terms |
| :--- | :--- |
| Editorial content (text, photographs, graphics, etc.) | Licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Reuse is allowed with source acknowledgement and an indication of any changes. |
| Statistical data, metadata, publications, and other dissemination tools | Reuse for commercial or non-commercial purposes is authorised provided the source is acknowledged. The reuse policy is implemented by the European Commission's Decision of 12 December 2011 (2011/833/EU). |

The dataset in this dossier is statistical data. Do not describe it as "CC BY 4.0 data". The correct statement is
that reuse is authorised with attribution under Decision 2011/833/EU, subject to the exceptions below.

## Exceptions

The general permission does not cover:

- **Third-party material.** Material whose copyright is identified as belonging to a third party, such as
  photos or illustrations from other rights holders. Permission must be obtained from the rights holder.
- **Logos and trademarks.** These are excluded unless they are redistributed as an integral part of an
  unchanged Eurostat publication.
- **Translations and modifications.** If you translate or modify the data or text, you must state this clearly
  to the end user and include a disclaimer that Eurostat is not responsible for the result.
- **Data for countries outside the EU, EFTA, and official EU acceding and candidate countries.** Commercial
  reuse is not allowed. Examples include data for the United States, Japan, and China. Non-commercial reuse is
  allowed. A commercial user must remove those countries from the table before reuse.
- **Trade data from Liechtenstein and Switzerland** as declaring countries from 1995 onwards, for HS, SITC,
  BEC, NSTR, and national commodity classifications. Commercial reuse of those declared flows is not allowed.
- **Trade data from Austria** as a declaring country at the 8-digit Combined Nomenclature level. Commercial
  reuse of those declared flows is not allowed.

The last two exceptions concern trade data and do not apply to `une_rt_m`. The country exception does apply to
the **full** `une_rt_m` dataset, because it includes the United States, Japan, and other non-EU/EFTA countries.
The registered PL slice and the five-country comparison (PL, DE, FR, ES, IT) are inside the permitted set.

## Commercial reuse

There is no special procedure and no written licence required. Download the material and use it, unless the
material falls under an exception above. For a commercial product that uses the full dataset, remove the
non-EU/EFTA/candidate countries first, or use a filtered request that only returns permitted countries.

## How to cite

### Dataset DOI

The canonical form is:

```text
Source: [DOI], [access date]
```

For this dataset:

```text
Source: 10.2908/UNE_RT_M, 2026-10-23.
```

The DOI URL is:

- <https://doi.org/10.2908/UNE_RT_M>

### Customised dataset

If you filter or otherwise customise the dataset, cite the datacode link instead of the DOI:

```text
Source: [Eurostat dataset datacode link], [access date]
```

For example:

```text
Source: Eurostat, une_rt_m (unemployment rate, monthly),
https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table, accessed 2026-10-23.
```

### Other products

For interactive tools, visualisations, webpages, Statistics Explained articles, and PDFs, the form is:

```text
Source: Eurostat, [Title of the product], [link to the product], [access date].
```

## Attribution used in this dossier

The dossier uses the DOI form in its headers and the customised form where a filtered series is described:

```text
Source: 10.2908/UNE_RT_M, 2026-10-23.
```

```text
Source: Eurostat, une_rt_m (unemployment rate, monthly),
https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table, accessed 2026-10-23.
```

If a downstream artifact modifies the data, add a clear statement such as:

```text
Based on Eurostat data. The modifications are the responsibility of the author.
Eurostat is not responsible for the modified data or for any interpretation of it.
```

Do not imply that Eurostat endorses the modification, the application, or the analysis.

## No affiliation

This repository is not affiliated with, endorsed by, or sponsored by Eurostat or the European Commission.
Eurostat is the source of the data; the repository is an independent engineering example.

## Catalogue correction

`open_data/rest_apis/rest-api-sources.md` currently says the licence is "commonly understood to align with
CC-BY 4.0, but this has not been independently confirmed". That wording conflates editorial content with
statistical data. Replace the section 7 licence line with:

```text
- **Licence:** Reuse of statistical data, metadata, publications, and other dissemination tools is authorised
  for commercial and non-commercial purposes provided the source is acknowledged, under the European
  Commission reuse policy (Decision 2011/833/EU). Editorial content is CC BY 4.0. Commercial reuse of data for
  countries outside the EU, EFTA, and official EU acceding and candidate countries is not allowed. See the
  [Eurostat license and attribution dossier](../../docs/data-sources/eurostat/license-and-attribution.md).
```

Add a full-dossier pointer:

```text
- **Full dossier:** [`docs/data-sources/eurostat/README.md`](../../docs/data-sources/eurostat/README.md)
```

Keep the source's `Verified` status and the script path unchanged. The correction is about the licence
description, not about whether the registration ran.

## Dataset-specific notes

- `une_rt_m` is a Eurostat-produced statistical dataset. The dataset page identifies Eurostat as the source.
- The registered slice contains only Poland. The full dataset contains the United States, Japan, and other
  non-EU/EFTA countries, so the commercial country exception matters for full-dataset reuse.
- The dataset may contain estimates and provisional values. Attribution does not imply accuracy; see
  [`data-quality.md`](data-quality.md) for status flags and revisions.
- The source's metadata and structure change over time. Cite the access date so a later reader can tell which
  vintage was used.
- The old create-script header points to `https://ec.europa.eu/eurostat/about/policies/copyright`, which
  returns 404. Use the official notice URL above.
