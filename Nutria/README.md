# Nutria

Meal prep, planner, grocery, and consumption tracking (Expo / React Native). This repository includes a **static web build** under [`docs/`](./docs/) for GitHub Pages.

## Live site (GitHub Pages)

After enabling Pages (**Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/docs`), the app is available at:

**https://crispysaladmayo.github.io/nutria/**

The [`docs/.nojekyll`](./docs/.nojekyll) file ensures GitHub Pages does not strip the `_expo` asset folder.

### Troubleshooting

- **You only see this README as a webpage (no app UI):** Pages is almost certainly set to **`/(root)`** instead of **`/docs`**. Jekyll then turns `README.md` into the homepage. Fix the folder to **`/docs`**, wait a minute, and hard-refresh. A root [`index.html`](./index.html) also redirects to `docs/` if you must publish from the repo root (cleaner URL: use `/docs` as the source).
- **Blank page:** Ensure JavaScript is allowed for `github.io`, then check the browser console for blocked script errors.

## Develop (native or web dev server)

```bash
cd app
npm install
npm start
# Web: press w, or: npm run web
```

## Rebuild the published web bundle

From `app/`:

```bash
npm run export:web
```

This runs `expo export --platform web`, copies output into `docs/`, and refreshes `.nojekyll`.

## Repository layout

| Path | Purpose |
|------|---------|
| `app/` | Expo app source |
| `docs/` | Static web export served by GitHub Pages |
