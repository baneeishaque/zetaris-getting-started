# [Clone getting-started to lab-data and set up Zetaris locally] (v1)

## Rule Compliance Reference

* `ai-agent-planning-rules.md` §1 — H1 `(v1)`
  header and this Rule Compliance Reference immediately after it.
* `ai-agent-planning-rules.md` §1.1 — Primary
  Goal Persistence Mandate (original enquiry carried verbatim into §0).
* `ai-agent-planning-rules.md` §1.2 —
  Architectural Boundary Verification (no CI/CD-managed task is executed locally).
* `ai-agent-planning-rules.md` §2–§4 — planning
  before acting; plan presented for approval; execution only after approval.
* `ai-agent-planning-rules.md` §5 — ambiguous
  requests handled with explicit open questions and gates.
* `ai-agent-planning-rules.md` §7, §7.1, §7.2 —
  maximum literal detail, exact commands, explicit files, guardrails, and future
  Verbatim-Superset Construction for v2+.
* `ai-agent-planning-rules.md` §8 — temporal
  hygiene and Change History.
* `ai-agent-planning-rules.md` §9 — versioning
  and SSOT integrity.
* `ai-agent-planning-rules.md` §10 — planning
  artifacts live under the main repository `docs/` tree.
* `ai-agent-planning-rules.md` §12 —
  state-dependent phase gating for unknown bundle contents and runtime health.
* `ai-agent-planning-rules.md` §13 — sequential
  objective protocol: v1 plans only; no clone, install, or configuration execution yet.
* `ai-agent-planning-rules.md` §14 — SSOT and
  content integrity.
* `shell-execution-rules.md` §2.3.1, §2.3.1.2,
  §2.3.4 — atomized probes, no combined unfamiliar-path chains, bounded output, and no
  renderer-freezing dumps.
* `ide-renderer-freeze-prevention` —
  long command output redirected to scratch logs; bounded `tail`/`head` reads.
* `redaction-portability` — no secrets,
  absolute-path normalization, and safe artifact publication rules.
* `planning-artifact-naming`
  — session-stamped task and implementation-plan filenames.
* `planning-artifact-lifecycle`
  — creation, presentation, approval, versioning, and retirement rules.
* `markdown-generation` and
  `markdown-generation-rules-additions.md`
  — lint-compliant artifact formatting.
* `AGENTS.md` — permanent operating reminders, DOX contract, and scratch-file
  placement rules.

---

## 0. Starting Point — Original Enquiry (verbatim, persisted per §1.1)

```text
clone https://github.com/zetaris/getting-started to lab-data (with proper name), then setup zetaris locally

plan first according to $AI_SUITE/ai-agent-rules/ai-agent-planning-rules.md. follow the instructions in $AI_SUITE/ai-agent-rules/ai-agent-planning-rules.md strictly & deeply for planning process. give me the maximum detailed plan according to the ai-agent-planning-rules. (please normalize paths first (if needed) - these were mac paths)
```

Normalized paths for this Linux host:

| Original macOS path | Normalized Linux path |
| :------------------ | :-------------------- |
| `$AI_SUITE` | `$AI_SUITE` |
| `$LAB_DATA` | `$LAB_DATA` |

This is the primary goal for all versions (v1…vN). Everything below is a supporting action to this
goal, not a replacement.

Plan version: **v1**. Date: **2026-10-20**. Status: **AWAITING APPROVAL — NOTHING EXECUTED**.
Session: `local-session`
(`Clone getting-started to lab-data and plan Zetaris setup`).

---

## 1. Deconstruction of the Request

* **Core task 1 — clone:** Clone `https://github.com/zetaris/getting-started` into
  `$LAB_DATA/` under a descriptive name. Recommended name:
  `$ZETARIS_REPO`.
* **Core task 2 — local Zetaris setup:** Install the Zetaris platform locally through the bundle's
  Docker Compose path, verify the platform, then configure the repository's client helpers so the
  local instance is usable from the shell.
* **Constraint — proper name:** The upstream folder is generically named `getting-started`; the
  local folder must be vendor-qualified and kebab-case so it is unambiguous in `lab-data`.
* **Constraint — planning only in v1:** No clone, package installation, bundle extraction, Docker
  operation, configuration mutation, or secret handling is performed until the user approves v1.
* **Constraint — macOS paths:** The request contains `$HOME/...` paths; they are normalized to
  `$HOME/...` above and used everywhere in this plan.
* **Hard dependency:** The `getting-started` repository contains recipes and guides only. It does
  **not** contain the Zetaris platform images or licence. The platform archive
  (`zetaris-platform.zip`), its matching `.env`, and registry credentials must come from Zetaris
  Cloud. Without them, a local platform install is impossible.
* **Desired output:** A maximum-detail, literal, approval-gated implementation plan. No execution in
  this turn.

---

## 2. Pre-Plan Context Gathering — Evidence (read-only, already executed)

All probes below were executed before this plan was finalized. No assumptions.

### 2.1 Host and workspace

1. Working directory: `$AI_SUITE`.
2. Host OS: `Ubuntu 22.04.5 LTS`; architecture: `x86_64`.
3. CPUs: `4`; memory: `15Gi` total, `8.7Gi` available at probe time.
4. Free disk on `/`: `62G` (`124G` total, `51%` used). Zetaris requires at least `15G`.
5. Git: `git version 2.34.1`.
6. Current ai-suite branch: `work/mise-github-throttling`; HEAD:
   `eb6ed326 2026-10-20 mise upgrade tools work`.
7. `lab-data` already contains unrelated repositories and no `zetaris*` directory.
8. `docs/` exists in ai-suite; neither `docs/AGENTS.md` nor
   `docs/implementation-plans/AGENTS.md` exists, so the root DOX contract applies.

