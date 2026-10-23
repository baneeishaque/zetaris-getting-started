# Zetaris JDBC driver

This directory is a Maven file repository for the Zetaris Lightning JDBC driver.

- Coordinates: `com.zetaris:lightning-jdbc:2.4.3.1`
- Source: the Zetaris-supplied `ndp-jdbc-driver-2.4.3.1-7eff043-driver.jar`
- Prepared JAR SHA-256:
  `9a3119dc4967fe1156006baa945a0f0d19cc0368395e2129306dbcd53a7a2d8f`

Maven tries the configured remote repositories first. If
`com.zetaris:lightning-jdbc:2.4.3.1` is not published there, Maven resolves it
from this directory.

The driver JAR bundles Log4j 2, SLF4J, and Commons Logging. The checked-in copy
is prepared by `scripts/install-zetaris-driver.sh`, which removes those bundled
logging classes and writes a minimal POM so the app uses Spring Boot's Logback.
No driver code is changed.

To refresh this repository from a new Zetaris-supplied JAR:

```bash
./scripts/install-zetaris-driver.sh /path/to/ndp-jdbc-driver-2.4.3.1-driver.jar
```

If Maven has already cached the artifact, run the build with `-U` after a
refresh.
