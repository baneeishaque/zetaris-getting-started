# Task: Clone getting-started to lab-data and set up Zetaris locally

Created: [2026-10-20 13:08] — implementation plan v1 drafted, awaiting approval.
Updated: [2026-10-20 13:37] — v2 drafted from new requirements and verified corrections;
awaiting approval. v1 retained verbatim; coverage audit `FULL`.
Updated: [2026-10-21 10:49] — Phase 3 bundle obtained, verified, and extracted; v2 approval still pending.
Plan v1:
`docs/implementation-plans/2026-10-20_zetaris-local-setup_implementation-plan_v1.md`
Plan v2:
`docs/implementation-plans/2026-10-20_zetaris-local-setup_implementation-plan_v2.md`
Primary goal: clone `https://github.com/zetaris/getting-started` to
`$ZETARIS_REPO`, then install and verify a Zetaris local
Docker Compose platform plus the repository client helpers on this Linux host.

- [x] [2026-10-20 13:08] Normalized macOS paths and gathered read-only pre-plan evidence.
- [x] [2026-10-20 13:08] Drafted implementation plan v1 and passed `markdownlint-cli2`
  (0 issues across both planning artifacts). Planning only; zero execution.
- [ ] [2026-10-20 13:08] User approval of v1 and confirmation of target name, bundle path,
  compose-plugin install, Docker access strategy, and admin values.
- [ ] [2026-10-20 13:08] Phase 0 — approval and input gates.
- [ ] [2026-10-20 13:08] Phase 1 — install `docker-compose-v2`, verify Docker prerequisites.
- [ ] [2026-10-20 13:08] Phase 2 — clone the repository to `$ZETARIS_REPO`.
- [x] [2026-10-21 10:49] Phase 3 — obtain, verify, and extract the Zetaris platform bundle.
  Fresh signed URL from the bundle API; `7z t` OK; 13 files / 31,245,009 bytes verified at
  `$ZETARIS_PLATFORM`; `.env` mode `600`.
- [ ] [2026-10-20 13:08] Phase 4 — configure and validate the platform `.env`.
- [ ] [2026-10-20 13:08] Phase 5 — pull images, start services, wait for bootstrap, run `verify.sh`.
- [ ] [2026-10-20 13:08] Phase 6 — first UI login, `SELECT 1`, API key and organisation ID.
- [ ] [2026-10-20 13:08] Phase 7 — configure client `.env.local`, Python venv, REST preflight.
- [ ] [2026-10-20 13:08] Phase 8 — final verification, secret-permission audit, handover.
- [x] [2026-10-20 13:37] Drafted v2 amendments (Compose, Deno/TS, JDBC, 5432 correction, MCP,
  recipe scope, Docker access); `markdownlint-cli2` 0 issues; coverage audit `FULL`.
- [ ] [2026-10-20 13:37] User approval of v2 and the updated decisions Q2, Q3, Q8–Q16.
- [ ] [2026-10-20 13:37] Phase 1 addendum — install `docker-compose-v2`; add `ext_root` to `docker`.
- [ ] [2026-10-20 13:37] Phase 2 addendum — install Deno `2.9.7` via mise; run `deno task check`.
- [ ] [2026-10-20 13:37] Phase 2 addendum — download and verify public JDBC driver `2.1.0.13`;
  install mise Java `21.0.2` for JDBC only.
- [ ] [2026-10-20 13:37] Phase 4 addendum — port 5432 gate; preserve host PostgreSQL/Django.
- [ ] [2026-10-20 13:37] Optional — Phase 6 addendum MCP discovery after platform is healthy.
- [ ] [2026-10-20 13:37] Optional — Phase 9 verified recipe subset with disk budget.
