# Catholic Daily App — Context

**Owner:** Alvin  
**Status:** Draft  
**Last updated:** 2026-04-06

> This is the canonical reference for this project. All decisions, scope, timeline, and ownership live here. Other docs (PRDs, decks) derive from or link to this file.

**Platform:** **Android only** (V1).  
**Locale:** **Indonesian** — all user-facing copy, navigation, and **primary content** (readings, commentary, and homily when an official **Bahasa Indonesia** text exists). Fallback for homily: show **official Latin/other text only** with clear labeling, or **link out** to Vatican source—avoid unlicensed machine translation of full homilies presented as authoritative.

---

## Goal

Build an **Android** app for Catholics in **Indonesia (and Indonesian speakers)** that surfaces **each day’s Mass readings** in **Indonesian** (the scriptures proclaimed in the Catholic liturgy per the **Indonesian liturgical calendar** where it differs from other conferences), pairs them with **the most recent prior homily from Pope Leo XIV** (see product note on timing below; Indonesian text when available), and adds a **short commentary** in Indonesian on today’s readings—so users can pray with the Church’s chosen word in one calm daily flow.

---

## What “daily Catholic chosen scriptures” means (research)

The Catholic Church does not pick arbitrary verses per day; it uses the **Lectionary**—a liturgical book of Scripture readings assigned to **Sundays, solemnities, feasts, memorials, and weekdays** according to the **liturgical calendar**.

- **Sunday cycle:** Years **A, B, C** (Gospel cycles: Matthew, Mark, John; Luke is distributed).
- **Weekday cycle:** A **two-year** cycle (Year I / Year II) for Ordinary Time, with proper readings for seasons (Advent, Christmas, Lent, Easter) and many saints’ days.
- **Regional nuance:** The **calendar of memorials/obligations** can vary slightly by **bishops’ conference** (e.g. local saints). The **readings** for a given liturgical day are largely shared; which **day** a memorial falls on may shift by conference.

**Authoritative presentation (examples; licensing/API terms apply):**

