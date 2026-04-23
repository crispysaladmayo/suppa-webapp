#!/bin/sh
# Usage: ./scripts/set-pages-api.sh https://nutria-api-xxxx.onrender.com
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
URL="${1:-}"
if [ -z "$URL" ]; then
  echo "Usage: $0 <https://your-nutria-api.onrender.com>" >&2
  exit 1
fi
URL="${URL%/}"
OUT="$REPO_ROOT/docs/api-config.json"
if command -v jq >/dev/null 2>&1; then
  jq -n --arg u "$URL" '{apiBase: $u}' > "$OUT"
else
  python3 -c "import json, pathlib, sys; pathlib.Path(sys.argv[1]).write_text(json.dumps({'apiBase': sys.argv[2]}))" "$OUT" "$URL"
fi
echo "Wrote docs/api-config.json. Commit and push: git add docs/api-config.json && git commit -m 'pages: API URL' && git push"
cat "$OUT"
