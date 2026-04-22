# Generator notes

## What was built

- **Nutria/app/** — full Expo TypeScript app under `src/` with navigation, SQLite persistence, and screens for Home (three layouts), Week planner, Grocery, Log, Settings, and Prep mode modal.
- **Domain helpers:** depletion, yield, nutrition aggregation, prep nudges (rule-based).
- **Tests:** Jest unit tests for `depletion`, `yield`, and `nutrition` modules.

## Known limitations

- **Notifications:** Local alerts fire when depletion **escalates** for the active prep run (requires notification permission). Use a **development build** for full behavior; Expo Go shows limitations for `expo-notifications`.
- **Planner → grocery:** **Shop** on a meal adds one grocery line (title + guessed section); not a full ingredient breakdown.
- **Grocery pricing:** Each line can store one `price_idr_per_unit` figure; the total is a simple sum of unchecked priced lines (no per-kg math across mixed units).
- **Pantry:** Display-only in grocery; no automatic deduction when logging consumption.
- **Meals ↔ prep items:** Meals can be marked “prepped” but do not auto-deduct stock (deduction is explicit via Log).
- **Notifications:** No push/local scheduled notifications; alerts are on the Home screen when data reloads.
- **Web:** Not validated; SQLite + native modules target iOS/Android.

## Deferred (per spec / scope)

- LLM-based meal suggestions (only rule-based nudges implemented).
- Barcode scanning and branded packaged-food databases.
- Multi-device sync.