### 2.2 Docker

1. Docker client: `Docker version 29.1.3, build 29.1.3-0ubuntu3~22.04.2`.
2. Docker daemon: active; `sudo -n docker info` returns `CPUs=4`,
   `MemTotal=16766812160` (~15.6 GiB), `Driver=overlayfs`, root `/var/lib/docker`.
3. `docker compose` is **missing**:
   `docker: unknown command: docker compose`.
4. Installed Docker packages: `docker.io 29.1.3-0ubuntu3~22.04.2`; no Compose package.
5. Available package: `docker-compose-v2 2.40.3+ds1-0ubuntu1~22.04.1` (Ubuntu `jammy-updates`,
   `universe`).
6. Docker socket: `srw-rw---- root docker /var/run/docker.sock`.
7. User `ext_root` is in groups `adm, dialout, cdrom, floppy, sudo, audio, dip, video, plugdev,
   netdev, lxd` — **not** in `docker`.
8. `sudo -n true` succeeds; `sudo -n docker ps` succeeds. `sg docker -c 'docker ps'` fails with a
   password prompt. `sudo -n -u ext_root -g docker -H docker ps` also fails with a password prompt.
   Therefore the reliable, non-interactive access path is `sudo docker ...`.
9. Existing Docker state: one buildx container (`buildx_buildkit_steg0`); no Zetaris containers,
   images, volumes, or networks. Volume list contains only `buildx_buildkit_steg0_state`.
10. Ports `3000`, `8888`, `10000`, and `5432` are currently free.

### 2.3 Toolchain

| Tool | Finding | Impact |
| :--- | :------ | :----- |
| `unzip` | `/usr/bin/unzip` | Bundle extraction ready. |
| Java | OpenJDK `27` 2026-09-15 | Satisfies JDBC's JDK 11+ requirement. |
| Python | `3.10.12`; `venv` and `ensurepip` available | Client scripts and `.venv` ready. |
| `pip` | Not installed system-wide; `ensurepip` provides pip in a venv | Use `.venv/bin/pip`, not system pip. |
| Deno | Not installed | TypeScript helpers are optional; Python path is sufficient. |
| `markdownlint-cli2` | `v0.23.3` via mise-managed Node | Artifact linting ready. |

### 2.4 Upstream repository and platform requirements

1. `git ls-remote --symref https://github.com/zetaris/getting-started HEAD` returns
   `ref: refs/heads/main` and commit `841344cc704986dadf961854eecf2dd1f4098c0a` (at probe time).
2. The repository README states it contains data recipes, connection helpers, and guides; platform
   images are separate.
3. Local install requirements from the installation guide:
   * Docker Engine 25 or later; daemon running.
   * Docker Compose plugin; tested with Compose `5.5.1` in the test record.
   * 8 GB memory recommended; preflight fails below 6 GB.
   * 4 CPUs recommended.
   * At least 15 GB free disk.
   * `amd64` images; Apple Silicon needs emulation. This host is `x86_64`, so no emulation.
   * Outbound access to `zetarishackathon.azurecr.io` and queried data sources.
4. Required bundle contents: `docker-compose.yml`, `.env`, `preflight.sh`, `verify.sh`, plus the
   service definitions. The guide warns that older `.env.example` / `env/make-env.sh` references
   may be absent; the supplied `.env` is authoritative.
5. Platform `.env` values required before first startup: administrator email, administrator
   password, organisation name, Spark memory/cores/master, API heap, UI port, allowed origins, GUI
   URL, empty `COMPOSE_PROFILES`, and `ZETARIS_SEED_TPCH=true`.
6. Administrator password policy: at least 8 characters with lowercase, uppercase, a digit, and one
   of `$ @ ! % * ? &`. Other punctuation is rejected.
7. Client configuration: `.env.local` is gitignored and separate from the platform `.env`. It needs
   `ZETARIS_BASE_URL`, `ZETARIS_REST_URL`, numeric `ZETARIS_ORG_ID`, an API key or
   username/password, optional JDBC URL/JAR, and `ZETARIS_USER_AGENT`.
8. API keys are shown once in the UI and must never be pasted into a prompt or command line.

### 2.5 Missing prerequisites

1. `$HOME/Downloads`, `$HOME/Desktop`, and `$HOME/Documents` contain no
   `zetaris-platform.zip`.
2. No registry authentication exists for `zetarishackathon.azurecr.io`
   (`~/.docker/config.json` has no matching entry).
3. No Zetaris JDBC driver JAR is present in the inspected locations.
4. These are **user-supplied inputs**, not agent-fixable facts.

---

## 3. Scope, Out of Scope, Assumptions

### 3.1 In scope

* Install the missing Docker Compose v2 plugin with user approval.
* Clone the upstream repository to a vendor-qualified local folder.
* Obtain (user action), verify, and extract the official platform bundle.
* Configure the platform `.env` and start the local Docker Compose stack.
* Run the bundle's `preflight.sh`, `verify.sh`, and service health checks.
* Perform the first administrator login and a read-only `SELECT 1`.
* Create and protect the client `.env.local`; create a Python virtual environment; install the
  repository's client requirements; run REST and UI-proxy preflight checks.
* Optionally validate JDBC with a user-supplied driver JAR.

### 3.2 Out of scope (deferred unless the user explicitly asks)

* Running data recipes (PokéAPI, PUDL, NOAA, EDGAR, USL builds, etc.).
* Creating, dropping, granting, or writing any platform objects beyond the read-only checks.
* Deploying the managed AWS cluster alternative.
* Installing Deno and the TypeScript helper path.
* Obtaining the Zetaris platform archive, licence, registry credentials, JDBC driver, or API key on
  the user's behalf.
