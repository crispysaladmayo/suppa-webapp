#!/usr/bin/env bash
# Copies the static M1 prototype into docs/ for GitHub Pages
# ("Deploy from a branch" → main → /docs), and mirrors the same files to the repo root
# for clones that keep a duplicate static preview at /. Run from repo root after editing the prototype.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/Child Nutrition App/m1-hifi-prototype"
DST="$ROOT/docs"
mkdir -p "$DST"
rsync -a --delete \
  --exclude='.git' \
  "$SRC/" "$DST/"
echo "Synced prototype → docs/ ($DST)"
# No --delete on root: avoid removing unrelated repo files (README, .github, etc.).
# Never overwrite repo-root .gitignore (prototype only has a minimal stub).
rsync -a \
  --exclude='.git' \
  --exclude='.gitignore' \
  "$SRC/" "$ROOT/"
echo "Synced prototype → repo root ($ROOT)"
