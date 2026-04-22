# Nutria Web Platform — Spec

## Overview

Nutria Web Platform is a **browser-first** household meal companion that matches the **canonical four-tab IA** (**Hari ini**, **Rencana**, **Belanja**, **Prep**) with **Indonesian UI copy**, warm kitchen visual language, and **server-backed persistence**. A single household signs in (lightweight auth), and all prep runs, planner entries, grocery lines, pantry, consumption logs, and settings sync through a **REST API** backed by a **relational database**—so data survives refresh, device change, and redeploy without relying on device SQLite alone.

## Stack

- **Web client:** TypeScript, **React 19**, **Vite**, **React Router**; styling with **CSS modules** or a minimal token layer (no heavy UI kit required).
- **API:** **Node.js** + **Hono** (or Fastify) on **Node**, HTTP JSON REST.
- **Database:** **PostgreSQL** in development via Docker Compose; **SQLite** acceptable as a single-file dev fallback if documented—production target Postgres.
- **ORM / queries:** **Drizzle ORM** (or Prisma) with migrations checked in.
- **Validation:** **Zod** on every API boundary and for client parse of responses.
- **Logging:** Structured **JSON** logs from the server; client uses a small logger that can POST debug bundles in dev only—no raw `console.log` in shared logic.
- **Auth:** **Session cookie** (HTTP-only, SameSite=Lax) or **JWT in httpOnly cookie** after email+password or **single-household demo login** for MVP; rate-limit login route.

## Design Language

- **Mood:** Warm, homey, kitchen-forward—**not** clinical fitness UI.
- **Palette:** Cream surfaces **~`#faf9f5`**, sage/stone gradients **~`#EAE4D6` → `#D8CDB3`**, **terracotta accent ~`#C65D3C`**, deep warm text **~`#2B2620`**, highlights **`#FFFEF9`**. **Belanja:** darker hero panel for totals (per hi-fi). **Prep:** gold-forward card accent for active session.
- **Typography:** **Lora** (Google Fonts) for headings; **system-ui** for dense lists and inputs.
- **Layout:** Four primary tabs fixed bottom or top on mobile width; desktop uses a max-width column with the same IA. **Week strip** on **Hari ini** / **Rencana**; **insight** cards where hi-fi shows them.
- **Density:** Comfortable tap targets; grouped sections on grocery; avoid cramming macro columns on small screens.

## Features

### P0 — Core

- **F01: Auth & household session** — Register/login (or seeded demo user), session persistence, logout. All data scoped to `household_id`.
  - User stories: As a user, I open the web app on a new laptop and still see my prep and planner.
  - Acceptance criteria: Invalid session returns 401 from API; client redirects to login; session survives refresh.

- **F02: Hari ini dashboard** — Prep stock summary, depletion state (comfortable / low / critical), alerts from thresholds, quick links to log consumption and shopping, “makan hari ini” summary, donut or summary consumption widget as in hi-fi.
  - User stories: As a cook, I immediately see whether we are running out of the last prep.
  - Acceptance criteria: Data loads from API; thresholds match settings; empty prep state is explained in UI.

- **F03: Prep runs & items (API + UI)** — CRUD prep runs (active/archived), prep items with cooked grams, remaining grams, cook-yield %; depletion derived from logs.
  - User stories: As a user, I start a new batch and track what is left.
  - Acceptance criteria: Create/edit/archive prep run; adjust remaining grams; validations reject negative or impossible values.

- **F04: Consumption logging** — Log consumption linked to person, prep item, grams, timestamp; list recent logs; updates remaining grams server-side (transactional).
  - User stories: As a user, I log in seconds after a meal.
  - Acceptance criteria: Log creates DB row and updates prep item remainder; undo/delete optional P1.

- **F05: Rencana (weekly planner)** — Week strip, per-day meal cards, slots (breakfast/lunch/dinner/snack), per-person tags, fresh vs prepped linkage, optional notes and macro fields on meals.
  - User stories: As a user, I plan the week for husband, wife, and daughter.
  - Acceptance criteria: Navigate weeks; CRUD meals; data persisted via API.

- **F06: Belanja (grocery)** — List by category, checkboxes, IDR price per unit, running total, manual lines + derived hints from planner/prep (rule-based aggregation MVP).
  - User stories: As a user, I shop once with one list and a credible total.
  - Acceptance criteria: Toggle checked, edit price, total recalculates; persist to DB.

- **F07: Prep mode screen** — Session block: duration or manual start/stop, portions, ingredients with kg and shrinkage, ordered cook steps (ordered list MVP).
  - User stories: As a user, I use Prep tab during the actual cook.
  - Acceptance criteria: Start/end session stored; ingredients list editable; ties optionally to active prep run.

- **F08: REST API completeness** — Versioned routes (e.g. `/api/v1/...`) for persons, settings, prep, consumption, meals, grocery, pantry, prep sessions. OpenAPI or typed client generated from Zod.
  - User stories: As a developer, I can integration-test all entities without the UI.
  - Acceptance criteria: CRUD for each domain; consistent error shape `{ error: { code, message } }`.

### P1 — Important

- **F09: People & roles** — Adults vs child defaults for planner; editable display names; sort order.
  - Acceptance criteria: Planner defaults respect role; API validates role enum.

- **F10: Pantry** — Pantry items, sections, optional qty, price hints; “already have” affects grocery suggestions.
  - Acceptance criteria: Pantry CRUD; grocery UI can reference pantry state.

- **F11: Settings & thresholds** — Low/critical depletion thresholds, preferred home emphasis, locale ID for copy.
  - Acceptance criteria: PATCH settings; Hari ini reacts without reload hack.

- **F12: Postgres migrations & seed** — Idempotent seed for demo household matching current SQLite seed personas (optional).
  - Acceptance criteria: `migrate` + `seed` scripts documented in CONTEXT.md.

### P2 — Nice-to-have

- **F13: Export / share** — Export week + grocery as Markdown or PDF download from web.
  - Acceptance criteria: One-click download; no server file leak of other households.

- **F14: AI meal suggestions (safe)** — Server endpoint calls **Claude** or stub: given pantry + prefs, return **non-binding** meal ideas; user must confirm before writing planner rows.
  - Acceptance criteria: Feature flag; no auto-write; Zod-validated response.

- **F15: Notifications hooks** — Email or web push placeholder interfaces (no full provider required) for “prep low” events.
  - Acceptance criteria: Event logged server-side when threshold crossed; channel can be no-op in dev.

- **F16: Deploy story** — Dockerfile for API + DB; static web build to CDN/GitHub Pages env pointing at API URL.
  - Acceptance criteria: README section with env vars (`DATABASE_URL`, `SESSION_SECRET`).

## AI Features

- **Grocery gap hinting:** Rule-based “you may still need…” from planner + pantry + prep remainder (server or client using API data).
- **Optional Claude suggestions (F14):** Natural-language meal ideas with explicit confirm to apply.

## Out of Scope

- Native iOS/Android wrappers (Expo app remains separate; optional future share same API).
- Multi-household real-time collaboration (single household per account MVP).
- Barcode scanning, branded packaged food database, medical nutrition therapy.
- Automated supermarket checkout integration.
- Replacing GitHub Pages static export in-repo **without** user explicitly requesting removal of current `docs/` flow (web client may live beside or replace later).

---

**Design reference:** `Nutria/product/design-preview.html` and `Nutria/product/SOURCE_OF_TRUTH.md` take precedence over legacy five-tab English app for IA and Indonesian target copy.
