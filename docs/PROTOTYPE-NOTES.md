# Prototype notes (M1 hi-fi HTML)

1. **Brand:** Customer-facing product name is **Suppa** ([`suppa-brand-framework.md`](../suppa-brand-framework.md)). Landing uses the **Suppa** wordmark (Fraunces), positioning line from the brand framework, and PRD-aligned disclaimers (“Suppa shares…”). Screen `<title>` elements use the “— Suppa” suffix where applicable.
2. **0–5 month Today mode:** The hi-fi spec’s milk-forward layout is not built as a separate page; the demo child is **3–5 years** with **macro snapshot**, **two** gap-hint cards, and **meal ideas** carousel (PRD §7.5).
3. **Auth:** M1 is **email + password** (PRD FR-A1). Sign-up / log-in is static; no real validation. Duplicate-email messaging is stubbed in HTML only. **Forgot password?** on log-in is a placeholder link until eng ships reset (may be M1.1).
4. **Recipe detail after “Save recipe”:** Navigates with `?mine=1` to show the “Yours” pill only—ingredients/steps are still the sample library recipe.
5. **Settings:** Section rows link to `#` as placeholders until engineering wires routes.
6. **Fridge empty search:** Inline error appears when the ingredient field is cleared and **Find recipes** is clicked; default field is pre-filled for demo flow.
7. **GitHub Pages:** The monorepo’s HTML is **not** at the repo root. A copy is synced into **`docs/`** (run `./scripts/sync-prototype-to-docs.sh` from repo root). On GitHub: **Settings → Pages → Deploy from a branch → `main` → folder `/docs`** (not `/ root`). See repo root **`GITHUB-PAGES.md`**. Source of truth for edits remains this folder (`m1-hifi-prototype/`); re-sync after changes.
