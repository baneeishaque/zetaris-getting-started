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

## 17. v2 Amendment — New Requirements, Verified Answers, and Corrections

> Appended by Verbatim-Superset Construction per `ai-agent-planning-rules.md` §7.1.
> The v1 text above is retained byte-for-byte. Where this section conflicts with v1,
> **this section wins**. Nothing has been executed; v2 is still planning-only.

### 17.0 Change History (v2)

| Timestamp | Summary of Changes | Rationale |
| :-------- | :----------------- | :-------- |
| `[2026-10-20 13:37]` | v2 amendments: Docker Compose, Deno/TS, JDBC driver, 5432 correction, MCP, recipe scope, Docker access. | New user requirements and verified corrections; v1 retained verbatim. |

### 17.1 New user requirements (verbatim, persisted per §1.1)

```text
Great findings:
- Zetaris does have MCP! Website mentions Zetaris MCP server, read-only, Claude/Cursor/Codex/ChatGPT. Need details/connection guide. Search more for Zetaris MCP server docs/endpoint/package. Maybe `kbase.zetaris.com` has "Zetaris MCP" docs. Search.
- JDBC driver: class `com.zetaris.lightning.jdbc.LightningDriver`; driver version 2.1.0.10 mentioned. Need public download? Search Maven Central likely not. Maybe available via Zetaris Kbase or GitHub `zetaris/zetaris-code-share`. Search GitHub code for `LightningDriver`, `zetaris-driver`, `.jar`. Use `gh search code` (auth available). Let's try.
- Platform zip: no public result. Likely gated.
- MCP repos search empty, but website says MCP server. Maybe bundled with platform, not open-source. Search.

Docker registry anonymous 401 → login required. Good.

Port 5432: confirmed occupied by local Postgres 14; plan must change. Need to inspect Zetaris compose port mapping (unknown). We can ask user or plan override. Zetaris platform's PostgreSQL may not need host exposure. But the compose file may publish 5432. We can create a `docker-compose.override.yml` that removes the host port mapping? Compose override can't remove a port easily; you can set `ports: []`? In override, `ports: []` may not clear base; merging lists appends. Could use `!reset` in newer Compose, or `!override` tag. Compose 2.24+ supports `!reset []` and `!override`. Since we install 2.40.3, we can use `!override` to replace ports. Or set an env var if the compose file uses `${PG_PORT:-5432}:5432`. Need to inspect. Protocol gate. Plan v2: after bundle extract, inspect `docker-compose.yml` for `5432`; if published, create `docker-compose.override.yml` with `ports: !override ["127.0.0.1:5433:5432"]` (or remove) and update `.env.local` PGPORT=5433 if needed. But the existing Django app uses 5432; do not touch. Important.

Now, the user asked "can we run all the data recipes - is our disk space enough?" Need concrete answer. We have 62G free. Let's estimate known large datasets:
- NOAA GHCN 2025.csv size? Could query S3 HEAD anonymously. `curl -sI https://noaa-ghcn-pds.s3.amazonaws.com/csv/by_year/2025.csv` or `aws s3 ls --no-sign-request`. Check size.
- AWS Public Blockchain one day btc transactions maybe size? Query S3 listing or HEAD a sample. Could be ~100MB/day? The recipe may register entire prefix, not download; Zetaris queries in place, so disk usage is cache, not full dataset. Important: Zetaris queries data in place; filestore recipes don't download the whole dataset to local disk unless cached. `CACHE TABLE` may cache. So disk requirement is mostly Docker images + volumes + caches, not full datasets. Running all recipes doesn't mean downloading all data. The platform reads from S3/HTTP. Disk 62G likely enough, but caching large tables can consume. The known failures make "all" impossible. Also REST recipes are tiny. The main disk consumers: Docker images ~4GB, containers/volumes, caches. 62G is enough for the verified set, but not guaranteed for `CACHE TABLE` on large datasets (GBIF 1.6B records, blockchain). We can state: 62G is enough for the starter/verified recipes and light caching; not enough to cache all large datasets, and 7 recipes are known to fail/unsupported. Need a per-source disk audit before caching. The user asks "can we run all the data recipes" — answer: No, not all: 5 known_to_fail filestore + Singapore PM2.5 + NASA DONKI; deprecated company_dns_legacy must not run with replacement; bulk download fetchers are not integrated. Of the runnable set, disk is likely sufficient because Zetaris queries in place, but caching large tables is the risk. We can quantify NOAA file size and maybe blockchain sample. Let's check sizes with HEAD or S3 API. Use `curl -sI` for NOAA and a blockchain sample maybe. Also check repo docs for size notes. Use `aws s3 ls --no-sign-request` if aws CLI installed? Check. Could use HTTP HEAD for S3 public objects. Let's get NOAA 2025.csv size; maybe ~250MB. For blockchain, the path includes wildcard; use S3 ListObjectsV2 API for prefix `v1.0/btc/transactions/date=2026-09-01/` to sum sizes. Use Python urllib XML parse. That gives data size but not local download. Also GBIF/Ookla large. We can estimate.

