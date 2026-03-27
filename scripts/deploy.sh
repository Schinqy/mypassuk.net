#!/bin/sh
set -e

echo "=== Running deployment seed check ==="
pnpm --filter @workspace/scripts run deploy-seed

echo "=== Pruning pnpm store ==="
pnpm store prune
