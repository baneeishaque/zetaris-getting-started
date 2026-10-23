# Eurostat CRUD on Zetaris

A small Angular 22 example that saves Eurostat unemployment-rate notes in the browser and reads the
observations from the Zetaris `eurostat.une_rt_m_pl_series_table` view. It is a standalone, zoneless
application with no backend, accounts, or database.

Zetaris currently exposes only the **Poland, total sex** slice of `une_rt_m`. The app therefore
offers one country/sex combination. It does not call the public Eurostat API.

The verified dataset notes live in the repository dossier:
[`docs/data-sources/eurostat/`](../../docs/data-sources/eurostat/README.md).

## Run locally

Requires Node.js 26 and npm 11. Copy this folder's tracked `.env.example` to `.env.local`
(gitignored) and set at least:

```text
ZETARIS_REST_URL=http://localhost:8888/api/v1.0
```

`ZETARIS_ORG_ID` defaults to `1`. The app does not read `.env.local` itself; the Angular dev proxy
reads only `ZETARIS_REST_URL`.

```bash
npm install
npm start
```

Open `http://localhost:4200/`, then open **Connection** and paste the Zetaris API key. The key is
held in `sessionStorage` for that tab; it is not written to `localStorage` or source control.

```bash
npm test -- --watch=false   # Vitest unit tests
npm run build               # production bundle in dist/
```

## Routes

| Route | Purpose |
| --- | --- |
| `/series` | List saved series, empty state, storage warnings |
| `/series/new` | Create a saved series |
| `/series/:id` | Query Zetaris, inspect observations, edit or delete |
| `/series/:id/edit` | Edit a saved series |
| `/settings` | Save, test, or clear the Zetaris connection |

The app redirects `/` and unknown routes to `/series`.

## Data

The app sends SQL to Zetaris:

```text
POST /zetaris-api/sql-editor/sqls/run
```

It queries:

```sql
SELECT period, unemployment_rate_pct
FROM eurostat.une_rt_m_pl_series_table
ORDER BY period ASC;
```

and:

```sql
SELECT dataset_label, dataset_source, last_updated
FROM eurostat.une_rt_m_pl_metadata_table;
```

The service sends `Authorization: Bearer <API key>`, `X-Org-ID`, and a UUID `X-Request-ID`. It
validates rows, converts the rate to a number, drops malformed rows, sorts observations by period,
and caches successful responses for five minutes. The detail page shows the latest 24 observations
by default and can reveal the full 356-row history.

## Dev proxy and CORS

Zetaris does not send CORS headers, so a browser page on `localhost:4200` cannot call
`localhost:8888` directly. `proxy.conf.cjs` forwards `/zetaris-api` to the origin and base path in
`ZETARIS_REST_URL`, which makes the request same-origin from the browser's perspective.

This is a local-development arrangement. A production deployment needs a same-origin reverse proxy
in front of Zetaris. Do not publish a build that contains an API key, and do not treat this browser
key entry pattern as a production authentication design.

## Storage

Saved series use the browser `localStorage` key `eurostat-crud.saved-series.v1` with this envelope:

```json
{ "version": 1, "items": [] }
```

Records are validated on load; invalid items are ignored with a warning. Corrupt raw JSON is copied
to `eurostat-crud.saved-series.v1.corrupt` before the app starts empty. Saved series never contain
the Zetaris API key.

The Zetaris connection uses the `sessionStorage` key `eurostat-crud.zetaris-connection.v1`. It is
cleared when the tab closes and can be removed with **Disconnect**.

## Limitations

- Zetaris currently provides only Poland/total (`PL`, `T`).
- No accounts, server sync, export, or cross-device storage.
- The API key is visible to JavaScript in the page and to anyone with access to the browser tab.
- The dev proxy is required locally; direct cross-origin browser calls fail.
- The chart is a compact SVG trend view, not a full statistical charting tool.
- Data freshness is the Zetaris registration's current vintage, not a local cache guarantee.

## Attribution

Source: [Eurostat, `une_rt_m`](https://ec.europa.eu/eurostat/databrowser/view/une_rt_m/default/table)
(unemployment rate, monthly), served through Zetaris. Reuse is subject to the
[Eurostat copyright notice](https://ec.europa.eu/eurostat/en/help/copyright-notice). The dataset's
statistical data is not presented as CC BY 4.0; see the
[license and attribution dossier](../../docs/data-sources/eurostat/license-and-attribution.md).

## Structure

```text
src/app/
  core/series/         Saved-series model, labels, localStorage store, tests
  core/zetaris/        Connection store, Zetaris SQL client, tests
  features/            List, form, detail, and connection pages
  shared/rate-chart/   Standalone SVG line chart
proxy.conf.cjs         Same-origin dev proxy for the Zetaris REST API
```
