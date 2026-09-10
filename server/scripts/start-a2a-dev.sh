#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

SKIP_INSTALL=0
SKIP_SMOKE=0

usage() {
    cat <<'EOF'
Usage: ./scripts/start-a2a-dev.sh [options]

Starts a self-contained local APAP A2A development environment:
  - starts the PostgreSQL Docker Compose service;
  - creates .env from .env_example when it is absent;
  - installs dependencies when node_modules is absent;
  - pushes the database schema and builds the server;
  - starts APAP with development-only unauthenticated A2A access;
  - runs agent-card and list-templates smoke tests.

Options:
  --skip-install  Do not run npm ci, even when node_modules is absent.
  --skip-smoke    Start the server without running HTTP smoke tests.
  -h, --help      Show this help.

Environment:
  A2A_DEV_PORT    Local HTTP port (default: 9000).
EOF
}

while (($# > 0)); do
    case "$1" in
        --skip-install)
            SKIP_INSTALL=1
            ;;
        --skip-smoke)
            SKIP_SMOKE=1
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            usage >&2
            exit 2
            ;;
    esac
    shift
done

log() {
    echo "[a2a-dev] $*"
}

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Required command not found: $1" >&2
        exit 1
    fi
}

require_command curl
require_command docker
require_command node
require_command npm

NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if ((NODE_MAJOR < 22)); then
    echo "Node.js 22 or newer is required; found $(node --version)." >&2
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    echo "Docker Compose v2 is required (the 'docker compose' command)." >&2
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "Docker is installed but its daemon is not available. Start Docker and retry." >&2
    exit 1
fi

cd "$SERVER_DIR"

if [[ ! -f .env ]]; then
    cp .env_example .env
    log "Created server/.env from .env_example"
else
    log "Preserving existing server/.env"
fi

if [[ ! -d node_modules || ! -f node_modules/@a2a-js/sdk/package.json ]]; then
    if ((SKIP_INSTALL == 1)); then
        echo "Dependencies are missing and --skip-install was supplied." >&2
        exit 1
    fi
    log "Installing dependencies with npm ci"
    npm ci
else
    log "Dependencies already installed; skipping npm ci"
fi

# Always target the local Compose database. This prevents an existing .env
# containing a hosted POSTGRES_URL from being modified by drizzle-kit push.
# An exported empty value prevents dotenv from restoring a hosted URL from
# .env, while keeping the application's truthy POSTGRES_URL check disabled.
export POSTGRES_URL=''
export POSTGRES_DATABASE=postgres
export POSTGRES_USER=postgres
export POSTGRES_HOST=localhost
export POSTGRES_PASSWORD=1baddeed
export POSTGRES_PORT=5432

export NODE_ENV=development
export HOST=127.0.0.1
export PORT="${A2A_DEV_PORT:-9000}"
export PUBLIC_BASE_URL="http://${HOST}:${PORT}"
export AUTH_ADAPTER=none

log "Starting the local PostgreSQL service"
docker compose up -d db

log "Waiting for PostgreSQL"
DB_READY=0
for _attempt in {1..30}; do
    if docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
        DB_READY=1
        break
    fi
    sleep 1
done
if ((DB_READY == 0)); then
    echo "PostgreSQL did not become ready within 30 seconds." >&2
    exit 1
fi

log "Applying the database schema"
npx drizzle-kit push

log "Building the APAP server"
npm run build

SERVER_PID=""
cleanup() {
    local exit_code=$?
    trap - EXIT INT TERM
    if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
        log "Stopping APAP server"
        kill "$SERVER_PID" >/dev/null 2>&1 || true
        wait "$SERVER_PID" 2>/dev/null || true
    fi
    exit "$exit_code"
}
trap cleanup EXIT INT TERM

log "Starting APAP at ${PUBLIC_BASE_URL}"
node dist/index.js &
SERVER_PID=$!

log "Waiting for the health endpoint"
SERVER_READY=0
for _attempt in {1..60}; do
    if curl --fail --silent --show-error "${PUBLIC_BASE_URL}/health" >/dev/null 2>&1; then
        SERVER_READY=1
        break
    fi
    if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
        echo "The APAP server exited before becoming healthy." >&2
        wait "$SERVER_PID"
    fi
    sleep 0.5
done
if ((SERVER_READY == 0)); then
    echo "The APAP server did not become healthy within 30 seconds." >&2
    exit 1
fi

if ((SKIP_SMOKE == 0)); then
    log "Checking the public agent card"
    AGENT_CARD="$(curl --fail --silent --show-error \
        "${PUBLIC_BASE_URL}/.well-known/agent-card.json")"
    node -e '
        const card = JSON.parse(process.argv[1]);
        const skills = card.skills.map((skill) => skill.id);
        const expected = [
            "list-templates",
            "get-template",
            "list-agreements",
            "get-agreement",
            "trigger-agreement",
        ];
        for (const skill of expected) {
            if (!skills.includes(skill)) throw new Error(`Agent card is missing ${skill}`);
        }
        if (skills.includes("create-agreement")) {
            throw new Error("Agent card unexpectedly advertises create-agreement");
        }
        console.log(`[a2a-dev] Agent card OK: ${skills.join(", ")}`);
    ' "$AGENT_CARD"

    log "Sending an A2A list-templates request"
    A2A_RESPONSE="$(curl --fail --silent --show-error \
        --request POST "${PUBLIC_BASE_URL}/a2a" \
        --header 'Content-Type: application/json' \
        --header 'A2A-Version: 1.0' \
        --data '{
            "jsonrpc": "2.0",
            "id": "smoke-test-1",
            "method": "SendMessage",
            "params": {
                "message": {
                    "messageId": "smoke-message-1",
                    "role": "ROLE_USER",
                    "parts": [{
                        "data": {
                            "skillId": "list-templates",
                            "input": { "limit": 1, "offset": 0 }
                        },
                        "mediaType": "application/json"
                    }]
                }
            }
        }')"
    node -e '
        const response = JSON.parse(process.argv[1]);
        if (response.error) throw new Error(JSON.stringify(response.error));
        const state = response.result?.task?.status?.state;
        if (state !== "TASK_STATE_COMPLETED") {
            throw new Error(`Expected TASK_STATE_COMPLETED, received ${state}`);
        }
        console.log(`[a2a-dev] A2A smoke test OK: ${state}`);
    ' "$A2A_RESPONSE"
fi

log "Ready. Press Ctrl-C to stop APAP. PostgreSQL will remain running."
log "Stop PostgreSQL later with: cd '${SERVER_DIR}' && docker compose stop db"
wait "$SERVER_PID"
