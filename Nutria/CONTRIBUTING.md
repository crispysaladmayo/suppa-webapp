# Contributing — branches & this repo

## Which repo and branch?

- **This repository:** `https://github.com/crispysaladmayo/nutria` (clone path on your machine is often `Nutria/` inside a larger folder).
- **Always** run git commands from the **Nutria project root** (the directory that contains this file). The parent “workspace” folder may be a *different* git repository with unrelated branches; ignore those for Nutria work.

## Branch policy (agreed)

| Branch | Role |
|--------|------|
| **`main`** | **Default and production line.** This is the branch **GitHub Pages** uses (source: **`main`**, folder **`/docs`**). Merges here should be intentional: what is on `main` is what is meant to be deployable. |
| **`feature/<name>`** | Short‑lived work (e.g. `feature/hifi-web`, `fix/export-docs`). **Branch from `main`**, open a pull request into **`main`**, delete the branch after merge. |

**Next time you ask or a teammate asks:** the live site follows **`main`**. There is no separate “webapp branch” for production—work lands on `main` when you merge.

## Pushing the static site (`docs/`)

- Regenerate the **hi-fi Vite** bundle: from `nutria-web-platform/`, `npm run export:gh-pages` (writes `../docs/` from `app/web` after `vite build`). Not the legacy `app && npm run export:web` unless you explicitly want the old Expo web UI.
- Commit the resulting `docs/` changes on your **feature** branch, or on **`main`** for a direct hotfix, then **push** the branch you intend to ship.

## Optional GitHub settings (maintainer)

- **Settings → Branches → Default branch:** `main` (default).
- **Settings → Pages:** Build from **`main`**, directory **`/docs`**.