- JDBC driver: search GitHub code and web. The driver may be downloadable from Zetaris Kbase or Cloud. Let's search:
  - `gh search code 'com.zetaris.lightning.jdbc.LightningDriver' --limit 20`
  - `gh search code 'zetaris-driver' --limit 20`
  - `gh search repos 'zetaris jdbc'`
  - websearch "com.zetaris.lightning.jdbc.LightningDriver jar download"
  - websearch "Zetaris JDBC driver download"
  - Check `https://kbase.zetaris.com` maybe has a downloads page. Search.
  - Maybe Maven Central search timed out; retry with `repo1.maven.org/maven2/com/zetaris/` listing. `curl -sS https://repo1.maven.org/maven2/com/zetaris/` → 404 likely.
  - Check `https://mvnrepository.com/search?q=zetaris` maybe.
- MCP details:
  - websearch "Zetaris MCP connection guide"
  - fetch `https://www.zetaris.com/zetaris-meta-data-lakehouse` maybe has link.
  - Search `site:zetaris.com MCP connection guide`.
  - Search `kbase.zetaris.com MCP`.
  - GitHub `zetaris/zetaris-code-share` maybe contains MCP config.
- Platform bundle public:
  - `gh search code 'zetarishackathon.azurecr.io'`
  - `gh search code 'zetaris-platform.zip'`
  - websearch "Zetaris Air download" maybe Zetaris Air is free self-managed; perhaps a public download page? The getting-started says Cloud. Search "Zetaris Air download".
  - Check `https://www.zetaris.com/getting-started-with-zetaris` for editions and download links. May require account.
- Deno install: `mise use -g deno@2.9.7`; plan. Need to check mise trust/config. Fine.

- Docker without sudo: plan to add group. Need to consider that `docker` group is root-equivalent; mention. The user asked; answer yes. We can include in v2.

