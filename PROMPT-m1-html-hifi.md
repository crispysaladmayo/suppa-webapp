# Master prompt — M1 HTML hi-fi prototype

Use this in a **fresh chat**. Attach or `@`-reference these files from the repo:

- [`design-m1-hifi-pages.md`](../design-m1-hifi-pages.md)
- [`prd-milestone-1.md`](../prd-milestone-1.md)
- [`child-nutrition-0-12-knowledge-base.md`](../child-nutrition-0-12-knowledge-base.md)

---

**You are a front-end prototyper.** Build a **mobile-first, static hi-fi HTML prototype** for Milestone 1 of a child nutrition web app.

**Authoritative inputs (read fully and follow; resolve conflicts in this order: design spec > PRD > knowledge base):**

1. `design-m1-hifi-pages.md` — layout, components, states, microcopy, visual tokens, navigation, accessibility §8, component inventory §6 (includes **MacroBar**, **MealIdeaCard**, **macro estimate disclaimer** C7).
2. `prd-milestone-1.md` — scope, safety rules for allergens/dislikes, **macro-anchored nutrition model** §7 (logging → estimates, reference targets, gap hints, meal ideas, recipe macro metadata), non-goals, disclaimers.
3. `child-nutrition-0-12-knowledge-base.md` — tone and constraints: educational framing, no clinical diagnosis, **AMDR/EER** context for defaults, age-stage appropriateness, geography/limitations.

**Deliverables**

- **File set:** `index.html` (landing), separate HTML files **or** one multi-section document with clear screen boundaries — your choice, but every screen in design **§5.1–5.16** must be reachable (links or in-page nav). Include **`styles.css`** with **CSS custom properties** matching design **§2.1–2.3** (e.g. `--bg-page`, `--accent`, typography scale). Optional **`app.js`** only for non-semantic UI: bottom tab highlight, modal/sheet open-close, step indicator — **no** real auth or API.
- **Today (§5.8):** **Hero = macro snapshot** (energy + protein/carbs/fat bars vs reference), persistent **estimate disclaimer**, **≤3 macro gap hints**, **Meal ideas for today** (horizontal scroll cards with **Helps with [macro]** + safe badge). **0–5 mo:** milk-day only — separate page or clear demo note if not built.
- **Log (§5.9):** Food groups + **portion** (default medium); copy explains groups drive **macro estimates**.
- **Recipes / detail / add recipe:** **Macro emphasis** pills; optional **per-serving macros** on add-recipe (collapsible); recipe detail **macro line** when data present.
- **Fridge results (§5.12):** Optional **gap boost** copy and **Helps with…** badge on cards.
- **Fonts:** Load **Fraunces** and **Inter** (e.g. Google Fonts) per design **§2.2**.
- **Layout:** Default viewport **375px** feel; max content width **480px** centered (720px allowed for recipe detail only if spec says so). **16px** outer padding mobile; **44px** minimum touch targets; bottom tab bar for authenticated shell.
- **Visual fidelity:** Match token colors, radii, shadows, chip/pill styles, card elevation from the design doc. **Do not** use alarming clinical red/green for nutrition hints; use **info-soft** / **success-soft** patterns from the spec.
- **Content:** Use **realistic placeholder data** (one demo child, household city/country, a few allergens, sample logs, fridge ingredients, recipe cards with **macro badges**). Allergy **chips** visible on recipe surfaces. **Primary CTA** per screen as specified (e.g. Today: “Log a meal”).
- **Onboarding:** Steps **1–5** with progress indicator, back/skip rules from design **§4.1**.
- **Compliance copy:** Include disclaimer patterns from PRD/design where specified (Today, recipes); wording must align with KB — **never** “deficient,” “diagnosis,” or supplement dosing. Macro numbers are **estimates**.
- **Accessibility:** Semantic landmarks, heading order, visible **focus** styles (`--focus-ring`), sufficient contrast; **macro bars** need text labels (not color alone).
- **Out of scope:** No backend, no real auth, no analytics, no PWA — prototype only.

**Output:** Produce complete file contents (or a minimal tree with paths). Start with `styles.css` variables and one shell page, then add screens in flow order. If anything in the inputs is ambiguous, choose the **conservative/safety-first** interpretation from the PRD and note the assumption in a short `PROTOTYPE-NOTES.md` (optional, max ~15 lines).

---

## Implemented reference build

Open [`index.html`](./index.html) in a browser (mobile width ~375px). Files:

| File | Screen / role |
|------|----------------|
| `index.html` | Landing (§5.1) |
| `auth.html` | Sign up / Log in (§5.2) |
| `onboarding.html` | Steps 1–5 (§5.3–5.7) |
| `today.html` | Today — **macro snapshot**, gap hints, meal ideas (§5.8) |
| `log-add.html` | Log meal (§5.9) |
| `log-week.html` | 7-day history (§5.10) |
| `fridge.html` | Fridge ingredients (§5.11) |
| `fridge-results.html` | Fridge results (§5.12) |
| `recipe-detail.html` | Recipe detail + macro line (§5.13) |
| `recipes.html` | Recipe library + emphasis pills (§5.14) |
| `add-recipe.html` | Add recipe + optional macros (§5.15) |
| `settings.html` | Settings (§5.16) |
| `styles.css`, `app.js` | Tokens + light interactions |
| `PROTOTYPE-NOTES.md` | Assumptions |
| `bmad-review-ar-findings.md`, `bmad-review-ech-findings.json` | BMad AR / ECH on earlier build |
| `m1-bmad-review-ar-macro-redesign.md`, `m1-bmad-review-ech-macro-redesign.json` | Post–macro PRD/design pass |

Regenerate or fork from the prompt above if you prefer a clean pass.
