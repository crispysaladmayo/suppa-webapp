# Suppa — Design Brief

**Status:** Living document — update as design decisions are made
**Created:** 2026-04-09
**Last reviewed:** 2026-04-09
**Owner:** Alvin
**Session agents:** CPO · Designer

> This document translates the strategic vision and research findings from [`suppa-vision-brainstorm-2026-04-09.md`](./suppa-vision-brainstorm-2026-04-09.md) into actionable design direction. It is the primary reference for UX and UI decisions on Suppa and should be read alongside [`child-nutrition-app-context.md`](../child-nutrition-app-context.md) and [`prd-milestone-1.md`](../prd-milestone-1.md).

---

## 1. Brief at a Glance

> **CPO:** This brief exists to answer one question — "What does the design have to be true about to deliver on the product strategy?" Every section flows from that.

**Problem:** Indonesian moms managing MPASI carry a disproportionate cognitive load: remembering what a child has eaten, checking whether iron and zinc needs are covered, deciding what to cook in under 20 minutes, and navigating contradictory advice from grandparents and online groups. Existing apps either track growth (PrimaKu) or serve content (Tentang Anak) but none close the loop from "I know my child needs zinc" to "here is what to cook tonight."

**Primary audience:** Indonesian mothers with children aged 0–36 months, managing MPASI introduction or toddler feeding, predominantly in Tier 1–2 cities (Jakarta, Bandung, Surabaya, Medan), mobile-first, WhatsApp-native.

**Product promise:** Suppa makes the daily nutrition loop visible and completable — log what was eaten, see gaps clearly, act on them immediately with a recipe that respects the child's profile.

**M1 north star:** A mom who uses Suppa for one week should be able to say: *"I know which nutrients my child is missing and I cooked something this week that covered them."*

### Non-goals for M1 design

> **CPO:** These are gates, not wish-list cuts. Any design work that creeps into these areas must be escalated before it enters the spec.

| Non-goal | Reason |
|---|---|
| Medical diagnosis or clinical scoring | Not a medical device — framing as "practical companion" is a legal and trust requirement |
| Social / community feed | Resolved: no community tab. WhatsApp integration handles sharing |
| Partner or nenek profiles | Caregiver reference card post-M1; multi-profile is Future |
| Regional food availability maps | Place-aware via city dropdown, not store finder |
| Photo meal recognition (AI) | Post-M1 — manual log only in M1 |
| Subscription or paywall flows | Phase 2+ revenue; M1 is trust-building, ad-free |
| Immunization tracking | Trust anchor feature, post-M1 |

---

## 2. Strategic Design Intent

> **CPO:** The product positioning — "education platform that also tracks" — is not a UX opinion. It is the core strategic bet validated by research. The knowledge-practice gap is the primary behavioral barrier for Indonesian MPASI moms. Knowing what to do and actually doing it are separated by friction. Design must own that bridge.

### Why education-first changes UX decisions

Most nutrition apps make the dashboard the default. Suppa's position says Mode Edukasi is first-class, not a secondary tab. This has three direct design consequences:

1. **The three modes are peers, not hierarchy.** Bottom nav gives each equal weight. No mode is a "sub-feature" of another.
2. **Every education article must close with an action.** An article about zinc that does not link to a Mode Masak recipe containing zinc has failed. The article → quiz → recipe pipeline is the product's core behavioral loop, not a nice-to-have.
3. **The weekly aggregate is the emotional product.** Daily log entries are data input. The weekly view is where a mom feels reassured or prompted. Design must make the weekly view feel rewarding, not clinical.

### Competitive moat that design must protect

> **CPO:** These four features are what no current Indonesian app does together. Design quality on these specific flows is where Suppa either wins or loses against PrimaKu adding nutrition tracking within 12 months.

| Moat feature | Design requirement | Risk if executed poorly |
|---|---|---|
| Zinc + iron gap hints (distinct, food-specific) | Two separate hint cards — different colors, different food language | Collapsing into "protein kurang" erases the differentiation entirely |
| Pelangi makan (WHO 8-group diversity visual) | Secondary placement on dashboard; weekly cadence | Overemphasizing daily → shame spiral for incomplete days |
| Allergen binary filter | Hard filter — no "may contain" gray zone | One unsafe recipe suggestion ends the relationship permanently |
| Fridge → allergen-safe recipe with Indonesian food database | DKBM-sourced, allergen-filtered, regional food names | Generic "international" recipes signal the app was not built for this user |

### What M1 must prove to unlock Phase 2

