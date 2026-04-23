#!/bin/sh
set -e
cd /app
export NODE_ENV="${NODE_ENV:-production}"
echo "[nutria] running migrations..."
node app/server/dist/scripts/migrate.js
echo "[nutria] starting server on port ${PORT:-3001}..."
exec node app/server/dist/index.js
