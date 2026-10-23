#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local; copy .env.example to .env.local and fill it in." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

exec mvn -q spring-boot:run
