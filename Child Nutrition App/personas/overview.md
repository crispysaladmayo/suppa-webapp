# Suppa — User Personas Overview
## Research Interviewees & User Testing Cohort

**Product:** Suppa (Child Nutrition App)  
**Purpose:** User research interviews and usability testing for Milestone 1  
**Last updated:** 2026-04-09  
**Owner:** Alvin

---

## Why these personas

Suppa's primary user is a **young Indonesian mother** who carries the household's nutrition decisions for at least one young child. These five personas represent distinct segments of that user base — differentiated by child age, life situation, core anxiety, and relationship to the app's key features.

Each persona file includes:
- Demographic snapshot
- Background narrative
- Goals, pain points, and motivations
- Behavioral patterns
- Relationship to Suppa (entry point, primary use case, key value, risk)
- A full **research interview guide**
- **Usability test scenarios** mapped to M1 screens

---

## The 5 Personas

| # | Name | Age | Location | Child(ren) | Core tension | Primary Suppa use case |
|---|------|-----|----------|------------|--------------|------------------------|
| 1 | **Anya Kusuma** | 26 | Jakarta Selatan | Bagas, 4 months | First-time anxiety; approaching MPASI | Milk mode → growth tracking → MPASI preparation |
| 2 | **Dewi Rahayu** | 31 | Surabaya | Kira, 18 months | Time-poor; needs instant answers | Quick log → gap view → fridge-to-recipe at 6 PM |
| 3 | **Siti Nurhaliza** | 28 | Bandung | Zahra, 2.5 years | Picky eater; invisible nutrient gaps | Preference-aware recipe discovery; cumulative reassurance |
| 4 | **Ratna Wulandari** | 32 | Medan | Rafi, 4 yrs + Nadia, 7 months | Two kids, two nutritional worlds | Multi-child tracking; MPASI log for infant |
| 5 | **Linda Pratiwi** | 29 | Yogyakarta | Dimas, 3 years | Confirmed peanut allergy; in-law friction | Allergen-safe recipe filtering; shareable allergy profile |

---

## Persona files

- [`persona-1-anya-first-time-infant-mom.md`](./persona-1-anya-first-time-infant-mom.md) — Anya Kusuma
- [`persona-2-dewi-working-mom-toddler.md`](./persona-2-dewi-working-mom-toddler.md) — Dewi Rahayu
- [`persona-3-siti-stayathome-picky-eater.md`](./persona-3-siti-stayathome-picky-eater.md) — Siti Nurhaliza
- [`persona-4-ratna-two-kids-juggler.md`](./persona-4-ratna-two-kids-juggler.md) — Ratna Wulandari
- [`persona-5-linda-allergy-alert-mom.md`](./persona-5-linda-allergy-alert-mom.md) — Linda Pratiwi

---

## Feature coverage map

Which personas stress-test which M1 features:

| M1 Feature | Anya | Dewi | Siti | Ratna | Linda |
|------------|:----:|:----:|:----:|:-----:|:-----:|
| Onboarding / child profile | ✓ | | ✓ | ✓ | ✓ |
| Allergen profile | | | | | ✓ |
| Milk mode (0–5 mo) | ✓ | | | ✓ | |
| MPASI tracking (6 mo+) | | | | ✓ | |
| Meal log | | ✓ | ✓ | ✓ | ✓ |
| Today / macro snapshot | | ✓ | ✓ | ✓ | |
| Gap hints | | ✓ | ✓ | | |
| Fridge → recipe | | ✓ | | | ✓ |
| Recipe browser + preferences | | | ✓ | | ✓ |
| Allergen-safe recipe filter | | | | | ✓ |
| Picky-eater / dislike filter | | | ✓ | | |
| Weekly meal prep | | ✓ | ✓ | ✓ | |
| Growth chart | ✓ | | | ✓ | |
| Multi-child switching | | | | ✓ | |

---

## Recruiting notes

### Screening criteria (for any of the 5 segments)

- Indonesian mother, age 24–35
- Has at least one child aged 0–5 years
- Primary caregiver / nutrition decision-maker in the household
- Smartphone user (Android or iOS)
- Lives in an urban or peri-urban area (Tier 1–2 city)
- No prior sustained use of Suppa (avoid trained users for usability tests)

### Segment-specific screeners

| Persona | Extra criteria |
|---------|---------------|
| Anya (P1) | First-time mom; child currently 3–6 months old; has not started MPASI |
| Dewi (P2) | Returns to work after maternity leave; uses a helper/asisten for childcare during work hours |
| Siti (P3) | Stay-at-home mom; toddler 2–3 years old who exhibits selective eating patterns |
| Ratna (P4) | Has two or more children; youngest is 6–12 months (in MPASI phase) |
| Linda (P5) | Child has at least one confirmed food allergy; manages allergy within a multigenerational household |

### Session format recommendation

| Format | Duration | Notes |
|--------|----------|-------|
| Research interview (discovery) | 35–45 min | Core questions + 1–2 usability probes per persona guide |
| Usability test (prototype) | 45–60 min | All 3 scenarios per persona; think-aloud protocol |
| Combined (hybrid) | 60–75 min | Interview first, prototype second; best for early-stage validation |

### Incentive suggestion

- 100,000–150,000 IDR Tokopedia / GoPay voucher per session (urban Indonesia market rate as of 2026)

---

## Research goals by priority

1. **Validate the core loop** (profile → log → Today → recipe action) with time-pressured users (Dewi, Ratna).
2. **Stress-test allergen safety** — confirm zero allergy violations in recipe surfacing (Linda).
3. **Measure reassurance value** — does cumulative week-view reduce anxiety without requiring perfect logging? (Anya, Siti).
4. **Assess regional food trust** — do Indonesian recipe suggestions feel locally credible? (Siti, Ratna).
5. **Multi-child usability** — is switching between children's profiles smooth enough to justify daily use? (Ratna).