* Committing, pushing, or creating pull requests in either repository.
* Modifying the global Git configuration or the ai-suite source tree.

### 3.3 Assumptions

1. The user has a Zetaris Cloud account or a supplied platform bundle plus registry credentials.
2. The user will enter secrets locally, never in chat.
3. No other service needs ports `3000`, `8888`, `10000`, or `5432` during setup.
4. The host remains at 4 CPUs and at least 6 GB available to Docker; 8 GB is preferred.
5. The upstream repository remains public and reachable over HTTPS.
6. The bundle's Compose project name is `zetaris`; no existing `zetaris` volumes exist now.

---

## 4. Files and Paths

### 4.1 Planning artifacts

| Path | Action |
| :--- | :----- |
| `$AI_SUITE/docs/2026-10-20_zetaris-local-setup_task.md` | Created (live checklist). |
| `$AI_SUITE/docs/implementation-plans/2026-10-20_zetaris-local-setup_implementation-plan_v1.md` | Created (this plan). |

### 4.2 Execution artifacts

| Path | Action |
| :--- | :----- |
| `$ZETARIS_REPO/` | Created by `git clone`. |
| `$ZETARIS_PLATFORM.zip` | User-supplied archive; moved here before extraction. |
| `$ZETARIS_PLATFORM/` | Created by `unzip`. |
| `$ZETARIS_PLATFORM/.env` | Modified in place from the supplied bundle. |
| `$ZETARIS_PLATFORM/.env.supplied.bak` | Optional pre-edit backup; mode `600`. |
| `$ZETARIS_REPO/.env.local` | Created from `.env.example`; mode `600`. |
| `$ZETARIS_REPO/.venv/` | Created by `python3 -m venv`. |
| `$SCRATCH/local-session/` | Session scratch for long command logs. |
| `/root/.docker/config.json` | Registry login written by `sudo docker login`. |
| `/usr/libexec/docker/cli-plugins/docker-compose` | Installed by `docker-compose-v2` (expected path). |

### 4.3 Deletions and renames

* **None.** No existing file, directory, volume, or container is deleted or renamed.
* If the target clone path already exists, the plan stops and asks; it does not overwrite.
* If a `zetaris` Compose project collision is found, the plan isolates with
  `COMPOSE_PROJECT_NAME=zetaris-local`; it does not delete volumes.

---

## 5. Required Inputs and Open Decisions

| ID | Decision / input | Recommended default | Blocking? |
| :-- | :--------------- | :------------------ | :-------- |
| Q1 | Target clone path | `$ZETARIS_REPO` | Yes |
| Q2 | Install `docker-compose-v2` via `sudo apt-get` | Yes | Yes |
| Q3 | Docker access strategy | `sudo docker ...` for this setup | Yes |
| Q4 | Platform bundle path | `$ZETARIS_PLATFORM.zip` | Yes |
| Q5 | Registry credentials | User enters at the `docker login` prompt | Yes |
| Q6 | Admin email / organisation | User supplies non-secret values | Yes |
| Q7 | Admin password | User sets it directly in `.env` (never in chat) | Yes |
| Q8 | JDBC driver JAR | Optional; user supplies the absolute path | No |
| Q9 | Deno installation | Optional; skip for the Python path | No |
| Q10 | API key and numeric org ID | User creates/copies in the UI, enters in `.env.local` | Yes (client phase) |

---

## 6. User Questions & Answers

**Q: Were the macOS paths normalized?**
A: Yes. `$AI_SUITE` → `$AI_SUITE` and
`$LAB_DATA` → `$LAB_DATA`. The working directory was verified with `pwd`.

**Q: What is the "proper name" for the clone?**
A: Recommended `$ZETARIS_REPO`. It is vendor-qualified,
lowercase-kebab-case, avoids a generic `getting-started` folder, and matches the existing
`lab-data` repository naming style.

**Q: Can the setup be completed without the Zetaris Cloud bundle?**
A: No. The GitHub repository contains recipes and guides only. The platform images, matching
`.env`, registry credentials, and licence/evaluation entitlement come from Zetaris Cloud. This is a
hard gate.

**Q: Is Docker ready?**
A: Partially. Docker Engine `29.1.3` is running, but the Compose plugin is missing and the current
user cannot access the Unix socket without `sudo`. The plan installs `docker-compose-v2` and uses
`sudo docker` consistently.

**Q: Is JDBC required?**
A: No. REST and the UI proxy are sufficient for the initial setup. Java 27 is present; JDBC only
needs a matching driver JAR, which must be supplied by Zetaris or the user.

**Q: Will secrets appear in this plan, chat, or logs?**
A: No. The plan uses placeholders. `.env` and `.env.local` are mode `600`; `docker compose config`
is always run with `--quiet`; the API key is created and entered by the user directly.

---

## 7. Change History

| Timestamp | Summary of Changes | Rationale |
| :-------- | :----------------- | :-------- |
| `[2026-10-20 13:08]` | v1 initial plan created after read-only context gathering. | First approval gate; no execution performed. |

---

## 8. Execution Phases (only after explicit approval)

### Phase 0 — Approval and input gate

**Action:** Confirm Q1–Q10, especially the target path, bundle path, compose-plugin install, Docker
access strategy, and admin values.

**Commands:** None.

**Exit criteria:**

* The user explicitly approves v1.
* The user confirms the bundle archive is available or states when it will be.
* The user confirms that installing `docker-compose-v2` with `sudo` is permitted.
* The user confirms `sudo docker` is the accepted access path.
* The user confirms the target path is free or accepts a different path.
* The user understands that the admin password must be set locally before first startup.

