# Arranged Commits Preview

- Repository: `/home/ext_root/lab-data/zetaris-getting-started`
- Branch: `main`
- Baseline: `6a2fbaa` (`main...origin/main`, no divergence at last fetch)
- Preview scope: Eurostat dossier, Angular example, Java example, and sanitized Zetaris plans
- Authorization: do not execute until the user explicitly says `start`
- Author gate: resolved. Local repo identity is `Banee Ishaque K
  <Baneeishaque@gmail.com>`, copied from the ai-suite repo.

## Scope Decisions

Included (our changes):

- `docs/data-sources/eurostat/` and its root index/catalog entries
- `.markdownlint-cli2.jsonc`
- `examples/eurostat-crud/`
- `examples/eurostat-crud-java/`
- `.env.example` (root, `ZETARIS_ORG_ID=1`)
- `examples/eurostat-crud/.env.example` (new app-local proxy template)
- `AGENTS.md` (intro rewrap in Commit 1; examples hunk in Commit 2)
- `docs/plans/` sanitized copies of the Angular, Java, and Zetaris-setup plans/tasks
  - `docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_implementation-plan_v1.md`
  - `docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_task.md`
  - `docs/plans/2026-10-23_eurostat-crud-java_implementation-plan_v2.md`
  - `docs/plans/2026-10-23_eurostat-crud-java_task.md`
  - `docs/plans/archive/2026-10-23_eurostat-crud-java_implementation-plan_v1.md`
  - `docs/plans/archive/2026-10-20_zetaris-local-setup_implementation-plan_v1.md`
  - `docs/plans/archive/2026-10-20_zetaris-local-setup_implementation-plan_v2.md`
  - `docs/plans/archive/2026-10-20_zetaris-local-setup_task.md`

Sanitization applied to the copied plans:

- Real opencode session IDs replaced with `local-session`.
- Host-specific paths replaced with `$ZETARIS_REPO`, `$AI_SUITE`, `$LAB_DATA`,
  `$HOME`, and `$SCRATCH`.
- Local markdown links flattened to plain text; no local link targets remain.
- Old unsanitized Angular plan/task files remain local and ignored via
  `.git/info/exclude`.

Excluded:

- Unrelated ai-suite plans (`2026-10-08_drop-overwritten-task-file-from-gist`, `2026-10-09_clone-distributed-steganography-c-no-gcm`)
- `scratch/` smoke scripts, screenshots, logs, and captured data
- Root `.env.local`, `examples/eurostat-crud/.env.local`, `examples/eurostat-crud-java/.env.local`
- `node_modules/`, `dist/`, `target/`, and other ignored build artifacts

Sequencing note: Commit 1 adds the dossier before the example. Three dossier
links point to `examples/eurostat-crud/README.md` and resolve when Commit 2
lands. The final tree is link-clean. If every intermediate commit must also be
link-clean, authorize a split that defers those three link lines.

---

## Commit 1: docs(eurostat): add verified data-source dossier

- **Files**:
  - `.markdownlint-cli2.jsonc` (new, 22 lines)
  - `README.md` (modified)
  - `open_data/rest_apis/rest-api-sources.md` (modified)
  - `AGENTS.md` (modified: 120-column rewrap of the intro only; no examples text)
  - `docs/data-sources/eurostat/README.md` (new, 148 lines)
  - `docs/data-sources/eurostat/api-reference.md` (new, 347 lines)
  - `docs/data-sources/eurostat/data-dictionary.md` (new, 353 lines)
  - `docs/data-sources/eurostat/data-quality.md` (new, 268 lines)
  - `docs/data-sources/eurostat/dataset-profile.md` (new, 246 lines)
  - `docs/data-sources/eurostat/license-and-attribution.md` (new, 151 lines)
  - `docs/data-sources/eurostat/operations-runbook.md` (new, 284 lines)
  - `docs/data-sources/eurostat/zetaris-integration.md` (new, 258 lines)

- **Message**:

  ```text
  docs(eurostat): add verified data-source dossier

  - Add the une_rt_m dossier covering the dataset profile, API
    contract, data dictionary, quality checks, Zetaris views,
    operations, and licensing.
  - Record the verified PL/T slice: 356 rows from 1997-01 to
    2026-08, with 2026-09 present but empty.
  - Link the dossier from the root README and REST source catalog.
  - Add the repository markdownlint config used by the dossier.
  - Rewrap the AGENTS.md intro to the new 120-character limit.
  - Keep the 2026-09-19 onboarding SQL comments as a historical
    baseline; the license correction is documentation-only.
  - Replace local absolute paths in runbook commands with
    /path/to/zetaris-getting-started so the docs are portable.
  ```

