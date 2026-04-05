# Milestone 1 (M1) — Product spec

**Owner:** Alvin  
**Role framing:** CPO-level milestone definition (outcome, scope boundary, stories, exit criteria). Engineering stack is intentionally open.  
**Canonical context:** [`child-nutrition-app-context.md`](./child-nutrition-app-context.md)  
**Product requirements (PO):** [`prd-milestone-1.md`](./prd-milestone-1.md) — journeys, functional requirements, rules, acceptance criteria (research-grounded).  
**Nutrition research input:** [`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md) — informs *targets* in product; app copy must remain non-medical.

---

## Milestone intent

**Working name:** Core loop live (web)

**Outcome:** A caregiver can **onboard a household + child**, **log today’s eating** (food groups + portion → **estimated macros**), **see a Today view** with **approximate macros vs age-band defaults**, **macro gap hints**, **stage-aware nutrient-focus goals** (curated: e.g. vitamin D, iron—see KB), **optional sodium/added-sugar awareness** vs reference bands, and **meal ideas** that match the largest gaps—plus **recipe ideas from fridge ingredients** that **never violate** the child’s stated allergies/dislikes—using **seeded + user-added recipes** (macros + optional **sodium/sugar per serving**, **cook time**, **trending** flag where editorial). They can **plan a weekly meal-prep menu** for the primary child, **share any recipe** as **link / print-friendly PDF path / plain text**, and **record growth measurements** to see a **simple chart vs WHO/CDC reference bands** (non-diagnostic). **Household city/locality** is captured for **place-aware** copy and content—not maps or store finder in M1.

**Strategic pillars (for this milestone)**

1. **Trust & safety** — Allergies and explicit dislikes are **hard filters** for recipe suggestions; **growth** and **sharing** surfaces carry **explicit non-medical** and **privacy** framing.
2. **Clarity** — Today tells a story in seconds; no clinical jargon in the default UI; **honest imprecision** when sodium/sugar data is missing.
3. **Action** — Obvious next steps: **log**, **cook from fridge**, **meal-prep the week**, **share a recipe**, or **add a growth check-in**.
4. **Place-aware food** — City/locality grounds language and future content; M1 stores it and uses it where product can without heavy geo infra.

---

## M1 — In scope (product)

1. **Account & household (minimal)**  
   - Sign up / sign in — **email + password** (M1 PO lock; see [`prd-milestone-1.md`](./prd-milestone-1.md) FR-A1).  
   - One household, one **primary child** profile for M1 scoring (optional other members may exist as **placeholders**; see below).  
   - **Household location (required, M1 PO):** **Indonesia only**—**city or regency** from a **dropdown** (kota/kabupaten list; see [`prd-milestone-1.md`](./prd-milestone-1.md) FR-A3). **Use in M1:** persist, show in Settings, use for **place-aware** copy/tagging where implemented; **no GPS**, no store locator.

2. **Child profile (required)**  
   - Name, age band (align bands with knowledge base: e.g. 0–6 mo, 6–12 mo, 1–2 y, 3–5 y, 6–8 y, 9–11 y, 12 y — exact UX enums TBD).  
   - **Sex assigned at birth** (or equivalent enum: female / male / prefer not to say) — **required for growth chart** when caregiver uses growth features; if “prefer not to say,” growth chart is **disabled** with explanatory copy ([`prd-milestone-1.md`](./prd-milestone-1.md)).  
   - Allergies (structured list, user-maintained).  
   - Preferences + does not like (one simple pattern for M1: tags **or** short text—pick one).  
   - **Reference awareness targets:** default **sodium** and **added sugar** “mindful daily bands” from KB/PRD; caregiver **may adjust** in Settings + **reset to defaults** ([`prd-milestone-1.md`](./prd-milestone-1.md) FR-B5); **not** individualized clinical targets.

3. **Today / dashboard**  
   - **Macro snapshot:** estimated **energy (kcal)** and **protein / carbohydrates / fat (g)** vs **reference defaults** by nutrition row ([`prd-milestone-1.md`](./prd-milestone-1.md) §7.2); **0–5 months** stays **milk-day** mode (no solid macro chart).  
   - **Nutrient focus (curated):** small module for **vitamin D + iron** (and optional **calcium pattern** per KB)—**education and pattern hints**, not full vitamin tracking from logs ([`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md) §Nutrient focus goals).  
   - **Sodium / added sugar awareness (optional rollup):** when recipe or future log data supports it; otherwise **unknown** state—PRD §7.  
   - **1–3 macro gap hints** (“light on…”) when logs support them, plus **Meal ideas:** **gap-matched** when possible; **generic allergy-safe browse** + **Browse recipes** when there are **no logs** or no matches—**never** a dead-end module ([`prd-milestone-1.md`](./prd-milestone-1.md) FR-C5, §7.5). **0–5 months:** **milk mode** only (no solid macro chart); **feed check-in** path, not food-group meal log. **Informational only**; not individualized medical advice.