**Failure handling:** If any input is missing, stop. Do not substitute guesses.

---

### Phase 1 — Environment remediation and Docker prerequisite verification

**Action:** Install the Compose v2 plugin, verify Docker resources, and re-check ports and
collisions.

**Commands (literal, in order):**

```bash
sudo apt-get update
sudo apt-get install -y docker-compose-v2
sudo docker compose version
sudo docker info --format 'CPUs={{.NCPU}} MemTotal={{.MemTotal}} Driver={{.Driver}}'
sudo docker ps -a --format '{{.Names}}\t{{.Status}}\t{{.Image}}'
sudo docker volume ls --format '{{.Name}}'
ss -ltn | awk 'NR==1 || /:(3000|8888|10000|5432)\b/'
free -h
df -h $HOME
nproc
```

**Expected results:**

* `sudo docker compose version` prints `Docker Compose version v2.40.3` (or the installed
  `docker-compose-v2` version).
* Docker info reports 4 CPUs and about 15.6 GiB total memory.
* No `zetaris*` containers or volumes are listed.
* Ports `3000`, `8888`, `10000`, and `5432` remain free.
* At least 6 GiB is available; 8 GiB is preferred.

**Fallback if the apt package is unavailable:** install the official plugin binary into the system
CLI plugin directory:

```bash
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -fsSL -o /usr/local/lib/docker/cli-plugins/docker-compose \
  https://github.com/docker/compose/releases/download/v2.40.3/docker-compose-linux-x86_64
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
sudo docker compose version
```

**Docker access decision:** Use `sudo docker ...` for every Docker command. Do **not** change the
user's group membership in this plan. The root registry config is acceptable because every platform
command runs through `sudo`.

**Failure handling:**

* If `apt-get` fails, capture the exact error and stop; do not install from an unverified source.
* If memory is below 6 GiB, ask before stopping `buildx_buildkit_steg0` or another non-essential
  container. Do not stop unrelated workloads without approval.
* If a port is occupied, identify the listener with `ss -ltnp` and ask before changing ports.

---

### Phase 2 — Clone the upstream repository under the proper name

**Action:** Clone the public repository to the vendor-qualified target path and record the exact
commit.

**Commands (literal, in order):**

```bash
test ! -e $ZETARIS_REPO
git clone https://github.com/zetaris/getting-started.git \
  $ZETARIS_REPO
git -C $ZETARIS_REPO remote -v
git -C $ZETARIS_REPO rev-parse --abbrev-ref HEAD
git -C $ZETARIS_REPO rev-parse HEAD
git -C $ZETARIS_REPO status --short
git -C $ZETARIS_REPO log -1 --format='%h %ad %s' --date=short
```

**Expected results:**

* `remote.origin.url` is `https://github.com/zetaris/getting-started.git`.
* Branch is `main`.
* HEAD is `841344cc704986dadf961854eecf2dd1f4098c0a` or a newer upstream commit; record the actual
  value.
* `git status --short` is empty.

**Failure handling:**

* If the target exists, stop and ask; do not delete or overwrite it.
* If the clone fails for network reasons, run `git ls-remote --symref` to distinguish DNS,
  proxy, and authentication problems.
* Do not add credentials, change the remote to SSH, or modify global Git config.

---

### Phase 3 — Obtain, verify, and extract the Zetaris platform bundle

**Action:** Place the user-supplied `zetaris-platform.zip` in `lab-data`, verify its integrity, and
extract it beside (not inside) the cloned repository.

**User action first:** Download `zetaris-platform.zip` from
`https://cloud.enterprise.zetaris.com/dashboard/download` and place it at
`$ZETARIS_PLATFORM.zip`. If it is in `~/Downloads`, move it:

```bash
test ! -e $ZETARIS_PLATFORM.zip
mv $HOME/Downloads/zetaris-platform.zip $LAB_DATA/
```

**Verification and extraction commands:**

```bash
ls -lh $ZETARIS_PLATFORM.zip
file $ZETARIS_PLATFORM.zip
unzip -t $ZETARIS_PLATFORM.zip
test ! -e $ZETARIS_PLATFORM
unzip -q $ZETARIS_PLATFORM.zip -d $LAB_DATA
ls -la $ZETARIS_PLATFORM
```

**Protocol Gate G1 — inspect the bundle before using it:**

```bash
cd $ZETARIS_PLATFORM
sed -n '1,200p' docker-compose.yml
sed -n '1,200p' preflight.sh
sed -n '1,160p' verify.sh
ls -la .env
stat -c '%a %n' .env
```

**Checks:**

* `docker-compose.yml`, `.env`, `preflight.sh`, and `verify.sh` exist.
* The compose file's `name:` is recorded. If it is `zetaris`, check for collisions:
  `sudo docker volume ls --format '{{.Name}}' | grep '^zetaris'`.
* If `zetaris` volumes already exist, append `COMPOSE_PROJECT_NAME=zetaris-local` to `.env` for
  isolation. Do not remove the existing volumes.
* Do not print `.env`; it may contain supplied values.

**Failure handling:**

* If `unzip -t` fails, stop and ask for a fresh download; do not extract a corrupt archive.
* If the extracted directory already exists, stop and ask.
* If the bundle lacks `docker-compose.yml` or `.env`, stop; the bundle is incomplete.

---

### Phase 4 — Configure and validate the platform `.env`

**Action:** Set the administrator identity and the local sizing values in
`$ZETARIS_PLATFORM/.env`. The user edits secrets directly; the agent never
prints them.

**Pre-edit backup (optional but recommended):**

