# Nutria

**You want the website to “just work” on the internet (spouse / family)?** Do this first: **[START_HERE.md](./START_HERE.md)** (Render + one GitHub Action — no jargon wall).

---

Meal prep, planner, grocery, and consumption tracking (Expo / React Native). This repository includes a **static web build** under [`docs/`](./docs/) for GitHub Pages.

### Git: which branch for the web app?

- **Production + GitHub Pages** use the **`main`** branch only (Pages: **`main`** + **`/docs`**).  
- **Day-to-day work:** create **`feature/…`** branches from `main` and merge via PR.  
- Full details: [`CONTRIBUTING.md`](./CONTRIBUTING.md).

**Important:** this folder (`crispysaladmayo/nutria`) is its **own** git repository. A parent “workspace” may have other branches; they do not apply here.

## Live site (GitHub Pages)

After enabling Pages (**Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/docs`), the app is available at:

**https://crispysaladmayo.github.io/nutria/**

The [`docs/.nojekyll`](./docs/.nojekyll) file ensures GitHub Pages does not strip the `_expo` asset folder.

### URL (important)

- **Correct live URL:** `https://crispysaladmayo.github.io/nutria/` (ends after `nutria/`, **not** `…/nutria/docs/`).
- In **Settings → Pages**, the source **folder** named `/docs` is the *directory in the repository* that becomes the **site root**. It is **not** a `/docs` segment in the public URL. (A redirect from `…/nutria/docs/` to the app root is included in the static build so old links do not 404.)

### Troubleshooting

- **404 at `…/nutria/docs/`:** Use **`…/nutria/`** as the homepage. If you need the long URL to work, pull the latest `main` and redeploy; the build includes a redirect from `…/nutria/docs/` → `…/nutria/`.
- **You only see the README as a webpage (no app UI):** Pages is set to **`/(root)`** in the repo instead of **`/docs`**. Set the source folder to **`/docs`**, wait a minute, and hard-refresh.
- **Blank page:** Ensure JavaScript is allowed for `github.io`, then check the browser console for blocked script errors.

## Develop (native or web dev server)

```bash
cd app
npm install
npm start
# Web: press w, or: npm run web
```

## Rebuild the published site (hi-fi web app for GitHub Pages)

The live UI matches **`nutria-web-platform/app/web`** (Indonesian 4-tab hi-fi), not the legacy Expo `app/`.

From `nutria-web-platform/`:

```bash
npm install
npm run export:gh-pages
```

This runs `VITE_GITHUB_PAGES=1 npm run build -w @nutria/web` so the app **skips the `/api` session call** and shows the login page immediately (no stuck “Bentar ya…”). Vite’s `base` is `/nutria/`; output is copied to `../docs/` and `docs/.nojekyll` is touched. Push `main` to publish.

**API on the public internet (for family / anyone):** deploy the Hono server + Postgres (Dockerfile in `nutria-web-platform/`) and point the static build at it:

```bash
export VITE_API_BASE="https://YOUR-API.up.railway.app"   # no trailing slash
npm run export:gh-pages   # still sets VITE_GITHUB_PAGES=1; with VITE_API_BASE, login/session work
```

Full checklist: [`nutria-web-platform/DEPLOY.md`](./nutria-web-platform/DEPLOY.md). You can also run **Actions** → *Nutria — build GitHub Pages* and paste the API URL.

**Local dev** keeps using `npm run dev` in `nutria-web-platform` (Vite + API together).

**Legacy only:** Expo web export is still `cd app && npm run export:web` if you need the old 5-tab English bundle; do not use that for the product design.

## Repository layout

| Path | Purpose |
|------|---------|
| `app/` | Expo / React Native (legacy until migrated) |
| `nutria-web-platform/app/web` | **Hi-fi web** (Vite) — 4 tabs, Bahasa Indonesia; this is what `export:gh-pages` publishes to `docs/`. |
| `docs/` | Static build of the Vite app for GitHub Pages |
| `product/` | **Canonical product IA** — `SOURCE_OF_TRUTH.md` and `design-preview.html` (Hari ini · Rencana · Belanja · Prep). |

Open `product/design-preview.html` locally before UI work. Cursor loads `.cursor/rules/nutria-hifi-design.mdc` for `Nutria/**`.
