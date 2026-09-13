#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo " Nexus CMS Verification Suite"
echo "=================================================="

echo "[*] Step 1: Running ESLint..."
npm run lint

echo "[*] Step 2: Validating Prisma schema..."
npx prisma validate

echo "[*] Step 3: Running TypeScript compiler check..."
npx tsc --noEmit

echo "[*] Step 4: Verifying Next.js production build..."
npm run build

echo "[*] Step 5: Running PRD domain & anti-pattern test assertions..."
npx tsx scripts/test_e2e_workflow.ts

echo "=================================================="
echo "[OK] All verification checks passed cleanly."
echo "=================================================="
