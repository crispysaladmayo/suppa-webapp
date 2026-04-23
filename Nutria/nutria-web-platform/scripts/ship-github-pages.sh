#!/usr/bin/env bash
# Rebuild ../docs/ for GitHub Pages with a public API. Run from nutria-web-platform/:
#   chmod +x scripts/ship-github-pages.sh   # once
#   ./scripts/ship-github-pages.sh https://nutria-api-xxxx.onrender.com
set -euo pipefail
API="${1:?Usage: $0 https://your-api.example.com (no trailing slash)}"
cd "$(dirname "$0")/.."
export VITE_GITHUB_PAGES=1
export VITE_API_BASE="${API%/}"
npm run build -w @nutria/web
rm -rf ../docs
cp -R app/web/dist ../docs
touch ../docs/.nojekyll
echo
echo "Done. From repo root: git add docs && git commit -m 'chore: point Pages to API' && git push"
echo
