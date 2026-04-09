# Catholic Daily App — V1 Design Brief (Hi-fi happy path)

**Owner:** Alvin  
**Status:** Draft  
**Last updated:** 2026-04-06  
**Product spec:** [`catholic-daily-app-v1-prd.md`](./catholic-daily-app-v1-prd.md)  
**Canonical context:** [`catholic-daily-app-context.md`](./catholic-daily-app-context.md)  
**Brainstorm source:** `_bmad-output/brainstorming/brainstorming-session-2026-04-06-112719.md`

This brief tells design **what to draw** for V1 **high-fidelity** prototypes: **screens**, **components**, and **every required state**. It does not replace the PRD for prioritization or legal scope.

---

## 1. Design principles

1. **One breath, one column** — The home experience is a **single vertical scroll** for scripture → homily → renungan. Avoid tab bars or competing “homes.”
2. **Trust is visible** — Sources, dates, and “content may change” live in predictable places (**Tentang konten**, headers, share tail).
3. **Honest empties** — Missing homily is a **designed card state**, not whitespace.
4. **Pastoral rhythm** — After **Injil**, use **intentional space** before the homily card (handoff from **proclamation** to **teaching**).
5. **No ads** on the V1 happy path** — Preserves focus and credibility unless strategy explicitly changes (then re-brief).

---

## 2. Screen & modal inventory (deliverables)

| ID | Artifact | Notes |
|----|----------|--------|
| **S0** | Cold start / splash | Minimal; instant handoff to **Hari ini** if possible. |
| **S1** | **Hari ini** main scroll | Primary deliverable; contains readings + homily + renungan. |
| **S2** | **Sticky subheader** (part of S1) | **Liturgical day** + **calendar date**; overflow → **Tentang konten** / Settings. |
| **S3** | **Bagikan** bottom sheet | Per-reading entry; see §5. |
| **S4** | **Tentang konten** sheet | Single aggregated trust surface. |
| **S5** | **Settings** (light) | **Ukuran teks**; optional notifikasi stub; tentang aplikasi. |

**P0 for Figma:** S1 (with S2), S3, S4, and **all states** in §4–§5.  
**P1:** S0, S5, global loading/offline.  
**P2:** Polish, motion, illustration system (if any).

---

## 3. Information architecture (V1)

```text
Hari ini (scroll)
├── Sticky: liturgical day + date [+ overflow]
├── Bacaan I  [⋮ → Bagikan]
├── Bacaan II [omit on 2-reading days] [⋮ → Bagikan]
├── Injil     [⋮ → Bagikan]
├── [threshold: padding + divider + optional caption]
├── Homili Paus (card — state variants)
├── Renungan
└── (entry to Tentang konten — header/overflow/footer as you prefer)

Modals / sheets
├── Bagikan (per pericope)
├── Tentang konten
└── Settings
```

---

## 4. Layout specs

### 4.1 Readings stack (seamless stream)

- **No reading “cards”:** One continuous column on the same background; separate readings with a **faded horizontal rule** (gradient hairline), not elevated surfaces.
- **R1 Weekday (two readings):** Show **Bacaan I** + **Injil** only; **do not** show an empty Bacaan II slot.
- **R2 Sunday / solemnity (three readings):** **Bacaan I**, **Bacaan II**, **Injil**.
- **R3** **Injil** is distinct via **typography** and/or a **subtle left accent** (not a boxed card).
- **R4** Each pericope block: heading (label + reference), **full body text on screen** (no “baca selengkapnya” to reveal scripture); optional **sumber** line; **⋮** menu: **Bagikan** (required); **Ukuran teks** optional (can live in Settings instead).

### 4.2 Injil → homily threshold

- **T1** **24–32dp** (or design-token equivalent) **extra padding** below Injil body.
- **T2** Full-bleed **hairline** divider, low contrast.
- **T3** Optional **caption** line (e.g. *Setelah Injil*) — **A/B** in copy; hi-fi should show **both** variants for stakeholder pick.

### 4.3 Homili Paus (seamless section)

- **No homily card chrome** in V1 layout: same seamless stream; optional **faded rule** before the section (after Injil threshold).
- Section **always** shows: **title** (e.g. *Homili Paus*), **date**, status line, then **full body on screen** whenever official text is available (see §5).
- **Sumber** appears as a **small foot line** (text link), not a primary “read more” button that gates the content.

### 4.4 Renungan

- Section title (*Renungan* or agreed product term), **byline**, body, calm spacing (avoid “blog noise”).

---

## 5. Homily — state matrix (must design all)