```bash
cd $ZETARIS_PLATFORM
cp -p .env .env.supplied.bak
chmod 600 .env .env.supplied.bak
```

**Required values:**

| Variable | Local value or action |
| :------- | :-------------------- |
| `ZETARIS_ADMIN_EMAIL` | Initial administrator email (user-supplied). |
| `ZETARIS_ADMIN_PASSWORD` | User-supplied strong password; policy below. |
| `ZETARIS_ADMIN_ORG` | Initial organisation name, chosen before first startup. |
| `ZSPARK_DRIVER_MEM` | `2g` |
| `ZSPARK_DRIVER_CORES` | `2` |
| `ZSPARK_MASTER_URL` | `local[2]` |
| `ZETARIS_API_MAX_HEAP` | `1g` |
| `UI_PORT` | `3000` (or `127.0.0.1:3000` if the compose file supports a bind address). |
| `ALLOWED_ORIGINS` | `http://localhost:3000` |
| `GUI_URL` | `http://localhost:3000` |
| `COMPOSE_PROFILES` | Empty/unset for the local path. |
| `ZETARIS_SEED_TPCH` | `true` to retain the supplied sample data. |

Keep the issued image references and all other supplied values.

**Password policy:** at least 8 characters, containing lowercase, uppercase, a digit, and one of
`$ @ ! % * ? &`. Other punctuation is rejected. Set the password before the first bootstrap;
changing it in `.env` after bootstrap does not reset existing accounts.

**Non-revealing verification:**

```bash
cd $ZETARIS_PLATFORM
chmod 600 .env
awk -F= '/^(ZETARIS_ADMIN_EMAIL|ZETARIS_ADMIN_PASSWORD|ZETARIS_ADMIN_ORG|ZSPARK_DRIVER_MEM|ZSPARK_DRIVER_CORES|ZSPARK_MASTER_URL|ZETARIS_API_MAX_HEAP|UI_PORT|ALLOWED_ORIGINS|GUI_URL|COMPOSE_PROFILES|ZETARIS_SEED_TPCH)=/{v=substr($0,index($0,"=")+1); print $1"="(length(v)>0?"<set>":"<empty>")}' .env
```

**Password-policy check (prints PASS/FAIL only):**

```bash
python3 - <<'PY'
import re
from pathlib import Path
vals = {}
for line in Path('.env').read_text().splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        k, v = line.split('=', 1)
        vals[k.strip()] = v.strip().strip('"').strip("'")
p = vals.get('ZETARIS_ADMIN_PASSWORD', '')
ok = (
    len(p) >= 8
    and re.search('[a-z]', p)
    and re.search('[A-Z]', p)
    and re.search('[0-9]', p)
    and re.search(r'[$@!%*?&]', p)
    and not re.search(r'[^A-Za-z0-9$@!%*?&]', p)
)
print('PASSWORD_POLICY=' + ('PASS' if ok else 'FAIL'))
print('ADMIN_EMAIL_SET=' + ('yes' if vals.get('ZETARIS_ADMIN_EMAIL') else 'no'))
print('ADMIN_ORG_SET=' + ('yes' if vals.get('ZETARIS_ADMIN_ORG') else 'no'))
PY
```

**Compose validation:**

```bash
sudo docker compose config --quiet
sudo docker compose config --services
```

**Expected results:**

* `config --quiet` exits 0 and prints nothing.
* `config --services` lists the expected services (`postgres`, `driver`, `api`, `ui`, `init`,
  `bootstrap`, `ai-datasteward`).
* The password check prints `PASSWORD_POLICY=PASS`, `ADMIN_EMAIL_SET=yes`, `ADMIN_ORG_SET=yes`.

**Failure handling:**

* If `config --quiet` fails, read the error; do not run `config` without `--quiet` because it can
  print resolved secrets.
* If `COMPOSE_PROFILES` is non-empty, clear it for the local path.
* If the password fails policy, ask the user to change it in `.env` before the first startup.

---

### Phase 5 — Pull images, start services, wait for bootstrap, verify

**Action:** Authenticate to the registry, pull the images, start the stack, wait for the one-time
jobs, and run the bundle verifier.

**Registry login (interactive; user enters credentials):**

```bash
sudo docker login zetarishackathon.azurecr.io
```

**Long-running outputs:** capture to the session scratch folder, not `/tmp`:

```bash
mkdir -p $SCRATCH/local-session
cd $ZETARIS_PLATFORM
sudo docker compose pull 2>&1 | tee $SCRATCH/local-session/zetaris-compose-pull.log
sudo docker compose up -d 2>&1 | tee $SCRATCH/local-session/zetaris-compose-up.log
sudo docker compose ps --all
```

**Wait for `bootstrap` to exit 0:**

```bash
cd $ZETARIS_PLATFORM
cid=$(sudo docker compose ps -q bootstrap)
for i in $(seq 1 60); do
  state=$(sudo docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' "$cid" 2>/dev/null || echo unknown)
  echo "$state"
  [ "$state" = "exited 0" ] && break
  sleep 10
done
```

**Read service logs (bounded):**

```bash
sudo docker compose logs --tail=80 driver api bootstrap
```

**Run the bundle verifier:**

```bash
cd $ZETARIS_PLATFORM
sudo ./verify.sh
```

**Expected results:**

* `postgres`, `driver`, `api`, `ui`, and `ai-datasteward` are running; check health in
  `docker compose ps --all`.
* `init` and `bootstrap` show `Exited (0)`.
* `verify.sh` passes all nine checks, including login and a query through UI, API, and query
  engine.
* First pull downloads about 4 GB; allow time. Startup with cached images took about 201 seconds in
  the upstream test record.

**Failure handling:**

