# Nutria — implementation context

**Stack:** Expo SDK 54, React Native 0.81, TypeScript, expo-sqlite (local), React Navigation (tabs + modal stack), Zod on form boundaries, JSON structured logging via `src/logger.ts`.

**Design tokens:** `src/theme/config.ts` — cream `#faf9f5`, terracotta `#c65d3c`, warm brown text `#2b2620`, sage borders (aligned with `Design/Nutria-share (1).html`).

## Done (feature groups)

1. **P0 — Core**
   - **Prep depletion:** Active `prep_run` + `prep_item` rows; home shows average remaining %, per-line grams, alert banner when below settings thresholds; nudges via `domain/nudges.ts`.
   - **Weekly planner:** `meal_entry` per `week_start` (Monday ISO), day index 0–6, slots, person, fresh vs prepped flag, optional kcal/protein; daily rollups via `sumMacros`.
   - **Grocery:** `grocery_item` by week, sections, check-off, IDR line estimate (unchecked lines with a price), pantry block (read-only list from `pantry_item`).
   - **Consumption log:** Subtracts grams from `prep_item.remaining_grams` and inserts `consumption_log`.

2. **P1**
   - **Profiles:** `person` roles adult/child; `is_fresh` on meals for daughter-style meals.
   - **Nutrition:** Moderate fields on meals + daily totals (kcal/protein emphasis in UI; full macro object in code).
   - **Yield:** `cook_yield_pct` on prep items; Settings screen **raw weight helper** using `rawNeededForCooked`.
   - **Pantry:** Listed on grocery screen; no decrement automation.

3. **P2 (partial)**
   - **Prep mode:** Modal checklist (`PrepModeScreen`).
   - **Home layouts:** Three variants in `settings.homeLayout` (`depletion` | `planner` | `compact`).
   - **“AI” nudges:** Rule-based copy in `buildPrepNudges` (no LLM).
   - **Export:** `Share.share` text export of week meals + grocery (`export/shareWeek.ts`).

## Next / gaps

- **Local notifications:** `expo-notifications` fires when average prep remaining **escalates** (ok→warn or warn→crit) for the same prep run; state stored in `app_setting.depletion_notify_state`. Full behavior needs a **development build** on device (Expo Go shows limited notification support).
- **Planner → grocery:** Week planner meals have a **Shop** button that adds a line to this week’s grocery list (section guessed from title).

- Richer grocery generation from planner (e.g. ingredient lines) and editable pantry quantities.
- Optional cloud sync (out of MVP scope).

## Run

```bash
cd app && npm install && npm start
```

Tests: `cd app && npm test`
