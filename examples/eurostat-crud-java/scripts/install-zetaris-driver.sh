#!/usr/bin/env bash
set -euo pipefail

JAR="${1:-${ZETARIS_JDBC_JAR:-}}"
if [[ -z "$JAR" ]]; then
  echo "Usage: $0 /path/to/ndp-jdbc-driver-2.4.3.1-driver.jar" >&2
  echo "   or: ZETARIS_JDBC_JAR=/path/to/driver.jar $0" >&2
  exit 1
fi
if [[ ! -f "$JAR" ]]; then
  echo "Driver JAR not found: $JAR" >&2
  exit 1
fi
if ! unzip -p "$JAR" META-INF/MANIFEST.MF | grep -q 'Implementation-Title: Lightning JDBC Driver'; then
  echo "Not a Zetaris Lightning JDBC driver: $JAR" >&2
  exit 1
fi
if ! unzip -p "$JAR" META-INF/MANIFEST.MF | grep -q 'Implementation-Version: 2.4.3.1'; then
  echo "Expected Zetaris Lightning JDBC driver 2.4.3.1: $JAR" >&2
  exit 1
fi

VERSION=2.4.3.1
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST_DIR="$APP_DIR/lib/com/zetaris/lightning-jdbc/$VERSION"
DEST_JAR="$DEST_DIR/lightning-jdbc-$VERSION.jar"
POM="$DEST_DIR/lightning-jdbc-$VERSION.pom"

mkdir -p "$DEST_DIR"
cp "$JAR" "$DEST_JAR"
zip -q -d "$DEST_JAR" \
  'org/apache/logging/log4j/*' \
  'org/slf4j/*' \
  'org/apache/commons/logging/*' \
  'META-INF/services/org.apache.logging.log4j.*' \
  'META-INF/org/apache/logging/log4j/*' \
  'META-INF/versions/9/org/apache/logging/log4j/*' \
  'META-INF/versions/9/org/slf4j/*'

cat > "$POM" <<'POM'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.zetaris</groupId>
  <artifactId>lightning-jdbc</artifactId>
  <version>2.4.3.1</version>
  <packaging>jar</packaging>
</project>
POM

sha256sum "$DEST_JAR"