* If `compose pull` reports unauthorized, re-run `sudo docker login` and retry. The pull itself is
  the definitive registry-credential check.
* If `bootstrap` is still running, wait and re-run the verifier.
* If UI checks fail immediately after bootstrap, wait 60 seconds and run `sudo ./verify.sh` again.
* If `verify.sh` still fails, capture logs to the scratch folder:
  `sudo docker compose logs --tail=200 > $SCRATCH/.../zetaris-verify-failure.log`.
* Do not run `docker compose down -v` during troubleshooting; it deletes the metastore and encryption
  keys.

---

### Phase 6 — First login and platform SQL verification

**Action:** Sign in to the local UI, run a read-only query, and collect the client identifiers.

**Steps:**

1. Open `http://localhost:3000`.
2. Sign in with `ZETARIS_ADMIN_EMAIL` and `ZETARIS_ADMIN_PASSWORD` from `.env`.
3. Open the SQL Editor and run:

   ```sql
   SELECT 1 AS one;
   ```

   Expect one row with value `1`.
4. Create an API key: **Management → API Tokens → +**. Copy it once and enter it directly into
   `.env.local`; never paste it into chat or a command line.
5. Find the numeric organisation ID: **Management → Organisation → ID**. Use the numeric **ID**,
   not the organisation name or URL slug.
6. Confirm the UI is reachable from the host:

   ```bash
   curl -sS -o /dev/null -w 'UI_HTTP=%{http_code}\n' http://localhost:3000
   curl -sS -o /dev/null -w 'API_HTTP=%{http_code}\n' http://localhost:8888/redoc/index.html
   ```

**Expected results:** `UI_HTTP=200` or `307`; `API_HTTP=200`; one row from `SELECT 1`.

**Failure handling:**

* If login fails, confirm `bootstrap` exited 0 and the `api` service is healthy.
* Re-check `.env` with the non-revealing `awk` command; do not print the password.
* Changing the admin email, password, or organisation in `.env` after bootstrap does not recreate
  the account. If the values were wrong at first startup, recovering may require discarding volumes
  with `docker compose down -v`, which is destructive and requires explicit approval.

---

### Phase 7 — Configure the repository client and run preflight

**Action:** Create `.env.local`, install the Python client requirements, and verify REST and the UI
proxy.

**Create `.env.local` without overwriting an existing file:**

```bash
cd $ZETARIS_REPO
test -e .env.local && echo EXISTS || cp .env.example .env.local
chmod 600 .env.local
```

**Values to set in `.env.local`:**

| Variable | Value |
| :------- | :---- |
| `ZETARIS_BASE_URL` | `http://localhost:3000` |
| `ZETARIS_REST_URL` | `http://localhost:8888/api/v1.0` |
| `ZETARIS_JDBC_URL` | `jdbc:zetaris:lightning@localhost:10000` |
| `ZETARIS_ORG_ID` | Numeric ID from the UI. |
| `ZETARIS_API_KEY` | User-created key; entered directly by the user. |
| `ZETARIS_USERNAME` | Optional if the API key is set. |
| `ZETARIS_PASSWORD` | Optional if the API key is set. |
| `ZETARIS_QUERY_LIMIT` | `1000` |
| `ZETARIS_ENGINE_ID` | Optional compute engine ID. |
| `ZETARIS_JDBC_JAR` | Optional absolute path to the matching driver JAR. |
| `ZETARIS_USER_AGENT` | `"{app_name} {contact_email}"` for create scripts. |

**Protect and verify:**

```bash
chmod 600 .env.local
git -C $ZETARIS_REPO check-ignore -v .env.local
git -C $ZETARIS_REPO status --short
```

**Expected results:** `check-ignore` reports the `.gitignore` rule; `git status --short` does not
list `.env.local`.

**Create the virtual environment and install client requirements:**

```bash
cd $ZETARIS_REPO
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/pip install -r scripts/requirements.txt
```

**Run the read-only preflight:**

```bash
cd $ZETARIS_REPO
.venv/bin/python scripts/preflight.py
```

**Run the UI-proxy helpers:**

```bash
.venv/bin/python scripts/check_zetaris.py
.venv/bin/python scripts/query_zetaris.py "SELECT 1"
```

**Expected results:**

* `preflight.py` passes the REST checks: `GET /datasource/datasources`, `SELECT 1`, and the
  Lightning database listing.
* `check_zetaris.py` returns a successful response.
* `query_zetaris.py "SELECT 1"` returns one row with value `1`.
* Read REST and JDBC results separately; a REST failure alone does not prove JDBC is unavailable.

**Optional JDBC validation:**

```bash
find $ZETARIS_PLATFORM -maxdepth 3 -type f -iname '*.jar' -print
java -version
```

If the driver JAR is not in the bundle, ask the user for its absolute path. Do not guess.
Java 27 is installed; the guide requires JDK 11 or later, but a driver built for older JDKs may not
support 27. If JDBC fails with a class-version or unsupported-JDK error, use a JDK 17 or 21 runtime
(approved by the user) and set `JAVA_HOME` for the preflight command. Do not change the system
default Java without approval.
Then:

```bash
cd $ZETARIS_REPO
.venv/bin/python scripts/preflight.py --jdbc --jar "$ZETARIS_JDBC_JAR"
```

**Optional Deno path:** Deno is not installed. The Python helpers cover the setup. Only if the user
asks, install Deno 2.9+ with the project's approved method and then run `deno task check`.

---

### Phase 8 — Final verification, secret audit, and handover

**Commands:**

