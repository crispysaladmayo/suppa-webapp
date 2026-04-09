# Catholic Daily App — from pipeline to shipped product

**Purpose:** Connect the repo **pipeline** (`pipeline/`) to a **real Android release** and **live content** users receive. Aligns with **app-only V1** in [`catholic-daily-app-data-architecture.md`](catholic-daily-app-data-architecture.md).

---

## 1. What “the product” is (three surfaces)

| Surface | What users get | How you package it |
|--------|----------------|--------------------|
| **Android app** | APK/AAB on **Google Play** | Gradle build, signing, `versionCode` / `versionName`, store listing |
| **Readings** | SQLite bundle (`readings_*.db`) | **In AAB assets** and/or **download** from your static host using [`readings-manifest.sample.json`](pipeline/samples/readings-manifest.sample.json) shape |
| **Editorial** | Per-day JSON | **Upload** to static host (`editorial/YYYY-MM-DD.json` and optional `editorial-index.json`) |

**Homily** is **not** produced by this pipeline: the app **fetches** allowed third-party sources at runtime (see context doc). You only **configure URLs** and **parser** in the app.

---

## 2. Versioning (keep these separate)

- **`versionCode` / `versionName` (Play)** — The **app binary**. Bumps when Kotlin/UI/fixes ship.
- **`readings_bundle_version` (content)** — The **lectionary dataset** (e.g. `2026.2.0`). Bumps when you ingest a new licensed export or corrections.
- **Editorial** — Versioned by **`published_at`** and file path (`liturgical_date`); no need to match app version.

**Rule:** Users can run **old app + new readings bundle** (OTA) or **new app + same bundle** (embedded). Document which combinations you support.

---

## 3. Readings: from licensed data to users

### Step A — Create import JSON (once per licensor export)

1. Obtain **rights-cleared** Indonesian lectionary data (KWI-consistent) from your partner.
2. Transform it into the **import JSON** shape validated by [`pipeline/schemas/readings-import.v1.schema.json`](pipeline/schemas/readings-import.v1.schema.json) (see [`samples/readings-import.sample.json`](pipeline/samples/readings-import.sample.json)).
3. Run `python3 pipeline/scripts/validate_content_assets.py` after you add/replace your real import file (extend the validator list if you use a different filename).

### Step B — Build the SQLite bundle

```bash
cd "Catholic Daily App/pipeline/scripts"
python3 build_readings_bundle.py \
  -i /path/to/readings-import.REAL.json \
  -o ../out/readings-2026.2.0.db
```

- Save the printed **bundle fingerprint** in your **release notes** or internal log.
- Optionally `zip` the `.db` if that is what you will host.

### Step C — Package for the product (choose one or both)

**C1 — Ship inside the app (simplest for V1 launch)**

- Place `readings-*.db` under Android **`assets/`** (or `raw/`).
- On first launch (or after app update), **copy** into app storage and **import** into Room, or use a **read-only** DB from assets per your Room strategy.
- **Play update** required to change readings → acceptable if bundle changes are rare.

**C2 — Over-the-air bundle (smaller app, faster fixes)**

- Upload `readings-*.db` or `.zip` to **HTTPS static storage** (S3 + CloudFront, Firebase Hosting, Cloudflare R2, etc.).
- Publish [`readings-manifest.json`](pipeline/samples/readings-manifest.sample.json) next to it with:
  - `readings_bundle_version`
  - `bundle_url`
  - `sha256` of the **exact bytes** users download (recommended for OTA), **or** align app verification with the **fingerprint rule** from the builder—**one rule only**.
- App on startup (or WorkManager): **GET manifest** → compare version → **download** → verify hash → **replace** local readings DB.

**C3 — Hybrid**

- Ship a **baseline** bundle in assets for **offline-first**; use OTA only for **corrections** or **next liturgical year** when manifest says a newer `readings_bundle_version` exists.

---

## 4. Editorial: from review to users

1. **Generate + review** renungan per PRD FR-14 / FR-14b (AI-assisted allowed with **human + theological review**).
2. Export one file per day: [`pipeline/samples/editorial/2026-04-06.json`](pipeline/samples/editorial/2026-04-06.json) shape (`ai_assisted`, `human_reviewed` accurate).
3. **Validate** (extend `validate_content_assets.py` to glob `editorial/*.json` in your production folder, or validate manually before upload).
4. **Upload** to static host, stable URL pattern, e.g.  
   `https://cdn.yourdomain.app/catholic-daily/v1/editorial/2026-04-06.json`