Now, before updating plan, gather more research. Let's run parallel:
1. gh search code for driver/platform/MCP.
2. websearch Zetaris MCP connection guide.
3. websearch Zetaris JDBC driver download.
4. HEAD NOAA + S3 listing blockchain sizes.
5. fetch Zetaris MCP page maybe `https://www.zetaris.com/zetaris-meta-data-lakehouse` (webfetch) and search for links.
6. Check Zetaris Kbase MCP doc via search.
7. Check `zetaris/zetaris-code-share` repo contents via GitHub API (gh repo view, ls tree).
8. Check `zetaris/getting-started` for MCP references (`gh search code 'MCP repo:zetaris/getting-started'`).
Let's do.
```

Additional explicit instructions carried from the user's earlier message (same turn, before the
follow-up questions): **install Docker Compose**, **install Deno via mise**, **use the TypeScript
helpers**, **download the Zetaris JDBC driver from the internet**, and **use Java from mise**.

### 17.2 Evidence-based answers to the follow-up questions

| # | Question | Verified answer | Evidence |
| :- | :------- | :-------------- | :------- |
| A1 | Is port `5432` free? | **No.** PostgreSQL 14 is listening on `127.0.0.1:5432` (`/usr/lib/postgresql/14/bin/postgres`, PID 683, systemd `postgresql@14-main.service`) and serves a Django app (`acersuser/acers`). The v1 check was wrong because `awk` `\b` is unsupported in `mawk`. | `lsof`/`ss` probe; `systemctl status postgresql@14-main` |
| A2 | Is `docker login` needed? Are the images public? | **Login is required.** `GET https://zetarishackathon.azurecr.io/v2/` and the anonymous token request both return `401 Unauthorized`. The five platform images are private to the issued credentials. | `curl` probes; install guide §2 |
| A3 | Can we use Docker without `sudo`? | **Yes, after adding `ext_root` to the `docker` group.** It takes effect on the next login (or a new session); the current session keeps using `sudo docker`. Note: the `docker` group is effectively root-equivalent. | `id -nG ext_root`; socket mode `srw-rw---- root docker` |
| A4 | Does Zetaris Cloud have MCP? | **Yes.** Zetaris markets a **read-only MCP server** (agents can query/explore but not insert/update/delete) with Claude, Cursor, Codex, and ChatGPT connection guides. **Local-bundle MCP support is unconfirmed** and is a discovery gate in v2. | `zetaris.com` home/Cloud pages; `kbase.zetaris.com` coding-agent guides |
| A5 | Is `zetaris-platform.zip` publicly downloadable? | **No public download found.** It is gated behind the Zetaris Cloud “Run locally” page; Zetaris Air access is also request-gated. GitHub code search only finds the URL inside docs. | web + `gh search code` sweeps |
| A6 | Is there a public JDBC driver? | **Yes.** `https://kbase.zetaris.com/hubfs/ndp-jdbc-driver-2.1.0.13-driver.jar` returns `200`, `application/java-archive`, `32,277,384` bytes, last modified `2023-08-24`. Class: `com.zetaris.lightning.jdbc.LightningDriver`. It is version `2.1.0.13` while the tested platform is `2.4.3.1`; treat it as a best-effort fallback and prefer a bundle-supplied matching JAR if present. | KB page + HTTP HEAD |
| A7 | Can we run **all** data recipes? | **No.** Manifest: 15 `verified`, 7 `known_to_fail`, 1 `deprecated`. Fails: PUDL, Foursquare, Overture, Ookla, GBIF, Singapore PM2.5, NASA DONKI. Also excluded: `company_dns_legacy` (deprecated), Singapore housing / Open Food Facts bulk (fetchers only), Kafka and SQL/log/PDF recipes (not ready). | `open_data/manifest.json`; `recipe-readiness.md` |
| A8 | Is 62 GB enough for the recipes? | **Enough for the platform and the verified subset with in-place queries; not enough for full-dataset caches.** Platform images ≈ 4 GB + volumes; NOAA 2025 CSV is `1,311,078,577` bytes (≈ 1.22 GiB) and needs `CACHE TABLE`; AWS Public Blockchain is `548,545,495` bytes (≈ 0.51 GiB) for one day, so a full year is ≈ 186 GiB; GBIF is > 1.6 billion records and is known to fail anyway. Cache selectively and re-check `df -h`. | HTTP HEAD + S3 `ListObjectsV2`; dataset catalog |

### 17.3 Corrections that supersede v1

| ID | Superseded v1 text | v2 correction |
| :- | :----------------- | :------------ |
| C1 | §2.2 item 10 “Ports `3000`, `8888`, `10000`, and `5432` are currently free.” | `5432` is **occupied** (see A1). `3000`, `8888`, `10000` remain free. |
| C2 | §3.3 assumption 3 “No other service needs ports `3000`, `8888`, `10000`, or `5432`.” | The host PostgreSQL/Django service **must keep** `5432`; Zetaris must not bind it. |
| C3 | §12 risk “Port conflict … All four ports free now.” | Replace with the 5432-specific gate in §17.6 (Phase 4A). |
| C4 | §1 Phase 1 / §12 “Do not change the user's group membership.” | v2 offers the `docker`-group add (recommended) while keeping `sudo docker` valid for the current session. |
| C5 | §3.2 “Installing Deno and the TypeScript helper path” is out of scope; Q9 “Deno optional.” | Deno `2.9.7` is installed via mise and the TypeScript helpers are used. |
| C6 | Q8 “JDBC driver … user supplies the absolute path.” | v2 downloads the public `2.1.0.13` driver, verifies it, and uses mise Java 21; a bundle-supplied matching JAR still wins. |
| C7 | §3.2 “Obtaining the … JDBC driver … on the user's behalf” is out of scope. | The **public** driver download is in scope; the **platform bundle, registry credentials, licence, and API key remain user-supplied**. |
| C8 | v1 makes no mention of MCP. | v2 adds an optional MCP discovery phase (Phase 6A). |
| C9 | v1 defers all recipes. | v2 adds an approval-gated Phase 9 for the verified recipe subset with a disk budget. |

### 17.4 Updated decision register