```bash
cd $ZETARIS_REPO
git status --short

cd $ZETARIS_PLATFORM
sudo docker compose ps --all
sudo ./verify.sh

curl -sS -o /dev/null -w 'UI_HTTP=%{http_code}\n' http://localhost:3000
curl -sS -o /dev/null -w 'API_HTTP=%{http_code}\n' http://localhost:8888/redoc/index.html

stat -c '%a %n' $ZETARIS_PLATFORM/.env
stat -c '%a %n' $ZETARIS_REPO/.env.local

git -C $ZETARIS_REPO ls-files | grep -E '(^|/)\.env' \
  || echo NO_ENV_TRACKED
```

**Final report contents:**

* Clone path, remote, branch, and HEAD.
* Bundle path and Compose project name.
* Service health table and `verify.sh` result.
* UI and API URLs.
* Client preflight results (REST and JDBC separately).
* Secret-file modes and confirmation that no `.env` file is tracked.
* Any optional items deferred (recipes, Deno, JDBC driver).
* `task.md` updated with completion timestamps.
* No commit or push is performed.

---

## 9. Surface Area / Impact Scan

This plan creates new paths and modifies two supplied env files. It does not rename or delete any
existing path. The scan below is mandatory before execution and again before the final report.

```bash
ls -d $LAB_DATA/zetaris* 2>/dev/null || echo NO_EXISTING_ZETARIS_DIR
sudo docker volume ls --format '{{.Name}}' | grep '^zetaris' || echo NO_ZETARIS_VOLUMES
sudo docker ps -a --format '{{.Names}}' | grep -i zetaris || echo NO_ZETARIS_CONTAINERS
ss -ltn | awk 'NR==1 || /:(3000|8888|10000|5432)\b/'
grep -n 'ZETARIS' $HOME/.bashrc $HOME/.profile \
  $HOME/.bash_profile 2>/dev/null || echo NO_SHELL_ZETARIS_VARS
```

**Interpretation:**

* Any existing `zetaris*` directory is a collision; stop and ask.
* Any existing `zetaris_*` volume is a Compose-project collision; use a distinct
  `COMPOSE_PROJECT_NAME` or stop and ask. Never delete the volume.
* Any occupied port is a conflict; identify the listener and ask before changing ports.
* Any shell-level `ZETARIS_*` variable could override `.env.local`; record it and ask before
  proceeding.

---

## 10. State-Dependent Protocol Gates

Per planning rule §12, the plan does not predict unknown future state. These gates generate fresh
evidence at execution time.

| Gate | When | Mandatory discovery | Decision |
| :--- | :--- | :------------------ | :------- |
| G0 | Before any execution | `pwd`, `date`, `git -C ai-suite status --short` | Confirm workspace and no unexpected changes. |
| G1 | After bundle extraction | `sed -n '1,200p' docker-compose.yml`; `sed -n '1,200p' preflight.sh`; `sed -n '1,160p' verify.sh`; `ls -la .env` | Confirm service names, Compose project name, ports, and verifier behavior. If commands must change, present v2 and wait. |
| G2 | Before `compose up` | `sudo docker compose config --quiet`; `sudo docker compose config --services`; memory/port/volume checks | Confirm config validity and no collision. |
| G3 | After `compose up` | `sudo docker compose ps --all`; bootstrap inspection; bounded logs | Confirm health and one-time-job exit codes before running the verifier. |
| G4 | After client preflight | `preflight.py` output; optional `--jdbc` output | Treat REST and JDBC as independent results; do not infer one from the other. |
| G5 | Before final report | Re-run `verify.sh`, UI/API HTTP checks, secret-mode audit | Confirm the final state, not an earlier cached state. |

---

## 11. Verification Matrix

| Gate | Exact command | Expected |
| :--- | :------------ | :------- |
| V1 Compose installed | `sudo docker compose version` | Prints a v2.x version. |
| V2 Docker resources | `sudo docker info --format 'CPUs={{.NCPU}} MemTotal={{.MemTotal}}'` | 4 CPUs; ~15.6 GiB. |
| V3 Target free | `test ! -e $ZETARIS_REPO` | Exit 0. |
| V4 Clone | `git -C ... remote -v`; `git -C ... status --short` | Origin exact; clean tree. |
| V5 Bundle | `unzip -t $ZETARIS_PLATFORM.zip` | No errors. |
| V6 Config | `sudo docker compose config --quiet` | Exit 0; no output. |
| V7 Services | `sudo docker compose ps --all` | Core services healthy; init/bootstrap `Exited (0)`. |
| V8 Platform verifier | `sudo ./verify.sh` | 9/9 checks pass. |
| V9 UI | `curl -sS -o /dev/null -w '%{http_code}' http://localhost:3000` | `200` or `307`. |
| V10 API docs | `curl ... http://localhost:8888/redoc/index.html` | `200`. |
| V11 SQL | UI SQL Editor `SELECT 1 AS one;` | One row, value `1`. |
| V12 Client preflight | `.venv/bin/python scripts/preflight.py` | REST checks pass. |
| V13 UI proxy | `.venv/bin/python scripts/query_zetaris.py "SELECT 1"` | JSON result with `1`. |
| V14 Secrets | `stat -c '%a %n' .env .env.local` | Both `600`. |
| V15 No tracked env | `git -C clone ls-files \| grep -E '(^\|/)\\.env'` | No output. |

---

