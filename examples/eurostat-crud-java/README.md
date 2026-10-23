# Eurostat CRUD (Java)

A small Spring Boot web app that demonstrates the Zetaris Lightning JDBC
interface. It reads the Eurostat monthly unemployment series for Poland
directly over JDBC and keeps app-owned notes about individual observations
in memory.

## What it demonstrates

- A Zetaris JDBC driver loaded through `SimpleDriverDataSource`.
- A `JdbcTemplate` reading `eurostat.une_rt_m_pl_series_table`.
- Read-only Eurostat data: the app never writes to Zetaris.
- Local CRUD for notes: create, read, update, delete, pin, rate, and tag.
- Thymeleaf server-rendered pages, no frontend build step.
- A health endpoint that checks `SELECT 1` against Zetaris.

## Stack

- Java 21
- Spring Boot 4.1.2
- Maven
- Thymeleaf
- Zetaris Lightning JDBC driver `2.4.3.1`

## Prerequisites

- JDK 21 or newer (`java -version`).
- Maven 3.9 or newer (`mvn -version`).
- Network access to the Zetaris Lightning endpoint.
- The Zetaris JDBC driver is vendored under `lib/`; no separate install step.
- `zip` and `unzip` on `PATH` only if you refresh the vendored driver.

## JDBC driver

Maven first tries `com.zetaris:lightning-jdbc:2.4.3.1` from the configured
repositories. If it is not published there, Maven resolves it from the file
repository in `lib/`.

The vendored JAR is prepared from the Zetaris-supplied
`ndp-jdbc-driver-2.4.3.1-7eff043-driver.jar`. It removes the driver's bundled
Log4j 2, SLF4J, and Commons Logging classes so the app uses Spring Boot's
Logback. See `lib/README.md`.

To refresh `lib/` from a Zetaris-supplied JAR:

```bash
./scripts/install-zetaris-driver.sh /path/to/ndp-jdbc-driver-2.4.3.1-driver.jar
```

Or set `ZETARIS_JDBC_JAR` and run the script without an argument:

```bash
ZETARIS_JDBC_JAR=/path/to/ndp-jdbc-driver-2.4.3.1-driver.jar \
  ./scripts/install-zetaris-driver.sh
```

## Configure

The app reads three environment variables from `.env.local` in this directory,
which is gitignored. Start from the tracked template:

```bash
cp .env.example .env.local
```

Then fill in:

```dotenv
ZETARIS_JDBC_URL=jdbc:zetaris:lightning@your-host:10000
ZETARIS_USERNAME=your-user
ZETARIS_PASSWORD=your-password
```

Do not commit `.env.local`. `run.sh` sources it automatically.

## Run

```bash
./run.sh
```

Then open:

- <http://127.0.0.1:8090/> — dashboard
- <http://127.0.0.1:8090/series> — Eurostat observations
- <http://127.0.0.1:8090/notes> — app notes
- <http://127.0.0.1:8090/health> — Zetaris health check

The server binds to `127.0.0.1:8090` only. It has no authentication and is
intended for local demonstration.

## CRUD behavior

- **Create**: a note must reference an existing Eurostat period. One note per
  period.
- **Read**: notes appear on the dashboard, on the notes page, and on the
  matching series detail page.
- **Update**: edit the note text, tag, rating, or pinned flag. The period can
  change only to another existing Eurostat period with no note.
- **Delete**: removes the note from memory.
- **Seed data**: three notes are created at startup (`1997-01`, `2024-01`,
  `2025-07`). They disappear when the app stops.

## Tests

```bash
mvn test
```

Runs unit and MockMvc tests. They do not need a live Zetaris endpoint.

```bash
set -a
source .env.local
set +a
mvn verify
```

`EurostatJdbcIT` is enabled only when `ZETARIS_JDBC_URL` is set. It reads the
real Eurostat table and checks `/health`.

## Design notes

- Notes live in a `ConcurrentHashMap`; there is no H2 or JPA layer.
- The app uses one `DataSource` and one `JdbcTemplate`, both named for Zetaris.
- The Zetaris password is read from the environment and is never logged or
  committed.
- `spring.thymeleaf.cache=false` keeps template edits visible during local
  development.

## Limitations

- Notes are not durable. Restarting the app resets them to the three seed
  notes.
- The app is a single-user local demo; there is no authentication or CSRF
  protection.
- The Eurostat table is read-only. Writes are deliberately out of scope.
