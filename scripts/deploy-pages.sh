#!/usr/bin/env bash
set -euo pipefail

# Pages uses a dedicated static branch because committing workflow files
# would require an additional GitHub OAuth scope.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$ROOT"

bun test
bun run build

REMOTE="$(git remote get-url origin)"
STAGING="$(mktemp -d)"
trap 'rm -rf "$STAGING"' EXIT

git clone --quiet --single-branch --branch gh-pages "$REMOTE" "$STAGING/site"
rsync -a --delete --exclude='.git' "$ROOT/dist/" "$STAGING/site/"
touch "$STAGING/site/.nojekyll"

git -C "$STAGING/site" add -A

if git -C "$STAGING/site" diff --cached --quiet; then
  echo "No website changes to publish."
  exit 0
fi

git -C "$STAGING/site" \
  -c user.name="Jet Engine Lab" \
  -c user.email="noreply@github.com" \
  commit -m "Publish updated website"

GIT_TERMINAL_PROMPT=0 git -C "$STAGING/site" \
  -c http.postBuffer=1048576 \
  -c http.lowSpeedLimit=1 \
  -c http.lowSpeedTime=25 \
  push origin gh-pages

echo "GitHub Pages deployment branch updated."