> **CPO:** M1 is not about feature completeness. It is about proving three things that justify brand sponsorship conversations (Phase 2) and clinical channel investment (Phase 3):
> 1. Moms return to log meals across multiple days (retention signal)
> 2. At least one recipe suggestion per week leads to a cook action (action completion signal)
> 3. The allergen filter is trusted enough that Linda-type users do not cross-check on a second app (trust signal)

Design decisions that do not advance at least one of these three signals should be deferred.

---

## 3. Who We Are Designing For

> **Designer:** The 5 personas are not marketing archetypes. Each maps to a distinct behavioral moment, an anxiety season, and a specific design implication. These must be kept visible during every design review.

### The 3 Anxiety Seasons

Design decisions should always specify which season they serve. A feature that serves Season 1 moms (pre-MPASI anticipatory anxiety) may actively harm Season 3 moms (chronic picky-eating guilt) if framing is not season-aware.

| Season | Child age | Core emotion | Primary mode | Design priority |
|---|---|---|---|---|
| **Season 1 — Persiapan** | 0–5 months | "Am I ready for MPASI?" | Mode Edukasi (pre-MPASI track) | Anticipation-building, milestone countdown, reassurance |
| **Season 2 — Introduksi** | 6–9 months | "Did I do the allergen rule right?" | Mode Log Harian + MPASI tracker | Procedural confidence, allergen safety, texture progression |
| **Season 3 — Konsistensi** | 18–36 months | "Picky eating = am I failing?" | Mode Masak + weekly aggregate | Reassurance-first, diversity without shame, streak compassion |

### Persona design implications

**Anya — First-time mom (Season 1 → early Season 2)**
- Reads at night during feeding sessions (22:00–23:00)
- Mode Edukasi must work one-handed in low light — large text, high contrast, minimal interaction required
- Wants to bookmark articles to return to later
- High-value early adopter: onboarding should acknowledge the pre-MPASI phase as legitimate, not just a waiting room

**Dewi — Working mom (Season 2–3)**
- Opens app at 17:00–19:00 — "I have 20 minutes to decide what to cook"
- Mode Masak is her primary entry. Speed is the UX metric, not thoroughness
- Time filter (20 min / 45 min) is not optional — it is the entry condition
- Cannot tolerate more than 3 taps to reach a cookable recipe

**Siti — Stay-at-home picky-eater mom (Season 3)**
- Chronic guilt pattern — any daily-gap emphasis risks triggering shame
- Pelangi makan visual must frame variety as progress, not deficit
- Weekly aggregate view ("week looks okay") is the reassurance mechanism she needs most
- Neophobia content ("10–15 exposure rule is normal") is her most requested content type

**Ratna — Two-child juggler (Season 2 + Season 3 simultaneously)**
- Needs one app, not two profiles that feel like two apps
- Age-appropriate content for two different children must not require manual context-switching
- Quick-switch between child profiles is a navigation requirement, not a settings flow

**Linda — Allergy-alert mom (Season 2)**
- Zero tolerance for ambiguity in allergen filtering
- "Kalau aplikasinya salah kasih saran dan Dimas kena reaksi — aku nggak akan pernah pakai lagi dan aku akan bilang ke semua orang."
- The allergen confirmation flow during onboarding must feel serious, not incidental
- Every recipe result must show a visible allergen-clear signal — not just the absence of a warning

---

## 4. Research-Validated Design Principles

> **CPO + Designer:** These 8 principles are derived directly from the three research briefs. They are not opinions. Any UX or copy decision that contradicts them requires explicit escalation.

### Principle 1 — The emotional product is the weekly view; the daily log is just input

> **CPO:** Never frame a missed day as failure. The product's emotional promise is cumulative reassurance, not daily scoring.

> **Designer:** Implementation consequences:
> - The weekly adequacy view must be the hero of the Today dashboard — not hidden under a scroll
> - A day with no log entries shows as "no data" — neutral gray, no broken ring, no "0%"
> - The completion badge triggers on weekly pattern, not daily streak alone
> - Copy for the daily summary: "Hari ini cukup baik" — not "Protein: 12g / 25g"

### Principle 2 — Zinc and iron are named explicitly, not collapsed

> **CPO:** 38.7% zinc deficiency, 34.2% iron deficiency in Indonesian children. Naming both explicitly is the core product differentiation.

> **Designer:** Implementation consequences:
> - Two distinct gap hint cards — different visual treatments, not nested under a single "micronutrient" label
> - Zinc card copy: "Tambahkan daging sapi, ayam, atau tempe untuk zinc si kecil"
> - Iron card copy: "Coba hati ayam, ikan teri, atau bayam untuk iron si kecil"
> - Cards appear in Mode Log Harian below the macro rings — visible without scrolling on a standard phone viewport
> - Never use: "Protein kurang", "Micronutrient gap", "Nutrition gap detected"

