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

- Regenerate from the Expo app: `cd app && npm run export:web` (writes `../docs/`).
- Commit the resulting `docs/` changes on your **feature** branch, or on **`main`** if you are doing a direct hotfix, then **push the same branch** you intend to ship (usually merge to `main` first if using a feature branch).

## Optional GitHub settings (maintainer)

- **Settings → Branches → Default branch:** `main` (default).
- **Settings → Pages:** Build from **`main`**, directory **`/docs`**.
