# Catholic Daily App — V1 Product Requirements Document (PRD)

**Owner:** Alvin  
**Status:** Draft  
**Last updated:** 2026-04-06  
**Canonical context:** `[catholic-daily-app-context.md](./catholic-daily-app-context.md)`  
**Inputs:** Brainstorm session `_bmad-output/brainstorming/brainstorming-session-2026-04-06-112719.md`

This PRD defines **V1 scope** and **product behavior** for the first Android release. **Hi-fi layout, states, and designer checklist** live in `[catholic-daily-app-v1-design-brief.md](./catholic-daily-app-v1-design-brief.md)`.

---

## 1. Summary

**Catholic Daily App** (working title) is an **Android-only** app for Catholics in **Indonesia** (and Indonesian speakers) that presents **today’s Mass readings** in **approved Indonesian** lectionary text (KWI-consistent calendar), a **Pope Leo XIV homily** block (Holy See / Vatican–aligned sourcing, with honest fallbacks), and a short **Indonesian commentary** (*renungan*)—in **one calm daily flow**.

V1 optimizes for a **single primary happy path**: open the app → read today’s scriptures → continue to homily → continue to commentary, with **trust-first** handling of rights, missing content, and share.

---

## 2. Goals


| Goal                                        | Measurable signal (V1)                                                                                                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Daily engagement with the Church’s readings | User can complete **readings + homily block + renungan** without leaving the home scroll (where content exists).                                                  |
| Trust and clarity                           | **Liturgical day** and **sources** are visible; **no** misleading “daily homily guaranteed” impression; **no** unlicensed full homily presented as authoritative. |
| Share responsibly                           | User can **share a pericope** with **non-removable attribution** per policy.                                                                                      |
| Performance clarity                         | First meaningful content is **readings**; loading uses **layout-faithful** skeletons (not blank spinners).                                                        |


---

## 3. Non-goals (V1)

- iOS, web, desktop.
- Tabbed “portal” home, ads, or translation pickers that compete with “read today.”
- Full Liturgy of the Hours; 1962 missal product.
- Parish bulletins, donations, confession scheduling (unless explicitly added later).
- **Verse-level share** and **in-app full papal homily** if **rights are not cleared**—use **link-first / excerpt** patterns until licensed.

---

## 4. Personas (light)

- **Primary:** Practicing Catholic in Indonesia who wants **today’s** readings and a **short guided read** (scripture → Pope’s word → reflection) in **Indonesian**, on a phone, often in a short window.
- **Secondary:** Indonesian-speaking diaspora user with same mental model; **KWI** calendar remains default unless product later adds conference selection.

---

## 5. V1 functional requirements

### 5.1 Home experience: single vertical scroll (“Hari ini”)

- **FR-1** On cold start, user reaches the **main daily content** quickly; splash is **minimal** if present at all.
- **FR-2** The default view is **one scroll** containing, in order: **Bacaan I** → **Bacaan II** (when assigned) → **Injil** → **Homili Paus** → **Renungan**.
- **FR-3** **Sticky subheader** (or equivalent persistent orientation) shows **liturgical day** and **calendar date**, appropriate to **KWI** and Indonesia time zones (WIB/WITA/WIT). User can understand **“what day”** the Church is observing.
- **FR-4** **Weekday vs Sunday/solemnity:** When the lectionary assigns only **two** Scripture readings (plus psalm, per liturgical norms), **Bacaan II** is **omitted or collapsed**—never shown as an error state.
- **FR-5** **Injil** is **visually distinct** from other readings (brand-appropriate emphasis).

### 5.2 Readings content

- **FR-6** Scripture text is **conference-approved Indonesian** lectionary text, **KWI-consistent**; no arbitrary mixing of translations with the calendar.
- **FR-6b** Assigned readings for the day are shown **in full** in the main scroll—**no** “baca selengkapnya” / expander for normal lectionary text.
- **FR-7** Optional per-reading **source** line (*sumber bacaan*) and **last updated** metadata when required by partner/API policy.
- **FR-8** Readings **fetch failure** and **retry** are handled **inline** without abandoning the scroll model.

### 5.3 Homily block (Pope Leo XIV)

- **FR-9** Homily content is sourced per **Holy See / Vatican** official or **licensed** channels (e.g. Vatican News Bahasa Indonesia when available). **Scraping** is not an acceptable default.
- **FR-10** The homily UI is a **state machine**. **Every** state shows **homily date** and **source** affordance (e.g. footnote link). **Default UX:** when rights allow, show the **full homily body** in the same scroll—**no** primary “read more” control that hides the magisterial text. States include at minimum:
  - Full text **Bahasa Indonesia** (when licensed).
  - Full text **non–Bahasa Indonesia** with **clear official-language** labeling; **no** faux-official machine translation of full homily.
  - **Rights-limited** variants only if legal requires: e.g. outbound-only viewing—still **honest** copy on screen (not a teaser framed as complete).
  - **None / not yet available**—section still present with **full** on-screen explanation (not an empty hole).
