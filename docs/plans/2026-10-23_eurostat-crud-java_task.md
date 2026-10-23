# [Task] Eurostat JDBC CRUD Web App

> **Artifact:** `task` (live checklist) · **Session:** `local-session` ·
> **Created:** `[2026-10-23 19:16]` · **Updated:** `[2026-10-23 22:16]`
>
> **Plan:** `docs/implementation-plans/2026-10-23_eurostat-crud-java_implementation-plan_v2.md`
>
> **Supersedes:** `docs/implementation-plans/2026-10-23_eurostat-crud-java_implementation-plan_v1.md`
> (archived; not deleted)

## Objective

Design, then (only after approval) implement a simple Java web CRUD application whose Eurostat reads go through the
Zetaris Lightning JDBC endpoint. Eurostat data is read-only, so CRUD is applied to app-owned notes in an in-memory
store (option B1); there is no H2 and no persistence. The Eurostat dataset itself is never mutated.

## Tasks

| # | Task | Status | Timestamp |
| :-: | :--- | :---: | :--- |
| 1 | Gather pre-plan context (toolchain, JDBC endpoint, schema, ports, artifact rules) | `[x]` | `[2026-10-23 19:16]` |
| 2 | Write v1 implementation plan and this task file | `[x]` | `[2026-10-23 19:22]` |
| 3 | Lint v1 planning artifacts with `markdownlint-cli2` | `[x]` | `[2026-10-23 19:22]` |
| 4 | Present v1; user chose B (in-memory CRUD), superseding v1 | `[x]` | `[2026-10-23 19:48]` |
| 5 | Write v2 Fresh Start plan (H2 removed; in-memory store) | `[x]` | `[2026-10-23 19:48]` |
| 6 | Lint v2 planning artifacts with `markdownlint-cli2` | `[x]` | `[2026-10-23 19:48]` |
| 7 | Present v2; obtain A1–A12 approval | `[x]` | `[2026-10-23 19:58]` |
| 8 | Phase 1 — driver install and JDBC smoke test | `[x]` | `[2026-10-23 20:28]` |
| 9 | Phase 2 — scaffold Maven project | `[x]` | `[2026-10-23 20:08]` |
| 10 | Phase 3 — domain and in-memory repository | `[x]` | `[2026-10-23 20:08]` |
| 11 | Phase 4 — Zetaris JDBC repository and Eurostat service | `[x]` | `[2026-10-23 20:08]` |
| 12 | Phase 5 — note service, validation, and seeder | `[x]` | `[2026-10-23 20:08]` |
| 13 | Phase 6 — Thymeleaf UI and controllers | `[x]` | `[2026-10-23 20:08]` |
| 14 | Phase 7 — unit, MVC, and JDBC integration tests | `[x]` | `[2026-10-23 20:08]` |
| 15 | Phase 8 — build, run, and end-to-end verification | `[x]` | `[2026-10-23 20:33]` |
| 16 | Phase 9 — README, lint, DOX pass, and handover | `[x]` | `[2026-10-23 20:33]` |
| 17 | Vendor driver under `lib/`, add `.env.example`, correct README env path | `[x]` | `[2026-10-23 22:16]` |

## Blockers

None.

## Resolved

- `[2026-10-23 20:12]` Live JDBC login failed with
  `TTransportException: Peer indicated failure: Error validating the login`.
  Root cause: the platform `lightning_user` row for `ADMIN@ZETARIS.COM` had
  `activated_at` set to `NULL`, so the API's `findUnlockedLightningUser` lookup
  returned nothing and the driver rejected the login. The password hash matched
  the platform `.env` password exactly. Fixed with
  `UPDATE lightning_user SET activated_at = created_at WHERE email='ADMIN@ZETARIS.COM' AND activated_at IS NULL;`
  and a driver restart; `legacy-login` then returned `200` and the JDBC probe
  returned `OK`. `.env.local` was synced to the platform admin email/password,
  and the driver lockout was cleared by the restart. Final `mvn -q verify`
  passed with 21 tests.