### Principle 3 — Knowledge without action path is wasted

> **CPO:** Mode Edukasi articles that do not connect to Mode Masak recipes are incomplete product flows. The article → quiz → recipe pipeline is the behavioral loop that differentiates Suppa from a content app.

> **Designer:** Implementation consequences:
> - Every Mode Edukasi article ends with a "Coba resep ini" CTA that links to a pre-filtered Mode Masak result matching the article's featured nutrient
> - The quiz appears between the article body and the recipe CTA — not as a separate page
> - Recipe CTA must carry the article's nutrient context: "Resep kaya zinc untuk si kecil" — not a generic "See recipes"
> - Article → quiz → recipe pipeline should be completable in a single session without leaving Mode Edukasi's context

### Principle 4 — Authority transfer defeats grandparents

> **CPO:** 3 of 5 personas have active grandparent/mertua conflict. The design mechanism to resolve this is shifting authority from "kata saya" (mom's voice) to "kata penelitian" or "kata IDAI."

> **Designer:** Implementation consequences:
> - Caregiver reference card uses: "Berdasarkan panduan IDAI dan penelitian terkini..." — not "Mama bilang..."
> - Myth-busting articles use "Kata penelitian terbaru" framing in the headline — not clinical corrections
> - Error states and warnings use institutional language: "Bahan ini tidak direkomendasikan untuk usia [X] menurut panduan IDAI" — not "You shouldn't feed this to your child"
> - IDAI attribution appears at the bottom of every article that cites IDAI content

### Principle 5 — Compassionate gamification only

> **CPO:** Shame causes churn in this audience. The gamification design must be provably shame-free. No leaderboards, no "you missed X days" messages, no broken-streak notifications.

> **Designer:** Implementation consequences:
> - Streak counter shows only the current active streak — not "your longest streak was X"
> - On a missed day: streak counter simply resets without commentary — no notification, no message
> - Grace day behavior: if a mom logs on day N+2 (one day skip), streak resumes — shown as unbroken
> - Badge names celebrate behavior, not scores: "Konsisten minggu ini" (not "7-day warrior"), "Pertama kali coba resep baru"
> - No comparative language anywhere: no percentages relative to "other Suppa moms"

### Principle 6 — Indonesian food names are the trust signal

> **CPO:** Regional food names signal "this was built for me." Generic nutritional language signals the app was built for someone else.

> **Designer:** Implementation consequences:
> - All recipe names use Indonesian food names: "Nasi tim hati ayam," "Bubur kacang hijau," "Tumis bayam tempe" — not "Iron-rich rice porridge"
> - Food substitution engine uses regional equivalents: "wortel → labu kuning" (both Vitamin A–rich), not "carrots → butternut squash"
> - Gap hint copy names specific Indonesian foods — see Principle 2 for the zinc/iron examples
> - Sundanese/Javanese/Batak food name variants are Phase 2 regional personalization — but M1 defaults to national Indonesian register

### Principle 7 — The allergen system is binary, not probabilistic

> **CPO:** This is a legal and trust requirement, not a UX preference. One confirmed allergen appearing in a recipe suggestion is a permanent relationship-ending event.

> **Designer:** Implementation consequences:
> - Recipe filter is a hard exclude — if an ingredient contains a confirmed allergen, the recipe does not appear in any result set
> - No "may contain" states for confirmed allergens. "May contain" language is only allowed for cross-contamination disclosure on packaged foods (post-M1 scope)
> - Allergen-clear confirmation: every recipe result shows "Aman untuk [child name]" badge — visible in the card, not just on the recipe detail
> - If the allergen database cannot confirm a recipe is safe, the recipe is excluded — fail closed, not fail open
> - Allergen setup during onboarding: serious, deliberate flow — not a quick optional toggle

### Principle 8 — Pelangi makan shows variety, not sufficiency

> **CPO:** Meeting 5/8 WHO MDD groups is a positive signal, but it does not guarantee micronutrient adequacy. The visual must communicate variety without creating false confidence.

> **Designer:** Implementation consequences:
> - Pelangi makan visual placement: secondary on Today dashboard, below the macro rings — it is supporting context, not the primary metric
> - Weekly cadence is the right frame: "Minggu ini si kecil sudah makan 5 dari 8 kelompok makanan" — not "Today: 3/8"
> - Color segments show filled groups without implying the others are failures: missing segments are neutral gray, not red
> - Tooltip/explainer available: "Pelangi makan membantu memastikan variasi — bukan pengganti pengecekan gizi individual"
> - Never show: a daily Pelangi makan score that resets to zero each morning

---

## 5. Three-Mode Architecture — UX Direction

> **Designer:** Each mode owns a distinct behavioral moment in the mom's day. The three-tab bottom nav gives each equal visual weight. Mode switching is explicit (user-initiated), with contextual hints that suggest — but never force — a mode change based on time of day.

### Mode switching architecture

```
Bottom nav (always visible):
[ Log Harian ]  [ Masak ]  [ Edukasi ]
     📓            🍳          📚

Contextual hint (non-forcing):
Small banner above the active tab area:
"Waktunya masak malam? Cek Mode Masak →"
Appears at 17:00–19:00 when Log Harian is active.
Dismissable. Never repeats in same session.
```

### Time-of-day contextual hint mapping

| Time | Hint | Target persona |
|---|---|---|
| 06:00–09:00 | No hint (morning log is default behavior) | All |
| 10:00–13:00 | No hint (mid-morning log is default behavior) | Siti, Ratna |
| 15:00–17:00 | No hint (snack log is default behavior) | All |
| 17:00–19:00 | "Mau masak apa malam ini? Mode Masak siap →" | Dewi, Ratna |
| 19:00–20:00 | No hint (dinner log is default behavior) | All |
| 20:00–22:00 | "Punya waktu baca malam ini? Mode Edukasi →" | Anya, Siti, Linda |

### Mode Log Harian — UX direction

> **Designer:** This mode must be completable in under 3 taps on a standard day. That constraint is not a target — it is the sustainability threshold validated by user behavior research.

**Entry trigger:** Post-meal (3× daily — breakfast, lunch, dinner). Mid-morning and snack logs are secondary.

**3-tap constraint design:**
- Tap 1: "Catat makan" CTA — visible above the fold on Today dashboard
- Tap 2: Select a recent/frequent food (shortcut list shows top 5 recent meals by default)
- Tap 3: Confirm portion size (visual guide, age-appropriate)

**State flow:**

```
Today dashboard
├── Macro rings (energy, protein, carbs, fat)
│   └── Zinc gap hint card (conditional — if zinc below 50% weekly average)
│   └── Iron gap hint card (conditional — if iron below 50% weekly average)
├── Pelangi makan strip (secondary — scroll to reveal on small screens)
├── Weekly adequacy bar ("Minggu ini sudah cukup baik 🟢")
└── [+ Catat makan] primary CTA

Catat makan flow:
├── Recent foods shortcut (top 5)
├── Search (text — no photo in M1)
├── Portion size selector (visual, 3 options: sedikit / sedang / banyak)
├── Feeding mood (optional): lahap / biasa / susah
└── Save → return to Today dashboard
```

**Key states:**
- No logs today: macro rings shown as empty outlines (neutral) — no percentage, no broken state
- Partial log (1–2 meals): rings partially filled, weekly bar unaffected
- Allergen detected in manual entry: warning before save — "Bahan ini ada di daftar alergi [nama anak]. Tetap catat?"

**M1-consider decision — Allergen 3-day introduction tracker:**
> **Designer:** This is a distinct flow from the allergen filter on recipes. It is an active parent-managed tracker: "Hari 1 → 2 → 3 of introducing udang — any reaction?" The flow requires a dedicated entry point separate from the standard meal log. Recommend including in M1 given the safety criticality (Linda-type users).

**M1-consider decision — Frequent foods shortcut:**
> **Designer:** This is the enabler of the 3-tap constraint. Without a shortcut list, returning to search for "nasi tim hati ayam" every morning is 6–8 taps. Recommend including in M1.

**M1-consider decision — Weekly aggregate view:**
> **Designer:** The weekly adequacy bar ("Minggu ini sudah cukup baik") is a single row on the Today dashboard. It is the emotional product. It must be in M1 — deferring it means the daily-score framing dominates, which conflicts with Principle 1.

### Mode Masak — UX direction

> **Designer:** Mode Masak's primary UX problem is time pressure. At 17:00–19:00, Dewi has 20 minutes to decide what to cook. The first screen she sees must give her a result, not a filter form.

**Entry trigger:** Primarily 17:00–19:00 dinner decision window. Secondary: meal planning sessions (weekend).

**Primary flow — Fridge to recipe:**

```
Mode Masak home
├── "Mau masak apa hari ini?" search / fridge input
│   └── Ingredient entry (text — top 3 ingredients from fridge)
│   └── Time filter (20 menit / 45 menit) — shown before results, not after
├── Recipe results (allergen-filtered, age-appropriate)
│   └── Each card: recipe name (Indonesian), prep time, "Aman untuk [child name]" badge
│   └── Missing ingredient callout: "Perlu: bayam (ganti dengan kangkung?)"
└── Recipe detail → Cook mode

Cook mode:
├── Screen stays on (wake lock)
├── Large font, high contrast
├── Step-by-step with swipe navigation
├── Ingredient amounts in household measures (sendok makan, gelas, genggam)
└── Nutrition summary at the end (not at the top — not clinical entry, reassurance exit)
```

**Key states:**
- No matching recipes (allergen + time constraints): "Belum ada resep yang cocok. Coba tambahkan bahan lain?" — never a dead end
- Recipe with missing ingredient: show substitution ("wortel bisa diganti labu kuning — sama-sama kaya vitamin A")
- Article → recipe bridge: when entering from Mode Edukasi, the recipe list pre-filters to the article's featured nutrient — shown as a banner: "Resep kaya zinc dari artikel tadi"

### Mode Edukasi — UX direction

> **Designer:** Mode Edukasi's primary UX problem is context. Anya reads at night during feeding — one-handed, tired, low light. The reading experience must require minimal navigation and work at arm's length.

**Entry trigger:** Primarily 20:00–22:00 post-bedtime. Event-triggered at child age milestones (6m birthday → MPASI hari pertama journey).

**Content architecture — 3 seasons:**

```
Mode Edukasi home
├── Current season indicator ("Si kecil [nama] sekarang di Season 2: Introduksi")
├── Featured article (age-matched, milestone-aware)
├── Continue reading (if article in progress)
├── Saved articles
└── Browse by topic (Tekstur · Gizi · Neophobia · Imunisasi · Alergi)

Article flow:
├── Article body (large readable font, 8–10 min read)
├── 3-question quiz (inline, below article — not a separate page)
│   └── Answer with explanation (not just correct/incorrect)
├── [Coba resep ini →] CTA (links to Mode Masak pre-filtered)
└── Share card (WhatsApp-optimized image)
```

**Age-gating logic:**
- Season 1 (0–5m): pre-MPASI track — visible from birth date entry, not hidden
- Season 2 (6–9m): MPASI introduction track — triggered at child age = 6 months
- Season 3 (18–36m): picky-eating track — triggered at 18 months
- Extended milestone articles (9m, 12m, 24m): unlocked on the date, not before

**MPASI hari pertama journey:**
- Triggered by calendar: child's birth date + 6 months
- Curated sequence: 5 articles in order, with action checklist between articles
- Celebratory framing: "Si kecil [nama] siap mulai MPASI! 🌟" — not an alert or warning

**Key states:**
- No articles read yet (new user): show Season 1 article even if child is already in Season 2 — let mom catch up
- Quiz answered incorrectly: show explanation without any shame language — "Jawabannya adalah X, karena..." not "Salah! Coba lagi"
- WhatsApp share card: 1080×1080px image format, branded Suppa, key learning in Bahasa Indonesia

---

## 6. M1 Design Scope

> **CPO:** Design work on Post-M1 features before M1 core flows are complete is scope creep. This section defines what the design team must complete before M1 ships.

### In scope for M1

| Flow | Mode | Priority | Note |
|---|---|---|---|
| Onboarding (account creation, child profile, allergen setup) | All | M1 ✅ | Allergen setup must be deliberate, not skippable |
| Today dashboard (macro rings, gap hints, weekly bar) | Log Harian | M1 ✅ | Weekly bar is required — see Principle 1 |
| Meal log entry (text search + frequent foods shortcut) | Log Harian | M1 ✅ | 3-tap constraint must hold |
| Iron + Zinc gap hint cards | Log Harian | M1 ✅ | Both distinct — not collapsed |
| WHO growth chart | Log Harian | M1 ✅ | |
| Fridge → recipe suggestion (allergen-filtered) | Masak | M1 ✅ | Core loop |
| Weekly meal prep planner | Masak | M1 ✅ | |
| Recipe detail + Cook mode | Masak | M1 ✅ | Screen-on, large font |
| Child profile management (add/edit allergies, dislikes) | Settings | M1 ✅ | |

### M1-consider (design decision required before backlog finalization)

| Flow | Mode | Recommendation | Rationale |
|---|---|---|---|
| Frequent foods shortcut (1-tap recurring) | Log Harian | **Include** | Enables 3-tap constraint — without it, the constraint is unachievable |
| Allergen 3-day introduction tracker | Log Harian | **Include** | Safety-critical; Linda-type churn risk is permanent if absent |
| Weekly adequacy aggregate view | Log Harian | **Include** | Emotional product; without it, daily-gap framing dominates and contradicts Principle 1 |

### Post-M1 (deliberately deferred)

| Flow | Mode | Reason for deferral |
|---|---|---|
| Photo meal log (AI recognition) | Log Harian | Requires ML infrastructure; manual log proves concept first |
| Compassionate streak + badges | Log Harian | Gamification layer — core loop first, engagement layer second |
| Feeding mood tracker | Log Harian | Nice-to-have; no blockers on core tracking without it |
| Texture progression tracker | Log Harian | Season 2 enrichment — not a loop-blocker |
| Time-based recipe filter (20/45 min) | Masak | Dewi's request — include in M1 if engineering effort is <1 day; otherwise post-M1 |
| Ingredient substitution engine | Masak | Helpful but not a loop-blocker |
| Pelangi makan visual (full) | Masak | Full WHO 8-group visual is post-M1; simplified 3-group indicator is M1-consider |
| Full Mode Edukasi article feed | Edukasi | Seed content required; can launch with Season 2 only if Season 1 + 3 seed data is not ready |
| Post-article quiz | Edukasi | Requires quiz question bank; article reading alone proves value in M1 |
| Caregiver reference card | Family | Post-M1 — safety feature, but not a loop-blocker for M1 |
| Pediatrician-shareable monthly summary | Family | Post-M1 — Phase 2 clinical channel |

---

## 7. Key Design Patterns

> **Designer:** These are the specific UI patterns that recur across screens and must be consistent. Inconsistency in any of these patterns reduces trust.

### Compassionate streak UI

**Behavior:**
- Streak counter: "🔥 [N] hari berturut-turut"
- Grace day: if one day is skipped, the streak continues — the counter does not break
- After a missed streak: counter resets to "0 hari" with no commentary, no notification
- No "longest streak" display anywhere

**Copy rules:**
- DO: "Mama sudah konsisten [N] hari — tetap semangat!"
- DO NOT: "Kamu melewatkan kemarin. Streakmu terputus."
- DO NOT: "Streak terbaik: 14 hari" (comparative, pressure-inducing)

**Visual:**
- Streak badge: warm orange, flame icon
- Broken/reset state: neutral gray, no broken icon

### Iron + Zinc gap hint cards

**Zinc card:**
```
╔══════════════════════════════════╗
║  🟡  Zinc minggu ini sedikit rendah
║  Coba tambahkan:
║  · Daging sapi cincang
║  · Tempe kukus
║  · Ayam cincang
║  [Lihat resep kaya zinc →]
╚══════════════════════════════════╝
```

**Iron card:**
```
╔══════════════════════════════════╗
║  🔴  Iron minggu ini sedikit rendah
║  Coba tambahkan:
║  · Hati ayam
║  · Ikan teri
║  · Bayam
║  [Lihat resep kaya iron →]
╚══════════════════════════════════╝
```

**Rules:**
- Cards appear only when the weekly average for that nutrient is below threshold (not daily — weekly)
- Cards are dismissable — tapping "✕" hides for 24 hours
- Both cards can appear simultaneously — they are never merged
- CTA links to Mode Masak pre-filtered by that nutrient
- "Sedikit rendah" framing — not "DEFICIENT" or "KEKURANGAN" (alarm language)

### Allergen binary filter UI

**Recipe card (safe):**
```
[Recipe name]
Prep: 20 menit
✅ Aman untuk [child name]
```

**Recipe card (allergen conflict — should not appear in results, but if shown in non-filtered browse):**
```
[Recipe name]
Prep: 20 menit
⚠️ Mengandung [allergen] — tidak ditampilkan di hasil utama
```

**Onboarding allergen setup:**
- Step label: "Keamanan si kecil" — not "Food preferences"
- Instruction copy: "Masukkan semua alergi yang sudah dikonfirmasi dokter. Suppa akan menyaring semua resep berdasarkan ini secara otomatis."
- Confirmation step: "Kami akan menyembunyikan semua resep yang mengandung [allergen list]. Ini tidak bisa dilewati secara tidak sengaja."
- Supports: susu sapi, telur, kacang tanah, udang, ikan, kedelai/tempe, gluten, sesame (Big 8 + Indonesian-specific)

### Authority transfer microcopy templates

Use these templates consistently across all content that references clinical guidelines:

| Context | Template |
|---|---|
| Article attribution | "Berdasarkan panduan IDAI dan rekomendasi WHO" |
| Allergen warning | "Bahan ini tidak direkomendasikan untuk usia [X] menurut panduan IDAI" |
| Myth-busting headline | "Kata penelitian terbaru: [correct information]" |
| Caregiver reference card header | "Panduan pemberian makan si kecil berdasarkan rekomendasi IDAI" |
| Recipe safety confirmation | "Resep ini sesuai untuk usia [X] berdasarkan panduan tekstur IDAI" |

### Pelangi makan visual

**Placement:** Secondary section on Today dashboard — below macro rings, visible on scroll. Weekly view is the primary frame.

**Visual format:**
- 8 colored segments representing WHO food groups arranged as a rainbow arc or horizontal strip
- Filled segments: food groups logged this week
- Empty segments: neutral gray — not red, not empty/broken
- Label below: "Minggu ini: [N]/8 kelompok makanan 🌈"

**Tooltip/explainer (tap on visual):**
> "Pelangi makan membantu memastikan si kecil mendapat variasi dari berbagai kelompok makanan. Ini bukan pengganti pemantauan gizi individual — tapi cara mudah melihat apakah makanannya sudah beragam minggu ini."

**DO NOT show** a daily Pelangi makan score. Weekly cadence only.

---

## 8. Content Strategy

> **Designer:** Content strategy for Suppa is not about tone guidelines alone. The language register is a product trust signal. Getting it wrong reads as "this was not built for Indonesian moms."

### Language register rules

**Always use:**
- "Si kecil" for the child — never "anak Anda," "your child," or "bayi"
- "Mama" for the user — never "Anda," "ibu," or "user"
- Present tense, active voice: "Suppa membantu Mama" — not "Suppa is designed to help mothers"
- Indonesian food names for all ingredient and recipe references — see Principle 6
- "Kata penelitian terbaru" for clinical framing — not "menurut ilmu pengetahuan" or "scientifically proven"

**Never use:**
- Clinical or Western nutrition terminology as primary labels: no "micronutrient deficiency," no "macronutrient targets," no "dietary intake assessment"
- Alarm or shame language: no "KEKURANGAN," no "bahaya," no "gagal," no "terlewat"
- Comparative language: no "dibanding ibu-ibu lain," no "rata-rata pengguna Suppa"
- Formal Bahasa Indonesia register in conversational copy: reserve for legal and medical content attribution only

### Empty state copy

| Screen | Empty state copy |
|---|---|
| Today dashboard (no logs yet) | "Selamat pagi, Mama [nama]! Catat makan pertama si kecil hari ini yuk 🌟" |
| Mode Masak (no ingredients entered) | "Punya apa di kulkas? Ketik 2–3 bahan dan Suppa carikan resep yang aman untuk si kecil." |
| Mode Edukasi (first visit) | "Halo, Mama [nama]! Suppa siapkan artikel yang pas untuk si kecil usia [X] bulan. Mulai dari sini yuk →" |
| Recipe results (no match) | "Belum ada resep yang cocok untuk bahan itu. Coba tambahkan 1 bahan lain, atau lihat semua resep aman untuk si kecil →" |
| Growth chart (no measurements) | "Belum ada data pertumbuhan. Tambahkan berat dan tinggi si kecil untuk mulai memantau." |

### Error and warning copy

| Situation | Copy |
|---|---|
| Allergen detected in manual log | "Bahan ini ada di daftar alergi [nama anak]. Mama yakin mau catat ini? [Tetap catat] [Batal]" |
| Age-inappropriate food in log | "Menurut panduan IDAI, [food] biasanya aman mulai usia [X] bulan. Si kecil [nama] sekarang [age]. [Tetap catat] [Lihat alternatif]" |
| Recipe not safe for age band | "Resep ini untuk anak usia [X] bulan ke atas. Si kecil [nama] belum siap untuk ini — tapi ini bisa jadi pilihan nanti!" |
| Network error | "Koneksi sedang tidak stabil. Data log Mama sudah tersimpan, coba lagi sebentar." |

### WhatsApp share card format

- Size: 1080×1080px (square — optimal for WhatsApp status and group sharing)
- Content: Key learning from article in 2–3 lines Bahasa Indonesia, illustrated
- Branding: Suppa logo small bottom-right, "Dari Suppa — aplikasi MPASI si kecil" caption below image
- No QR code in M1 — download link in caption text only
- Caption template: "Mama, tau nggak? [key learning]. Baca selengkapnya di Suppa — aplikasi nutrisi MPASI gratis. [link]"

---

## 9. Design Validation Agenda

> **CPO + Designer:** These are the open empirical questions that current design decisions are based on assumptions about. Each P1 question blocks a specific design decision from being finalized.

### P1 — Blocks design decisions before M1 ship

| Question | What it blocks | Suggested method |
|---|---|---|
| At what tap count does the log flow get abandoned? | 3-tap constraint validation — if 3 taps is not achievable, frequent foods shortcut design needs revision | Prototype usability test: time + drop-off per screen, n=10 |
| Do allergen-mom users (Linda-type) trust app-generated filtering enough to act on it without cross-checking? | Allergen binary design decision — if trust is low, we need an additional confirmation layer in the recipe result | Depth interview + prototype test, 3–5 allergy moms |
| Does weekly aggregate view reduce log-gap anxiety vs. daily-only view? | Weekly bar placement and emphasis — if it doesn't reduce anxiety, the framing needs revision | A/B comparison: daily-only vs weekly bar prototype, n=10 |

### P2 — Informs design improvements after M1 launches

| Question | What it informs | Suggested method |
|---|---|---|
| Photo log vs text log — which has lower friction for Indonesian moms? | Post-M1 photo log feature prioritization | Comparative usability test |
| Does "si kecil / Mama" register vs formal "anak Anda" measurably affect trust? | Copy strategy confidence level | A/B copy test post-launch |
| How does Siti-type mom respond to Pelangi makan — motivating or shame-inducing? | Pelangi makan display framing | Usability test with picky-eater mom segment, n=5 |
| What is Dewi-type mom's actual recipe shortlist size? (How many unique recipes per week?) | Frequent foods shortcut list length | Survey, n=50 active users |

---

## 10. Open Design Questions

> **Designer:** These questions must be resolved before the relevant screens can be finalized. Each has a decision owner and a current hypothesis.

| # | Question | Owner | Current hypothesis | Blocking |
|---|---|---|---|---|
| DQ-1 | Compassionate streak grace period: 1 day or 2 days? | Designer + Alvin | 1 day (default). Validate via churn analytics post-launch. | Streak UI spec |
| DQ-2 | Pelangi makan daily vs weekly framing on Today dashboard — does showing daily (even as supplement) create shame? | Designer | Weekly only in M1. Daily framing post-M1 only after Siti-type usability test. | Pelangi makan placement |
| DQ-3 | Time-based recipe filter (20/45 min) — M1 or post-M1? | CPO + PO | M1 if engineering cost is <1 day estimate; otherwise post-M1. Dewi's core need. | Mode Masak spec |
| DQ-4 | How does the allergen 3-day intro tracker surface — in-flow during log entry, or as a separate tracker screen? | Designer | Separate tracker screen reachable from Today dashboard and child profile. In-flow prompt during new food entry. | M1-consider spec |
| DQ-5 | Child profile quick-switch pattern for Ratna (2+ children) — tab bar, dropdown, or swipe? | Designer | Profile switcher in top nav (avatar/name tap → drawer). Not a bottom nav tab — that space is reserved for modes. | Navigation spec |
| DQ-6 | IDAI alignment status at M1 launch — does the design use IDAI attribution language before formal advisor is named? | CPO + Alvin | Use "berdasarkan panduan IDAI" as general attribution. Named IDAI-affiliated nutritionist is the 12–18 month goal (OQ-8). | All authority-transfer copy |

---

## 11. Key Quotes to Keep Visible

> "Evaluasi has no feedback mechanism. Without a closing loop signal, it is a dead end." — CPO

> "Moms don't read numbers. 'Proteinnya kurang' with a color ring is better than '12g / 25g.'" — Designer

> "PrimaKu tells you the child needs iron. Suppa tells you what to cook tonight that has iron and respects the child's allergies." — Researcher

> "Kalau aplikasinya salah kasih saran dan Dimas kena reaksi — aku nggak akan pernah pakai lagi dan aku akan bilang ke semua orang." — Linda Pratiwi (persona)

> "Aku butuh satu tempat untuk dua anak. Bukan dua aplikasi." — Ratna Wulandari (persona)

> "Zinc is the silent deficiency — 38.7% prevalence, more common than iron, but gets far less attention. Suppa naming zinc explicitly is genuinely differentiated." — Researcher

---

*Last updated: 2026-04-09 | Synthesized from vision brainstorm by CPO + Designer agents | DQ-1 and DQ-6 are highest priority design decisions before M1 spec finalization*
