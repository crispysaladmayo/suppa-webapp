# Nutria — Spec

## Overview

Nutria is a **mobile** meal-planning companion for a small household that **batch-preps** food for adults while **cooking fresh daily** for a child. It reduces mental load by tracking **how much of the last prep run is still “in the system,”** surfacing **grocery needs** with **Indonesian-context pricing**, and organizing the week on a **calendar** with **per-person** meal tags and **moderate nutrition** detail. The **home screen prioritizes prep continuity** (depletion risk, restock cues), then **logging consumption** of prepped food, then **entering a “prep mindset”** for the next cook.

## Stack

- **Client:** React Native with **Expo** (single codebase, OTA-friendly), **TypeScript**, **React Navigation** for flows.
- **Local-first data:** **SQLite** (e.g. `expo-sqlite`) or **WatermelonDB** on device for offline-first grocery, planner, and inventory; optional encrypted backup export.
- **Validation:** **Zod** at all boundaries (imports, sync payloads, user-entered quantities).
- **Logging:** Structured **JSON** logs via a small logger wrapper (no raw `console.log` in app code paths).
- **Optional later:** Lightweight sync (e.g. Supabase) — not required for MVP if local-only is acceptable.

## Design Language

- **Mood:** Warm, homey, kitchen/recipe — **not** clinical or “fitness bro.”
- **Palette:** Creamy neutrals — page/surface **~`#faf9f5`**, soft sage/stone gradients (**~`#EAE4D6` → `#D8CDB3`**), **terracotta accent ~`#C65D3C`** for primary actions and alerts; deep warm text **~`#2B2620`**; off-white highlights **`#FFFEF9`**.
- **Typography:** **Lora** (or similar serif) for headings and brand moments; **system UI** for dense lists and inputs (readability for grocery lines).
- **Density:** Comfortable touch targets; grocery and planner screens may scroll — avoid cramming; use **grouped sections** (produce, meat, dairy) with clear headers.
- **Delight:** One or two **small** touches only — e.g. subtle progress celebration when a prep run is “closed” or a calm **prep mode** transition — avoid gimmicks.

## Features

### P0 — Core

- **F01: Prep run & depletion home (primary focus)** — Treat each **batch cook** as a **prep run** with expected portions or total grams per protein/ staple (e.g. chicken patties 250g, minced beef 200g batches). Track **estimated remaining** after **consumption logs** and optional **cooking-yield rules** (see F07). Show **“X% of last prep remaining”** (or days-to-empty heuristic) and **state**: comfortable / low / critical. **User stories:** As a cook, I see whether we’re about to run out of prepped food before the next shop/prep day. **Acceptance:** Home shows last prep run label + depletion indicator; user can set/adjust what “low” means (e.g. under 20% remaining); **alert** (in-app + optional local notification) when crossing threshold.

- **F02: Weekly meal planner (calendar)** — Week view with **breakfast / lunch / dinner / snacks** (or configurable slots). Each entry **tagged to husband / wife / daughter** (and optional “family”). **Adults:** can reference **prepped** items. **Daughter:** defaults to **fresh-cooked** entries; can still attach prepped when relevant. **User stories:** Plan the week without juggling three mental lists. **Acceptance:** Add/edit/delete meals; duplicate day; filter by person; sample ingredients (e.g. corn, green beans) attachable to meals.

- **F03: Smart grocery list** — Aggregates planned meals + prep restock needs into one list. **Group by store section:** produce, meat, dairy, pantry, frozen, other. **Pantry:** mark **already have** (reduces or strikes through). **Estimate total cost in IDR** using **editable default unit prices** (Indonesian context: Rp per kg / per pack / per piece). **User stories:** One list for the market, fewer forgotten items. **Acceptance:** Totals update when items checked or prices edited; sections collapsible.

- **F04: Log consumption (prepped meals — secondary focus)** — Quick flow: **“I ate prepped food”** → pick person, meal type, **linked prep item** (e.g. chicken patty), **quantity** (grams or servings). Updates depletion (F01). **User stories:** Log in seconds so the fridge count stays honest. **Acceptance:** Log appears in history; depletion % updates within one navigation cycle.

### P1 — Important

- **F05: Dual prep model (daughter daily vs adults batch)** — Profiles: **Adult** vs **Child** with defaults (adults → prepped-friendly; child → “fresh today” flag on meals). Weekly planner respects these defaults but allows overrides. **Acceptance:** Daughter’s Thursday lunch can show fresh fish + veg without implying a prep-run deduction unless user links prepped.

- **F06: Moderate nutrition** — Per day and per meal (where data exists): **calories, protein, carbs, fat**, plus **fiber, iron, calcium** (targets optional, not medical). Use **simple food templates** or user-defined items with macro + mineral fields. **Acceptance:** Totals roll up to daily summary; missing data shows as “—” not zeros disguised as real.

- **F07: Cooking yield / weight loss** — For selected proteins (e.g. chicken), apply **default 25–30% cook loss** from raw → cooked weight when planning portions or converting recipes; **user-adjustable** per ingredient. **Acceptance:** Changing yield updates suggested raw purchase weight on grocery list.

- **F08: Pantry inventory (lightweight)** — Optional **on-hand quantities** for staples (egg white, oats, whey, etc.) separate from “this week’s shop”; feeds **F03** (“you may already have X”). **Acceptance:** User can decrement on use or link to consumption log.

### P2 — Nice-to-have

- **F09: Prep mode (tertiary — mindset)** — Short **focus session** before cooking: checklist of this run’s tasks, timer optional, **minimal UI** distraction. Does not replace the planner; **entrances** from home when depletion is low or user starts a **new prep run**. **Acceptance:** User can start/end session; session notes optional.

- **F10: Alternate home layouts** — **2–3** home screen variants (e.g. **depletion-first card**, **planner-first**, **compact stats**) user-selectable in settings. **Acceptance:** Switching layouts preserves data; primary emphasis remains **prep continuity** in default layout.

- **F11: AI-assisted planning (on-device rules + optional LLM later)** — **MVP-safe:** rule-based **suggestions** (e.g. “you usually prep Sunday — schedule grocery Saturday”). **Stretch:** natural-language **meal ideas** from pantry + preferences (**all natural food**, daughter likes veg/fish). **Acceptance:** Suggestions are dismissible and never overwrite without confirm.

- **F12: Export / share** — PDF or text **weekly plan + grocery list** for spouse. **Acceptance:** Share sheet works on iOS/Android.

## AI Features

- **Smart nudges:** Correlate **depletion trajectory** with **historical prep interval** (“Usually you prep again in 2 days”).
- **Grocery gap detection:** Compare planner + pantry + prep run remainder → **“Still need: …”** list.
- **Optional (later):** Conversational **“adjust this week for more fish for daughter”** with explicit apply step — only after core flows are stable.

## Out of Scope

- Medical nutrition therapy, allergy diagnosis, or guaranteed dietary outcomes.
- Full recipe social network or photo-first Instagram-style feed.
- Barcode scanning and branded packaged food database (unless added later).
- Multi-household collaboration with real-time sync (MVP is single device / optional export).
- Automated supermarket e-commerce checkout integration.

---

**Design reference:** Bundled share export `Design/Nutria-share (1).html` — color and typography direction should align; implementation will live under `app/` per harness (separate from the static export).
