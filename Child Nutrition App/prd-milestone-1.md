# PRD — Child Nutrition App, Milestone 1 (M1)

**Document type:** Product requirements (what / why). Implementation belongs in the technical spec.  
**Authoring lens:** Product Owner ([`agents/product-owner.md`](../agents/product-owner.md)).  
**Research grounding:** Synthesized with Researcher ([`agents/researcher.md`](../agents/researcher.md)) from [`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md).  
**Strategic alignment:** [`child-nutrition-app-context.md`](./child-nutrition-app-context.md), [`milestone-1-spec.md`](./milestone-1-spec.md), [`suppa-brand-framework.md`](./suppa-brand-framework.md).  
**Customer-facing product name:** **Suppa** (this PRD may still say “child nutrition app” descriptively; UI, marketing, and legal surfaces use **Suppa** per the brand framework).  
**Owner / decision authority:** Alvin (with CPO on scope changes).

---

## Document control

| Version | Date | Author | Notes |
|---------|------|--------|--------|
| 0.1 | 2026-04-05 | PO (draft) | Initial M1 PRD; research-linked. |
| 0.2 | 2026-04-05 | PO | Post–BMad AR/ECH review: country rule, edge cases, privacy stub ([`m1-bmad-review-ar-ech.md`](./m1-bmad-review-ar-ech.md)). |
| 0.3 | 2026-04-05 | PO | **Macro-anchored Today:** age-band energy + macro targets (approximate), logging → estimated macros, gap-driven **meal ideas** from recipe macro data ([`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md) §AMDR reference). |
| 0.4 | 2026-04-05 | PO + CPO alignment | **M1 expansion:** nutrient-focus (vitamin D, iron, calcium pattern), sodium/added-sugar **awareness**, **trending** recipes, **cook time**, **weekly meal prep**, **recipe share** (URL / print / text), **growth chart** (WHO/CDC, user-entered measurements). See [`milestone-1-spec.md`](./milestone-1-spec.md). |
| 0.5 | 2026-04-05 | PO | **Suppa** branding locked for customer-facing copy; linked [`suppa-brand-framework.md`](./suppa-brand-framework.md); hi-fi + prototype aligned ([`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md)). |
| 0.6 | 2026-04-06 | PO | **PO-first queue** §14.1: ordered decisions before design freeze; maps to [`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md) §9. |
| 0.7 | 2026-04-06 | PO | **Q1 Auth locked:** M1 **email + password** sign-up and sign-in (FR-A1). |

---

## 1. Summary

M1 delivers a **web-first** experience where a **primary caregiver** can: create a **household** with **city/locality**, define a **child profile** (age band, **sex for growth features**, allergies, preferences, dislikes, **reference sodium/added-sugar awareness bands**), **log meals** for that child, see a **Today** view with an **approximate macro snapshot** (energy, protein, carbohydrates, fat) vs **age-band defaults**, a **curated nutrient-focus module** (vitamin D, iron, and optional calcium **pattern**—not full vitamin tracking from logs), **optional sodium/added-sugar awareness** when data exists, **up to 3 plain-language macro gap hints**, and **child-safe meal ideas** that help close the largest gaps; run **fridge → recipe** suggestions that **never violate** stated allergies/dislikes; **browse recipes** with **Trending** labels and **cook-time** metadata; **add family recipes** with optional **macros, sodium/sugar per serving, cook time**; **plan a weekly meal-prep menu** for the primary child; **share any recipe** as a **clean public-style page (URL)**, **print/PDF-friendly** output, or **plain text**; and **record growth measurements** to view a **simple chart** vs **WHO/CDC** reference bands (**non-diagnostic**).

The product is **planning and education support**, not a medical device. Copy and behavior must align with **research-backed age stages** (0–12) without **diagnosing deficiency** or **prescribing supplements**. **Numbers are estimates** from coarse logging and reference tables—not individualized clinical targets. **Growth charts** do **not** replace clinical assessment.

---

## 2. Goals & success

### 2.1 Business / product goals

| ID | Goal |
|----|------|
| G1 | Prove the **core loop**: profile → log → Today → actionable hint or recipe path. |
| G2 | Establish **trust** on **child safety**: allergy/dislike rules are **deterministic** for recipe surfacing. |
| G3 | Reduce caregiver **cognitive load** (directional): faster “what matters today” + “what can I cook.” |
| G4 | Support **weekly execution**: meal-prep planning, **shareable recipes**, and **at-a-glance growth context** without claiming medical diagnosis. |

### 2.2 Success metrics (instrument when analytics exist)

| Metric | Type | Definition / note |
|--------|------|-------------------|
| Activation | Funnel | User completes onboarding (incl. city + child + ≥1 allergy field **or** explicit “none known”). |
| Core loop completion | Funnel | Within first session: ≥1 meal logged + Today viewed + ≥1 fridge suggestion **or** hint shown. |
| Return logging | Leading | Sessions with ≥1 new log in days 2–7. |
| Safety QA | Gate | **Zero** P1 bugs: suggested recipe contains user-flagged allergen token (per matching policy). |

### 2.3 Non-goals (M1)

- Clinical diagnosis, lab interpretation, or supplement dosing.  
- Barcode/photo logging; grocery checkout; native apps.  
- **Public recipe marketplace** or **social feed** (stranger discovery of UGC). **Recipe-only sharing** (link / print / text) **is in scope**—see Epic H.  
- GPS, store finder, real-time inventory.  
- Multi-child **scoring** on Today (multiple children may exist later; M1 **primary child** only for Today—see §6).  
- **Corrected-age / prematurity** growth logic unless explicitly added after research sign-off.

---

## 3. Research collaboration (PO × Researcher)

Research **informs** requirements; it does **not** replace clinician judgment. Sources and limitations are documented in [`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md).

### 3.1 User needs ↔ evidence

| User need (from problem statement) | Research insight | PRD response |
|-----------------------------------|------------------|--------------|
| “Am I missing something important?” | Public health emphasizes **dietary pattern** and **energy/macronutrient balance** by life stage—**AMDR** and **EER** are reference bands, not precision without quality intake data ([KB](./child-nutrition-0-12-knowledge-base.md)). | **Approximate** macro snapshot vs age-band defaults + **max 3 macro gap hints** + **meal ideas**; **no** “deficient” or diagnosis language. |
| Infant vs toddler vs child differs | **Under ~6 mo:** milk-focused; **~6 mo+:** complementary feeding, diversity, iron; **2+:** food-group patterns (CDC, WHO, DGA—KB). | **Age-band–aware** Today **modes** (§7.2, FR-C2). |
| Safety (allergies) | Allergen introduction is **individualized**; app must not **prescribe** introduction order (KB). | **User-declared** allergens only; **filter** recipes; **no** “introduce peanut now” automation. |
| Geography | KB notes **U.S.-leaning** DRIs; **Indonesia / other** guidelines may differ. | **City + country** captured; disclaimers; **future** locale packs—M1 may still use **generic** hint library with country **tagging** for copy variants where implemented. |
| Logging is hard | KB **recommends** honest imprecision: coarse inputs should not imply gram-perfect intake. | Log = **meal name + food-group tags (required)** + **optional portion** (small/medium/large); backend applies a **fixed contribution table** to **estimate** macros per log (technical spec). |
| “Vitamins” and minerals | Full micronutrient intake needs **food composition data**; KB defines **curated focus** (vitamin D, iron, calcium **pattern**). | **Nutrient-focus** UI is **educational + stage-aware**; **no** “complete vitamin score” from food-group logs ([KB §Nutrient focus goals](./child-nutrition-0-12-knowledge-base.md)). |
| Sodium / added sugar | DGA/DRI themes support **awareness bands** by age; logs don’t yield label-grade sodium/sugar. | **Defaults** from KB + **optional recipe fields**; **unknown** state when data missing ([KB §Sodium & added sugars](./child-nutrition-0-12-knowledge-base.md)). |
| Growth | WHO/CDC charts are **population references**, not individual diagnoses. | User-entered measurements + **sex**; **non-diagnostic** copy; chart source **versioned** in tech spec ([KB §Growth charts](./child-nutrition-0-12-knowledge-base.md)). |

### 3.2 Explicit research limitations (product must absorb)

1. DRI numbers in KB are **illustrative** and **U.S.-centric** until localized.  
2. **School-age** logging behavior is **under-researched** in our materials—treat 6–12 hints as **hypothesis**.  
3. **Validation:** PRD assumes **follow-up** with pediatric dietitian review of hint templates (KB open questions).

---

## 4. Personas & ICP

### 4.1 Primary persona: **Primary caregiver (Mom / equivalent)**

- **Context:** At least one child **0–12** in household; busy; mobile web.  
- **Jobs:** Feed child safely; reduce “what’s for dinner” stress; feel less guilt about imperfection.  
- **Constraints:** Not a nutrition expert; may have **low logging patience**.  
- **Fears:** Missing allergies; wrong advice; shaming UX.

### 4.2 Secondary (M1 placeholder only)

- **Other household member:** Name + role stored for **future** nutrition; **no** Today scoring in M1.

---

## 5. Product principles (M1 enforcement)

1. **Safety-first:** Allergies + “does not like” **hard-exclude** from fridge suggestions (with conservative ambiguity handling—§8).  
2. **Educational, not clinical:** Disclaimers on **Today, fridge, recipes, growth, share, and meal-prep** surfaces.  
3. **Stage-appropriate:** **Milk-forward** messaging for youngest band; no fake **personalized** micronutrient scores from solids before complementary feeding stage; **nutrient-focus** cards use **education/pattern** framing per §7.7.  
4. **One primary action** per screen (mobile web).  
5. **Honest imprecision:** UI may show **approximate grams and kcal** vs **defaults**, always paired with copy that values are **estimates** from quick logging—not lab/clinical intake. Prefer **“light on [macro] today”** over **deficiency** framing.

---

## 6. Scope decisions locked in PRD

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Today subject | **Primary child only** | Avoid half-built multi-member analytics ([`milestone-1-spec.md`](./milestone-1-spec.md)). |
| Preferences capture | **Free-text fields** for “likes” and “does not like” (max length e.g. 500 chars each) **plus** structured **allergies** | Simplicity; dislikes used as **soft** ranking deprioritization where parseable, else **manual** user judgment. **Allergies remain structured.** |
| Allergies input | **Multi-select** from **curated allergen list** (see §8.1) + optional **“Other”** free text stored but **excludes** recipe unless high-confidence match (conservative) | Balances UX and safety. |
| Nutrition model (M1) | **Macro-anchored** + **nutrient focus** + **sodium/sugar awareness:** same as v0.3 **plus** §7.7–§7.9; **honest unknowns** for sodium/sugar when recipes/logs lack data. | Food groups remain the **logging primitive**; macros are **derived**; micronutrients are **not** fully tracked from logs. |
| Trending recipes | **Editorial** `trending` boolean (or tag) on **seeded** recipes for M1; **no** social proof metrics required at launch. | Predictable UX; analytics can inform later. |
| Recipe share | **Recipe content only** on public/share surfaces—**no** child name, allergies, household, or Today data. | Privacy and trust. |
| Growth | **Manual** weight/height/length + date; **WHO 0–24 mo** vs **CDC 2–12 y** per KB; **sex** required for chart. | Non-diagnostic positioning only. |

---

## 7. M1 nutrition model (requirements-level)

### 7.1 Food groups (logging input; drives macro estimates)

Caregiver tags each log line with **one or more** of: `vegetables` · `fruits` · `grains` · `protein` · `dairy_or_fortified_soy` · `other` (`other` does not contribute to macro estimation beyond a minimal “other” bucket if defined in tech spec, or zero—pick one and document).

**Per-log estimation:** Given selected groups + **portion** (small | medium | large), the system assigns **estimated kcal, protein (g), carbohydrates (g), fat (g)** using a **fixed household contribution table** (versioned in technical spec). Same meal logged by two users yields the same estimate—no ML in M1.

**Research link:** Pattern emphasis (DGA / MyPlate, complementary feeding) remains in KB; macro **targets** use **EER / AMDR** bands as **defaults** ([KB §AMDR reference](./child-nutrition-0-12-knowledge-base.md)).

### 7.2 Today modes and reference targets (by nutrition row)

**Nutrition rows** (map UX age bands to exactly one row; same rule as prior PRD—e.g. 3–5 / 6–8 / 9–11 / 12 y → **child_3_12**):

| Row ID | Child stage (PRD) | Today UI | Reference daily energy (kcal, **default midpoint**) | Macro targets (g/day, **AMDR-derived midpoints** at that energy) |
|--------|-------------------|----------|-----------------------------------------------------|-------------------------------------------------------------------|
| **infant_0_5** | 0–5 months | **Milk day** — no solid macro chart; optional milk check-in | N/A for solids | N/A |
| **infant_6_12** | 6–12 months | Macro snapshot **includes complementary foods only**; copy clarifies milk not fully modeled unless extended in tech spec | **800** (illustrative; tunable) | Protein **15** · Carbs **95** · Fat **30** (example set—**technical spec** aligns to KB table) |
| **toddler_1_2** | 1–2 years | Full macro snapshot | **1000** | **19** · **119** · **37** |
| **child_3_12** | 3–12 years (all UX sub-bands) | Full macro snapshot | **1600** (single M1 default for span; optional sub-split later) | **30** · **190** · **53** |

**Note:** Numeric cells are **product defaults** for engineering—not individualized medical prescriptions. **Localization** (country-specific EER) is **post-M1** unless PO promotes earlier; until then, disclaimers reference **approximate U.S.-style reference bands**.

**UX age bands → row:** Document full enum mapping in technical spec (must match [`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md) onboarding).