- **Indonesia (target for this app):** Daily readings in Indonesian are published through **KWI-related channels** (e.g. **[Mirifica News](https://www.mirifica.net/)** — “Jendela Alkitab” / daily readings; **verify rights and API** before ingesting). Use only **conference-approved** Indonesian Scripture text for liturgical use (e.g. **Kitab Suci** editions authorized for Indonesia).
- **United States (reference):** [USCCB Daily Readings](https://bible.usccb.org/) — useful for **structure** and calendar cross-checks, not as the shipped **Indonesian** text.
- **Holy See / universal calendar:** The **Roman Missal** and **Lectionary** define the assignment; many episcopal conferences publish the same readings online in their approved translation.

**Product implication:** **Default “home” calendar:** **Konferensi Waligereja Indonesia (KWI)** / Indonesia. State this in Settings; do not mix USCCB text with KWI calendar without explicit product intent.

---

## Pope Leo XIV homilies — “yesterday edition” (product definition)

**Pope Leo XIV** (as of 2026) is the Bishop of Rome; his **homilies** are delivered at Masses and major liturgies and are usually distributed via **Vatican media** (e.g. **[Vatican News Bahasa Indonesia](https://www.vaticannews.va/id.html)** when translated) and often republished by Catholic news outlets. Prefer **official Indonesian** full text when the Holy See or licensed partner publishes it.

**Important:** There is **not** necessarily a new papal homily every calendar day. Treat “**yesterday’s edition**” in product terms as:

- **Default:** The **latest available homily text** as of the user’s **local start of day**, or the **most recent homily before today** if you want strict “not today” semantics; or
- **Strict calendar:** If no homily was published “yesterday,” show the **most recent prior** homily and label the date clearly.

**Content rights:** Full homily texts are **copyrighted / controlled** by the Holy See and publishers. Any app needs **official feeds, license, or clearly permitted reuse**—do not assume scraping is allowed.

---

## Third block: commentary on today’s readings

- **Option A — Original:** Short daily reflection in **Indonesian**, written or reviewed **in-house** (theological review recommended).
- **Option B — Licensed:** Partner with a publisher or author with **clear rights** (Indonesian text).
- **Option C — AI-assisted:** If used, disclose it and still have **human + theological review** for doctrinal safety; this is sensitive content.

Tone should be **orthodox, pastoral, non-polemical**, and aligned with the **Magisterium** (avoid contradicting the Catechism or defined teaching). Use **natural Indonesian** (formal register where appropriate for dignity and clarity).

---

## Scope

**In scope (V1 direction):**

- **Android** app (Kotlin/Jetpack Compose or agreed stack); **Indonesian** UI (`values-in` / single-locale V1 acceptable).
- Daily presentation of **Mass readings** for the **Indonesian** liturgical calendar, in **approved Indonesian** Scripture text (within rights).
- Section for **Pope Leo XIV’s latest / previous-day homily** (per the definition above), with **clear date** and source link; **Bahasa Indonesia** when officially available.
- **Commentary** in Indonesian on today’s readings (per chosen model above).
- Basic **notifications** (optional), **offline cache** (if licensing allows), **share** reading.

**Out of scope (until decided):**

- **iOS**, **Web**, **desktop** — not V1.
- Full **Liturgy of the Hours** (different office); **Latin-only** 1962 missal readings (different product).
- **Confession scheduling**, **donations**, **parish bulletins** (unless you explicitly add them later).

---

## Key decisions

- **Platform:** **Android only** (V1).  
- **Language:** **Indonesian** for UI and primary content; homily uses official **ID** text when available, else documented fallback (see Goal).  
- **Readings source:** **TBD** — must be **KWI-consistent** Indonesian lectionary text; confirm license/API (e.g. Mirifica or other authorized publisher).  
- **Homily source:** **TBD** — prefer **Vatican News ID** or licensed syndication; update frequency and fallback UX.  
- **Commentary model (V1 direction):** **Option C — AI-assisted:** renungan may be **drafted with AI**, but every piece **must** pass **human + theological review** before publication, and the app **must disclose** AI assistance per PRD FR-14/FR-14b (exact wording TBD with counsel). **Indonesian** tone and **Magisterium-aligned** content remain mandatory (see §Third block). Options A/B remain valid for future mixes (e.g. licensed guest weeks).  
- **Name & brand:** Working title **Catholic Daily App** (replace when final; Indonesian marketing name may differ).

---

## Timeline & milestones

| Milestone | Target | Owner |
|-----------|--------|-------|
| Confirm content sources & rights | TBD | TBD |
| V1 PRD + wireframes | TBD | TBD |
| MVP (readings + homily + commentary shell) | TBD | TBD |

---

## Key risks & constraints

- **Copyright and terms of use** for Indonesian **Kitab Suci** / lectionary text, layouts, and papal texts.
- **Calendar edge cases:** **WIB/WITA/WIT** (Indonesia time zones), **KWI** feasts/memorials, when “the day” turns for the liturgy.
- **No homily days:** UX must degrade gracefully with honest labeling.
- **Homily language gap:** Not every homily may ship in Indonesian immediately—plan **transparent** fallback (date, link, optional short official summary if rights allow).

---

## Related documents

- **V1 PRD:** [`catholic-daily-app-v1-prd.md`](./catholic-daily-app-v1-prd.md) — requirements derived from this context + V1 brainstorm.  
- **Pipeline → production:** [`catholic-daily-app-packaging-to-production.md`](./catholic-daily-app-packaging-to-production.md) — how readings DB, editorial JSON, and the Play app fit together.  
- **Android scaffold:** [`android/README.md`](./android/README.md) — Gradle app, Room, `ContentRepository`, assets import.  
- **V1 design brief (hi-fi happy path):** [`catholic-daily-app-v1-design-brief.md`](./catholic-daily-app-v1-design-brief.md) — screens, states, and designer handoff.  
- **Interactive hi-fi prototype:** [`v1-hifi-prototype/index.html`](./v1-hifi-prototype/index.html) — HTML/CSS demo (`Kontrol prototipe` switches states).  
- **Brainstorm session (raw):** `_bmad-output/brainstorming/brainstorming-session-2026-04-06-112719.md` (repo root relative to workspace).

---

## References

- Mirifica News (example — Indonesian daily readings; verify rights): https://www.mirifica.net/  
- Vatican News **Bahasa Indonesia**: https://www.vaticannews.va/id.html  
- Vatican News (pope — English reference): https://www.vaticannews.va/en/pope.html  
- USCCB readings (calendar cross-check only): https://bible.usccb.org/  
- Catechism of the Catholic Church (doctrinal guardrails): https://www.vatican.va/archive/ccc/index.htm  
