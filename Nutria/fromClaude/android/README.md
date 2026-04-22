# Nutria — Android

Native Android port of the Nutria meal-prep app for Maya & Arief. Built with Jetpack Compose + Material 3, offline-first.

## Stack
- **Kotlin 2.0** + **Jetpack Compose** (BOM 2024.06)
- **Material 3** theming with custom Nutria cream/clay palette
- **DataStore Preferences** for offline state (checklist progress, prep completion)
- **Min SDK 26** (Android 8.0+) · Target SDK 34

## Run it

1. Install **Android Studio Koala** (2024.1.1) or newer.
2. Open the `android/` folder as a project.
3. Let Gradle sync (downloads ~8.7 + AGP 8.5 + Compose BOM).
4. Pick an emulator (Pixel 6, API 34 recommended) or plug in a device with USB debugging.
5. Press **Run ▶**.

The first build takes 3–5 min. Subsequent builds are fast.

## Project layout

```
android/
├── app/
│   ├── build.gradle.kts           # Compose, Room, DataStore deps
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/nutria/app/
│       │   ├── MainActivity.kt          # Entry + tab state
│       │   ├── data/
│       │   │   ├── SeedData.kt          # Meals, grocery, prep tasks, stock
│       │   │   └── UserPrefs.kt         # DataStore — offline checklist state
│       │   └── ui/
│       │       ├── theme/               # Color.kt, Type.kt, Theme.kt
│       │       ├── components/          # BottomTabBar, Pill, Avatar
│       │       └── screens/             # Home, Plan, Grocery, Prep
│       └── res/
│           ├── values/{themes,strings}.xml
│           └── xml/                     # Backup rules
├── build.gradle.kts               # Root plugins
├── settings.gradle.kts
├── gradle.properties
└── gradle/wrapper/gradle-wrapper.properties
```

## Design parity

The Compose UI mirrors the web prototype 1:1:
- Same cream/paper background, clay primary, herb secondary, yolk tertiary
- Same 4-tab layout (Hari ini / Rencana / Belanja / Prep)
- Home = "Hearth" stock-depletion dashboard with depletion ring, stock bars, glance cards, today's consume rows, focus-mode CTA
- All copy in Bahasa Indonesia, prices in IDR with dot-thousand separator

## Typography note

Uses `FontFamily.SansSerif` (Roboto on most devices) as an Open Sans stand-in.
To ship the real Open Sans: drop `open_sans_regular.ttf` / `open_sans_semibold.ttf` / `open_sans_bold.ttf` into `app/src/main/res/font/` and change `AppFontFamily` in `Type.kt` to:

```kotlin
private val AppFontFamily = FontFamily(
    Font(R.font.open_sans_regular, FontWeight.Normal),
    Font(R.font.open_sans_semibold, FontWeight.SemiBold),
    Font(R.font.open_sans_bold, FontWeight.Bold),
)
```

## Missing from scaffold (next steps)

- **App icon** — placeholder mipmaps not generated; add via Android Studio → New → Image Asset
- **Gradle wrapper binaries** (`gradlew`, `gradlew.bat`, `gradle-wrapper.jar`) — Android Studio creates these on first sync, or run `gradle wrapper` in the `android/` folder
- **Room** — swapped for DataStore to keep scaffold small; upgrade to Room when you need relational data
- **Notifications** — reminders for Sunday prep, low-stock alerts
- **Settings screen** — family members, calorie targets

## Tweak the seed

`data/SeedData.kt` holds the full week of meals, grocery list, prep tasks, and current stock snapshot. Edit values in-place and re-run.