| ID | Decision / input | v2 recommended default | Blocking? |
| :-- | :--------------- | :--------------------- | :-------- |
| Q2 | Install `docker-compose-v2` via `sudo apt-get` | Yes (`2.40.3`) | Yes |
| Q3 | Docker access strategy | Add `ext_root` to the `docker` group **and** keep `sudo docker` for the current session | No |
| Q8 | JDBC driver JAR | Download public `2.1.0.13` to `$ZETARIS_DRIVERS/`; prefer bundle JAR if present | No |
| Q9 | Deno installation | `mise use -g deno@2.9.7` | Yes |
| Q10 | API key and numeric org ID | User creates/copies in the UI | Yes (client phase) |
| Q11 | JDBC Java runtime | mise Java `21.0.2` for JDBC commands; no global default change | No |
| Q12 | Zetaris Postgres host port | Keep internal; if the bundle publishes `5432`, override to `127.0.0.1:5433` (or remove the host publish) | Yes (Phase 4A gate) |
| Q13 | MCP | Discover local support after install; if absent, record and defer to Cloud MCP | No |
| Q14 | Recipe scope | Start with the verified subset only; never run `known_to_fail` or `deprecated` scripts | Yes (Phase 9 gate) |
| Q15 | Platform bundle | User registers/downloads from Zetaris Cloud (or Air) | Yes |
| Q16 | Registry credentials | User enters at the `sudo docker login` prompt | Yes |

### 17.5 Phase 1 addendum — Compose plugin and Docker group

Run after the v1 Phase 1 commands; keep the v1 verification steps.

```bash
sudo apt-get update
sudo apt-get install -y docker-compose-v2
sudo docker compose version
sudo usermod -aG docker ext_root
getent group docker
id -nG ext_root
```

Expected:

* `sudo docker compose version` prints a `v2.40.3`-class version. The guide's “Compose 5.5.1”
  reference is not a real Compose version; the installed plugin version is authoritative.
* `getent group docker` lists `ext_root`; `id -nG ext_root` may not show `docker` until the next
  login. The current session continues with `sudo docker`.
* On the next login, `docker ps` must work without `sudo`. If it does not, keep using `sudo docker`
  and record it.

Security note: membership in `docker` is equivalent to passwordless root for the host. If that is
not acceptable, skip `usermod` and use `sudo docker` throughout.

### 17.6 Phase 2 addendum — Deno and JDBC driver

**Deno (mise-managed):**

```bash
mise use -g deno@2.9.7
mise exec deno@2.9.7 -- deno --version
```

Later, from the clone:

```bash
cd $ZETARIS_REPO
deno task check
deno task lint
./scripts/check_zetaris.ts
./scripts/query_zetaris.ts "SELECT 1"
```

**JDBC driver (public KB artifact; user-approved download):**

```bash
mkdir -p $ZETARIS_DRIVERS
curl -fL --retry 3 --connect-timeout 20 --max-time 600 \
  -o $ZETARIS_DRIVERS/ndp-jdbc-driver-2.1.0.13-driver.jar \
  https://kbase.zetaris.com/hubfs/ndp-jdbc-driver-2.1.0.13-driver.jar
ls -lh $ZETARIS_DRIVERS/
sha256sum $ZETARIS_DRIVERS/ndp-jdbc-driver-2.1.0.13-driver.jar
unzip -l $ZETARIS_DRIVERS/ndp-jdbc-driver-2.1.0.13-driver.jar \
  | grep -E 'LightningDriver.class|META-INF/MANIFEST.MF'
unzip -p $ZETARIS_DRIVERS/ndp-jdbc-driver-2.1.0.13-driver.jar \
  META-INF/MANIFEST.MF | head -40
mise install java@21.0.2
mise exec java@21.0.2 -- java -version
```

Rules:

1. If the extracted platform bundle contains `jdbc-driver/*.jar`, prefer that matching JAR and set
   `ZETARIS_JDBC_JAR` to it. Use the public `2.1.0.13` JAR only as a fallback.
2. If JDBC fails with a class-version/unsupported-JDK error under Java 21, try the already-installed
   mise Java `27.0.0`; if both fail, record JDBC as unavailable and keep the REST path.
3. Never place the JAR inside the clone’s tracked tree; keep it under `lab-data/zetaris-drivers/`.
4. REST remains the primary protocol; JDBC is an optional validation path.