- **Hunks/Preview**:

  `~~~diff
  diff --git a/README.md b/README.md
  index 9ecc71c..7038c4d 100644
  --- a/README.md
  +++ b/README.md
  @@ -31,6 +31,7 @@ The [GitHub Pages guide](website/README.md) describes how to preview and publish
   | [`open_data/manifest.json`](open_data/manifest.json) | Source/model IDs, status, and dependencies for `onboard.py` |
   | [`docs/guides/project-paths.md`](docs/guides/project-paths.md) | Optional project directions, including the [PUDL chart](examples/pudl-chart/README.md) and [EDGAR/PUDL/NOAA guide](docs/guides/create-edgar-pudl-noaa-usl.md) |
   | [`docs/guides/zetaris-lightning-sql-companion.md`](docs/guides/zetaris-lightning-sql-companion.md) | SQL reference: shapes, quoting, gotchas, and confirmed platform limitations — read alongside the Zetaris Kbase while writing your own SQL |
  +| [`docs/data-sources/`](docs/data-sources/) | Verified data-source dossiers, starting with the Eurostat unemployment-rate dataset |
   | [`docs/plans/FUTURES.md`](docs/plans/FUTURES.md) | The full data-source roadmap, priority order, and status per category |
   | [`docs/plans/`](docs/plans/) | Active plans for in-progress or upcoming work; [`docs/plans/archive/`](docs/plans/archive/) holds completed or superseded plans and the original source-research manifest, kept as historical record |
  
  @@ -49,6 +50,7 @@ docs/
     connections/     Route choices, Cursor/Codex/Claude Code prompts, and recipe command reference
     install/         Installation & configuration guide, plus its test record
     guides/          First dataset, project paths, readiness, recovery, and demo guidance
  +  data-sources/    Verified data-source dossiers (Eurostat unemployment rate)
     plans/           Active roadmap and category plans (FUTURES.md, recipes/); archive/ for completed plans
   ```
  
  diff --git a/open_data/rest_apis/rest-api-sources.md b/open_data/rest_apis/rest-api-sources.md
  index 86c9a7f..6cb2c29 100644
  --- a/open_data/rest_apis/rest-api-sources.md
  +++ b/open_data/rest_apis/rest-api-sources.md
  @@ -78,9 +78,14 @@ A catalog of REST sources registered with `CREATE LIGHTNING REST TABLE`. Each en
   ## 7. Eurostat REST API — license: open, with a condition
  
   - **What it is:** EU statistics, including unemployment and HICP inflation, through a public SDMX/REST API.
  -- **Licence:** commonly understood to align with CC-BY 4.0, but this has not been independently confirmed. Read Eurostat's policy before reuse.
  +- **Licence:** Reuse of statistical data, metadata, publications, and other dissemination tools is authorised
  +  for commercial and non-commercial purposes provided the source is acknowledged, under the European
  +  Commission reuse policy (Decision 2011/833/EU). Editorial content is CC BY 4.0. Commercial reuse of data for
  +  countries outside the EU, EFTA, and official EU acceding and candidate countries is not allowed. See the
  +  [Eurostat license and attribution dossier](../../docs/data-sources/eurostat/license-and-attribution.md).
   - **Access:** no key, no registration, CORS-enabled.
   - **Docs:** [Eurostat API Statistics guide](https://wikis.ec.europa.eu/display/EUROSTATHELP/API+Statistics+-+data+query)
  +- **Full dossier:** [`docs/data-sources/eurostat/README.md`](../../docs/data-sources/eurostat/README.md)
  
   ## 8. Statistics Canada Web Data Service (WDS) — license: open (StatCan Open Licence)
  
  diff --git a/AGENTS.md b/AGENTS.md
  --- a/AGENTS.md
  +++ b/AGENTS.md
  @@ -1,6 +1,8 @@
   # Agent instructions
  
  -This repo is a set of tested onboarding material for Zetaris: install guide, `open_data/` source packages (`*_create.sql` / `*_select.sql` pairs), helper scripts in `scripts/`, and SQL references in `docs/guides/`. You are acting as a data engineer against a Zetaris instance.
  +This repo is a set of tested onboarding material for Zetaris: install guide, `open_data/` source packages
  +(`*_create.sql` / `*_select.sql` pairs), helper scripts in `scripts/`, and SQL references in `docs/guides/`.
  +You are acting as a data engineer against a Zetaris instance.
  
   ## Connect first
  ~~~

- **New file content summary**:
  - Dossier covers `une_rt_m`: profile, dimensions, full code inventory, JSON-stat API, Zetaris REST table and three views, data quality, operations, and licensing.
  - Verified facts: PL/T slice is 356 rows, `1997-01` to `2026-08`; `2026-09` is present but empty; Zetaris metadata `last_updated` is `2026-10-21T11:00:00+0200`.
  - `.markdownlint-cli2.jsonc` sets the repo's 120-character limit and table/list/code-block conventions.

- **Verification**:
  - `markdownlint-cli2` on the eight dossier files: 0 issues.
  - Root `README.md` and `rest-api-sources.md`: 56 pre-existing issues (baseline 57); no new issue from our lines.
  - Dangling-link audit: 36 dossier links checked, all `EXISTS`.
  - `AGENTS.md` Commit 1 version diff: intro rewrap only; the examples
    text is absent and the rest of the file is byte-identical.
  - `git diff --check`: clean for tracked files.

---

## Commit 2: feat(eurostat): add Zetaris-backed CRUD example

- **Files**: all 53 untracked files under `examples/eurostat-crud/`, plus the
  root `.env.example` and only the examples hunk in `AGENTS.md`:
  - `.editorconfig`
  - `.env.example` (app-local)
  - `.gitignore`
  - `.prettierrc`
  - `.vscode/extensions.json`
  - `.vscode/launch.json`
  - `.vscode/tasks.json`
  - `README.md`
  - `angular.json`
  - `mise.toml`
  - `package-lock.json`
  - `package.json`
  - `proxy.conf.cjs`
  - `public/favicon.ico`
  - `src/app/app.config.ts`
  - `src/app/app.css`
  - `src/app/app.html`
  - `src/app/app.routes.ts`
  - `src/app/app.spec.ts`
  - `src/app/app.ts`
  - `src/app/core/series/saved-series.model.ts`
  - `src/app/core/series/series-labels.ts`
  - `src/app/core/series/series-store.service.spec.ts`
  - `src/app/core/series/series-store.service.ts`
  - `src/app/core/zetaris/zetaris-connection.service.spec.ts`
  - `src/app/core/zetaris/zetaris-connection.service.ts`
  - `src/app/core/zetaris/zetaris.models.ts`
  - `src/app/core/zetaris/zetaris.service.spec.ts`
  - `src/app/core/zetaris/zetaris.service.ts`
  - `src/app/features/series-detail/series-detail.css`
  - `src/app/features/series-detail/series-detail.html`
  - `src/app/features/series-detail/series-detail.spec.ts`
  - `src/app/features/series-detail/series-detail.ts`
  - `src/app/features/series-form/series-form.css`
  - `src/app/features/series-form/series-form.html`
  - `src/app/features/series-form/series-form.spec.ts`
  - `src/app/features/series-form/series-form.ts`
  - `src/app/features/series-list/series-list.css`
  - `src/app/features/series-list/series-list.html`
  - `src/app/features/series-list/series-list.spec.ts`
  - `src/app/features/series-list/series-list.ts`
  - `src/app/features/zetaris-settings/zetaris-settings.css`
  - `src/app/features/zetaris-settings/zetaris-settings.html`
  - `src/app/features/zetaris-settings/zetaris-settings.ts`
  - `src/app/shared/rate-chart/rate-chart.css`
  - `src/app/shared/rate-chart/rate-chart.html`
  - `src/app/shared/rate-chart/rate-chart.ts`
  - `src/index.html`
  - `src/main.ts`
  - `src/styles.css`
  - `tsconfig.app.json`
  - `tsconfig.json`
  - `tsconfig.spec.json`
  - root `.env.example` (modified)
  - `AGENTS.md` (modified: examples hunk only, relative to Commit 1)

- **AGENTS.md staging**: backup-edit-commit-restore. Commit 1 commits the
  rewrap-only version; this commit stages only the examples hunk. The full
  file is backed up, staged, committed, and restored byte-for-byte.

- **Message**:

  ```text
  feat(eurostat): add Zetaris-backed CRUD example

  - Add an Angular 22 example under examples/eurostat-crud that
    stores saved-series metadata in the browser and reads the PL/T
    observations from the registered Zetaris views.
  - Keep the example Zetaris-only; it does not call the public
    Eurostat API.
  - Add a connection page that keeps the API key in sessionStorage
    and a dev proxy that keeps browser requests same-origin.
  - Add list, form, detail, and settings routes, an SVG trend
    chart, unit tests, build configuration, and usage notes.
  - Document the Zetaris CORS limitation and the production
    reverse-proxy and credential-boundary requirements.
  - Add both examples to AGENTS.md, default ZETARIS_ORG_ID
    to 1 in the root .env.example, and add an app-local
    .env.example for the dev proxy. Document copying that local
    template to the gitignored .env.local.
  - Verify 27 unit tests and the production build before commit.
  ```

- **Hunks/Preview**:

  The `AGENTS.md` hunk below is relative to Commit 1's rewrap-only version.

  `~~~diff
  diff --git a/examples/eurostat-crud/.env.example b/examples/eurostat-crud/.env.example
  new file mode 100644
  --- /dev/null
  +++ b/examples/eurostat-crud/.env.example
  @@ -0,0 +1,4 @@
  +# Copy this file to .env.local and set the Zetaris REST endpoint.
  +# .env.local is gitignored. Do not put credentials in this file; the app
  +# asks for the API key at runtime and keeps it in sessionStorage.
  +ZETARIS_REST_URL=http://localhost:8888/api/v1.0
  
  diff --git a/.env.example b/.env.example
  index 853dd37..39bcd3f 100644
  --- a/.env.example
  +++ b/.env.example
  @@ -14,7 +14,7 @@ PGSSLMODE=disable
  
   # Zetaris HTTP API scripts (TypeScript and Python versions in scripts/).
   ZETARIS_BASE_URL=http://localhost:3000
  -ZETARIS_ORG_ID=
  +ZETARIS_ORG_ID=1
   # Set either an API key or a username and password for POST /api/auth/login.
   # Create the key in the Zetaris GUI (never ask an agent to create it). Coding
   # harness sessions (docs/connections/) read ZETARIS_API_KEY from .env.local.
  
  diff --git a/AGENTS.md b/AGENTS.md
  --- a/AGENTS.md
  +++ b/AGENTS.md
  @@ -2,9 +2,11 @@
  
   This repo is a set of tested onboarding material for Zetaris: install guide, `open_data/` source packages
  -(`*_create.sql` / `*_select.sql` pairs), helper scripts in `scripts/`, and SQL references in `docs/guides/`.
  -You are acting as a data engineer against a Zetaris instance.
  +(`*_create.sql` / `*_select.sql` pairs), helper scripts in `scripts/`, SQL references in `docs/guides/`, and
  +runnable examples in `examples/` (`examples/eurostat-crud-java/` is a Spring Boot JDBC demo;
  +`examples/eurostat-crud/` is an Angular browser CRUD example). You are acting as a data engineer against a
  +Zetaris instance.
  
   ## Connect first
  ~~~

  - Entire app directory is new; no mixed-concern hunks.
  - Key behavior:
    - `ZetarisService` posts SQL to `/zetaris-api/sql-editor/sqls/run`.
    - Queries `eurostat.une_rt_m_pl_series_table` and `eurostat.une_rt_m_pl_metadata_table`.
    - `ZetarisConnectionService` stores the connection in `sessionStorage` under `eurostat-crud.zetaris-connection.v1`.
    - `SeriesStoreService` stores saved metadata in `localStorage` under `eurostat-crud.saved-series.v1`.
    - `proxy.conf.cjs` reads only `ZETARIS_REST_URL` from `examples/eurostat-crud/.env.local`.
    - `/settings` saves, tests, and clears the Zetaris connection.

- **Verification**:
  - `npm test -- --watch=false`: 27/27 tests pass.
  - `npm run build`: success; `main 341.47 kB`, `styles 6.81 kB`.
  - Browser smoke: connection test/save, 356-row read, reload persistence, update, delete, and no API key in `localStorage`.
  - Dangling-link audit: 2 app README links checked, all `EXISTS`.
  - Secret scan: only test fixture `test-key`; no real key or `.env.local` content.
  - Staged `AGENTS.md` diff is examples-only relative to Commit 1; the full
    file is restored byte-for-byte after the commit.
  - `git diff --check`: clean for tracked files.

---

## Commit 3: feat(eurostat): add Java JDBC CRUD example

- **Files**: all 49 untracked files under `examples/eurostat-crud-java/`:
  - `.env.example`
  - `.gitignore`
  - `README.md`
  - `pom.xml`
  - `run.sh`
  - `lib/README.md`
  - `lib/com/zetaris/lightning-jdbc/2.4.3.1/lightning-jdbc-2.4.3.1.jar` (28 MB, filtered)
  - `lib/com/zetaris/lightning-jdbc/2.4.3.1/lightning-jdbc-2.4.3.1.pom`
  - `scripts/install-zetaris-driver.sh`
  - `src/main/java/com/example/eurostatcrud/EurostatCrudApplication.java`
  - `src/main/java/com/example/eurostatcrud/config/ZetarisConfig.java`
  - `src/main/java/com/example/eurostatcrud/config/ZetarisProperties.java`
  - `src/main/java/com/example/eurostatcrud/domain/EurostatSeries.java`
  - `src/main/java/com/example/eurostatcrud/domain/PageResult.java`
  - `src/main/java/com/example/eurostatcrud/domain/SeriesNote.java`
  - `src/main/java/com/example/eurostatcrud/domain/SeriesSummary.java`
  - `src/main/java/com/example/eurostatcrud/exception/DuplicateNoteException.java`
  - `src/main/java/com/example/eurostatcrud/exception/EurostatDataAccessException.java`
  - `src/main/java/com/example/eurostatcrud/exception/NoteNotFoundException.java`
  - `src/main/java/com/example/eurostatcrud/exception/UnknownPeriodException.java`
  - `src/main/java/com/example/eurostatcrud/repository/EurostatRepository.java`
  - `src/main/java/com/example/eurostatcrud/repository/InMemorySeriesNoteRepository.java`
  - `src/main/java/com/example/eurostatcrud/repository/JdbcEurostatRepository.java`
  - `src/main/java/com/example/eurostatcrud/repository/SeriesNoteRepository.java`
  - `src/main/java/com/example/eurostatcrud/service/DemoNoteSeeder.java`
  - `src/main/java/com/example/eurostatcrud/service/EurostatService.java`
  - `src/main/java/com/example/eurostatcrud/service/SeriesNoteService.java`
  - `src/main/java/com/example/eurostatcrud/web/DashboardController.java`
  - `src/main/java/com/example/eurostatcrud/web/GlobalExceptionHandler.java`
  - `src/main/java/com/example/eurostatcrud/web/HealthController.java`
  - `src/main/java/com/example/eurostatcrud/web/NoteController.java`
  - `src/main/java/com/example/eurostatcrud/web/SeriesController.java`
  - `src/main/java/com/example/eurostatcrud/web/form/SeriesNoteForm.java`
  - `src/main/resources/application.yml`
  - `src/main/resources/static/css/app.css`
  - `src/main/resources/templates/error.html`
  - `src/main/resources/templates/index.html`
  - `src/main/resources/templates/layout.html`
  - `src/main/resources/templates/notes/form.html`
  - `src/main/resources/templates/notes/list.html`
  - `src/main/resources/templates/series/detail.html`
  - `src/main/resources/templates/series/list.html`
  - `src/test/java/com/example/eurostatcrud/EurostatCrudApplicationTests.java`
  - `src/test/java/com/example/eurostatcrud/EurostatJdbcIT.java`
  - `src/test/java/com/example/eurostatcrud/repository/InMemorySeriesNoteRepositoryTest.java`
  - `src/test/java/com/example/eurostatcrud/service/SeriesNoteServiceTest.java`
  - `src/test/java/com/example/eurostatcrud/web/NoteControllerTest.java`
  - `src/test/java/com/example/eurostatcrud/web/SeriesControllerTest.java`
  - `src/test/resources/application-test.yml`

- **Message**:

  ```text
  feat(eurostat): add Java JDBC CRUD example

  - Add a Spring Boot 4 / Thymeleaf example under
    examples/eurostat-crud-java that reads the PL/T Eurostat
    observations through the Zetaris Lightning JDBC driver.
  - Keep Eurostat read-only and store demo notes in memory; there
    is no H2 or persistence layer.
  - Vendor the filtered 2.4.3.1 driver in lib/ as a Maven file
    repository and add a refresh script for the Zetaris-supplied
    JAR.
  - Add the app-local .env.example, run script, templates, tests,
    and setup notes; document copying the template to the
    gitignored .env.local.
  - Verify 20 unit/MVC tests locally; the live JDBC integration
    test passed in the originating session.
  ```

- **Verification**:
  - `mvn -q test`: exit 0; 20 unit/MVC tests pass.
  - Live `EurostatJdbcIT` passed in the originating session (`21` total).
  - Vendored JAR SHA-256 matches `lib/README.md`:
    `9a3119dc4967fe1156006baa945a0f0d19cc0368395e2129306dbcd53a7a2d8f`.
  - Secret scan: only env-var names and `your-user` / `your-password`
    placeholders; no real credentials or `.env.local` content.
  - `git check-ignore`: `.env.local` and `target/` are ignored; `lib/**`
    is intentionally unignored.
  - `git diff --check`: clean for tracked files.

---

## Commit 4: docs(plans): add sanitized Zetaris planning records

- **Files**: 8 untracked sanitized plan/task files:
  - `docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_implementation-plan_v1.md`
  - `docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_task.md`
  - `docs/plans/2026-10-23_eurostat-crud-java_implementation-plan_v2.md`
  - `docs/plans/2026-10-23_eurostat-crud-java_task.md`
  - `docs/plans/archive/2026-10-23_eurostat-crud-java_implementation-plan_v1.md`
  - `docs/plans/archive/2026-10-20_zetaris-local-setup_implementation-plan_v1.md`
  - `docs/plans/archive/2026-10-20_zetaris-local-setup_implementation-plan_v2.md`
  - `docs/plans/archive/2026-10-20_zetaris-local-setup_task.md`

- **Message**:

  ```text
  docs(plans): add sanitized Zetaris planning records

  - Copy the Angular, Java, and Zetaris-setup plans and tasks into
    docs/plans with session IDs and host-specific paths removed.
  - Keep the Java and Zetaris-setup v1 plans under docs/plans/archive.
  - Flatten local markdown links so the records do not depend on
    ai-suite-only artifacts.
  - Exclude unrelated ai-suite plans and local scratch artifacts.
  ```

- **Verification**:
  - `markdownlint-cli2` on the 8 plans plus the dossier and Angular
    README: `0 issues in 0 files` (17 files linted).
  - No local markdown link targets remain in the 8 plan files.
  - Grep found no host-specific paths or real session IDs; only
    `local-session` placeholders remain.
  - Old unsanitized Angular plan/task files remain ignored via
    `.git/info/exclude`.
  - `git diff --check`: clean.

---

## Execution Plan

### Gate 0 — Author identity

- Resolved: local `user.name` and `user.email` are set from the ai-suite repo.
- Verified: `Banee Ishaque K <Baneeishaque@gmail.com>`.
- No machine fallback remains.

### Gate 1 — Preflight

1. `git -C /home/ext_root/lab-data/zetaris-getting-started status --short`
2. `git -C /home/ext_root/lab-data/zetaris-getting-started fetch origin`
3. Compare `HEAD` with `origin/main`; stop if behind.
4. Confirm the index is empty.
5. Confirm no `.env.local`, `target/`, `node_modules/`, or `scratch/` is staged. `AGENTS.md` is expected in Commit 1 (rewrap) and Commit 2 (examples hunk); `.env.example` is expected in Commit 2; the Java example is expected in Commit 3; the sanitized plans are expected in Commit 4.
6. Confirm no pre-existing stashes; capture the safety stash.

### Gate 2 — Safety stash

1. `git -C /home/ext_root/lab-data/zetaris-getting-started stash push -u -m "pre-commit safety: Eurostat dossier, Angular example, Java example, and sanitized plans"`
2. `git -C /home/ext_root/lab-data/zetaris-getting-started stash apply`
3. Do not `pop`; retain until final verification.

### Commit 1 — backup-edit-commit-restore for AGENTS.md

1. Back up the full AGENTS.md:
   `cp AGENTS.md <scratch>/AGENTS.md.commit2-full.bak`
2. Install the rewrap-only version:
   `cp <scratch>/AGENTS.md.commit1-rewrap-only.md AGENTS.md`
3. `git -C /home/ext_root/lab-data/zetaris-getting-started add .markdownlint-cli2.jsonc README.md open_data/rest_apis/rest-api-sources.md AGENTS.md docs/data-sources/eurostat`
4. `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached --name-only`
5. `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached --check`
6. Confirm the staged AGENTS.md hunk is rewrap-only:
   `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached -- AGENTS.md`
7. `markdownlint-cli2 docs/data-sources/eurostat/*.md` from the repo root
8. Commit with the prepared message file:
   `git -C /home/ext_root/lab-data/zetaris-getting-started commit -F <scratch>/commit-1-message.txt`
9. Restore the full AGENTS.md:
   `cp <scratch>/AGENTS.md.commit2-full.bak AGENTS.md`
10. Verify the restored diff is the examples hunk only:
    `git -C /home/ext_root/lab-data/zetaris-getting-started diff -- AGENTS.md`
11. Verify: `git -C /home/ext_root/lab-data/zetaris-getting-started show --stat --oneline HEAD`

### Commit 2 — backup-edit-commit-restore for AGENTS.md

1. Reconfirm the full AGENTS.md backup exists and matches the working file:
   `cmp AGENTS.md <scratch>/AGENTS.md.commit2-full.bak`
2. Stage the Angular example, root `.env.example`, and AGENTS.md:
   `git -C /home/ext_root/lab-data/zetaris-getting-started add examples/eurostat-crud AGENTS.md .env.example`
3. Confirm the staged AGENTS.md hunk is examples-only relative to Commit 1:
   `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached -- AGENTS.md`
4. `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached --name-only`
5. `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached --check`
6. Run `npm test -- --watch=false` and `npm run build` in `examples/eurostat-crud`
7. Commit with the prepared message file:
   `git -C /home/ext_root/lab-data/zetaris-getting-started commit -F <scratch>/commit-2-message.txt`
8. Restore the full AGENTS.md backup:
   `cp <scratch>/AGENTS.md.commit2-full.bak AGENTS.md`
9. Verify `git status --short AGENTS.md` is clean.
10. Verify: `git -C /home/ext_root/lab-data/zetaris-getting-started show --stat --oneline HEAD`

### Commit 3

1. `git -C /home/ext_root/lab-data/zetaris-getting-started add examples/eurostat-crud-java`
2. `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached --name-only`
3. `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached --check`
4. Run `mvn -q test` in `examples/eurostat-crud-java`
5. Commit with the prepared message file:
   `git -C /home/ext_root/lab-data/zetaris-getting-started commit -F <scratch>/commit-3-message.txt`
6. Verify: `git -C /home/ext_root/lab-data/zetaris-getting-started show --stat --oneline HEAD`

### Commit 4

1. `git -C /home/ext_root/lab-data/zetaris-getting-started add docs/plans`
2. `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached --name-only`
3. `git -C /home/ext_root/lab-data/zetaris-getting-started diff --cached --check`
4. `markdownlint-cli2 docs/plans/*.md docs/plans/archive/2026-10-20_zetaris-local-setup_*.md docs/plans/archive/2026-10-23_eurostat-crud-java_*.md`
5. Commit with the prepared message file:
   `git -C /home/ext_root/lab-data/zetaris-getting-started commit -F <scratch>/commit-4-message.txt`
6. Verify: `git -C /home/ext_root/lab-data/zetaris-getting-started show --stat --oneline HEAD`

### Post-Commit Verification

1. `git -C /home/ext_root/lab-data/zetaris-getting-started status --short`
   - Expected: clean except ignored `scratch/` and local `.env.local` files.
2. `git -C /home/ext_root/lab-data/zetaris-getting-started log -4 --oneline`
3. `git -C /home/ext_root/lab-data/zetaris-getting-started show --stat HEAD~3..HEAD`
4. Run the commit-preview verifier against this file.
5. Confirm the safety stash is a no-op, then drop it only after verification.
6. Do not push unless separately requested.

### Abort Rules

- Stop on any staged path outside the planned lists.
- Stop on any secret, `.env.local`, `target/`, `node_modules/`, or `scratch/` path.
- Stop on a pre-commit fetch that shows the branch is behind.
- Stop on a failing test, build, lint, or link check.
- Stop on an author-identity mismatch.

---

Please say `start` to begin the sequential execution of the four atomic
commits above.
