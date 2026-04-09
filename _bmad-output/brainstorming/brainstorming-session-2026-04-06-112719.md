---

## stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Catholic Daily App — V1 scope and features'
session_goals: 'Define a high-fidelity happy flow (primary user path and key screens/states) for the first Android release'
selected_approach: 'ai-recommended'
techniques_used: ['Constraint Mapping', 'Persona Journey', 'SCAMPER Method']
ideas_generated: 20
context_file: 'Catholic Daily App/catholic-daily-app-context.md'
session_active: false
workflow_completed: true

# Brainstorming Session Results

**Facilitator:** Alvin
**Date:** 2026-04-06

## Session Overview

**Topic:** Catholic Daily App — V1 scope and features

**Goals:** Define a high-fidelity happy flow (primary user path and key screens/states) for the first Android release

### Context Guidance

Grounded in `Catholic Daily App/catholic-daily-app-context.md`: Android-only V1; Indonesian UI and primary content; daily Mass readings for Indonesia/KWI with approved Scripture text; Pope Leo XIV homily block with transparent dating and fallbacks when no new text; Indonesian commentary with doctrinal care; constraints around licensing, liturgical calendar (time zones, memorials), and tone.

### Session Setup

Facilitated brainstorm targeting what ships in V1 and the **single happy path** expressed at **hi-fi** depth (concrete screens, states, and transitions—not only a feature list).

## Technique Selection

**Approach:** AI-Recommended Techniques  
**Analysis context:** V1 scope and features with focus on a high-fidelity happy flow for the first Android release.

**Recommended techniques**

1. **Constraint Mapping** — Map real vs assumed limits (rights, calendar, homily availability, locale) so the hi-fi flow stays shippable.
2. **Persona Journey** — Walk the golden path as one user to surface screens, states, and emotional beats.
3. **SCAMPER Method** — Pressure-test what belongs in V1 (substitute, combine, eliminate, etc.) on top of the flow.

**AI rationale:** The product is constraint-heavy and ritual-shaped; grounding in **Constraint Mapping** avoids fantasy UI, **Persona Journey** produces the hi-fi spine, **SCAMPER** trims scope without losing the daily experience.

### Technique execution

**Techniques completed:** Constraint Mapping → Persona Journey (Beats 1–3) → SCAMPER Method  
**Status:** **Complete** — organized deliverable below (**Hi-fi designer one-pager**)

## Constraint Mapping — draft inventory (happy-path shaping)


| #   | Constraint (forces screen, copy, order, or state)                                                                                                                        | R / A (draft)                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| 1   | **Scripture text** must be **conference-approved Indonesian** lectionary (KWI-consistent); no mixing arbitrary translations with the calendar.                           | R                              |
| 2   | **Readings source** (API/partner, update rules) is **not finalized** — until closed, hi-fi must show **attribution + “content may change”** patterns.                    | A                              |
| 3   | **Homily** is not guaranteed daily; UX must support **latest prior** with **clear date** and honest **empty / link-only** variants per rights.                           | R                              |
| 4   | **Homily source** and reuse terms **TBD** — hi-fi should include **source link** affordance and a **licensed vs external** treatment.                                    | A                              |
| 5   | **Commentary** must be **Indonesian**, orthodox/pastoral tone; if AI-assisted later, **disclosure + review** — V1 hi-fi should show **byline / “reflection”** framing.   | R (tone) / A (operating model) |
| 6   | **Liturgical day** for Indonesia: **WIB/WITA/WIT** and KWI memorials can change what “today” means — hi-fi needs explicit **“liturgical date”** vs device date behavior. | R                              |
| 7   | **Offline cache** only if **licensing allows** — V1 may be **online-first** with cache as stretch; empty/offline state must be designed.                                 | A                              |
| 8   | **Android-only V1** — no parity pressure for iOS/web in the happy path.                                                                                                  | R                              |
| 9   | **No full homily in Indonesian** sometimes — fallback is **official Latin/other** with label **or** link out, not faux “official” machine translation.                   | R                              |
| 10  | **Share reading** in scope for V1 — implies **copy/export** UI and possible **snippet length** limits from rights.                                                       | R (feature) / A (limits)       |