### 17.7 Phase 4 addendum — Port 5432 conflict gate

**Gate P1 — inspect the bundle before any `compose up`:**

```bash
cd $ZETARIS_PLATFORM
grep -nE '5432|ports:|UI_PORT|ZETARIS_.*PORT' docker-compose.yml
grep -nE 'network_mode' docker-compose.yml
```

* **If `5432` is not published by any service:** no action; record the finding.
* **If a service publishes `${PG_PORT:-5432}:5432` or similar:** add `PG_PORT=5433` to `.env`.
* **If a service hardcodes `5432:5432`:** create `docker-compose.override.yml` next to the bundle
  file, replacing only that service’s host port (Compose `2.24.4+` supports `!override`; we install
  `2.40.3`):

  ```yaml
  services:
    postgres:
      ports: !override
        - "127.0.0.1:5433:5432"
  ```

  Adjust the service name if the bundle uses a different one. Validate with:

  ```bash
  sudo docker compose config --quiet
  sudo docker compose config --services
  ```

* **If any service uses `network_mode: host`:** stop and present a new plan version; do not start it,
  because the host PostgreSQL/Django service owns `5432` and must not be disturbed.
* **Never** stop, disable, reconfigure, or restart `postgresql@14-main.service`.
* After startup, confirm the host listener is unchanged: `ss -ltnp | grep ':5432'` must still show
  `/usr/lib/postgresql/14/bin/postgres`, and `psql`/Django connectivity must remain intact.

### 17.8 Phase 6 addendum — MCP discovery (optional, after the platform is healthy)

Do not assume the local bundle exposes MCP. Discover first; configure only if found.

```bash
cd $ZETARIS_PLATFORM
grep -RIn --include='*.md' --include='*.yml' --include='*.yaml' --include='*.json' \
  -i 'mcp' . | head -40
curl -sS -o /dev/null -w 'MCP_UI=%{http_code}\n' http://localhost:3000/mcp
curl -sS -o /dev/null -w 'MCP_API=%{http_code}\n' http://localhost:8888/mcp
```

* If a documented MCP endpoint or UI setting exists, configure a client (Claude/Cursor/Codex/ChatGPT)
  in **read-only** mode and verify with a `SELECT 1`-class tool call.
* If not, record “local MCP not exposed by this bundle” and leave the Cloud MCP option documented.
* Zetaris Cloud’s MCP is read-only by design; never enable write tools in a client configuration.

### 17.9 Phase 9 — Verified recipe subset (separate approval; after platform is healthy)

**Do not run all recipes.** The manifest classifies the catalog as 15 `verified`, 7 `known_to_fail`,
and 1 `deprecated`; `recipe-readiness.md` also excludes fetcher-only, Kafka, and not-ready recipes.

| Category | Recipes | Disposition |
| :------- | :------ | :---------- |
| Verified REST | `pokeapi`, `company_dns`, `company_dns_eu_nace`, `company_dns_japan`, `edgar_facts`, `edgar_profiles`, `open_food_facts`, `nasa_neows`, `eurostat`, `statcan_wds`, `abs_data_api` | Runnable; small/local. |
| Verified filestore | `noaa_ghcn` (≈ 1.22 GiB, `CACHE TABLE` required), `aws_public_blockchain` (≈ 0.51 GiB/day; cache one partition only) | Runnable with a disk budget. |
| Verified USL | `sic_usl`, `sic_edgar_usl` | Runnable; model materialisation questions remain. |
| Known to fail | `pudl`, `foursquare_places`, `overture_maps`, `ookla_speedtest`, `gbif`, `singapore_pm25`, `nasa_donki` | **Do not run**; failures are reproduced. |
| Deprecated | `company_dns_legacy` | **Do not run**; use the V4-based `company_dns`. |
| Not ready | Singapore housing / Open Food Facts bulk fetchers, Kafka, SQL/log/PDF recipes | Deferred. |

Disk budget (62 GB free at probe time):

* Platform images ≈ 4 GB; named volumes and logs ≈ 2–5 GB; `.venv` and drivers < 1 GB.
* NOAA cache ≈ 1.3 GB; one blockchain day ≈ 0.5–1 GB cached.
* Full-year blockchain ≈ 186 GB and GBIF-scale datasets exceed the disk; never cache them.
* Re-check `df -h $HOME` and `sudo docker system df` before and after each cache.

