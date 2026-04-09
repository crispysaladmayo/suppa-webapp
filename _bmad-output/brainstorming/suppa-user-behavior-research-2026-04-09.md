# Suppa — User Behavior Research Brief

**Agent:** Researcher  
**Date:** 2026-04-09  
**Input:** 5 persona files (Anya, Dewi, Siti, Ratna, Linda) + brainstorm session research agenda  
**Method:** Persona synthesis (proxy for field interviews — see confidence notes throughout)  
**Status:** Draft — to be validated with real field interviews before M2 feature commitment  

> **Confidence labeling used throughout:** `[HIGH]` = consistent across 3+ personas with behavioral evidence | `[MED]` = 2 personas or inferred from behavior | `[LOW]` = 1 persona or speculative | `[UNVALIDATED]` = requires real field research

---

## Executive Summary

1. **Apps are opened for tasks; WhatsApp is opened for feelings.** The trigger to open Suppa is a concrete decision (what to cook, did Kira eat enough protein). The trigger to open WhatsApp is emotional (anxiety, celebration, peer validation). These are orthogonal jobs. Suppa must excel at task completion, not community.
2. **Maximum sustainable logging is 3 taps, once per meal, end-of-day acceptable.** Any log flow requiring more than that will be abandoned within 2 weeks. Retrospective logging (logging what happened, not logging in real-time) is the realistic behavior.
3. **Mode switches are time-anchored, not intent-anchored.** Moms don't consciously decide to "switch modes" — they open the app at a specific moment in the day and that moment determines what they need. Mode Masak is a 5–7 PM behavior. Mode Edukasi is a post-bedtime behavior. Mode Log Harian is a post-meal behavior.
4. **Grandparents are the single largest food safety override risk.** In 3 of 5 personas, a non-primary caregiver (mertua or nenek) actively undermines feeding decisions. The product's shareable caregiver reference card is a safety feature, not just a convenience feature.
5. **There are three distinct anxiety peaks, not one.** Pre-MPASI (5–6m), MPASI introduction (6–9m), and picky eating / toddler gap (18–30m) are emotionally different moments with different feature needs. Content strategy must treat them as three user "seasons."
6. **Language register is the trust proxy.** "Si kecil," "Mama," and regional Indonesian food names (tempeh, bayam, kangkung, nasi tim) signal that the app was built for them. Clinical language, Western food references (quinoa, salmon), or "anak Anda" formal register signal the opposite.
7. **The allergen system is a binary trust gate.** One false positive (a peanut-containing recipe for Linda's Dimas) permanently ends the relationship and triggers active anti-advocacy. This is not a feature — it is a safety-critical system.
8. **Weekly pattern view is more motivating than daily precision.** Moms who miss a day of logging don't need guilt — they need "the week still looks okay." The weekly aggregate is the emotional product; the daily log is just the data input method.

---

## Finding 1: App vs. WhatsApp Trigger Patterns

**Research question:** What triggers opening a nutrition app vs. asking in a WhatsApp group?

### Evidence by persona


| Persona | App trigger                                                                  | WhatsApp trigger                                                             |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Anya    | Structured reference ("what does Bagas need at 6 months?")                   | Emotional validation from Jakarta mom groups; conflicting advice resolution  |
| Dewi    | Decision point at 6 PM ("what do I cook with these ingredients?")            | Quick sanity check ("is this okay for Kira?") sent with a food photo         |
| Siti    | After a bad food day — looking for reassurance or new recipe to try          | Sharing cooking wins with Bandung mom group; recipe sharing and discussion   |
| Ratna   | Documentation and systematic tracking (paper notebook translated to digital) | Coordinating with sister and husband about childcare logistics               |
| Linda   | Allergen reference before feeding; documentation after meals                 | Alerting mertua about what Dimas can/cannot eat; sharing allergy safety info |


### Synthesis

**[HIGH]** Apps serve **functional, task-completion jobs**: look up a reference, log a meal, find a recipe, track a number. WhatsApp serves **social-emotional jobs**: get validation, share a win, ask "is this normal?", coordinate with family.

**[MED]** The boundary is blurring for Dewi and Siti, who send food photos to WhatsApp as a quasi-logging behavior. This suggests a **photo-first log with instant WhatsApp-share** would reduce friction while fitting existing behavior.

**[LOW]** Moms do not compare apps against WhatsApp consciously — they use both in parallel for different jobs. Trying to replace WhatsApp behavior is the wrong product goal; integrating with WhatsApp sharing patterns is the right goal.

### Product implications

- If Suppa can only do one thing, it must complete the task (find recipe, show today's gap) without friction. Emotional support is secondary.
- "Share to WhatsApp" is not a nice-to-have — it is the primary distribution and retention mechanism. Every screen that produces a useful output (today's nutrition summary, a recipe, the caregiver reference card) should have a one-tap WhatsApp share.
- Do not build in-app community (confirmed in OQ-3 decision). Build WhatsApp-optimized outputs instead.

---

## Finding 2: Minimum Sustainable Logging Behavior

**Research question:** What is the minimum logging she will actually sustain?

### Evidence by persona


| Persona | Stated tolerance                                                                                              | Behavioral evidence                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Anya    | Pre-MPASI, nothing to log yet. Will track growth.                                                             | Tracks weight on home scale + notes app — 1-tap equivalent behavior  |
| Dewi    | Explicitly: "If logging is complicated I'll quit week 1." 3 taps maximum.                                     | Abandoned 2 prior apps in under a week. Logs from memory end-of-day. |
| Siti    | Writes down food wins in notes app ("she ate broccoli!!") — records notable events, not every meal.           | Selective logging: records exceptions, not the routine               |
| Ratna   | Uses paper notebook (incomplete, scattered). Needs 2-minute window interactions due to work interruptions.    | Paper tolerance = digital tolerance: quick entry, review later       |
| Linda   | Higher logging motivation (medical documentation). Still needs it to feel like documentation, not data entry. | Screenshots and saves allergy-related info compulsively              |


### Synthesis

**[HIGH]** The maximum sustainable logging frequency is **once per meal, up to 3 taps, with end-of-day catch-up acceptable.** Real-time logging during the meal is not realistic for 4 of 5 personas.

**[HIGH]** There are two distinct logging motivations: **habit logging** (Dewi, Ratna — logging for pattern/gap insight) and **event logging** (Siti, Linda — logging specific notable events). The UI must support both without penalizing the event logger for not being a habit logger.

**[MED]** The "week still looks okay" view is more motivating than daily precision. Moms who miss a day of logging do not need a nudge to "catch up" — they need reassurance that the cumulative week is not ruined.

**[UNVALIDATED]** The exact tap count threshold needs real usability testing. 3 taps is derived from Dewi's stated preference; the actual tolerance across the full user base is unknown.

### Product implications

- Design the log flow for **retrospective end-of-day use** as the primary mode, not real-time.
- Frequent foods shortcut (1-tap for nasi tim, ayam suwir, dll) is the highest-leverage logging feature.
- Weekly view must show a "nutrition adequacy signal" even when logging is incomplete (e.g., "Based on 4 of 7 days logged, the week looks light on iron — consider adding...").
- Never show a "you missed X days" shame message. Show "here's what we know so far this week."
- **Logging streak** gamification must be optional — forcing a streak breaks the relationship with event loggers like Siti and Linda.

---

## Finding 3: Natural Mode-Switch Patterns

**Research question:** How does the 3-mode switch happen naturally in a mom's day?

### Time-of-day behavior mapping


| Time window | Dominant behavior                                   | Mode                       |
| ----------- | --------------------------------------------------- | -------------------------- |
| 06:00–08:00 | Preparing breakfast, reviewing yesterday            | Log Harian (retrospective) |
| 09:00–11:00 | Child feeding, work begins (Dewi/Ratna)             | Log Harian (current)       |
| 11:00–13:00 | Deciding what's for lunch; cooking or ordering      | Masak                      |
| 14:00–16:00 | Nap time; brief browsing; commute (Dewi)            | Edukasi (light browse)     |
| 17:00–19:00 | Dinner decision + cooking — highest stress window   | Masak (peak demand)        |
| 19:00–20:00 | Feeding + clean-up                                  | Log Harian                 |
| 20:00–22:00 | Post-bedtime quiet time — only uninterrupted window | Edukasi (deep read)        |


### Evidence by persona

**Anya:** Almost entirely in Mode Edukasi pattern — reads content 3–5x per day, mostly at night during feeding. No mode switching needed pre-MPASI; will shift to Log Harian at 6 months.

**Dewi:** Sharp Mode Masak trigger at 6 PM. Commute = light Mode Log Harian or Edukasi scroll. Post-bedtime = brief Edukasi. Her switching is **time-anchored and automatic**, not intentional.

**Siti:** Mode Masak during cooking research (YouTube to app pipeline). Mode Log Harian after a "bad food day." Mode Edukasi is triggered by a **worry event** (picky eating crisis, nenek conflict) not by time.

**Ratna:** Scattered across all 3 modes in 2-minute windows. Needs fast mode access. Sunday morning = Mode Masak (meal prep). Nighttime = Mode Edukasi for Nadia MPASI research.

**Linda:** Mode Log Harian before and after every meal (allergen check + reaction log). Mode Edukasi triggered by medical appointments and allergy research.

### Synthesis

**[HIGH]** Mode switching is **time-anchored for Dewi and Ratna** (working moms) and **event-triggered for Siti and Linda** (stay-at-home or part-time moms). The explicit bottom nav tabs serve both patterns — time-anchored users develop muscle memory; event-triggered users find the right tab when they need it.

**[MED]** The app's default "home" state should match the most common arrival context. 5–7 PM arrivals are Mode Masak intent; 8–10 PM arrivals are Mode Edukasi intent. A **contextual hint** (not force) on first open of the day could reduce decision friction without removing the explicit tab choice (consistent with OQ-1 resolved: explicit mode switching).

**[LOW]** Ratna's pattern — 2-minute windows scattered through the day — suggests a **widget or quick-log shortcut** outside the app may be worth evaluating post-M1.

### Product implications

- The bottom nav tab order should match peak usage frequency: **Log Harian | Masak | Edukasi** (or validated through analytics post-launch).
- The "contextual suggestion" on open (soft UI hint, not a redirect) can be implemented as a banner: "Mau masak malam ini? Cek resep dari kulkasmu." — surfaced only in the 5–7 PM window.
- Mode Edukasi must load **fast** for the post-bedtime session — this is likely the only uninterrupted reading window of the day. Any load friction here causes bounce.

---

## Finding 4: Grandparent / Mertua Override Risk

**Research question:** What role do grandparents and mertua play in overriding food decisions?

### Evidence by persona


| Persona | Caregiver conflict                                                                           | Severity                                                                           |
| ------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Anya    | Mother-in-law pushes rice water at 3 months (pre-MPASI). Source of conflicting information.  | Medium — Anya has high information literacy but finds the conflict exhausting      |
| Dewi    | Asisten (paid helper) feeds Kira during the day. Not tech-savvy, can't use the app.          | Medium — delegation gap, not ideological conflict                                  |
| Siti    | Mother (Zahra's nenek) says "just give what the child eats." Undermines structured approach. | Medium — confidence-eroding, not safety-threatening                                |
| Ratna   | Husband doesn't engage with nutrition decisions. Sister helps occasionally.                  | Low — gap in shared responsibility, not active override                            |
| Linda   | Mertua cook Javanese food with peanuts; occasionally forget or dismiss the allergy.          | **HIGH — active safety risk.** Linda has had to re-explain the allergy repeatedly. |


### Synthesis

**[HIGH]** Grandparents (nenek, mertua) are the **primary information override vector** in at least 3 of 5 households. They carry cultural authority that often outweighs what the mom reads online.

**[HIGH]** The format that reaches them is **not in-app** — it is physical or shareable. "The app says no peanuts" carries more authority than "I say no peanuts" because it shifts the source of authority from the daughter-in-law to a neutral external system. This is a documented phenomenon in health behavior research (authority transfer / third-party credibility effect).

**[MED]** The asisten (Dewi's case) represents a **delegation gap** that no app can fully bridge — a caregiver who isn't using the app cannot input data. However, a simplified **"asisten view"** or WhatsApp-delivered meal log template could partially bridge this.

**[LOW]** Partners (husbands) are largely absent from nutrition decision-making in all 5 personas. Designing for partner engagement is a lower priority than designing for grandparent communication.

### Product implications

- **The caregiver reference card (OQ-6: all formats) is a safety feature for Linda's segment**, not just a convenience. It must be: (a) visually clear, (b) authoritative in tone ("Dokter anak merekomendasikan..." or "Berdasarkan panduan IDAI..."), (c) shareable via WhatsApp in one tap, and (d) printable for households without consistent smartphone access.
- The card must include: confirmed allergens (bold, explicit), foods to avoid by age, and a contact field for the child's pediatrician.
- For the asisten gap (Dewi): consider a future feature — **simplified WhatsApp-bot log** — where the asisten sends a WhatsApp message and it logs to Dewi's app. Flag as post-M1 research spike.
- Anya's mother-in-law conflict: Mode Edukasi content that addresses "common traditional feeding myths" (with respectful, non-confrontational framing) directly serves this need. Frame as "What the latest research says" not "Why grandma is wrong."

---

## Finding 5: Anxiety Peak by Age Band

**Research question:** At which age band does the mom feel most anxious or most lost?

### Evidence by persona


| Persona | Child age                 | Core anxiety                                                     | Anxiety type                |
| ------- | ------------------------- | ---------------------------------------------------------------- | --------------------------- |
| Anya    | 4 months (approaching 6m) | "Am I ready for MPASI? Will I do it right?"                      | Anticipatory / preparedness |
| Ratna   | 7 months (Nadia)          | "Is this the right food to introduce? Did I track the reaction?" | Procedural / systematic     |
| Dewi    | 18 months                 | "Is there a hidden nutrient gap I can't see from behavior?"      | Invisible gap anxiety       |
| Siti    | 2.5 years                 | "Is this picky eating phase doing long-term harm?"               | Cumulative / chronic        |
| Linda   | 3 years                   | "Will someone give Dimas something with peanuts?"                | Safety / vigilance          |


### Three Distinct Anxiety Seasons

**Season 1 — Pre-MPASI (4–6 months):** Anticipatory anxiety. The mom is preparing, not yet acting. She needs **information and readiness content**, not tracking tools. Primary mode: Edukasi. Primary emotion: excitement mixed with dread.

**Season 2 — MPASI introduction (6–9 months):** Procedural anxiety. The mom is executing a new skill with real stakes (allergen introduction, texture progression). She needs **structured tracking and guided introduction**. Primary mode: Log Harian + structured MPASI tracker. Primary emotion: vigilant attention.

**Season 3 — Toddler gap (18–36 months):** Chronic, low-grade anxiety. Picky eating, repetitive menus, invisible micronutrient gaps. She needs **cumulative reassurance and recipe variety**. Primary mode: Masak + weekly pattern view. Primary emotion: guilt and frustration cycling with brief relief.

**[MED]** There is a fourth emerging anxiety for Linda's segment — **ongoing allergen vigilance** — which is chronic and overlaps with all age bands once an allergy is confirmed. This is a distinct segment, not an age-band peak.

### Product implications

- **Content strategy must address all three seasons simultaneously** (different moms are in different seasons). Age-gating in Mode Edukasi handles this automatically — each mom sees content relevant to her season.
- **Onboarding must correctly classify which season the mom is entering** and route her to the appropriate content track and feature set.
- The **MPASI hari pertama journey** (triggered at 6 months per OQ-4 decision) is the single highest-value content moment — it is the transition from Season 1 to Season 2.
- **Season 3 reassurance** (the "week still looks okay" aggregate view) is as emotionally important as the tracking accuracy. A toddler mom who sees "this week had some gaps but overall variety was good" will stay; one who sees "you're failing" will leave.

---

## Finding 6: Language Register and Regional Food Trust

**Research question:** What language register does she prefer? What food reference signals trust?

### Evidence by persona


| Persona | Register signals                                                               | Regional food signals                                                                                    |
| ------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Anya    | Warm, approachable, science-backed but not clinical. Instagram/TikTok tone.    | Jakarta — diverse, open to variety but wants Indonesian framing                                          |
| Dewi    | Direct, action-oriented. No fluff. "Masakin ini malam ini."                    | Surabaya — Javanese food but pragmatic; accepts variety                                                  |
| Siti    | Conversational, empathetic. Accepts being "just a mom" voice.                  | Bandung — **strongly Sundanese**: tempeh, tahu, bayam, kangkung. Salmon = lost trust immediately         |
| Ratna   | Organized, systematic. Appreciates clear structure.                            | Medan — **Batak-influenced**: specific spices, pork-inclusive household (important for recipe filtering) |
| Linda   | Precise, explicit, non-ambiguous on allergens. Formal when it comes to safety. | Yogyakarta — Javanese, peanut-prevalent cuisine. Needs explicit peanut flagging everywhere               |


### Synthesis

**[HIGH]** The preferred register across all 5 personas is: **warm and informal for emotional content** ("si kecil," "Mama"), **precise and explicit for safety/allergy content** (no softening of allergen warnings). Formal "anak Anda" feels clinical and distant across all segments.

**[HIGH]** Regional food relevance is a primary trust signal, not a secondary nice-to-have. For Siti (Bandung/Sundanese), seeing tempeh, bayam, and kangkung in recipe suggestions signals "this was made for me." Seeing quinoa or salmon signals the opposite — and she will not trust the nutrition data because the food environment is unfamiliar.

**[MED]** Ratna's household in Medan may be Batak and potentially pork-inclusive. Recipe filtering for dietary constraints must include a **household diet profile** beyond allergens (halal/non-halal, vegetarian, etc.) — this is a data modeling decision with UX implications.

**[LOW]** The informal vs. formal register preference may shift by content type. Siti and Anya want warmth in education content but may want precision in tracking content. Testing copy register by content type is warranted in usability research.

### Product implications

- **Voice and tone guide:** All copy defaults to: "si kecil" (not "anak Anda"), "Mama" (not "ibu"), "coba deh" (not "disarankan untuk"). Clinical language only in allergy warnings and medical disclaimers.
- **Recipe seed data must include Indonesian regional staples as a first-class priority**: nasi tim, bubur sumsum, tahu/tempe goreng, bayam bening, soto ayam baby, sayur lodeh, tim ikan. Western ingredients are supplementary, not primary.
- **Regional tagging on recipes** (Sundanese, Javanese, Batak, Padang, etc.) enables personalization post-M1. Flag the field in the data model even if it's unused in M1 filters.
- **Allergen copy must be explicit and never euphemistic.** "Mengandung kacang tanah" not "mungkin mengandung kacang." For Linda, ambiguity = breach of trust.

---

## Persona-to-Feature Coverage (Stress Test)

Which features are validated by which personas, and which have no persona coverage yet:


| Feature                                 | Anya | Dewi | Siti | Ratna | Linda | Coverage                  |
| --------------------------------------- | ---- | ---- | ---- | ----- | ----- | ------------------------- |
| Milk mode / 0–5m track                  | ✓    |      |      | ✓     |       | 2 personas                |
| MPASI hari pertama journey              | ✓    |      |      | ✓     |       | 2 personas                |
| Allergen hard-rule filtering            |      |      |      |       | ✓     | 1 persona — HIGH priority |
| Shareable allergen/caregiver card       | ✓    |      |      |       | ✓     | 2 personas                |
| Quick log (3-tap max)                   |      | ✓    | ✓    | ✓     |       | 3 personas                |
| Frequent foods shortcut                 |      | ✓    | ✓    | ✓     |       | 3 personas                |
| Fridge → recipe                         |      | ✓    |      |       | ✓     | 2 personas                |
| Weekly adequacy aggregate view          |      | ✓    | ✓    | ✓     |       | 3 personas                |
| Picky eater / dislike filter on recipes |      |      | ✓    |       |       | 1 persona                 |
| Multi-child switching                   |      |      |      | ✓     |       | 1 persona                 |
| Mode Edukasi (articles + quiz)          | ✓    |      | ✓    | ✓     | ✓     | 4 personas                |
| Cook mode (distraction-free, screen-on) |      | ✓    | ✓    | ✓     |       | 3 personas                |
| Pelangi makan / food diversity visual   |      | ✓    | ✓    | ✓     |       | 3 personas                |
| Auto shopping list from meal plan       |      | ✓    |      | ✓     |       | 2 personas                |
| Budget-aware filter                     |      |      | ✓    | ✓     |       | 2 personas                |
| Traditional myth-busting content        | ✓    |      | ✓    |       |       | 2 personas                |
| Asisten / delegated caregiver input     |      | ✓    |      |       |       | 1 persona — UNVALIDATED   |
| Partner / husband education mode        |      |      |      | ✓     |       | 1 persona — LOW priority  |


**Gaps — no current persona covers:**

- Urban dad primary caregiver (not represented; likely rare but worth 1 future persona)
- Single-parent household
- Tier 3 city / rural context (limited connectivity, lower literacy)
- Grandmother as primary caregiver (not rare in Indonesia — could be a future persona)

---

## Assumptions and Risks

1. **[ASSUMPTION]** Personas are proxies for real field behavior. All findings labeled [HIGH] should still be validated with 8–12 real interviews before driving M2 feature investment.
2. **[RISK]** Siti's strong Sundanese food preference may not generalize to all Tier 2 Indonesian moms. Recipe regional relevance needs quantitative validation (what % of users feel regional food matching matters?).
3. **[RISK]** The "3-tap maximum" is Dewi's stated preference, not observed behavior. Stated preference in interviews consistently underestimates actual tolerance. Real threshold may be higher.
4. **[ASSUMPTION]** Weekly aggregate view reduces logging anxiety. This is a design hypothesis — it needs a controlled comparison against daily-only views in a usability study.
5. **[RISK]** Ratna's multi-child use case adds significant data model complexity. If multi-child is positioned as a core feature (not an edge case), the architecture must be built for it from the start. Underestimating this is a technical debt risk.
6. **[RISK]** Linda's allergen trust gate has zero tolerance for error. Any systematic ambiguity in ingredient-to-allergen matching (e.g., "kacang" matching peanut vs. other nuts) will trigger Linda-type users to churn and anti-advocate. This is a product safety risk, not just a feature quality risk.

---

## Recommendations

1. **If the allergen system is not provably accurate, do not launch it.** Linda's trust gate means a partial allergen system is worse than no allergen system. Scope the allergen feature as all-or-nothing with rigorous QA before expose.
2. **If the weekly adequacy view shows useful data with incomplete logging, retention will improve.** Design the aggregate algorithm to show meaningful output even with 3–4 days of logged data — not just when the week is 100% complete.
3. **If the recipe seed set contains Indonesian regional staples as primary items, Siti-type users will trust the app.** A recipe set dominated by Western ingredients will fail with the largest stay-at-home mom segment. Prioritize DKBM-aligned seed recipes with Sundanese, Javanese, and Padang staples first.
4. **If the caregiver reference card is shareable in one tap to WhatsApp, Linda will distribute it to her mertua and become an evangelist.** This is a zero-cost distribution feature with high safety value.
5. **If Mode Edukasi content is age-gated from birth and the pre-MPASI track actively prepares Anya-type moms for the 6-month transition, she will be the most loyal early adopter.** Her anticipatory anxiety makes her highly receptive to structured preparation content — she has no competitor for her attention in the 4–6m window.

---

## Open Research Questions (to validate in field)


| Priority | Question                                                                                                                                                       | Suggested method                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| P1       | What is the real tap-count tolerance for a log flow in usability testing?                                                                                      | Prototype usability test — time + completion rate + drop-off per screen |
| P1       | Do moms with confirmed-allergy children trust app-generated allergen filtering enough to act on it without cross-checking?                                     | Depth interview + prototype probe with 3–5 Linda-type moms              |
| P1       | Does the weekly aggregate view ("week looks okay") measurably reduce log-gap anxiety vs. a daily-only view?                                                    | A/B test post-launch or prototype comparison study                      |
| P2       | How does Siti-type mom (picky eater, stay-at-home) respond to the food diversity / Pelangi makan visual — motivating or shame-inducing?                        | Usability test with picky-eater mom segment                             |
| P2       | What is the actual cooking repertoire size of the typical Indonesian MPASI mom? (How many unique recipes does she rotate?)                                     | Survey, n=100+, to size the recipe seed set correctly                   |
| P2       | Is the asisten delegation gap addressable without a WhatsApp bot, or is that the only viable solution?                                                         | Contextual interviews with asisten-employing moms                       |
| P3       | Do Ratna-type moms (multi-child) churn faster than single-child moms when multi-child switching is clunky?                                                     | Cohort analysis post-launch                                             |
| P3       | What % of Indonesian urban moms identify strongly with their regional cuisine in food app contexts? (Quantify Siti's Sundanese preference as a segment signal) | Survey, n=200+                                                          |


---

*Research brief by: Researcher agent | Input source: 5 Suppa persona files | Validated by: Pending field research | Next action: Schedule 10–12 real user interviews covering Anya, Dewi, Linda segments (P1 priority) before M2 feature planning*