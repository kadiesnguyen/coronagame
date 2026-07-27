#!/usr/bin/env bash
# Deploy Coronacasino to prod — NEVER syncs env secrets into the app tree.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${DEPLOY_HOST:-root@14.225.211.14}"
REMOTE="${DEPLOY_REMOTE:-/www/wwwroot/coronacasino}"
SECRETS="$REMOTE/secrets"
FORBIDDEN='cbvnsjeikd|xosoclient'

RSYNC_EXCLUDES=(
  --exclude node_modules
  --exclude .next
  --exclude .git
  --exclude config.env
  --exclude .env
  --exclude .env.local
  --exclude .env.production
  --exclude .env.development
  --exclude 'public/sw.js'
  --exclude 'public/workbox-*.js'
  --exclude 'ckeditor5-*/node_modules'
  --exclude 'docs/superpowers'
  --exclude 'info.md'
)

echo "==> Preflight: refuse local env with legacy domains"
if grep -Eiq "$FORBIDDEN" "$ROOT/backend/config.env" 2>/dev/null; then
  echo "ERROR: local backend/config.env still has legacy domain. Fix before deploy."
  exit 1
fi
if grep -Eiq "$FORBIDDEN" "$ROOT/frontend/.env.local" 2>/dev/null; then
  echo "ERROR: local frontend/.env.local still has legacy domain. Fix before deploy."
  exit 1
fi

echo "==> Ensure remote secrets exist (source of truth)"
ssh "$HOST" "test -f $SECRETS/backend.config.env && test -f $SECRETS/frontend.env.local" || {
  echo "ERROR: missing $SECRETS/{backend.config.env,frontend.env.local} on server."
  echo "Create them once; deploy will never overwrite them via rsync."
  exit 1
}

echo "==> Guard: secrets must be corona domains"
ssh "$HOST" "grep -Eiq '$FORBIDDEN' $SECRETS/backend.config.env $SECRETS/frontend.env.local && exit 1 || exit 0" || {
  echo "ERROR: secrets still contain legacy domains."
  exit 1
}

echo "==> Rsync code (env excluded)"
rsync -az --delete "${RSYNC_EXCLUDES[@]}" -e ssh \
  "$ROOT/backend/" "$HOST:$REMOTE/backend/"
rsync -az --delete "${RSYNC_EXCLUDES[@]}" -e ssh \
  "$ROOT/frontend/" "$HOST:$REMOTE/frontend/"
rsync -az -e ssh "$ROOT/ecosystem.config.cjs" "$HOST:$REMOTE/ecosystem.config.cjs"

echo "==> Restore FE .env.local from secrets (Next reads this at build)"
ssh "$HOST" "cp -a $SECRETS/frontend.env.local $REMOTE/frontend/.env.local"

echo "==> Build + restart"
ssh "$HOST" 'set -e
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 18
cd '"$REMOTE"'/frontend
NODE_OPTIONS=--max_old_space_size=4096 npm run build
# Refuse baked legacy API URL
if grep -R --include="*.js" -Eiq "'"$FORBIDDEN"'" .next/static 2>/dev/null; then
  echo "ERROR: built frontend still contains legacy domain"
  exit 1
fi
cd '"$REMOTE"'
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
'

echo "==> Smoke CORS (retry until API ready)"
ok=0
for i in 1 2 3 4 5 6 7 8; do
  ORIGIN_HDR=$(ssh "$HOST" "curl -sI --max-time 5 -H 'Origin: https://admin.coronacasin24.com' https://api.coronacasin24.com/api/v1/hethong/branding | tr -d '\\r' | grep -i '^access-control-allow-origin:' || true")
  echo "  try $i: ${ORIGIN_HDR:-"(no ACAO header)"}"
  if echo "$ORIGIN_HDR" | grep -qi 'admin.coronacasin24.com'; then
    ok=1
    break
  fi
  sleep 2
done
if [ "$ok" != "1" ]; then
  echo "ERROR: CORS allow-origin is not admin.coronacasin24.com"
  exit 1
fi

echo "==> Deploy OK"
