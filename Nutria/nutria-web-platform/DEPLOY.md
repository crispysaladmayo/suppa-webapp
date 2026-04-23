# Deploy Nutria API (internet) + connect GitHub Pages

Use this so **https://crispysaladmayo.github.io/nutria/** can call a real **HTTPS API** (e.g. for family members). The web app is static; the **Hono + Postgres** server in `app/server` must run on a public host.

## 1. One-time: choose a host

**Railway** (below) is a simple default: Postgres + container from the included `Dockerfile`.

Other options: **Render**, **Fly.io**, **Google Cloud Run** — same `Dockerfile`, same environment variables.

## 2. Create Postgres

On Railway: **New** → **Database** → **PostgreSQL**. Copy **Private / Public `DATABASE_URL`** (TCP URL), e.g. `postgresql://...`.

## 3. Create the API service

1. In the same Railway project: **New** → **GitHub repo** (or **Empty** and connect repo later).
2. **Settings** → set **Root directory** to `nutria-web-platform` (if your monorepo root is the GitHub repo that contains that folder, adjust: root should be the directory that contains this `Dockerfile`).
3. Railway should detect the **Dockerfile** and build.

If the Git repo root is **only** the `nutria` app with `nutria-web-platform/` at top level, set root directory: **`nutria-web-platform`**.

## 4. Environment variables (API service)

Set these on the **API** service (not the DB):

| Variable | Example | Notes |
|----------|---------|--------|
| `NODE_ENV` | `production` | Required for secure cookies. |
| `PORT` | (leave unset) | Railway injects this; the server reads `process.env.PORT`. |
| `DATABASE_URL` | `postgresql://...` from step 2 | **Variable reference** to Postgres plugin in Railway, or paste URL. |
| `SESSION_SECRET` | 32+ random bytes | e.g. `openssl rand -hex 32` |
| `CORS_ORIGIN` | `https://crispysaladmayo.github.io` | **Exact** origin of the static site, no path. If you also test on `localhost:5173`, add comma: `https://crispysaladmayo.github.io,http://localhost:5173,http://localhost:5174` |
| `SESSION_SAMESITE` | `None` | **Required** for “site on `github.io` + API on another domain” (cross-site cookies + `fetch(..., { credentials: 'include' })`). |

**Do not** commit real secrets. Set them in the Railway UI or linked secrets.

## 5. Public URL

After deploy, open the service **URL** (e.g. `https://nutria-production.up.railway.app`). Test:

- `GET https://YOUR-URL/health` → `{"ok":true}`
- `GET https://YOUR-URL/health/db` → `ok` and `database: true` after migrations

## 6. One-time: seed a demo user (optional)

With `DATABASE_URL` in env (e.g. from a shell linked to Railway or local copy):

```bash
cd nutria-web-platform
# Put DATABASE_URL in .env in app/server or export it
export DATABASE_URL="postgresql://..."
npm run db:seed -w @nutria/server
```

Or use **Railway** → service → **Shell** / one-off run with the same command from `/app` if the image includes dev tooling — the published Dockerfile is production-only; **easiest** is run from your machine with the Railway `DATABASE_URL` exposed once.

The seed file creates `demo@nutria.local` (see `app/server/src/scripts/seed.ts` for the password used in dev).

**Better for family:** use **Register** on the live site after API + CORS + cookies work.

## 7. Rebuild static GitHub Pages with `VITE_API_BASE`

The browser must know your API’s **origin** (no path, no trailing slash).

From `nutria-web-platform`:

```bash
VITE_GITHUB_PAGES=1 \
VITE_API_BASE=https://YOUR-SERVICE.up.railway.app \
npm run build -w @nutria/web
```

Then copy the build into `../docs` (or use the repo’s `export:gh-pages` after we wire env — see `package.json` and GitHub Action below).

**Important:** with `VITE_API_BASE` set, the app will call **`/api/...` on that host** (the client already prefixes with `VITE_API_BASE`).

Push `docs/` to `main` so Pages updates.

## 8. GitHub Action (optional)

In the `nutria` repository, use **Actions** → *Build Nutria GitHub Pages* (workflow) and set the input **API base URL** to your Railway URL. That rebuilds `docs/` with the right env without doing it on your laptop.

## Troubleshooting

- **CORS error in the browser** → add the exact `https://crispysaladmayo.github.io` to `CORS_ORIGIN` (and redeploy API).
- **Login succeeds but next request is logged out** → set `SESSION_SAMESITE=None` and HTTPS on the API. Local dev can stay `Lax`.
- **401 / no session** → check `credentials: 'include'` (already in client) and cookie isn’t blocked by browser.

## Local dry-run of the container

```bash
cd nutria-web-platform
docker build -t nutria-api .
docker run --rm -p 3001:3001 \
  -e PORT=3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://... \
  -e SESSION_SECRET=devdevdevdevdevdevdevdevdevdevdevdev \
  -e CORS_ORIGIN=https://crispysaladmayo.github.io \
  -e SESSION_SAMESITE=None \
  nutria-api
```

(Use a real `DATABASE_URL` to a test DB.)
