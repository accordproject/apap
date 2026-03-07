#!/usr/bin/env bash
set -euo pipefail

# Migrates a Docker Postgres 17 volume to Postgres 18 using dump/restore.
# Steps:
# 1. Start temporary Postgres 17 using existing volume
# 2. Create dump.sql
# 3. Remove old volume
# 4. Start Postgres 18
# 5. Restore dump

WORKDIR="$(pwd)"
DUMP="$WORKDIR/dump.sql"
VOLUME_NAME="server_db-data"
TEMP_CONTAINER="pg17-temp"

# Ensure volume exists
if ! docker volume ls --format '{{.Name}}' | grep -q "^$VOLUME_NAME$"; then
  echo "ERROR: Volume $VOLUME_NAME not found"
  exit 1
fi

# Stop compose services
docker compose down || true

# Start temporary Postgres 17 container using existing volume
docker run -d \
  --name "$TEMP_CONTAINER" \
  -e POSTGRES_PASSWORD=1baddeed \
  -v "$VOLUME_NAME":/var/lib/postgresql/data \
  postgres:17-alpine

# Wait until Postgres is ready
until docker exec "$TEMP_CONTAINER" pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
done

# Create dump
docker exec "$TEMP_CONTAINER" pg_dumpall -U postgres > "$DUMP"

# Stop temporary container
docker stop "$TEMP_CONTAINER"
docker rm "$TEMP_CONTAINER"

# Remove containers using the volume
USING=$(docker ps -a --filter volume="$VOLUME_NAME" -q || true)
if [ -n "$USING" ]; then
  docker rm -f $USING
fi

# Remove old volume
docker volume rm "$VOLUME_NAME"

# Create fresh volume
docker volume create "$VOLUME_NAME"

# Start Postgres 18
docker compose up -d db

# Wait until Postgres 18 is ready
until docker compose exec db pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
done

# Restore dump
docker compose exec -T db psql -U postgres < "$DUMP"

# Verify databases
docker compose exec db psql -U postgres -c "\l"

echo "Migration completed successfully."