4. **Meal log**  
   - Manual log: meal/snack + **food-group tags** (required) + **portion** (optional; drives macro estimates) + subject (primary child).  
   - **7-day** history view.

5. **Fridge → recipes**  
   - Ingredients on hand (simple list).  
   - Ranked short list: max overlap with fridge, **exclude** recipes conflicting with allergies/dislikes.  
   - Seeded starter set + user recipes.

6. **User-provided recipes**  
   - Add: title, ingredients, steps, optional tags; **optional** per-serving **kcal, protein, carbs, fat** and **macro emphasis**—required for inclusion in **Today meal ideas**, not required for fridge/browse.  
   - **Optional** per-serving **`sodium_mg`**, **`added_sugar_g`** for awareness rollup when present.  
   - **Cook time:** **`total_minutes`** (and optionally **active_minutes**) — shown on list/detail; supports meal-prep planning.  
   - Included in fridge suggestions when constraints pass.

7. **Recipes browse — trending & share**  
   - **Trending:** editorial **`trending`** flag on seeded recipes (M1 default); surfaced as a **label/section** on the Recipes tab ([`prd-milestone-1.md`](./prd-milestone-1.md) FR-E5).  
   - **Share (recipe only, no child PII):** **(a)** shareable URL to a **minimal public recipe page**; **(b)** **print / PDF** via print stylesheet or export; **(c)** **plain text** copy for messaging apps; **(d)** **revoke** current link (**user recipes** in M1; see [`prd-milestone-1.md`](./prd-milestone-1.md) FR-H5).

8. **Weekly meal prep**  
   - Caregiver builds a **7-day plan** for the **primary child** by assigning **recipes or notes** to days/meals; respects **allergy hard rules** when picking from catalog; optional **prep checklist** / cook-time summary ([`prd-milestone-1.md`](./prd-milestone-1.md) Epic G).

9. **Growth**  
   - Enter **weight**, **length/height**, **date**; plot vs **WHO (0–24 mo)** and **CDC (2–12 y)** reference bands per KB; **non-diagnostic** copy; disclaimer on every view.

---

## M1 — Explicitly out of scope

- Barcode / photo logging; deep grocery API/checkout.  
- **Social feed** or **public recipe marketplace** (UGC discovery by strangers).  
- Native iOS/Android apps.  
- Per-child **clinical** nutrition plans from an RD encoded in-app.  
- Precise GPS, store hours, or delivery integration.  
- **Automated diagnosis** or treatment recommendations from growth or nutrient views.

---

## M1 — Differentiation (one line)

**Wedge:** Child-safety-first recipes + **macro- and nutrient-aware Today** + **weekly meal-prep** + **fridge matching**, with **shareable, dead-simple recipe pages** and **optional growth context**—grounded in **place-aware** food guidance so suggestions aren’t generic-global.

---

## Today view — M1 subject scope (decision for build)

**Default M1:** **Today scores and hints for the primary child only** to avoid half-built multi-member analytics. Optional household members are **data placeholders** for settings/onboarding only unless explicitly expanded in spec.

*If Alvin chooses household-wide Today in M1, revise this section and acceptance tests before build.*

---

## Information architecture (pages)

| Area | Purpose |
|------|--------|
| Landing | Value prop + sign up / log in |
| Onboarding | Household **city/locality** + child profile + allergies / likes / dislikes |
| Home / Today | Macro snapshot, gap hints, meal ideas, quick log CTA |
| Log | Add meal; 7-day history |
| Fridge | Ingredients → suggested recipes |
| Recipes | Browse seeded + mine; **Trending**; **Add recipe**; **Share** |
| Meal prep | **Weekly plan** for primary child (7-day) |
| Growth | **Measurements** + chart (WHO/CDC per age); Settings-linked |
| Settings | Profile, household (incl. city), **sex**, **awareness limits**, sign out |

**UX guardrail:** Mobile-web first—large taps, minimal fields per screen, **one primary action** per view.

---

## High-level user stories (M1)

### Access & trust

1. **As a** caregiver, **I want to** create an account and sign in **so that** my household data stays private.  
2. **As a** caregiver, **I want to** sign out **so that** I’m safe on shared devices.

### Household, place, child