**Principle:** When the Church’s text is licensed for in-app display, the user reads the **full homily in the scroll**—no **“baca selengkapnya”** pattern for core content. If rights only allow outbound viewing, product/legal must still choose honest UX (see context); the **visual pattern** remains “everything that we may show is already visible.”

| State | On screen | Sumber (footnote) |
|-------|-----------|-------------------|
| **H1** Full **ID** | Entire official Indonesian text in the column | Optional text link to canonical URL. |
| **H2** Full **non-ID** official | Entire official text + clear **language** label | Text link to official publication. |
| **H3** (demo / variant) | Full text on screen (same principle as H1) | Text link. |
| **H4** | Full text on screen **if** license allows; otherwise only what legal approves—still **no** fake “teaser + read more” for magisterial text | Text link as attribution. |
| **H5** None / delayed | Full **explanation** on screen (why empty, what user can do spiritually) | Link to official site for user-initiated check. |

**Never:** Present **machine-translated** full homily as if it were **official** Indonesian.

---

## 6. Bagikan bottom sheet (S3)

**Flow**

1. Header: e.g. *Bagikan Injil* + small **liturgical date** line.
2. **Preview** scroll: plaintext that matches **exact** share payload.
3. If **trim** required: inline notice (*Akan dipotong sesuai aturan sumber*) + indicator.
4. **Fixed footer in payload** (not togglable): reference, **Sumber: …**, **Aplikasi: …**, optional URL per rights.
5. Actions: **Salin teks** (primary), **Bagikan ke…** (system).
6. Dismiss returns to **same scroll offset**.

**Offline / cache:** If showing cached reading, include **Terakhir diperbarui** in preview when applicable.

---

## 7. Tentang konten (S4)

Single sheet containing at least:

- **Sumber bacaan** (placeholder ok in hi-fi).
- **Sumber homili** (Vatican / Holy See pattern).
- **Kalender:** KWI + note on **time zones** if needed.
- **Konten dapat diperbarui** / disclaimer.
- **Terakhir diperbarui** timestamp pattern.

---

## 8. Global states (shell)

- **G1 Loading:** Skeleton **matches** final stack (readings blocks + card silhouettes).
- **G2 Offline:** Top **banner** + **Coba lagi**; optional cached readings with **cache honesty** pattern.
- **G3 Error:** Inline **retry** on readings fetch.

---

## 9. Copy deck (Indonesian) — design placeholders

Design can use **lorem** for long body; **must** reserve real strings for:

- Homily states **H1–H5** (headings, buttons, empty explanations).
- Share sheet (**Bagikan**, **Salin teks**, trim notice).
- Offline / error / retry.
- Tentang konten section headers.
- Optional bridge line **Setelah Injil** vs **no line** variant.

Product + theological review own final wording.

---

## 10. Visual direction (non-prescriptive)

- Calm, **readable** long-form typography; generous line height for scripture.
- **Restrained** color: scripture neutral; **Injil** distinction subtle (e.g. weight, surface, or small accent—avoid neon).
- Material **3** bottom sheets, standard Android affordances.

---

## 11. Handoff checklist (design → product / eng)

- [ ] **Sunday** and **weekday** scroll variants both prototyped.
- [ ] **All homily states** H1–H5 on artboard.
- [ ] **Bagikan** sheet with **trim** and **non-trim** variant.
- [ ] **Tentang konten** sheet wired from header overflow.
- [ ] **G1–G3** documented on same file or linked frame.
- [ ] Redlines or design tokens for **Injil → homily** spacing and divider.

---

## 12. Out of scope for this brief

- Brand marketing site, ASO assets, store listing (separate brief).
- iOS patterns.
- Deep implementation specs (Compose, navigation graph)—engineering doc.

---

## 13. Interactive hi-fi prototype (HTML)

An in-browser **clickable prototype** lives in **`v1-hifi-prototype/`**:

- Open **`v1-hifi-prototype/index.html`** in Chrome or Safari (local file is fine, or serve the folder with any static server).
- Includes: **sticky header**, **seamless reading stream** (faded dividers, no reading cards), **2 vs 3 readings**, **Injil → homily** threshold, **homily states H1–H5** (full text on screen in demo), **Bagikan** bottom sheet, **Tentang konten**, **Pengaturan** (text scale), optional **offline banner** and **skeleton** loading.
- Expand **“Kontrol prototipe (demo)”** at the bottom to switch states for reviews.

Use it for **stakeholder walkthroughs** before or in parallel with Figma.

---

## References

- [`catholic-daily-app-v1-prd.md`](./catholic-daily-app-v1-prd.md)  
- [`catholic-daily-app-context.md`](./catholic-daily-app-context.md)
