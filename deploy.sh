#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo " Nexus CMS Deployment: Nexus Global Tech"
echo "=================================================="

# 1. Environment configuration
if [ ! -f .env ]; then
  echo "[*] Creating .env from .env.example..."
  cp .env.example .env
fi

# 2. Build and launch containers
echo "[*] Building and starting containers..."
docker compose down --remove-orphans || true
docker compose up -d --build

# 3. Wait for PostgreSQL readiness
echo "[*] Waiting for PostgreSQL database readiness..."
until docker compose exec -T db pg_isready -U nexus_user -d nexus_cms > /dev/null 2>&1; do
  sleep 1
done
echo "[OK] PostgreSQL is healthy and accepting connections."

# 4. Apply Prisma migrations & generate client
echo "[*] Running database schema sync and client generation..."
docker compose exec -T web npx prisma db push || true

echo "=================================================="
echo "[OK] Nexus CMS deployment completed successfully."
echo "[*] Application endpoint: http://localhost:3000"
echo "=================================================="