### User confirmation

Inventory and R/A tags **confirmed correct** (session check-in).

## Constraint Mapping — R constraints → hi-fi UI hooks (draft)

*Map: what the happy path must **show** because of each **R** (and shaping **A** where noted).*


| Constraint ref | Likely surface                  | State / copy / behavior (hi-fi)                                                                                                                                            |
| -------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1              | Readings (each pericope + list) | Scripture in **one** approved Indonesian lectionary voice; **no** user-selectable translation swap in V1 unless licensed; optional subtle **“Sumber bacaan”** line.        |
| 3              | Homily block                    | **Always** show **homily date**; states: *full text ID*, *full text other + “Bahasa resmi: …”*, *excerpt + “Baca lengkap” link*, *no text — link only* with honest reason. |
| 5              | Commentary                      | Section labeled **Renungan** (or similar) + **byline** or **“Tim redaksi”**; tone visually calm; optional footnote slot for **disclosure** if model is hybrid/AI later.    |
| 6              | App shell / “Hari ini”          | Header shows **liturgical day** (e.g. memorial name when applicable) + **calendar date**; settings or long-press explains **Konferensi / zona waktu** if needed.           |
| 8              | N/A (scope)                     | Material-only Android patterns; no “download on iOS” in flow.                                                                                                              |
| 9              | Homily block                    | **Language chip** or subtitle when not Indonesian; **never** present machine-translated homily as magisterial text.                                                        |
| 10             | Readings toolbar                | **Bagikan** with preview sheet: optional **trim to N characters** + **sumber** line auto-appended.                                                                         |
| 2, 4 (A)       | Footer / “Tentang konten”       | **Attribution** block + **“Konten dapat diperbarui”**; link to canonical source where policy requires.                                                                     |
| 7 (A)          | Global                          | **Offline**: simple banner *“Tidak ada koneksi”* + retry; **no** silent stale readings unless license allows cache semantics.                                              |