### 7.3 Daily rollup

- **Scope:** Sum estimated macros for **all logs for the primary child** on the **calendar day** in the user’s timezone (or browser-local if server TZ undefined—pick one in tech spec).  
- **Display:** Today shows **progress toward** reference **kcal** and each macro (bars, rings, or row—design spec). **Percent of target** is allowed if copy states **approximate**.

### 7.4 Macro gap hints (max 3)

- **Eligibility:** Compare rolled-up estimates to §7.2 targets; identify **shortfall** per macro (kcal, protein, carbs, fat). Rank by **relative gap** (e.g. largest % below target first).  
- **Cap:** Show **at most 3** hint cards.  
- **Wording:** **“Today looks light on [protein / carbohydrates / overall energy / fat].”** Optional one-line food examples. Never **“deficient,” “too low clinically,”** or diagnosis.  
- **No logs today:** Do **not** fabricate personalized macro gaps—use **empty state** + optional **stage-only education** (§9.2).

### 7.5 Meal ideas (gap-driven)

- **Source:** **Seeded** recipes **must** have: per-serving **`kcal`, `protein_g`, `carb_g`, `fat_g`** (authoritative entry or batch from one nutrition dataset) and **`macro_emphasis`** ∈ { `protein`, `carbs`, `fat`, `balanced` } (≥1). **Seeded** recipes **should** include **`total_minutes`** (total cook time), optional **`active_minutes`**, optional **`sodium_mg_per_serving`**, **`added_sugar_g_per_serving`**, and **`trending`** (boolean—editorial).  
- **User recipes:** **Optional** same fields; if missing, recipe **excluded** from macro-matched meal ideas (may still appear in fridge/browse).  
- **Matching:** For each **top macro gap** (up to **2** gaps used for ideas), select up to **3** recipes total (deduped) that: (1) pass **allergy hard filter**, (2) **`macro_emphasis`** matches the gap macro **or** `balanced` when gap is energy, (3) **soft** deprioritize dislikes.  
- **Placement:** **Today** shows a **Meal ideas for today** module linking to recipe detail; **Fridge results** may **boost** rank when a recipe both matches fridge **and** addresses a **current-day gap** (optional M1 enhancement—if not built, meal ideas remain Today-only).

