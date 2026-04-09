# Catholic Daily App — content pipeline (app-only)

This folder supports **V1 app-only** data: **readings bundles** (SQLite), **static editorial JSON**, and optional **remote manifest** metadata. Canonical design: [`../catholic-daily-app-data-architecture.md`](../catholic-daily-app-data-architecture.md).

**→ Shipping to users (Play + CDN + checklist):** [`../catholic-daily-app-packaging-to-production.md`](../catholic-daily-app-packaging-to-production.md).

## Layout

| Path | Purpose |
|------|---------|
| `sql/readings_tables.sql` | SQLite DDL for **readings only** (matches architecture doc §3). |
| `schemas/` | JSON Schema for import JSON, manifest, editorial piece, editorial index. |
| `samples/` | Example files you can copy; **not** licensed lectionary text. |
| `scripts/build_readings_bundle.py` | Turns **readings import JSON** → **`.db`** for assets or static hosting. |
| `scripts/build_kwi_seed_window.py` | Filters licensed KWI readings to `today-3 months .. today+3 months` and builds JSON + `.db` + coverage report. |
| `scripts/generate_liturgical_window_template.py` | Generates a full-window placeholder readings template for dev seeding. |
| `scripts/fetch_vatican_leo_homilies.py` | Fetches Pope Leo homily records from Vatican sources and emits history + latest JSON. |
| `scripts/validate_content_assets.py` | Checks `samples/` (stdlib validation; mirrors `schemas/`). |
| `out/` | Build output (gitignored); create by running the builder. |

## Quick start (non-engineer friendly)

1. **Install Python 3** (macOS often has `python3` already).
2. Open Terminal, go to this `scripts` folder:

   `cd "…/Catholic Daily App/pipeline/scripts"`

3. **Validate** samples (no `pip install` required):

   `python3 validate_content_assets.py`

   You should see: `OK: validated … sample file(s)`.

4. **Build** a sample SQLite bundle:

   `python3 build_readings_bundle.py -i ../samples/readings-import.sample.json -o ../out/readings-sample.db`

5. **Integrity check:** the script prints a `Bundle fingerprint (sha256…)` line. If you publish the `.db` (or a zip of it) on a static host, put that **same** fingerprint logic in your release checklist **or** use the SHA-256 of the **file bytes** of the shipped artifact consistently everywhere (app + manifest)—pick one rule and document it for the Android team.

## Readings manifest (`readings-manifest.sample.json`)

The sample uses a **dummy** `sha256` (`aaa…`) so the file validates. Before production:

- Replace `bundle_url` with your real CDN URL.
- Set `sha256` to the hash of the **exact file** users download (the `.db` or `.zip`), **or** align the app to verify the same fingerprint the builder prints—**do not mix rules silently**.

## Homily (static JSON for app `HOMILY_FEED_URL`)

- Latest homily document: `samples/homily-latest.sample.json` (matches Android `HomilyLatestJsonDto`).
- Optional monthly source list starter: `samples/vatican-leo-homily-urls.sample.txt`.

## Monthly reseed runbook (prod-safe)

1. Put licensed KWI readings export in `pipeline/in/` (gitignored recommended), shaped like `readings-import.sample.json`.
2. Build the 6-month window package:

   `python3 build_kwi_seed_window.py --licensed-import ../in/readings-kwi-licensed.json --output-import ../out/readings-import.kwi-window.json --output-db ../out/readings-kwi-window.db --report ../out/readings-kwi-window.report.json`

3. Build Vatican homily outputs for past 3 months:

   `python3 fetch_vatican_leo_homilies.py --months-back 3 --source-urls-file ../samples/vatican-leo-homily-urls.sample.txt --history-out ../out/homily-history.leo.3months.json --latest-out ../out/homily-latest.leo.3months.json`

4. Copy outputs into Android assets:

   - `../out/readings-kwi-window.db` -> `../android/app/src/main/assets/readings_bundle.db`
   - `../out/homily-latest.leo.3months.json` -> `../android/app/src/main/assets/homily_latest.seed.json`
   - optional audit: `../out/homily-history.leo.3months.json`

5. Validate before release:

   - Coverage report shows `missing_days = 0`.
   - `homily_latest.seed.json` has a valid `source_url` and explicit `rights_mode`.
   - If KWI rights are not confirmed, do not ship generated reading text.

## Editorial

- Per day: `samples/editorial/2026-04-06.json` shape.
- Optional index for lazy loading: `samples/editorial-index.sample.json`.
- **V1 model (product):** renungan may be **AI-drafted** but **must** be **human + theologically reviewed** before upload; set **`ai_assisted`** / **`human_reviewed`** truthfully (see PRD FR-14 / FR-14b).

## CI

GitHub Actions workflow **`.github/workflows/catholic-daily-pipeline.yml`** runs validate + build when files under `Catholic Daily App/pipeline/` change. Extend that job to **upload** `out/readings-ci.db` (or a zip) to your static host when you are ready to automate releases.