3. **As a** caregiver, **I want to** enter **my city or locality** **so that** food hints and recipes feel relevant to **what I can buy and how we eat here**.  
4. **As a** caregiver, **I want to** set up a household and my child (name, age band) **so that** guidance matches **my child’s stage**.  
5. **As a** caregiver, **I want to** record **allergies** **so that** suggestions stay safe.  
6. **As a** caregiver, **I want to** record **preferences** and **foods they don’t like** **so that** suggestions are realistic.

### Today & guidance

7. **As a** caregiver, **I want** a **Today** summary **with energy and macros (approximate)** **so that** I quickly see how eating is going.  
8. **As a** caregiver, **I want** a few **plain-language macro gap hints** **so that** I know what to prioritize without guilt.  
9. **As a** caregiver, **I want** **meal ideas that help close today’s gaps** **so that** I can act without starting from scratch.  
10. **As a** caregiver, **I want** clear **non-medical** framing **so that** I trust the product’s role.

### Logging

11. **As a** caregiver, **I want to** log meals/snacks with minimal effort **so that** I keep using the app on busy days.  
12. **As a** caregiver, **I want** about **a week** of history **so that** I notice patterns.

### Fridge & recipes

13. **As a** caregiver, **I want to** enter what I have at home **so that** I get **usable** meal ideas.  
14. **As a** caregiver, **I want** suggestions to **respect allergies and dislikes** **so that** I don’t re-check every recipe.  
15. **As a** caregiver, **I want to** **add my own recipes** **so that** family staples appear.  
16. **As a** caregiver, **I want** **trending ideas** flagged on the recipe list **so that** I can try vetted popular options quickly.  
17. **As a** caregiver, **I want to** **share a recipe** as a **link, printable page, or plain text** **so that** family or helpers can cook it without my account details.  
18. **As a** caregiver, **I want** **cook-time estimates** on recipes **so that** I can plan busy nights.  
19. **As a** caregiver, **I want a** **weekly meal-prep plan** tied to my child **so that** shopping and batch cooking are easier.

### Growth & awareness

20. **As a** caregiver, **I want to** log **height/weight** and see **typical-range context** on a chart **so that** I can discuss trends with my pediatrician—without the app diagnosing.  
21. **As a** caregiver, **I want** **sodium and added-sugar awareness lines** for my child’s age **so that** I stay mindful without pretending logs are exact.

### Settings

22. **As a** caregiver, **I want to** update child profile (**including sex for growth**), **city**, and household **so that** the app stays accurate.

---

## Exit criteria (definition of done for M1)

- New user: **onboarding (incl. city + child + sex when growth used) → first log → Today shows macro snapshot + nutrient-focus module where applicable + (when applicable) ≥1 gap hint or meal-idea path → fridge flow returns ≥1 valid recipe** (happy path).  
- **Meal prep:** User can **save a week plan** with ≥1 slot filled; **allergy-violating recipes cannot be added** from catalog per PRD.  
- **Share:** From recipe detail, user can obtain **working share link** (recipe content only), **print-friendly view**, and **plain-text** export.  
- **Growth:** With **sex + ≥2 measurements**, chart renders **percentile band** per PRD/KB; copy includes **non-diagnostic** disclaimer.  
- **QA:** No recipe suggestion that **violates** a user-stated allergy per documented matching rules (conservative handling when parsing is ambiguous).  
- Copy: visible **informational / not medical advice** disclaimer on **Today, fridge, recipes, growth, and share** surfaces.  
- Success **signals** (directional, can be instrumented post-launch): return visits to log; use of **meal prep** or **share**; occasional use of hints/recipes.

---

## Dependencies & open decisions (must close before/during build)

- **M1 nutrition model:** **Locked** in [`prd-milestone-1.md`](./prd-milestone-1.md) §7 (**macro-anchored** + **nutrient focus** + **sodium/sugar awareness** rules). Contribution table + thresholds in **technical spec**; tune with design / optional RD review. **Disclaimer** strategy in PRD §8.4.  
- **Allergy matching** policy for free-text ingredients (enum on profile + conservative algorithm + tests).  
- **Seeded recipes:** licensing/source list; **trending** flags; **cook time**; optional **sodium/sugar** per serving.  
- **Age bands** in UX vs. research bands in knowledge base — map explicitly.  
- **Share URLs:** unguessable token, **no PII** on public page, **revoke** in M1 for **user-owned** recipes ([`prd-milestone-1.md`](./prd-milestone-1.md) FR-H5).  
- **Growth:** WHO vs CDC **chart version** pinned; **measurement units** and **length vs height** UX; legal review of copy.

---

## References (external — nutrition authority)

Listed in [`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md).