### 7.6 Optional secondary education (not counted in 3 gap hints)

- **At most 1** rotating **food-pattern** card (e.g. iron-rich foods for 6–12 mo) may appear **below** macro content, **only when** fewer than 3 macro hints fired—**PO toggle** in content config. Default M1: **off** to reduce noise (nutrient-focus module §7.7 **supersedes** this for M1 when enabled).

### 7.7 Nutrient focus goals (“vitamins” / minerals — curated)

- **Purpose:** Surface **stage-aware** **vitamin D**, **iron**, and optional **calcium pattern** guidance aligned to [`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md) §Nutrient focus goals—**not** a complete multivitamin tracker.  
- **Placement:** **Today** shows a compact **Nutrient focus** block **below** macro snapshot for bands where applicable (**infant_0_5:** optional short vitamin D / milk education only—**no** “gap from logs”; **infant_6_12+:** iron + vitamin D emphasis with age-appropriate copy).  
- **Wording:** **Education + food examples + “ask your pediatrician”** for supplements; never **“deficient”** or dosing.  
- **Independence:** Does **not** consume the **3 macro gap hint** budget (§7.4).

### 7.8 Sodium and added sugar (awareness)

- **Reference defaults:** Product loads **age-band default daily awareness lines** for **sodium (mg/day)** and **added sugar (g/day or qualitative under 2)** from KB + technical spec (versioned tables). **Added sugar (2+):** derive illustrative **g/day cap** as **~10% × (that child’s §7.2 reference kcal) ÷ 4** (DGA theme)—e.g. **1000 kcal** → ~**25 g**, **1600 kcal** → ~**40 g**. **Under 2:** qualitative only unless locale dictates otherwise.  
- **Profile:** Caregiver sees **child’s current reference lines** in Settings with explanation; **optional M1:** allow **±20% user adjustment** of displayed line **only** with clear “not medical advice” friction—**or** read-only defaults (**open**—pick one before build).  
- **Rollup (partial):** If **logged meals** link to **recipes with** `sodium_mg_per_serving` / `added_sugar_g_per_serving` **or** future portion mapping, show **rough day tally** vs line; otherwise show **“Not enough recipe detail to estimate today”** for that nutrient. **Never** imply precision from food-group-only logs.  
- **Recipes:** Fridge/Today surfaces may show **per-recipe** sodium/sugar when fields exist.

### 7.9 Cook time & trending (metadata)

- **`total_minutes`:** Required on **seeded** recipes for M1 browse UX; **optional** on user recipes. Display on **list + detail**; **Meal prep** may sum selected recipes for **rough** weekly load (informational).  
- **`trending`:** **Editorial** flag on seeded recipes; **Recipes** tab shows **Trending** section or badge (design spec).

---

## 8. Business rules & policies

### 8.1 Curated allergen list (M1 minimum)

`milk` · `egg` · `peanut` · `tree_nuts` · `wheat` · `soy` · `fish` · `shellfish` · `sesame` — align labels with copy deck; **“Other”** as free text with conservative matching.

### 8.2 Recipe exclusion (allergies)

- Recipe is **ineligible** for suggestions if **any** ingredient line matches a child **selected** allergen per **matching policy** (technical spec: normalization, synonyms, substring rules).  
- If parser **uncertain**, **exclude** recipe (prefer **false negatives** in results over unsafe inclusion—**Architect** documents algorithm).

### 8.3 “Does not like”

- **Soft:** Deprioritize recipes whose **title or tags** contain dislike phrase **if** match is exact case-insensitive substring; **do not** guarantee removal (user may still open full list with badge).

### 8.4 Disclaimers (visible)

- Short text on **Today**, **Fridge results**, **Recipes**, **Meal prep**, **Growth**, **shared recipe page**, and **first onboarding** completion: informational only; not medical advice; consult pediatrician/RD for health concerns.  
- **Growth-specific:** Chart is based on **standard population references** and **caregiver-entered measurements**; **not** a diagnosis; **errors in entry** can misplace the point.

### 8.5 Recipe sharing & public page (privacy)

- **Share link** resolves to a **recipe-only** view: title, ingredients, steps, optional cook time, optional per-serving nutrition—**no** authentication wall required for **read** (implementation may use **unguessable token** in URL).  
- **Must not** include: child name, age, allergies, household location, Today data, or account identifiers.  
- **Revocation:** **Open**—ideal: user can **rotate/invalidate** share token from recipe detail (**Architect**); if not M1, document limitation.

### 8.6 Data (product-level)

- One **household** per account for M1 (unless product later allows multi—**out of scope**).  
- User can **edit** city, child profile, logs (add only or add+delete within 7-day window—**recommend** delete within 24h to reduce abuse; **open**—pick one in build).  
- **Growth measurements** stored per **primary child**; **export/delete** policy in tech spec and privacy policy.

---

## 9. User journeys

### 9.1 Happy path — new caregiver

1. Lands on marketing **Landing** → Sign up.  
2. **Onboarding:** **city** + **country** per FR-A3 (either combined free-text or separate controls—one pattern for M1), child **name**, **age band**, **sex** (female / male / prefer not to say) for growth features, **allergies** (multi-select + other), **likes** / **does not like** (optional text). **Reference sodium/added-sugar awareness lines** applied from defaults (visible in Settings).  
3. Directed to **Today** (empty state: “Log a meal to see today’s picture”).  
4. **Log** first meal with food-group tags + optional portion.  
5. **Today** updates **macro snapshot** + **nutrient-focus** block (§7.7) + **sodium/sugar awareness** when estimable + **≤3 macro gap hints** (when estimable) + **meal ideas** when eligible recipes exist.  
6. **Fridge:** enters ingredients → sees **ranked** safe recipes (seeded + own); optional **gap boost** per §7.5.  
7. **Recipes:** browses **Trending**; opens detail → **Share** (link / print / text); adds family recipe → appears in fridge/browse; **meal ideas** only if macro fields provided.  
8. **Meal prep:** builds **this week’s plan** by placing **safe** recipes into day/meal slots; saves plan.  
9. **Growth:** enters **weight + length/height + date** → chart shows point vs **typical band** with disclaimer.

### 9.2 Edge cases

| Scenario | Expected behavior |
|----------|-------------------|
| No logs today | Today shows **empty state** + CTA to log; **no** personalized macro gaps or fake zeros; optional **gentle** stage education only. |
| All macros near target | Show **positive** framing (“Nice variety today”) or hide gap cards; still allow **browse meal ideas** link. |
| User recipe without macros | **Exclude** from Today **meal ideas**; **include** in fridge/all-safe lists. |
| Energy target N/A (0–5 mo) | **Milk-day** UI only; no solid macro chart. |
| All recipes filtered out | Fridge page: **“No matches—try fewer ingredients or update profile.”** |
| User selects no allergies | Treat as **empty set**; still show disclaimer. |
| “Other” allergen text causes many exclusions | Fridge / recipe surfaces: short **explainer** that extra text is matched **carefully** and may hide recipes—link to profile edit; never imply a bug. |
| Second device or session expiry mid-onboarding | **Define in tech spec:** resume from server state **or** restart onboarding; must not create **duplicate** incomplete households without detection. |
| Child **0–5 mo** | Today **milk-day** mode; **no** food-group scoring from solids. |
| Logout mid-onboarding | Resume onboarding or **discard** partial—**open**; minimum: cannot access app data without auth. |
| **Sex = prefer not to say** | **Growth chart** disabled; Settings explains **why**; no empty broken chart. |
| **No sodium/sugar on recipes** | Today/rollup shows **unknown** or hides tally—never fake zeros. |
| **Share URL opened by stranger** | Sees **recipe only**; **no** login required; **no** child/household data (§8.5). |
| **Meal prep: user picks allergic recipe** | **Blocked** when adding from catalog if recipe **fails** allergy policy; manual text slots **allowed** with **safety reminder** (design copy). |
| **Unit mismatch (kg vs lb)** | Growth entry uses **explicit unit control** + validation; conversion in tech spec. |
| **Single growth point** | Chart shows **point** with copy that **trend needs multiple visits** + clinician context—or empty-state per design. |

### 9.3 Journey — share recipe (returning user)

1. Opens **Recipe detail** (seeded or own).  
2. Taps **Share** → sheet: **Copy link** (opens **minimal recipe page** in browser), **Print or save as PDF** (print stylesheet), **Copy recipe text** (plain ingredients + steps).  
3. Recipient opens link → **read-only** recipe page (**large type**, **simple layout** for novice cooks—design spec §5.x); **no** account data.

---

## 10. Functional requirements

### Epic A — Authentication & household

| ID | Requirement |
|----|-------------|
| FR-A1 | User can **sign up** and **sign in** with **email and password** (hashing, validation, rate limits, and **forgot-password / reset** timing in technical spec—**self-service reset** may ship **M1.1** if M1 is scope-tight). |
| FR-A2 | User can **sign out** and session ends. |
| FR-A3 | User can create **one household** with **city** (required) and **country**. **If** the UI presents a **country** control (dropdown or required field), **country is required** for that flow; **if** M1 ships **city + free-text “City, country”** only, **country** is satisfied by that field and a separate control may be omitted—pick one pattern before build and keep analytics consistent. |
| FR-A4 | User can add **optional** household members (name, role) **stored only**—no scoring in M1. |

### Epic B — Child profile

| ID | Requirement |
|----|-------------|
| FR-B1 | User can create/edit **primary child**: name, **age band** enum aligned to §7.2 **nutrition row mapping**. |
| FR-B2 | User can set **allergies** via §8.1 + optional other text. |
| FR-B3 | User can enter **likes** and **does not like** as optional text. |
| FR-B4 | User can set child **sex** as **female**, **male**, or **prefer not to say** (required field with third option). **Growth chart** (Epic I) is **available only** when sex is **female** or **male** (standard reference charts). |
| FR-B5 | System applies **default sodium and added-sugar awareness lines** per age band (§7.8); user can **view** them in Settings; **optional override** per §7.8 open decision. |

### Epic C — Today

| ID | Requirement |
|----|-------------|
| FR-C1 | **Today** reflects **primary child** only. |
| FR-C2 | **Today** uses **mode** per §7.2 (`infant_0_5` vs macro snapshot bands). |
| FR-C3 | For applicable bands, show **macro snapshot** (estimated intake vs §7.2 **reference targets**) with **estimate disclaimer** always visible on first expand or persistent subline—design spec. **Milk check-in** for 0–5 mo; **no** solid macro chart. |
| FR-C4 | Show **0–3 macro gap hints** per §7.4 with disclaimer component. |
| FR-C5 | Show **Meal ideas for today** per §7.5 when ≥1 eligible recipe exists; **empty state** when none (explain: log more, or add recipe macros). |
| FR-C6 | Show **Nutrient focus** module per §7.7 for applicable age bands; **omit or simplify** for **infant_0_5** per KB. |
| FR-C7 | Show **sodium / added sugar awareness** per §7.8: either **rollup** when data supports it or **explicit unknown** state—**no** false precision. |

### Epic D — Meal log

| ID | Requirement |
|----|-------------|
| FR-D1 | User can add **meal or snack** for primary child: label + **≥1 food group** tag + **optional portion** (small/medium/large). **At least one** tag must **not** be `other` alone (`other` may be selected with real groups). Portion affects **macro estimates** (default **medium** if unspecified—document in tech spec). |
| FR-D2 | User can view **last 7 days** of logs (list). |
| FR-D3 | Logs **drive** Today **macro rollup** for that day. |

### Epic E — Fridge & recipes

| ID | Requirement |
|----|-------------|
| FR-E1 | User can enter **multiple fridge ingredients** (free text list). |
| FR-E2 | System returns **ordered list** of recipes: **exclude** allergy conflicts (§8.2); rank by fridge overlap; **soft** deprioritize dislikes (§8.3); **optional:** boost recipes that address **current-day macro gap** (§7.5). |
| FR-E3 | System includes **seeded** recipes (count TBD by content), each with **macro profile + macro_emphasis** per §7.5, **`total_minutes`** (required seeded), optional **`active_minutes`**, optional **`sodium_mg_per_serving`**, **`added_sugar_g_per_serving`**, **`trending`** (editorial boolean), + **user recipes** for that household. |
| FR-E4 | User can **CRUD** (minimum: create + list + view; edit/delete **nice-to-have** M1) **own recipe**: title, ingredients, steps, optional tags, **optional** per-serving **kcal, protein_g, carb_g, fat_g**, **`macro_emphasis`**, **`total_minutes`**, **`active_minutes`**, **`sodium_mg_per_serving`**, **`added_sugar_g_per_serving`**. |
| FR-E5 | **Recipes** list shows **Trending** section and/or **Trending** badge on cards when `trending` is true (seeded). |
| FR-E6 | **Recipe detail** displays **total cook time** (and **active** when present) per §7.9. |

### Epic F — Settings

| ID | Requirement |
|----|-------------|
| FR-F1 | User can edit **household city/country**, child profile (**including sex**, FR-B4), **awareness lines** (view; edit if override allowed), **sign out**. |

### Epic G — Weekly meal prep

| ID | Requirement |
|----|-------------|
| FR-G1 | User can open **Meal prep** and see a **7-day** planner for the **primary child** (columns or list per design). |
| FR-G2 | User can **assign** a **recipe** from the safe catalog to a **day + meal slot** (e.g. lunch); system **blocks** assignment if recipe **violates** §8.2 for that child. |
| FR-G3 | User can add **free-text slot notes** (e.g. “leftovers”) without a recipe—**not** allergy-checked beyond copy warning. |
| FR-G4 | User can **clear** a slot or **reset week** (confirm destructive action—design). |
| FR-G5 | Planner shows **optional summary**: **count of dinners**, **approx total cook minutes** from assigned recipes when `total_minutes` present (informational). |

### Epic H — Recipe sharing

| ID | Requirement |
|----|-------------|
| FR-H1 | From **recipe detail**, user can **generate or copy** a **share URL** that loads a **minimal read-only recipe page** (§8.5)—recipe fields only. |
| FR-H2 | User can **print** or use **browser print to PDF** from that page via **print-optimized layout** (technical spec: dedicated route + print CSS). |
| FR-H3 | User can **copy plain text** recipe (title, ingredients, steps, optional times) to clipboard for messaging apps. |
| FR-H4 | Shared page includes **disclaimer** footer (§8.4) and **no** authenticated app chrome. |

### Epic I — Growth

| ID | Requirement |
|----|-------------|
| FR-I1 | When child sex is **female** or **male**, user can **add** growth entry: **date**, **weight** (value + unit), **length or height** (value + unit), **measurement type** (recumbent length vs standing height) per age UX guidance. |
| FR-I2 | User can **view list** of past entries and **simple chart** plotting measurement vs **WHO (0–24 mo)** or **CDC (2–12 y)** reference curves per KB—**implementation pins** chart version in tech spec. |
| FR-I3 | UI shows **band / percentile context** in **non-diagnostic** language (e.g. “near typical range on this chart”)—exact copy in design deck; **never** output clinical labels (failure to thrive, obesity, etc.). |
| FR-I4 | **Growth** entry points from **Settings** or **bottom nav / overflow** per design—discoverable without cluttering Today. |

---

## 11. Acceptance criteria (representative Given/When/Then)

### Epic B — Allergies

- **AC-B1:** Given a child with allergy **peanut**, When user opens **Fridge** suggestions, Then **no** recipe whose ingredient list matches peanut per policy appears in results.  
- **AC-B2:** Given **no** allergies selected, When user views suggestions, Then all **non-dislike** recipes may appear subject to fridge overlap.

### Epic C — Today

- **AC-C1:** Given age band **0–5 months**, When user opens **Today**, Then UI **does not** show **solid macro chart** or personalized macro gaps.  
- **AC-C2:** Given age band **1–2 years** (or any macro row) and logs that yield **protein estimate** **below** reference target by policy threshold, When Today loads, Then **≥1** macro hint references **protein** in plain language **or** meal ideas include **protein**-emphasis recipes when catalog exists.  
- **AC-C3:** Given **no logs** today, When Today loads, Then **no** fabricated macro gap numbers; empty state per §9.2.  
- **AC-C4:** Given eligible seeded recipes exist for a gap, When Today loads, Then **Meal ideas** shows **≥1** card **or** explicit empty state with reason.  
- **AC-C5:** Given age band **6–12 months** or older macro row, When Today loads, Then **Nutrient focus** shows **≥1** education card (vitamin D and/or iron pattern per §7.7) **or** explicit empty/disabled state per stage.  
- **AC-C6:** Given **no** recipe sodium/sugar data for the day, When Today loads, Then sodium/sugar line shows **unknown / not enough data**—**not** a numeric rollup implied from food groups alone.

### Epic D — Log

- **AC-D1:** Given user submits meal without food group, When save, Then show **validation** (require ≥1 group except **0–5 mo** milk check-in path if used).  
- **AC-D1b:** Given user selects **only** `other`, When save, Then show **validation** (require at least one non-`other` group).  
- **AC-D2:** Given user saves meal with groups + portion, When Today refreshes, Then **rollup** changes to reflect **new estimates** (deterministic per contribution table).

### Epic E — Fridge

- **AC-E1:** Given fridge ingredients **chicken, rice**, When suggestions run, Then top results **prefer** overlap and **exclude** allergens.  
- **AC-E2:** Given **zero** eligible recipes, When results render, Then show **empty state** message (§9.2).  
- **AC-E3:** Given a **user** recipe with **no** macro fields, When **Meal ideas** runs, Then that recipe **does not** appear in macro-matched ideas (may still appear in fridge/browse).  
- **AC-E4:** Given ≥1 seeded recipe has **`trending: true`**, When user opens **Recipes**, Then **Trending** section or badge appears on those items.  
- **AC-E5:** Given recipe has **`total_minutes`**, When user opens **Recipe detail**, Then cook time is **visible** on screen.

### Epic G — Meal prep

- **AC-G1:** Given child has allergy **milk**, When user assigns a recipe containing milk per §8.2 to a slot, Then assignment is **blocked** with clear message.  
- **AC-G2:** Given user saves **≥1** slot, When reopening **Meal prep**, Then plan **persists** (server state—tech spec).

### Epic H — Share

- **AC-H1:** Given user taps **Share → copy link**, When a logged-out user opens the URL, Then they see **recipe content only** and **no** child or account fields.  
- **AC-H2:** Given shared page, When user invokes **browser print**, Then layout is **readable** (large type, minimal chrome) per design §5.16.

### Epic I — Growth

- **AC-I1:** Given child sex is **prefer not to say**, When user opens **Growth**, Then chart is **unavailable** with explanation—not a blank chart.  
- **AC-I2:** Given sex is **female** and **≥1** measurement saved, When Growth loads, Then chart renders **without** diagnostic disease labels.

---

## 12. Analytics & events (M1)

Define in implementation; **minimum event names** for funnel:

| Event | Properties (examples) |
|-------|----------------------|
| `signup_complete` | — |
| `onboarding_complete` | `age_band`, `has_allergy`, `country` (if collected) |
| `meal_logged` | `food_groups_count`, `age_band`, `portion` |
| `today_viewed` | `macro_hints_shown_count`, `meal_ideas_shown_count` |
| `meal_idea_tap` | `macro_emphasis`, `recipe_source` |
| `fridge_suggest_run` | `ingredient_count`, `results_count` |
| `recipe_view` | `source_seed|user`, `has_cook_time`, `trending` |
| `trending_section_view` | `recipe_count` |
| `recipe_share` | `format` ∈ `link`, `print`, `text` |
| `mealprep_week_saved` | `slots_filled`, `approx_total_minutes` |
| `growth_entry_added` | `age_band` |
| `growth_chart_viewed` | `point_count` |

---

## 13. Non-functional requirements (product-facing)

| ID | NFR |
|----|-----|
| NFR1 | **Mobile web usable** on common phone widths (320px+); primary actions reachable with thumb. |
| NFR2 | **Accessibility:** **WCAG 2.2 Level AA** target for M1 web per hi-fi spec; text resizable; document any scoped-down exception in tech spec. |
| NFR3 | **Performance (UX):** Today and Fridge results feel fast on a typical connection (target **under ~3 seconds** perceived for M1 demo; engineering validates). |
| NFR4 | **Child-related data:** Collect **minimum** PII; document retention and jurisdiction-appropriate posture (e.g. COPPA/GDPR) in tech spec and privacy policy—**no** precise DOB required in M1 if age band suffices. **Growth measurements** are sensitive—document purpose limitation and deletion. |
| NFR5 | **Public recipe URLs:** Mitigate **enumeration** (unguessable tokens); **noindex** default for share pages unless marketing decides otherwise (tech spec). |

---

## 14. Open questions (PO / Alvin)

**Already locked (do not reopen without CPO):** Customer-facing product name **Suppa** ([`suppa-brand-framework.md`](./suppa-brand-framework.md)); PRD v0.5.

### Resolved (PO)

- **Q1 — Auth (M1):** **Email + password** for **sign up** and **sign in**. **Not in scope for M1:** magic-link–only flows, OAuth/social login as the **only** path (either may be added later as **additional** options). Implementation details (hashing, rotation, lockout, **forgot-password** UX) live in the **technical spec**; minimum shippable bar is **working credential sign-up and sign-in**.

### Open

2. **Log edit/delete:** Policy for correcting mistakes.  
3. **Seeded recipe count** and **licensing** owner.  
4. **Country list** vs free-text only for M1.  
5. **Bahasa Indonesia** copy wave: in M1 or M1.1?
6. **Account display name:** If Today greets the caregiver by name, define source (e.g. **name on signup** vs **household member**) or use **generic greeting** only.  
7. **Sodium/sugar lines:** Read-only defaults vs **caregiver-adjustable** band (§7.8)—decide before build.  
8. **Share token:** **Rotate/revoke** link in M1 or defer to M1.1?  
9. **Meal prep ↔ Log:** Auto-suggest “log this recipe” from plan—M1 or later?  
10. **WHO/CDC chart transition** at 24 mo: exact UX (switch chart type vs single continuous view)—align with pediatric norms + engineering spike.

### 14.1 PO-first resolution order (before design freeze)

Work **top to bottom**. Record each answer inline above (edit the numbered item) or in a dated one-line note under §15 Assumptions. Then update [`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md) §9 / §5 and the HTML prototype per the context file’s design workflow.