5. Optional: maintain [`editorial-index.json`](pipeline/samples/editorial-index.sample.json) so the app discovers **which dates** exist without guessing URLs.

**Daily “product” ritual:** publish JSON for **tomorrow’s** liturgical date (in Indonesia TZ) before local evening, or whatever cutoff you define in the PRD.

---

## 5. Homily (configuration only)

- Finalize **allowed source URLs** and **legal** display mode (`FULL` / `EXCERPT` / `LINK_ONLY`) per PRD.
- Encode **base URLs** in `BuildConfig`, remote config, or a tiny **static config JSON** you host (still no app backend required).
- **Parser** lives in the app; updates ship with **app releases** unless you use downloadable config for URL-only changes.

---

## 6. Android app responsibilities (when the codebase exists)

These are the engineering tasks that **turn** the pipeline into behavior:

| Task | Outcome |
|------|---------|
| **Scaffold repo** | [`android/`](android/) — Gradle module, Room, `ContentRepository`, readings importer, Compose shell (see [`android/README.md`](android/README.md)) |
| Room entities + DAOs | Match [`catholic-daily-app-data-architecture.md`](catholic-daily-app-data-architecture.md) §3 |
| **Readings importer** | Load embedded DB and/or OTA download + checksum |
| **Editorial fetcher** | OkHttp + parse JSON → upsert `editorial_piece` |
| **Homily fetcher** | Per-source parser → `homily_document` |
| **WorkManager** | Refresh B + C on interval + on app open; respect PRD FR-22 (honest stale) |
| **`ContentRepository`** | Single stream for the home scroll (readings + homily + renungan) |
| **`HomilyDataSource`** | `JsonHomilyFeedDataSource` + static `homily/latest.json` (see `pipeline/samples/homily-latest.sample.json`) |
| **`WorkManager`** | `ContentRefreshScheduler` — periodic homily + editorial refresh (see `android/README.md`) |
| **`LiturgicalDateResolver`** | Default: civil date in `Asia/Jakarta`; swap for KWI calendar when ready |
| **Disclosure UI** | FR-14: `renungan_ai_disclosure` string when `ai_assisted=true` (review with counsel) |

Until the Android module exists, treat this table as the **acceptance checklist** for “pipeline integrated.”

---

## 7. CI/CD → production (suggested maturity path)

| Stage | What to automate |
|-------|------------------|
| **Now** | GitHub Actions validates samples + builds sample DB (already in [`.github/workflows/catholic-daily-pipeline.yml`](../.github/workflows/catholic-daily-pipeline.yml)). |
| **Next** | On tag `readings/*`, build real import JSON from your **private** licensor artifact (secrets in CI), upload `.db` + manifest to **staging** CDN. |
| **Release** | Play **internal testing** track with AAB that points **staging** URLs; then promote to production URLs + production track. |

Keep **import JSON** and **raw licensor files** in a **private** repo or encrypted storage—not necessarily this public repo.

---

## 8. Pre-launch checklist (product + compliance)

- [ ] Readings text **license** documented; attribution strings in app and share payloads (PRD).
- [ ] Homily **rights** and **link vs full text** decided; no unlicensed scraping.
- [ ] Editorial **AI disclosure** copy approved (FR-14); `ai_assisted` / `human_reviewed` correct in JSON.
- [ ] **SHA-256** rule for readings OTA documented and **tested** on a real device (airplane mode, partial download, wrong hash).
- [ ] **KWI / timezone** behavior reviewed for “which liturgical day” (context doc).
- [ ] Play **Data safety** / AI labelling forms filled per current Google requirements.

---

## 9. Related files

- [`catholic-daily-app-context.md`](catholic-daily-app-context.md) — sources and guardrails  
- [`catholic-daily-app-v1-prd.md`](catholic-daily-app-v1-prd.md) — FRs  
- [`pipeline/README.md`](pipeline/README.md) — local commands  
- [`catholic-daily-app-data-architecture.md`](catholic-daily-app-data-architecture.md) — Room schema and app-only boundaries  
