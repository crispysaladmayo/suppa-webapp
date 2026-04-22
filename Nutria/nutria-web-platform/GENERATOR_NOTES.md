# Generator notes

## Implemented

- P0: Session auth, Hari ini summary + consumption log, prep runs/items, meals CRUD, grocery CRUD with IDR total, prep sessions CRUD + ingredients/steps endpoints, full v1 REST, Postgres schema + Drizzle migration, seed script, Indonesian four-tab web shell, structured logging on server and wrapped logger on web (dev-only console output).
- **UX pass:** Tab navigation for prep CTA from home; plan tab without stray AI CTA; meal add form with clear field groups; grocery add/edit with persistent labels, quantity text on create, and per-item edit sheet.
- P1: Pantry CRUD, settings JSON merge, migrations + seed documented.
- P2: Markdown week export (`GET /api/v1/export/week.md`), rule-based AI meal suggestions (`POST /api/v1/ai/meal-ideas`), depletion transition logging on consumption (notification hook placeholder), `docker-compose.yml` for Postgres.

## Known limitations

- **Deploy**: No production Dockerfile in-repo; F16 is satisfied by Compose + runbook in `CONTEXT.md` (Node start + static web build). A real deployment would pin multi-stage images for both services and manage secrets.
- **Integration tests**: Only unit tests for `depletion` and web `week` helpers; no DB-backed HTTP integration suite in CI.
- **Prep session UI**: Web Prep tab starts/ends sessions and can add/list **ingredients** (kg mentah + % susut). **Cook steps** remain API-only (no step editor in UI yet).
- **Grocery aggregation from planner**: Spec mentioned rule-based hints; summary exposes pantry names and open grocery count but does not auto-generate list lines from meals.
- **Rate limit**: Login rate limit is in-memory per process (resets on restart; not suitable for multi-instance without Redis).

## Intentionally deferred

- External LLM for AI suggestions (stub uses pantry heuristics only).
- Real push/email notification providers; only structured log on depletion transition.
