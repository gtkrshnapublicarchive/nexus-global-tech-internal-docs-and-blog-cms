#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo " Nexus CMS Redeployment Pipeline"
echo "=================================================="

ACTIVE_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "devv")

echo "[*] Active branch: ${ACTIVE_BRANCH}"
echo "[*] Tearing down running containers..."
docker compose down --remove-orphans

echo "[*] Executing clean deployment..."
bash deploy.sh