**[Flow #2]**: Homily truth states  
*Concept*: Treat the homily module as a **small state machine** (ID full / other full / link-only / none) so the hi-fi prototype always shows **date + source** and never implies a daily guarantee.  
*Novelty*: Avoids the trap of a **single “article” template** that breaks when Vatican doesn’t publish or ID lags.

**[Flow #3]**: Share sheet as rights UI  
*Concept*: Share is not an OS afterthought — it’s where **snippet limits** and **attribution** are enforced in one place.  
*Novelty*: Keeps reading view **clean** while compliance lives in **one** modal.

## Constraint Mapping — A constraints: shipping workarounds (hi-fi)


| Ref                       | Risk while **A**                                | Workaround so hi-fi / MVP stays shippable                                                                                                                                                                                                                                                                                          |
| ------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2** Readings source TBD | Wrong partner in prototype; legal surprise late | Design **provider-agnostic** readings screen: fixed slots for **title, pericopes, attribution line, “Diperbarui: …”** timestamp. Hi-fi uses **placeholder** publisher string; engineering gets **single ContentRepository** seam so UI does not change when source changes.                                                        |
| **4** Homily rights TBD   | Scraping or implied endorsement                 | **No** full text in-app until license clear: hi-fi still shows **card** (date, locale chip, 2-line summary *if* rights allow) + primary **“Baca di sumber resmi”** (Vatican News ID / Holy See). If license arrives, same card expands to **in-app reader** without navigation redesign.                                           |
| **7** Offline / cache TBD | Stale scripture or breach of terms              | **Branch in hi-fi:** (a) **Online-first V1** — banner + retry, readings greyed or last-known **with big “Cache — periksa pembaruan”** if you allow; (b) **Licensed offline** later — explicit **“Unduh bacaan hari ini”** action + expiry. Never imply offline text is **liturgically current** without a **date + source** stamp. |


**[Flow #4]**: Content provider seam  
*Concept*: Treat readings and homily as **two plug-in feeds** behind identical UI contracts so **A** constraints resolve in **backend/legal**, not in **layout churn**.  
*Novelty*: Product and design can **freeze** the happy-path frame while **source rows** in the inventory move from A → R.

**[Ops #1]**: Legal staging lane  
*Concept*: Ship **link-first homily** in V1 if needed; **in-body homily** as **v1.1** toggle when Vatican / partner terms allow—same **state machine**, different **content payload**.  
*Novelty*: Turns a **rights blocker** into a **phased release** instead of a **prototype lie**.

**[Trust #1]**: Stale-content honesty  
*Concept*: Any cached or offline reading shows **liturgical date + “Terakhir diperbarui”** so users trust the app in **WIB/WITA/WIT** edge cases.  
*Novelty*: **Compliance** and **pastoral trust** share one **timestamp pattern** (orthogonal to “features”).

### Constraint Mapping — closure

**A-row workarounds** captured; **homily** sourcing intent aligned with **Holy See / Vatican** channels (see project context). Proceeding to **Persona Journey** for screen-by-screen happy path.

## Persona Journey — Beat 1 (cold open) — user-authored

**Persona (implicit):** Daily user opening for *today’s* spiritual content (“hari ini”).

**User story (happy path):**

1. **Tap app icon** → land on **one vertical page**: **today’s scriptures** first. User expects the Catholic pattern **Bacaan I, Bacaan II, Injil** (three blocks). Scroll down → **homily** (if available) → **editorial commentary** (*renungan* / redactional).
2. **Motivation:** Read **today’s** thing—temporal alignment with the liturgical day matters emotionally and practically.
3. **Early bounce risks:** **Slow load**; **unclear visual hierarchy** (“what do I read first?”); **ads**.

**Product note (lectionary layout):** Many **weekdays** in the Ordinary Form use **two** Scripture readings (First + Gospel) plus psalm; **Sundays/solemnities** use **three** readings + Gospel. Hi-fi should use a **flexible readings stack** (hide empty slots) so the same scroll model works every day without breaking trust.

**Hi-fi spine — draft (Beat 1 → scroll):**


| Step | Surface                           | State / content                                                                                                               |
| ---- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| S0   | **Splash / cold start** (minimal) | Fast path to content; skeleton only if needed—**target: no “stuck” blank**.                                                   |
| S1   | **“Hari ini” scroll root**        | Sticky subheader: **liturgical day + date** (from Constraint Mapping). Body opens with **Bacaan I** (title, reference, text). |
| S2   | Same scroll                       | **Bacaan II** (or **hidden / omitted** when lectionary has no second reading that day).                                       |
| S3   | Same scroll                       | **Injil** block (visually distinct—e.g. subtle emphasis per brand).                                                           |
| S4   | Same scroll                       | **Homili Paus** module (state machine: full ID / other / link / none—date + source always).                                   |
| S5   | Same scroll                       | **Renungan** (byline / editorial framing).                                                                                    |
| S6   | Optional chrome                   | **Bagikan**, **Tentang konten**, overflow per earlier constraints—secondary to scroll.                                        |


**V1 positioning vs bounce risks**

- **Load:** Prioritize **readings-first** payload; defer non-critical assets; **inline skeleton** that mirrors final layout (reduces “unclear”).  
- **Hierarchy:** First pixel is **Bacaan I** headline + first verse—no interstitial chooser.  
- **Ads:** Treat as **anti-goal** for pastoral trust; **no ads** in hi-fi happy path unless strategy explicitly changes.

**[Journey #1]**: Single-scroll daily office  
*Concept*: One **continuous column** mirrors **one liturgical “session”**—scripture → papal word → local reflection—without tab confusion.  
*Novelty*: **Navigation simplicity** as a spiritual feature: fewer decisions, more reading.

**[Journey #2]**: Reading-count honesty  
*Concept*: **Dynamic stack** (2 vs 3 readings) with **no shame** empty states—slots **collapse** rather than “missing content” errors.  
*Novelty*: Prevents weekday users from thinking the app is **broken** when the Church only assigns two readings.

### Persona Journey — Beat 2 (emotion): Injil → homily threshold

**User choice:** **B** — what the user **sees and feels** in the **narrow band** between the end of **Injil** and the start of **Homili Paus**.

**Emotional job-to-be-done**

- The user has just finished **the Gospel**—often the **emotional peak** of the readings. The next block is **not** more Scripture; it is **the Pope’s homily** (when available)—a shift from **proclamation** to **pastoral unpacking**.
- The UI should signal **continuity with the Church** without **inflating** the moment: calm, dignified, **one breath** before the next voice.

**Hi-fi treatment (“two inches of scroll”)**


| Layer                  | Recommendation                                                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Space**              | **Extra vertical padding** after Injil body (e.g. +24–32dp) so the eye **rests**—not slammed into a card.                                                                                      |
| **Divider**            | **Thin rule** or **low-contrast hairline** full-bleed; optional **very subtle** liturgical-neutral motif (avoid loud flourish).                                                                |
| **Bridge label**       | One line of **quiet secondary text** (caption style), e.g. **“Setelah Injil”** or **“Renungan dari Pengajar Gereja”** — *or* skip text and rely on space + card title if copy feels redundant. |
| **Homily card header** | Always: **“Homili Paus”** (or agreed product name) + **date** + **source chip** (Vatican / Holy See link pattern). Tone: **factual**, not hype.                                                |


**If homily is link-only or not in Indonesian**

- The **threshold** stays the same (space + divider): **dignity before disclosure**. Card body: short honest line + **“Baca di sumber resmi”**—user never feels the **Gospel ended in a cliffhanger**; they feel **guided** to the next legitimate step.

**If homily missing / delayed**

- Card still appears with **date of latest** or **“Belum tersedia”** with **explanation**, not an empty hole—**threshold rhythm** preserved.

**[Journey #3]**: Gospel exhale  
*Concept*: Treat the **post-Injil gap** as intentional **“exhale”** whitespace—micro-pause before another authority voice.  
*Novelty*: Uses **layout rhythm** as **pastoral UX**, not decoration.

**[Journey #4]**: Authority handoff  
*Concept*: **One-line bridge** (optional) names the **shift** from **Kitab Suci** to **homili** without theology jargon—helps first-time users.  
*Novelty*: Reduces **“what is this block?”** anxiety at exactly the **highest** emotional point.

**[Journey #5]**: Dignified fallback runway  
*Concept*: Same **spacer + divider + card frame** for **link-only** and **missing** homily states so **failure modes** feel **considered**, not broken.  
*Novelty*: **Continuity** under **rights constraints**—the scroll still **flows**.

### Persona Journey — Beat 3 (interaction): **Bagikan** dari dalam bacaan

**User intent (interpreted):** “**ools**” → **tools** — walk **share** from **Bacaan I** or **Injil**.

**Trigger**

- Each reading block (**Bacaan I**, **Bacaan II**, **Injil**) has a **lightweight toolbar** or **top-trailing overflow** (⋮) with **Bagikan** (and optionally **Ukuran teks** — see below). **V1 default:** share **this entire pericope block** (reference + title + full text shown in app), not free-form text selection—selection-share can be **V1.1** if rights/UI cost is high.

**Flow (hi-fi)**


| Step | UI                                 | Notes                                                                                                                                                                             |
| ---- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1   | User taps **Bagikan** on **Injil** | Focus stays on reading; **bottom sheet** rises (Material).                                                                                                                        |
| T2   | **Sheet: header**                  | **“Bagikan Injil”** + liturgical date line (small).                                                                                                                               |
| T3   | **Sheet: pratinjau**               | Scrollable **plaintext preview** of what will be copied/shared; if rights cap length, show **“Akan dipotong sesuai aturan sumber”** + **character count** / soft trim indicator.  |
| T4   | **Sheet: tail (non-optional)**     | Auto-appended block: **reference** (e.g. pericope), **“Sumber: …”**, **“Aplikasi: …”** (app name), optional **link** if policy allows. User **cannot** turn off **sumber** in V1. |
| T5   | **Actions**                        | **Salin teks** (primary) + **Bagikan ke…** (system share intent). Success: snackbar **“Disalin”** / standard share result.                                                        |
| T6   | **Dismiss**                        | Swipe down or tap scrim; return to **same scroll position** in the reading.                                                                                                       |


**Ukuran teks (same “tools” family)**

- **Optional V1:** **A–A+** or slider in **overflow** or **Settings**; applies **globally** to reading body (not homily card typography unless unified token set). Keeps **one-scroll** model simple.

**Edge cases**

- **Offline / stale cache:** Preview still includes **“Terakhir diperbarui: …”** line in sheet if content is cached (aligns with **[Trust #1]**).  
- **Homily share:** **Out of happy-path tools beat** for V1 unless rights explicit—default **share readings only** or **“Bagikan tautan homili”** only.

**[Journey #6]**: Pericope-scoped share  
*Concept*: **Bagikan** is **anchored to the lectionary unit** the user is reading, not a global “share today”—cleaner rights story and clearer pastoral snippet.  
*Novelty*: Matches **mental model** (“I’m sharing *this* Gospel”) with **one** obvious control per block.

**[Journey #7]**: Attribution as fixed footer  
*Concept*: **Sumber + app** lines are **part of the payload**, not optional toggles—reduces accidental stripped shares.  
*Novelty*: **Compliance** embedded in the **happy path** of sharing.

**[Tools #1]**: Reading-only tool surface  
*Concept*: Keep **tools** thin: **Bagikan** + **font**; defer highlights, notes, audio to later.  
*Novelty*: Protects **load** and **clarity** bounce risks from Beat 1.

## SCAMPER Method — V1 single-scroll happy path

*Apply each lens to what ships in **V1** vs **later**.*


| Lens                    | Question (for this app)                            | **V1 bias** (proposal)                                                                                                                                                                                                  | **Later**                                                          |
| ----------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **S** Substitute        | What could we swap for something cheaper or safer? | **In-app full homily** → **official link / excerpt card** if license lags; **selection-share** → **whole pericope share**.                                                                                              | In-app full homily reader; verse-level share.                      |
| **C** Combine           | What could we merge?                               | **Readings + homily + renungan** in **one scroll** (already chosen); **“Tentang konten”** combined into **one footer sheet** (attribution + KWI note + refresh time).                                                   | Separate “Arsip” or search—post-V1.                                |
| **A** Adapt             | What could we borrow from elsewhere?               | Adapt **reading block pattern** from strong lectionary apps (title → ref → body) **without** copying their text; use **Material 3** sheets for share/settings like other reading apps.                                  | Audio homily, community features—only if licensed.                 |
| **M** Modify            | What could we magnify, shrink, or tune?            | **Magnify** whitespace at **Injil → homily** boundary; **shrink** chrome (no tab bar—**optional** bottom nav **hidden** on home scroll if single-route V1); **tune** typography scale with **one global** reading size. | Thematic “mode” or contrast themes.                                |
| **P** Put to other uses | What else could this do?                           | **Share sheet** doubles as **rights enforcement** (preview + fixed **sumber**); **sticky header** doubles as **orientation** (liturgical day + date).                                                                   | Same sheet pattern for **“laporkan kesalahan”** editorial—post-V1. |
| **E** Eliminate         | What could we cut?                                 | **Tabs** on home, **ads**, **translation picker**, **parish bulletin**, **iOS**, **confusing multi-home layouts**, **optional** second entry screen (splash beyond cold start).                                         | Anything that competes with “open → read today.”                   |
| **R** Reverse           | What if we flipped order or logic?                 | **Do not** put **renungan** above Scripture; **do** reverse **failure** into **honesty** (show **“belum tersedia”** early, not blank). **Optional dev-only:** reverse-order preview for QA—not user-facing.             | “Reflect first” mode—likely off-brand for V1.                      |


**[V1-S]**: Link-first homily default  
*Concept*: Substitute **risky full-text** with **canonical outbound** until **Holy See / partner** terms allow in-app storage.  
*Novelty*: **Ships** the same **card + date + source** story without **legal fiction**.

**[V1-C]**: Single footer of truth  
*Concept*: One **sheet** aggregates **sumber bacaan**, **sumber homili**, **KWI / zona waktu**, **diperbarui**—reduces scattered legal microcopy.  
*Novelty*: **Trust** UI as **one place** instead of **three** footers.

**[V1-A]**: Lectionary layout clone, text original  
*Concept*: **Steal structure**, not **scripture strings**—familiar rhythm for Catholics, **your** licensed body.  
*Novelty*: **Low learning curve** without **IP collision**.

**[V1-M]**: Gospel exhale as spec  
*Concept*: **Padding + divider** are **specified dp** in hi-fi, not “designer vibes”—so engineering preserves **pastoral rhythm**.  
*Novelty*: Emotion becomes **measurable**.

**[V1-P]**: Sticky header as compass  
*Concept*: **Liturgical identity** always visible while scrolling long readings—reduces “is this today?” anxiety.  
*Novelty*: **Orientation** without **extra** navigation.

**[V1-E]**: Ruthless home scope  
*Concept*: **Eliminate** everything that is not **read / share / adjust text / about content / settings stub**.  
*Novelty*: **Bounce-risk** list (load, clarity, ads) addressed by **subtraction**.

**[V1-R]**: Honest-empty inversion  
*Concept*: **Reverse** the instinct to **hide** missing homily—**surface** the card with **clear state** so absence feels **intentional**.  
*Novelty*: **Trust** over **fake completeness**.

## Idea organization and prioritization

**Session output:** 20 tagged ideas across 3 techniques; focus preserved on **V1 hi-fi happy flow** (Android, Indonesian, KWI-grounded).

### Thematic clusters

**Theme 1 — Trust, rights, and honesty**  
*Ideas:* [Flow #2], [Flow #3], [Trust #1], [Journey #7], [V1-S], [V1-C], [V1-R], A-row workarounds (2, 4, 7).  
*Pattern:* **Compliance is UX**—attribution, timestamps, homily state machine, share payload, honest empty states.

**Theme 2 — Single-scroll liturgical rhythm**  
*Ideas:* [Journey #1]–[Journey #5], [Journey #2], [V1-M], [V1-P], [V1-E], S1–S5 spine.  
*Pattern:* **One column** = one prayerful session; **dynamic reading count**; **Injil → homily** threshold as designed pause.

**Theme 3 — Ship under unresolved backends**  
*Ideas:* [Flow #4], [Ops #1], [V1-A], ContentRepository seam, link-first homily.  
*Pattern:* **Freeze the frame**, swap feeds when readings/homily sources move from **A → R**.

### Prioritization (facilitator synthesis → session goals)

Aligned to **hi-fi happy flow** delivery, not full product build:


| Priority | Item                                                                                       | Rationale                                                    |
| -------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| P0       | **SCR-HariIni** scroll with **sticky liturgical header** + **Bacaan I / II / Injil** stack | Core user story; first pixel = clarity.                      |
| P0       | **Homili Paus** card **state machine** (all states in Figma)                               | Highest legal/emotional risk if wrong.                       |
| P0       | **Bagikan** bottom sheet with **preview + fixed sumber tail**                              | V1 scope + rights in one pattern.                            |
| P1       | **Injil → homily** spacer + divider (**dp-spec’d**)                                        | Pastoral rhythm; easy to “value engineer” away without spec. |
| P1       | **Tentang konten** single sheet (sources, KWI/zona waktu, diperbarui)                      | Replaces scattered footers ([V1-C]).                         |
| P1       | **Loading / offline / error** on main scroll                                               | Bounce risks from Beat 1.                                    |
| P2       | **Ukuran teks** (global) + minimal **Settings** entry                                      | Accessibility; keep thin.                                    |
| P2       | **Renungan** block (byline + calm styling)                                                 | In happy path after homily.                                  |


### Action plan (next steps)

1. **Design (this week):** Build hi-fi in Figma (or tool of choice) using **Hi-fi designer one-pager** below; annotate **states** on homily card + share sheet.
2. **Legal / product (parallel):** Close **readings** + **homily** source rows (A → R); confirm **snippet** rules for share.
3. **Copy (parallel):** Indonesian strings for **homily states**, **offline**, **Tentang konten**, bridge line optional copy (**“Setelah Injil”** vs title-only).
4. **Engineering spike (optional):** Sketch **ContentRepository** + **homily payload** types so UI does not change when feeds change.

**Success indicators:** Designers can prototype **one complete day** (Sunday + weekday variant) without open questions on **homily** or **share**; stakeholders see **no ads** and **no tabbed home** in V1 story.

---

## Hi-fi designer one-pager — screens and modals


| ID     | Screen / modal                                  | Purpose                                                                                                           |
| ------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **S0** | Cold start / splash (minimal)                   | Reach **Hari ini** fast; optional branded flash only if instant.                                                  |
| **S1** | **Hari ini** (main vertical scroll)             | Single home: readings → homily → renungan.                                                                        |
| **S2** | **Sticky subheader** (region of S1)             | **Liturgical day** + **calendar date**; optional overflow → **Tentang konten** / Settings.                        |
| **S3** | **Bagikan** (bottom sheet)                      | Pericope title, preview, trim notice, **non-optional sumber tail**, **Salin** / system share.                     |
| **S4** | **Tentang konten** (full-height sheet or modal) | **Sumber bacaan**, **sumber homili**, **KWI / zona waktu**, **konten dapat diperbarui**, **terakhir diperbarui**. |
| **S5** | **Settings** (light)                            | **Ukuran teks**, notifications stub (if in V1), **tentang aplikasi** link.                                        |


*No second “home” or tab bar in V1 unless you explicitly add it later.*

---

## State checklist (hi-fi must show every variant)

### A. Global / shell

- **G1** Loading: skeleton **matches** final stack (not blank spinner).  
- **G2** Offline / no network: **banner** + retry; optional last-known with **cache honesty** ([Trust #1]).  
- **G3** Readings fetch error: inline **retry** without losing scroll position intent.

### B. Readings stack (within S1)

- **R1** Weekday **two-reading** layout (Bacaan II **collapsed** / omitted).  
- **R2** Sunday / solemnity **three-reading** layout (I + II + Injil).  
- **R3** Injil **visually distinct** from other readings.  
- **R4** Optional per-block **⋮** → **Bagikan** (+ optional **Ukuran teks**).

### C. Injil → homily threshold

- **T1** **Extra padding** after Injil (target **24–32dp**).  
- **T2** **Hairline divider** full width.  
- **T3** Optional **caption** bridge line (or deliberate omission).

### D. Homili Paus card

- **H1** Full text **Bahasa Indonesia** (when licensed).  
- **H2** Full text **non-ID** with **official language** label + no fake MT.  
- **H3** **Excerpt** in-app + **Baca lengkap** → official URL.  
- **H4** **Link-only** (no in-app body).  
- **H5** **None / belum tersedia** — card still present, **date** + explanation.  
*All states: **date** + **source** visible.*

### E. Renungan

- **N1** Loaded: body + **byline** / **Tim redaksi**.  
- **N2** Loading / error: calm inline treatment (no harsh alert unless needed).

### F. Bagikan sheet (S3)

- **F1** Preview matches **copy payload** including **sumber** (cannot disable).  
- **F2** Rights **trim** messaging + indicator if applicable.  
- **F3** Cached content: **terakhir diperbarui** in preview when relevant.

---

## Session summary and insights

**Achievements**

- Constraint → UI mapping for **R** and **A** rows; **homily** framed as **Holy See / Vatican**-aligned with **link-first** fallback path.  
- **Single-scroll** happy path with **2 vs 3** reading behavior and **Injil → homily** emotional transition **specified**.  
- **Share** designed as **rights-first** bottom sheet.  
- **SCAMPER** used to **cut** tabbed home, ads, translation picker for V1.

**Breakthroughs**

- **Homily as state machine** + **dignified empty** ([Flow #2], [V1-R]).  
- **One “Tentang konten”** truth sheet ([V1-C]).  
- **Gospel exhale** as measurable layout ([V1-M], [Journey #3]).

**Creative strengths observed**

- Clear **user mental model** (scripture first, today matters).  
- Early **bounce-risk** awareness (load, hierarchy, ads).

---

*Workflow: brainstorming session documented and organized. For a future pass: stakeholder review of P0 Figma + legal confirmation on share trim and homily embedding.*