# Child Nutrition App — Context

**Owner:** Alvin  
**Status:** Draft  
**Last updated:** 2026-04-06

> This is the canonical reference for this project. All decisions, scope, timeline, and ownership live here. Other docs (decks, one-pagers) derive from or link to this file.

**Product / brand name:** **Suppa** — naming extensions (SuppaMom, SuppaRecipe, etc.) and voice rules: [`suppa-brand-framework.md`](./suppa-brand-framework.md).

**GitHub repository:** [https://github.com/crispysaladmayo/suppa](https://github.com/crispysaladmayo/suppa) — canonical remote for this product. **Live static prototype:** GitHub Pages from branch **`main`**, folder **`/docs`** (synced from `m1-hifi-prototype/` via `scripts/sync-prototype-to-docs.sh`). Setup steps: [`GITHUB-PAGES.md`](../GITHUB-PAGES.md) at repo root.

### Design update workflow (Alvin’s default)

When Alvin asks for a **design update** (UX/UI change, new screen, copy/layout tweak tied to the hi-fi spec):

1. **Update the spec** — Edit [`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md) (and PRD [`prd-milestone-1.md`](./prd-milestone-1.md) if behavior or acceptance criteria change).
2. **Update the HTML prototype** — Apply the same changes under [`m1-hifi-prototype/`](./m1-hifi-prototype/) (`*.html`, `styles.css`, `app.js` as needed).
3. **Publish to GitHub Pages** — From the **repo root** (`Alvin Cursor`): run `./scripts/sync-prototype-to-docs.sh`, then `git add` (at least `docs/` and any spec/prototype edits), **commit**, **`git push origin main`** to [crispysaladmayo/suppa](https://github.com/crispysaladmayo/suppa).

The agent should complete this end-to-end unless Alvin says **spec-only** or **no push**.

**PO-first:** Before big design or prototype churn, work through open decisions in [`prd-milestone-1.md`](./prd-milestone-1.md) **§14.1** (ordered queue). Each resolution should flow **PRD → `design-m1-hifi-pages.md` → `m1-hifi-prototype/`** as needed.

**Auth & Today (locked):** Password **min 8**; **forgot password** sends email with one-time link to **reset password** (see PRD FR-A1). **Today** greets **Good [morning|afternoon|evening], mama — [child first name]** (PRD FR-C1); neutral/locale variants backlog.

**Household geography (M1):** **Indonesia only**; **city/regency dropdown** (FR-A3). **0–5 months:** **milk mode**—**feed check-in** only, no solid **meal log**. **Meal ideas:** **generic safe browse** when there are no logs or no gap matches—always a path forward (FR-C5). **Sodium/sugar guides:** **defaults + user-adjustable** in Settings (FR-B5). **Shared recipe links:** M1 includes **revoke** from recipe detail (**FR-H5**); old URLs stop working; **Copy link** mints a new token. **Library** vs **Yours** policy: PRD default—revoke for **user-owned** recipes; see [`prd-milestone-1.md`](./prd-milestone-1.md) §8.5.

---

## Project brief

**Problem:** Caregivers—especially new mothers—carry a heavy mental load: remembering what everyone ate, whether key nutrients are covered, what to buy, and what to cook that is safe and acceptable for a young child. That load shows up as stress, repetitive grocery decisions, and worry about “missing” something important.

**Who it’s for:** Primary caregiver (mom or equivalent) in a household with at least one young child; optionally other adults or children whose nutrition they want to track at a simple level.

**What we’re building:** A **web-first** platform to **log and track** eating patterns, **personalize** guidance (child allergies, likes, dislikes), **surface nutrition gaps** with practical hints, and **suggest recipes** from what’s in the fridge—including **family-added recipes**.

**Why it matters:** When daily nutrition is easier to see and act on, the household can trend healthier with less day-to-day cognitive burden on the caregiver—not as a medical device, but as a **planning and reassurance** companion.

**Success signals (directional):** Users return to log meals; they act on at least one shopping or recipe suggestion per week; child constraints (allergies / dislikes) are never violated by suggestions; qualitative feedback that grocery and meal decisions feel lighter.

---

## Product vision

We envision a world where **every family member** can move toward meeting their **daily nutritional needs** without the caregiver becoming the single bottleneck for remembering, calculating, and improvising.

**North star:** The platform makes **nutrition visible and actionable**—so caregivers see gaps early (e.g. “vitamin A light today”), get **concrete, food-based hints** (e.g. consider carrots or similar), and can turn **what’s already at home** into meals that fit the **child’s profile**.

**Long-term horizon:** Healthier households, **less chronic stress for moms** through shared clarity (not guilt), and a **lighter grocery load** because the product remembers context: who eats what, what to avoid, and what to prioritize.

**Principles**

- **Safety-first personalization:** Allergies and explicit dislikes are hard rules for any recipe or shopping suggestion.
- **Practical over clinical:** Informational guidance and meal planning support—not diagnosis or treatment.
- **Respect the caregiver:** Tone and UX reduce mental load; avoid shame for imperfect logging.
- **Web-first, inclusive:** Excellent experience in the browser; mobile web in scope before native apps.
- **Place-aware food guidance:** Use the household’s **city / locality** to keep shopping hints and recipe language grounded in **regional ingredients and norms** (without turning V1 into maps or store finder).

---

## First version (V1): what the web app looks like

V1 is a **coherent slice** that proves the core loop: **profile → log → see gaps → get one useful next step** (shop or cook). **Full M1 product spec** (user stories, exit criteria, detailed scope): [`milestone-1-spec.md`](./milestone-1-spec.md).

### V1 — in scope (user-visible)

1. **Account & household (minimal)**  
   - Sign up / sign in — **M1:** **email + password** ([`prd-milestone-1.md`](./prd-milestone-1.md) FR-A1 / §14 **Resolved**).  
   - One **household** with a named **child** (age or age band) and optional **other members** as simple profiles (name + role, e.g. “Adult”) for future nutrition targets.  
   - **City or regency (required for V1 / M1):** **Indonesia only** in M1—**dropdown** of kota/kabupaten (see PRD FR-A3)—used to tune **place-aware** suggestions and copy (not precise GPS).

2. **Child profile (required for V1)**  
   - Basic child info (name, age band).  
   - **Allergies** (structured list; user-maintained).  
   - **Preferences** and **does not like** (free text or tags—pick one simple pattern for V1).

3. **Today / dashboard**  
   - **Today’s snapshot (M1):** **Approximate macros** (energy, protein, carbs, fat) from **food-group + portion** logging vs **age-band reference defaults** (see [`prd-milestone-1.md`](./prd-milestone-1.md) §7).  
   - **Nutrient focus:** Curated **vitamin D + iron** (and related pattern hints per KB)—**not** full vitamin tracking from logs.  
   - **Sodium / added sugar awareness:** Reference **mindful daily bands** by age; show **unknown** when data is insufficient.  
   - **Gaps / hints:** 1–3 plain-language **macro** gaps (e.g. “light on protein”) with **no** medical claims.  
   - **Meal ideas:** **Gap-matched** when logs and data support it; otherwise **generic allergy-safe browse** + **Browse recipes** so the module is **never** a dead end (PRD FR-C5).

4. **Meal log (simple)**  
   - Log **meals or snacks** for the child (and optionally household members) with **manual entry**: meal name + rough portion or category; enough to drive the V1 nutrition model.  
   - **History:** last 7 days visible (list or calendar-lite).

5. **Fridge → suggest recipes**  
   - User enters **ingredients on hand** (simple list).  
   - System returns a **short ranked list** of recipes that **respect the child’s allergies and dislikes** and maximize overlap with the fridge list.  
   - Start with a **small seeded recipe set** plus **user-added recipes** (see below).

6. **User-provided recipes**  
   - **Add recipe:** title, ingredients (text or structured list), steps (text), optional tags; **optional per-serving macros + emphasis** for **Today meal ideas** (M1); optional **sodium / added sugar** and **cook time**.  
   - Recipes **created by the user** appear in suggestion results when they match constraints.  
   - **Browse:** **Trending** (editorial flag on seeded recipes).  
   - **Share:** **Recipe-only** link, **print/PDF-friendly** view, **plain text**—no child PII on shared surfaces.

7. **Weekly meal prep (M1)**  
   - **7-day plan** for the primary child; pick safe recipes into meal slots; optional prep summary using **cook times**.

8. **Growth (M1)**  
   - Caregiver-entered **weight / height / date** and **child sex** (for standard charts); **simple chart** vs **WHO/CDC** bands; **non-diagnostic** copy.

### V1 — explicit deferrals (not in first web release)

- Barcode scanning, photo-based logging, or deep third-party grocery integrations.  
- Full clinical-grade nutrient databases or per-user custom RD targets (unless we choose a very thin reference set for demo gaps only).  
- **Social feed** or **public recipe marketplace** (stranger discovery of UGC).  
- Native iOS/Android apps.

### V1 — suggested pages / IA (for design and build)

| Area | Purpose |
|------|--------|
| **Landing** | Value prop + sign up / log in |
| **Onboarding** | Household **city/locality** + child profile + allergies / likes / dislikes |
| **Home / Today** | Macro snapshot (approx.), gap hints, meal ideas, quick log CTA |
| **Log** | Add meal; 7-day history |
| **Fridge** | Ingredients in → suggested recipes |
| **Recipes** | Browse seeded + mine; **Trending**; **Add recipe**; **Share** |
| **Meal prep** | Weekly plan for primary child |
| **Growth** | Measurements + chart |
| **Settings** | Profile (**incl. sex for growth**), household **(incl. city/locality)**, awareness limits, sign out |

### V1 — UX note

Optimize for **speed on mobile web**: large tap targets, minimal fields per screen, and **one primary action** per view (log now, see what to buy, cook from fridge).

---

## Scope (product backlog lens)

### In scope (full product direction; V1 subset above)

- **Household nutrition:** Daily needs and gaps for members the user tracks—not only the child.  
- **Household location:** Caregiver-provided **city or locality** so food-related content stays **regionally relevant** (ingredients, naming, seasonal or cultural defaults as the product matures).  
- **Child profile:** Allergies, preferences, dislikes.  
- **Logging and tracking:** Meals over time (detail evolves after V1).  
- **Personalization:** Targets and suggestions respect profiles.  
- **Fridge → recipes:** Ingredients on hand → child-safe suggestions.  
- **User-provided recipes:** Contribute recipes to the catalog.

### Out of scope (until explicitly brought back)

- Replacing professional medical or dietetic advice.  
- Native apps before web is solid.  
- Full e-commerce checkout (hints and lists only, when we add them).

### Open decisions

- **M1 nutrition model:** **Locked** — macro-anchored Today + food-group logging primitive ([`prd-milestone-1.md`](./prd-milestone-1.md) §7). Broader product may evolve after M1.  
- **Nutrition data source:** M1 uses **reference EER/AMDR defaults** + **fixed contribution table** for logs; recipe macros **manual or batch** on seeded set ([`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md)).  
- **UGC:** Moderation, versioning, attribution (V1 can be “my recipes only” per household).  
- **Geo usage depth:** V1 stores city/locality and uses it for **copy, tagging, and seeded content selection** where feasible; richer behavior (seasonality, store chains, locale-specific RD references) is **post-V1** unless scoped early.

