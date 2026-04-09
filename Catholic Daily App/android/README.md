# Catholic Daily App — Android (V1 scaffold)

Kotlin, **Jetpack Compose**, **Room**, **OkHttp** + **Moshi** for editorial JSON. Matches [`../catholic-daily-app-data-architecture.md`](../catholic-daily-app-data-architecture.md) and [`../catholic-daily-app-packaging-to-production.md`](../catholic-daily-app-packaging-to-production.md).

## Requirements

- **Android Studio** Koala+ (or JDK 17 + Android SDK + command-line tools).
- **SDK path:** copy `local.properties.example` → `local.properties` and set `sdk.dir`, or open the project in Android Studio (it creates `local.properties` automatically).

## Build

```bash
cd android
./gradlew :app:assembleDebug
```

**Output:** `app/build/outputs/apk/debug/app-debug.apk` — install with `adb install -r` or share the file.

### APK without local SDK (GitHub)

After you push this repo to GitHub, run workflow **“Catholic Daily App — build debug APK”** (or push a change under `Catholic Daily App/android/`). Download the **`catholic-daily-app-debug`** artifact — it contains `app-debug.apk`.

The workflow links this folder to `android-ci` (no spaces) before Gradle runs — spaces in `Catholic Daily App` can break Android tooling on Linux runners. CI uses **JDK 21** and **`gradle/actions/setup-gradle`** for caching.

## Readings bundle in the app

V1 now includes a dev-seed bundle at:

`app/src/main/assets/readings_bundle.db`

So a fresh debug install can show non-empty content immediately.

To regenerate the bundle from pipeline samples:

   ```bash
   cd ../pipeline/scripts
   python3 build_readings_bundle.py -i ../samples/readings-import.sample.json -o ../out/readings-sample.db
   ```

Copy the output file **exactly** as:

   `app/src/main/assets/readings_bundle.db`

   (`ReadingsBundleImporter` looks for that name at app startup.)

Use **licensed** lectionary data for production; the sample is placeholders only.

For a licensed monthly window build (`today-3 months .. today+3 months`), use:

`cd ../pipeline/scripts && python3 build_kwi_seed_window.py --licensed-import ../in/readings-kwi-licensed.json --output-import ../out/readings-import.kwi-window.json --output-db ../out/readings-kwi-window.db --report ../out/readings-kwi-window.report.json`

## Editorial URL

`app/build.gradle.kts` sets `BuildConfig.EDITORIAL_BASE_URL`. Point it at your static CDN (see packaging doc). The app skips fetch if the host contains `example.invalid`.

If URL is empty/placeholder, app falls back to local seed:

`app/src/main/assets/editorial.seed.json`

## Homily (JSON feed)

`BuildConfig.HOMILY_FEED_URL` should be the **full HTTPS URL** of a static JSON file (same host as editorial is fine), e.g. `https://cdn.yourdomain.app/catholic-daily/v1/homily/latest.json`.

Shape matches [`../pipeline/samples/homily-latest.sample.json`](../pipeline/samples/homily-latest.sample.json) and `HomilyLatestJsonDto` in the app. On success, the app **replaces** the cached “latest” homily (`is_latest`) in Room.

If `HOMILY_FEED_URL` is empty **or placeholder** (contains `example.invalid`), the app falls back to local seed asset mode. Use **official or licensed** sources in production (PRD FR-9).

For dev-seed mode, the app uses:

`app/src/main/assets/homily_latest.seed.json`

Optional historical audit file (not read by runtime yet):

`app/src/main/assets/homily_history.seed.json`

## Background refresh

`ContentRefreshScheduler` enqueues a **12-hour** `WorkManager` job (network required) to call `refreshHomilyIfNeeded()` and `refreshEditorial(today)` using `LiturgicalDateResolver` (default civil date in `Asia/Jakarta` until KWI logic is added).

Additionally, app startup triggers one immediate refresh pass so local seed content is inserted without waiting for periodic work.

## Quick verification (dev-seed)

1. Install debug APK on a fresh device/emulator.
2. Launch app: readings should appear from local `readings_bundle.db`.
3. Homily + renungan should appear from seed assets even with placeholder URLs.
4. Tap refresh FAB: content remains available; when production URLs are configured later, remote fetch replaces seed rows.

## Package name

`com.catholicdaily.app` — change before Play upload if you use a different application id.