## 12. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| :--- | :--------- | :----- | :--------- |
| Platform bundle or registry credentials unavailable | High | Blocks local install | Hard gate; user downloads from Zetaris Cloud. Do not substitute public images. |
| Docker Compose plugin missing | Certain | Blocks `docker compose` | Install `docker-compose-v2`; fallback to the official plugin binary. |
| Docker socket permission denied | Certain for non-sudo | Blocks commands | Use `sudo docker` consistently; do not change group membership in this plan. |
| Memory below 6 GiB during startup | Medium | Preflight/start failure | 8.7 GiB available now; stop non-essential containers only with approval. |
| Compose project/volume collision | Low | Could reuse old data | No `zetaris` volumes exist; if found, set `COMPOSE_PROJECT_NAME=zetaris-local`. |
| Port conflict | Low | Startup failure | All four ports free now; re-check and identify listeners before changing. |
| Wrong admin values before first bootstrap | Medium | Login failure; reset may need volume deletion | Validate email/org/password before `compose up`; emphasize no post-bootstrap reset. |
| Password rejected by policy | Medium | Bootstrap/account issue | Run the PASS/FAIL policy check before startup. |
| Image pull is slow or fails | Medium | Delays setup | ~4 GB pull; capture log; retry login; verify registry access. |
| UI/API checks fail immediately after bootstrap | Medium | False failure | Wait 60 seconds; re-run `verify.sh`. |
| API key exposed in chat or logs | Low | Credential compromise | User enters it directly in `.env.local`; never print or echo it. |
| `docker compose config` prints secrets | Medium | Secret leakage in logs | Always use `--quiet`; never run bare `config`. |
| JDBC driver missing | Medium | JDBC path unavailable | REST path is sufficient; ask for the JAR; do not guess. |
| JDK 27 incompatible with the driver | Low | JDBC path unavailable | Try JDK 17 or 21 with `JAVA_HOME` after user approval; REST remains available. |
| Deno missing | Certain | TypeScript helpers unavailable | Python helpers cover setup; Deno is optional. |
| Renderer freeze from long output | Medium | Lost session/renderer | Redirect pull/log output to scratch; use `--tail`/`head`. |

---

## 13. Rollback and Recovery

### 13.1 Platform lifecycle

```bash
cd $ZETARIS_PLATFORM
sudo docker compose stop
sudo docker compose start
sudo docker compose down
sudo docker compose up -d
```

* `stop` and `down` retain named volumes and data.
* `down -v` deletes the metastore and encryption keys. Use only with explicit user approval after
  confirming data loss is acceptable.

### 13.2 Configuration rollback

* If `.env` is malformed, restore `.env.supplied.bak` with user approval, then re-apply the required
  values.
* If `.env.local` is malformed, restore from `.env.example` and re-enter the non-secret values.
* Never commit either file.

### 13.3 Clone rollback

* If the clone is wrong, stop and ask. Do not delete it. On Linux, move it to a user-approved backup
  path if cleanup is requested.
* The macOS `trash` rule does not apply on this Linux host; avoid `rm` regardless.

### 13.4 Package rollback

* `docker-compose-v2` is left installed; removing it is not part of this plan.

---

## 14. Security and Redaction Rules

1. Never print, `cat`, or `grep` the values of `.env` or `.env.local`.
2. Never run `docker compose config` without `--quiet`.
3. Never place the admin password, API key, registry password, or JDBC credentials in a prompt,
   command line, URL, screenshot, or log.
4. Always run `chmod 600` on `.env` and `.env.local`.
5. Use `sudo docker login` interactively; never use `--password` or `--password-stdin` with a value
   visible in shell history.
6. Confirm `.env.local` is ignored with `git check-ignore -v`.
7. Do not commit planning artifacts that contain the session ID; they are local-only.
8. Do not run create/drop/grant SQL during setup; only `SELECT 1` and read-only checks.
9. Do not expose the UI/API beyond loopback. If the compose file supports a bind address, prefer
   `127.0.0.1:3000`; otherwise record that port 3000 is bound on all interfaces and ask before
   changing exposure.
10. Report only `<set>` / `<empty>` status for secret fields, never the values.

---

## 15. Time and Resource Estimate

| Phase | Estimated time | Notes |
| :---- | :------------- | :---- |
| Approval + input collection | 5–15 min | Depends on bundle availability. |
| Compose plugin install | 1–3 min | `apt-get` plus verification. |
| Clone | <1 min | Public repository, small history. |
| Bundle download | User-dependent | ~4 GB of images are pulled separately. |
| Image pull | 10–30 min | Depends on network and registry. |
| First startup + bootstrap | 3–10 min | ~201 s with cached images in the test record. |
| `verify.sh` + login + SQL | 2–5 min | May need one retry after bootstrap. |
| Client venv + preflight | 5–10 min | `pip` downloads `psycopg[binary]` and `jaydebeapi`. |
| Final verification | 2–5 min | Health, HTTP, secret modes. |
| **Total after bundle is available** | **30–75 min** | First pull dominates. |

Resource expectations: ~4 GB image download, at least 15 GB free disk, ~2.3 GiB container memory
after startup, 4 CPUs, and outbound registry access.

---

## 16. Approval Gate

**Status: AWAITING APPROVAL — NOTHING HAS BEEN EXECUTED.**

Please reply with:

1. Approval of v1 (or the requested changes, which will produce v2 via Verbatim-Superset
   Construction).
2. Confirmation of the target path:
   `$ZETARIS_REPO`.
3. Whether `zetaris-platform.zip` is already available and its absolute path. If not, confirm that
   you will download it from Zetaris Cloud.
4. Confirmation to install `docker-compose-v2` with `sudo apt-get` and to use `sudo docker` for all
   Docker commands.
5. The administrator email and organisation name (non-secret); set the administrator password
   directly in `.env` when Phase 4 begins.
6. Whether to validate JDBC now, and if so, the absolute path to the matching driver JAR. If not,
   the Python REST path is sufficient.

No clone, package installation, extraction, Docker startup, or configuration change will occur
before explicit approval.