Recommended order: `pokeapi` → `company_dns` (SIC) → `edgar_facts`/`edgar_profiles` → `sic_usl` →
`sic_edgar_usl` → `noaa_ghcn` → one `aws_public_blockchain` partition. Stop and re-plan if free
disk drops below 15 GB.

### 17.10 Additional verification matrix rows

| Gate | Exact command | Expected |
| :--- | :------------ | :------- |
| V16 Compose plugin | `sudo docker compose version` | `v2.40.3`-class version. |
| V17 Docker group | `getent group docker` | Contains `ext_root` after `usermod`. |
| V18 Deno | `mise exec deno@2.9.7 -- deno --version` | `deno 2.9.7`. |
| V19 TS check | `deno task check` in the clone | Exit 0. |
| V20 JDBC JAR | `unzip -l …ndp-jdbc-driver-2.1.0.13-driver.jar \| grep LightningDriver.class` | One matching entry. |
| V21 Java 21 | `mise exec java@21.0.2 -- java -version` | OpenJDK 21. |
| V22 Port 5432 preserved | `ss -ltnp \| grep ':5432'` | Still the host PostgreSQL 14 process. |
| V23 Zetaris PG host port | `sudo docker compose ps --format '{{.Service}} {{.Ports}}'` | No `0.0.0.0:5432` publish. |
| V24 MCP discovery | `grep -RIn -i 'mcp' . \| head`; `curl …/mcp` | Documented endpoint or explicit “not exposed”. |
| V25 Disk headroom | `df -h $HOME`; `sudo docker system df` | ≥ 15 GB free after each recipe. |

### 17.11 Additional risks

| Risk | Likelihood | Impact | Mitigation |
| :--- | :--------- | :----- | :--------- |
| Zetaris Postgres overrides host `5432` | Medium | Breaks the host Django app | Phase 4A gate; override to `5433` or remove the host publish. |
| `!override` unsupported by the installed Compose | Low | Override ignored | We install `2.40.3`; validate with `docker compose config --quiet`. |
| `docker` group escalates privileges | Certain | Host security | Optional; keep `sudo docker` if the user declines the group add. |
| Public JDBC driver version mismatch | Medium | JDBC validation fails | Prefer the bundle JAR; treat REST as primary; record the outcome. |
| Deno global install changes global tooling | Low | Tool drift | `mise use -g deno@2.9.7` is explicit and reversible with `mise unuse -g deno`. |
| Recipe caching fills the disk | Medium | Host instability | Phase 9 budget; cache one partition at a time; stop below 15 GB free. |
| `known_to_fail` recipe run by mistake | Low | Wasted time, confusing errors | Phase 9 allow-list; never run `sql/known_to_fail/*` or `company_dns_legacy`. |
| MCP assumptions without evidence | Medium | Misconfiguration | Phase 6A discovery first; read-only only. |

### 17.12 Updated time and resource estimate

| Added item | Estimate | Notes |
| :--------- | :------- | :---- |
| `docker-compose-v2` install + group add | 2–4 min | `apt-get` + `usermod`. |
| Deno install via mise | 1–2 min | `2.9.7` download. |
| JDBC driver download + verification | 2–5 min | ≈ 32 MB. |
| Port 5432 override (if needed) | 2–5 min | Bundle-dependent. |
| MCP discovery (optional) | 2–10 min | Bundle-dependent. |
| Recipe subset (optional) | 20–60 min | Depends on caching. |

### 17.13 Approval gate v2 (supersedes §16)

**Status: AWAITING APPROVAL OF v2 — NOTHING HAS BEEN EXECUTED.**

Please reply with:

1. Approval of v2 (or further changes → v3).
2. Docker access: add `ext_root` to the `docker` group (recommended), or keep `sudo docker` only?
3. Confirm Deno `2.9.7` via `mise use -g deno@2.9.7`.
4. Confirm the public JDBC driver download (`2.1.0.13`) and mise Java `21.0.2` for JDBC.
5. Confirm the Phase 4A approach: keep the host `5432` untouched; if the bundle publishes it,
   override to `127.0.0.1:5433` (or remove the host publish).
6. Platform bundle: confirm registration at Zetaris Cloud / Air and provide the archive path when
   downloaded.
7. MCP: attempt local discovery after install? (optional)
8. Recipes: run the verified subset after the platform is healthy? (separate gate; optional)