- **FR-11** Product copy does **not** imply a **new homily every calendar day**; **latest prior** homily is shown with **clear dating** (per context doc).

### 5.4 Commentary (*renungan*)

- **FR-12** Short **Indonesian** commentary follows homily in the same scroll.
- **FR-13** **Byline** or editorial attribution (*Tim redaksi*, author, or equivalent).
- **FR-14** **V1 commentary model** is **AI-assisted (Option C in context)** with **mandatory human + theological review** before any piece is published to users. **UI reserves space for disclosure** in the renungan block (and **Tentang konten** must not hide it); exact **Bahasa Indonesia** disclosure string **TBD with counsel** / theological advisor.
- **FR-14b** Published editorial payloads (static JSON → Room) **must** record **`ai_assisted`** and **`human_reviewed`** accurately. **Do not** ship production renungan with **`human_reviewed=false`** unless a **documented pilot** explicitly allows it and **legal/theological sign-off** is recorded.

### 5.5 Share

- **FR-15** User can **share** from **each pericope block** (Bacaan I, II, Injil) via **Bagikan**.
- **FR-16** V1 default: share **entire pericope** shown in-app (reference + title + text), not free-form selection (selection-share is a **later** enhancement unless rights/UI allow earlier).
- **FR-17** Share flow uses a **bottom sheet** with **preview**; **sumber + app attribution** are **part of the payload** and **cannot** be disabled in V1.
- **FR-18** If rights require **length limits**, preview shows **trim** behavior and messaging.
- **FR-19** Homily share: **only** if explicitly allowed—otherwise **link-only** share for homily.

### 5.6 Tentang konten & settings (thin)

- **FR-20** **Tentang konten** aggregates **readings source**, **homily source**, **KWI / time-zone** note, **content may change**, **last updated**—**one** place for trust copy (not scattered footers).
- **FR-21** **Settings (light):** at minimum entry to **text size** (*ukuran teks*) for reading body; **notifications** remain **optional** per context; **tentang aplikasi** as needed.

### 5.7 Offline / cache

- **FR-22** If V1 is **online-first**, show **clear offline** state (banner + retry). If cached content is shown, show **honest** **last updated** / liturgical date semantics—**no** silent stale presentation as “fresh today” unless license permits defined cache behavior.

---

## 6. Non-functional requirements

- **NFR-1** **Android** Material Design **3** patterns; **Indonesian** UI strings.
- **NFR-2** **Accessibility:** support **global reading text scaling** (P2 in design priority but strongly recommended for launch quality).
- **NFR-3** **Performance:** prioritize **readings-first** payload; avoid long blank states (skeleton matches layout).
- **NFR-4** **Privacy & analytics:** TBD; default to **minimal** collection until policy is written.

---

## 7. Content, legal, and compliance

- Confirm **readings** license/API (KWI-consistent Indonesian text).
- Confirm **homily** reuse terms (in-app full text vs link-out).
- Confirm **share** snippet limits and required attribution strings.
- **AI-assisted renungan:** disclosure copy, reviewer accountability, and **Play Store / regional** expectations for AI-labelled content (update policies as platforms require).
- All user-facing claims about authority and language must match **context** doc guardrails.

---

## 8. Success metrics (initial)

- Qualitative: hi-fi covers **Sunday + weekday** reading layouts and **all homily states** without ambiguity.
- Pilot (post-build): **D1 retention** on notification opt-in (if used); **share** usage; **support** contacts about “wrong day” / calendar (should trend down with clear header).

---

## 9. Open questions

1. Final **readings** data partner and **update** cadence.
2. Final **homily** ingestion: in-app vs **link-first** for store submission v1.0.
3. **Commentary:** V1 direction is **Option C** (AI-assisted + human/theological review + disclosure)—remaining work: **disclosure strings**, reviewer workflow, and **compliance** sign-off.
4. **Notifications** copy and default opt-in policy (Indonesia-specific norms).
5. **Marketing / Indonesian** app name.

---

## 10. Milestones (suggested)


| Milestone | Output                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------- |
| Now       | PRD + design brief (this folder); context remains source of truth for doctrine/calendar research. |
| Next      | Hi-fi Figma (or equivalent) **P0** screens + homily + share states.                               |
| Then      | Legal sign-off on content + share; engineering **ContentRepository** contract frozen.             |
| Build     | Android MVP aligned to PRD §5.                                                                    |


---

## 11. References

- `[catholic-daily-app-context.md](./catholic-daily-app-context.md)`
- `[catholic-daily-app-v1-design-brief.md](./catholic-daily-app-v1-design-brief.md)`
- Brainstorm: `_bmad-output/brainstorming/brainstorming-session-2026-04-06-112719.md`

