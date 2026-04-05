# Suppa — Brand framework

**Owner:** Alvin  
**Status:** Draft  
**Last updated:** 2026-04-05  
**Canonical product context:** [`child-nutrition-app-context.md`](./child-nutrition-app-context.md)

This document defines how the **Suppa** master brand extends into **named roles, objects, and trust signals** (e.g. SuppaMom, SuppaRecipe) so product, design, and copy stay consistent.

---

## 1. Master brand

| Element | Rule |
|--------|------|
| **Name** | **Suppa** — short, warm, food-adjacent (“supper” echo without being literal). |
| **Primary use** | Product name, app title, marketing, legal entity references. |
| **Capitalization** | **Suppa** in headings, UI titles, and first mention in a block. |
| **Avoid** | Medical framing (“therapy,” “treatment,” “cure”); guilt language; implying diagnosis. |

**Positioning (one line):** Suppa makes **household nutrition visible and actionable**—planning and reassurance, not clinical care.

---

## 2. The `Suppa*` naming system

**Pattern:** `Suppa` + **one descriptive tail** (CamelCase in product/UI where you use proper nouns; **lowercase compound** acceptable in tags, slugs, and informal social).

| Form | When to use |
|------|-------------|
| **Suppa + Tail** (e.g. SuppaMom) | In-app labels, badges, feature names, marketing lines where the name is a **named concept**. |
| **suppa + tail** (e.g. suppamom) | Hashtags, handles, URL paths, internal IDs, SEO slugs—**no space**, all lowercase. |
| **“Suppa [noun]”** (two words) | Readable prose when CamelCase feels stiff: “Your Suppa household,” “a Suppa recipe.” |

**Rules**

1. **One tail only** per construct—avoid `SuppaMomVerifiedRecipe`; split into hierarchy (SuppaMom + SuppaRecipe + verified badge).
2. **Tails are nouns or noun phrases**—not verbs (`SuppaLog` as a *feature code* is OK; user-facing prefer “Meal log” with small Suppa attribution if needed).
3. **Inclusive defaults:** Primary caregiver is not always a mother—use **SuppaMom** as an **optional celebratory label** where users opt in, not as the only identity.

---

## 3. Person & household labels (user-facing)

These label **roles** in the household, not account types unless you later add billing tiers.

| Label | Working meaning | UX notes |
|-------|-----------------|----------|
| **SuppaMom** | Primary caregiver who leads nutrition planning (often mom; not exclusive). | Offer **self-ID** (“Call me SuppaMom”) or neutral “Primary caregiver” with SuppaMom as optional flair. |
| **SuppaDad** | Co-caregiver or lead dad. | Same opt-in pattern; avoids “secondary parent” vibe. |
| **SuppaChild** | The child (or children) whose profile drives safety and kid-focused suggestions. | Use per-child name in UI; **SuppaChild** as system term for “the tracked child profile(s).” |
| **SuppaHousehold** (optional) | The unit: profiles + locality + shared recipes. | Good for settings, invites later, analytics cohort naming. |

**Inclusivity guardrail:** Always provide a **neutral copy path** (e.g. “Primary caregiver,” “Parent,” “Guardian”) so Suppa* labels feel **fun optional identity**, not exclusion.

---

## 4. Content & catalog labels

| Label | Meaning | Trust / quality |
|-------|---------|------------------|
| **SuppaRecipe** | A recipe **in the Suppa system**—seeded or user-created. | Baseline: follows child constraints when shown to that household. |
| **SuppaRecipe + verified** (badge) | Recipe that passed **your** verification rules (e.g. from verified users, editorial check, or future pro review). | Define verification in product policy; badge is **not** a medical claim. |
| **My recipes / Household recipes** | Plain language for **UGC without verification**. | Keep **SuppaRecipe** for system-wide catalog identity; “Yours” for possession. |

**Naming verified recipes:** Prefer **“Verified SuppaRecipe”** or badge **“Verified”** next to title—not a new root brand like `SuppaVerifiedRecipe` unless legal/comms asks for it.

---

## 5. Voice & tone (aligned with product principles)

Drawn from [`child-nutrition-app-context.md`](./child-nutrition-app-context.md): *practical over clinical*, *respect the caregiver*, *safety-first personalization*.

| Do | Don’t |
|----|--------|
| Short, concrete next steps (“Add protein at dinner”) | Shame (“You missed…”) |
| Acknowledge imperfection (“Rough day? Log what you can.”) | Alarmist health claims |
| Celebrate small wins with **optional** Suppa* flair | Force cutesy labels on every screen |

**Suppa* labels** should feel **warm and slightly playful**, never **infantilizing** adults.

---

## 6. Implementation map (where names appear)

| Surface | Convention |
|---------|------------|
| App shell / store listing | **Suppa** |
| Navigation & page titles | Functional names (“Today,” “Recipes”); subtitle or footer “Suppa” where useful |
| Badges / achievements | **SuppaMom**, **SuppaDad**, etc. as **opt-in** display names |
| Recipe cards | Title + optional **Verified** chip; catalog kind = **SuppaRecipe** internally |
| Email / notifications | Subject: **Suppa** + concrete benefit; body can use **SuppaChild** only if personalized |
| Social / SEO | `#suppamom`, `/recipes/suppachild-snacks` style slugs |
| Legal / privacy | **Suppa** (legal entity name TBD) |

---

## 7. Extension playbook (future tails)

Before adding a new **Suppa\***, check:

1. Is it a **role**, **object**, or **trust signal**? (Pick one primary category.)
2. Does neutral copy exist for users who opt out?
3. Will it **scale** (multiple children, multiple households, locales)?

**Reserved-style ideas (use only when defined in spec):** SuppaShop (shopping hints), SuppaFridge (ingredient flow), SuppaToday (dashboard)—prefer **plain English** in UI unless the branded term aids discovery.

---

## 8. Open decisions (for you to lock)

- **Legal name** vs product name (e.g. “Suppa” app under “X Pte Ltd”).
- **Verification criteria** for the verified SuppaRecipe badge (who verifies, what evidence).
- **Default label** for primary caregiver in onboarding: neutral only vs optional SuppaMom/SuppaDad picker.

---

## References

- [`child-nutrition-app-context.md`](./child-nutrition-app-context.md) — vision, principles, V1 scope.
- [`design-m1-hifi-pages.md`](./design-m1-hifi-pages.md) — hi-fi spec and M1 HTML prototype use **Suppa** wordmark, C1–C2 disclaimers, and onboarding CTA (“Get started with Suppa”).
