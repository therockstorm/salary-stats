#!/usr/bin/env bash
set -Eeuo pipefail
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)

export DATABASE_URL=postgres://postgres:postgres@localhost:5433/db

if ! docker-compose -f "$script_dir/../docker-compose-test.yml" ps --status running | grep -q testDb; then
  npm run test:docker:up
  sleep 8
fi

npx prisma migrate deploy
jest --coverage --runInBand --silent