---

## Key decisions

- **Web-first delivery:** Ship in the browser before native clients.  
- **Household + child:** Framing includes family nutrition; child constraints gate recipes and critical hints.  
- **Geographic context:** Caregiver inputs **city/locality** at household level because **food is geographic** (availability, naming, norms).  
- **Owner:** Alvin.

---

## Milestones (no calendar dates)

Milestones are **ordered by intent**, not scheduled to specific dates.

| Milestone | Owner |
|-----------|--------|
| Context + project setup | Alvin |
| M1 web build (see `milestone-1-spec.md`) | Alvin |
| Post-V1: richer logging, data sources, shopping lists | Alvin |

---

## Key risks & constraints

- **Allergies and safety:** Wrong suggestions could harm users; allergy and dislike rules must be enforced rigorously in recipe and shopping logic.  
- **Nutrition accuracy:** Gap detection is only as good as logging and reference data; set user expectations clearly.  
- **Scope creep:** Defer non-V1 features until the core loop is validated.

---

## References

- [Milestone 1 (M1) product spec](./milestone-1-spec.md) — CPO-level scope, stories, exit criteria.
- [PRD — M1 (requirements)](./prd-milestone-1.md) — PO spec: journeys, FRs, rules, acceptance criteria, analytics (research-grounded).
- [M1 hi-fi UX/UI spec](./design-m1-hifi-pages.md) — Visual system, screens, components, copy (from PRD).
- [Child nutrition 0–12 knowledge base](./child-nutrition-0-12-knowledge-base.md) — Research synthesis for age-based targets (not medical advice).
- [Suppa brand framework](./suppa-brand-framework.md) — Master brand, Suppa* naming system, tone, implementation map.
