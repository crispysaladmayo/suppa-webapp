# Nutria Web Platform — context handoff

## What was built

- **`app/server`**: Hono API on Node, PostgreSQL via Drizzle ORM, Zod on request bodies, JSON stdout logging, cookie sessions (`nutria_session`), rate-limited login (in-memory), REST under `/api/v1`, auth under `/api/auth`.
- **`app/web`**: Vite + React 19 + React Router not required (single shell); four Indonesian tabs (**Hari ini**, **Rencana**, **Belanja**, **Prep**); API client with Zod response parsing; proxy to API in dev.
- **Infra**: `docker-compose.yml` publishes Postgres on **5433** (credentials `nutria`/`nutria`, DB `nutria`). Drizzle migration SQL in `app/server/drizzle/`.

## How to run locally

1. `docker compose up -d` from `Nutria/nutria-web-platform/` (or point `DATABASE_URL` at any Postgres).
2. `cd app/server && npm run db:migrate`
3. `cd app/server && npm run db:seed` — creates `demo@nutria.local` / `nutria-demo-12` plus sample prep, pantry, grocery for current week.
4. From repo root `Nutria/nutria-web-platform/`: `npm run dev` — API `:3001`, web `:5173`.

Env (optional): `DATABASE_URL`, `SESSION_SECRET` (min 16 chars), `CORS_ORIGIN` (default `http://localhost:5173`), `PORT` (default `3001`).

## API surface (summary)

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- V1 (auth required): persons, prep runs/items/consumption, meals, grocery, pantry, settings, prep-sessions (+ ingredients/steps), summary, export `week.md`, AI meal-ideas stub

## Troubleshooting

- **Login shows “Internal error” (or a DB error only in dev):** the API is running but PostgreSQL is not reachable, or migrations/seed were not applied. Check `http://localhost:3001/health/db` — if `database` is false, run `docker compose up -d` from this folder, then `cd app/server && npm run db:migrate && npm run db:seed`. Ensure `DATABASE_URL` matches Compose (default uses port **5433**).
- **Commands must run from this directory:** `Nutria/nutria-web-platform` inside your repo (path may include a space, e.g. `Alvin Cursor` — quote the path when using `cd`).

## Next steps if context resets

1. Read `SPEC.md` for full feature intent.
2. Run migrations + seed before UI testing.
3. Extend UI for prep-session ingredients/steps (API already exists).