| Order | PO question (§14) | Why first | Design spec touchpoint ([`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md)) |
|------:|-------------------|-----------|-------------------------------------------------------------------------------------|
| 1 | ~~**Q1 Auth**~~ **Resolved** | Email + password — FR-A1 | §5.2 Sign up / Log in |
| 2 | **Q4 Country** | Locks FR-A3 + onboarding validation | §5.3 Household place |
| 3 | **Q6 Display name** | Locks Today greeting (FR-C1) | §5.8 Today |
| 4 | **0–5 mo logging** (PRD journeys + AC-C1) | Locks milk mode vs meal log | §5.8 milk mode; §5.9 Log — *tie to Q1 if “feed” is separate flow* |
| 5 | **Meal ideas when no logs** | Picks empty-state behavior for meal ideas | §5.8 empty state (issue §9.9) |
| 6 | **Q7 Sodium/sugar** | Settings + Today awareness UX | §5.19 Settings; §5.8 awareness row (issue §9.13) |
| 7 | **Q8 Share token** | Scope for recipe detail + public page | §5.13 Share sheet; §5.16 (issue §9.12) |
| 8 | **Q2 Log edit/delete** | Support + abuse boundary | §5.10 Log history; tech spec |
| 9 | **Q10 WHO/CDC** | Growth chart UX | §5.18 Growth (issues §9.10–9.11) |
| 10 | **Q3 Seeded recipes** | Content plan, not blocking first UI pass | Epic E / content pipeline |
| 11 | **Q5 Bahasa** | Locale scope vs §15 assumption | §9.6; copy deck §7 |
| 12 | **Q9 Meal prep → Log** | Nice-to-have vs M1 scope | §5.17 Meal prep |
| — | **Fridge input (chips vs comma)** | Eng + UX tradeoff | §5.11 — resolve with Architect after Q1–Q4 |
| — | **Gap threshold %** | Product tuning | §5.8 hints — default in tech spec with PO visibility |
| — | **Age band → nutrition row mapping** | No silent logic | §5.4 + PRD §7.2 — Architect confirms table |
| — | **Landing headline** | Marketing polish | §5.1 — after Suppa wordmark (issue §9.1) |
| — | **Illustrations** | Asset plan | §5.1 empty states — issue §9.5 |

**PO sign-off gate (before “design done”):** Approve copy **C1–C14** and screen list in [`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md) §10 handoff checklist.

---

## 15. Assumptions

1. **Single locale** (English) for M1 unless Alvin decides otherwise.  
2. **One child** per household is dominant; multi-child is **post-M1**.  
3. **Research KB** will receive **Indonesia** supplement before marketing ID heavily.

---

## 16. References

- [`child-nutrition-app-context.md`](./child-nutrition-app-context.md)  
- [`milestone-1-spec.md`](./milestone-1-spec.md)  
- [`child-nutrition-0-12-knowledge-base.md`](./child-nutrition-0-12-knowledge-base.md)  
- [`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md) — UX/UI hi-fi page spec (Designer handoff)  
- [`m1-bmad-review-ar-ech.md`](./m1-bmad-review-ar-ech.md) — BMad AR + Edge Case Hunter log (2026-04-05)  
- [`m1-bmad-review-ar-macro-redesign.md`](./m1-bmad-review-ar-macro-redesign.md) — Adversarial review after macro-anchored PRD/design (2026-04-05)  
- [`m1-bmad-review-ech-macro-redesign.json`](./m1-bmad-review-ech-macro-redesign.json) — Edge Case Hunter paths (macro pass)  
- [`m1-bmad-review-ar-ech-m1-expansion.md`](./m1-bmad-review-ar-ech-m1-expansion.md) — Adversarial + edge-case pass (M1 expansion, 2026-04-05)  
- [`m1-bmad-review-ech-m1-expansion.json`](./m1-bmad-review-ech-m1-expansion.json) — Edge Case Hunter paths (M1 expansion)  

---

## Change log

| Version | Change |
|---------|--------|
| 0.1 | Initial M1 PRD: research traceability, FRs, rules, ACs, analytics stub. |
| 0.2 | AR/ECH integration: FR-A3 country clarity, UX band mapping note, §9.2 + NFR4, open question Q6, review artifact link. |
| 0.3 | Macro-anchored nutrition model §7; FR-C3–C5, FR-D1/D3, FR-E2–E4; AC-C1–C4, AC-D2; analytics; summary §1. |
| 0.4 | Nutrient focus §7.7; sodium/sugar awareness §7.8; cook time & trending §7.9; §8.5–8.6; journeys §9.1–9.3; Epics B–I; AC-C5–C6, AC-E4–E5, AC-G1–G2, AC-H1–H2, AC-I1–I2; analytics; NFR5; open Q7–10. |
| 0.5 | **Suppa** branding; link [`suppa-brand-framework.md`](./suppa-brand-framework.md); hi-fi alignment note. |
| 0.6 | §14.1 **PO-first resolution order** (table + sign-off gate); §14 locked-items note for **Suppa**. |
| 0.7 | **Q1 Auth:** M1 **email + password**; FR-A1 updated; §14 split **Resolved** / **Open** (Q2–Q10). |
