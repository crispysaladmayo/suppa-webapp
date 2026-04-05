# GitHub Pages — one setting

Your static M1 prototype is copied into the **`docs/`** folder at the repo root (from `Child Nutrition App/m1-hifi-prototype/`).

## Do this once on GitHub

1. Open **Settings → Pages**.
2. **Build and deployment → Source:** **Deploy from a branch**.
3. **Branch:** `main`.
4. **Folder:** **`/docs`** (pick **`/docs`**, not **`/ (root)`**).
5. Save. Wait ~1 minute, then open `https://crispysaladmayo.github.io/suppa/`.

## Design workflow (automation-friendly)

Product default: when changing UX, update **`design-m1-hifi-pages.md`** + **`m1-hifi-prototype/`**, then run the sync + git push below. See **`Child Nutrition App/child-nutrition-app-context.md`** § *Design update workflow*.

## After you edit the prototype HTML

From the repo root run:

```bash
./scripts/sync-prototype-to-docs.sh
git add docs && git commit -m "chore: sync prototype to docs" && git push
```
