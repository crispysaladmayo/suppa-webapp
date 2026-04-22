# Nutria web — design audit, QA pass & user tests (2026)

This document applies the **Principal Designer** bar from `docs/principal-designer-airbnb-level-capability.md` to **Nutria** hi-fi (`SOURCE_OF_TRUTH.md`): end-to-end journeys, research-backed defaults, motion with accessibility, edge cases, and a **visual system at scale** (tokens, patterns, copy in Indonesian).

---

## 1. Full audit (current state)

### Strengths


| Area              | Notes                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| **Visual system** | Cream canvas, Lora + system UI, terracotta accent, grocery hero, prep gold — aligned with `SOURCE_OF_TRUTH.md`. |
| **IA**            | Four tabs: Hari ini · Rencana · Belanja · Prep.                                                                 |
| **Trust**         | Offline API banner with concrete dev steps; login errors inline.                                                |


### Gaps addressed in this pass (implemented in `app/web`)


| Area                      | Before                     | After                                                                                                                         |
| ------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Empty states**          | Sparse or inline text only | `NutriaEmptyState` + SVG spot illustrations (plate, cart) on Rencana (day), Belanja (list), Prep (no session).                |
| **Loading**               | Plain “Memuat…” or nothing | Per-tab **skeleton** (`PageLoadSkeleton`) with shimmer disabled under `prefers-reduced-motion`.                               |
| **Undo**                  | None                       | **Toast** host with optional “Urungkan” after grocery checkbox toggle (`ToastContext` + `Belanja`).                           |
| **Conflict / API errors** | Generic `Error` message    | `ApiError` + **status code**; `ConflictOrErrorBanner` maps **409** to “bentrok” copy + refresh.                               |
| **Motion**                | Ad hoc                     | Toast entry uses `nutria-motion-raise`; global respect for reduced motion on that animation + skeleton shimmer.               |
| **Haptics**               | None                       | `hapticNudge()` on toast show (best-effort; documented limitations on iOS).                                                   |
| **Design QA surface**     | None                       | `**?designqa=1`** — dedicated page to review patterns: [http://localhost:5173/?designqa=1](http://localhost:5173/?designqa=1) |


### Remaining backlog (honest follow-ups)


| Topic                              | Risk                                | Recommendation                                                                                     |
| ---------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Multi-tab / real-time conflict** | Users editing same meal in two tabs | Server **ETags** or `version` field + 409 + merge UI; client already typed for conflict messaging. |
| **Undo beyond grocery**            | Meal delete / recipe detach         | Same toast pattern; 5–8s window; cap stack depth.                                                  |
| **Illustrations**                  | Spot SVG is minimal                 | Optional brand illustration set (1 style, 3–5 metaphors) when marketing assets exist.              |
| **Screen reader audit**            | Not formally run                    | Run VoiceOver (iOS) + NVDA/ChromeVox on four tabs + forms.                                         |
| **Performance**                    | Large JSON nutrition seed           | Lazy-load or virtualize long ingredient lists if needed.                                           |


---

## 2. Dedicated design QA pass (checklist)

Use `**http://localhost:5173/?designqa=1`** for pattern review, then `**/**` logged-in for integration.

### Visual & system

- Canvas, type scale, and card radius match `SOURCE_OF_TRUTH.md` on a real device width (≤430px).
- Active tab uses terracotta; inactive uses muted brown-grey.
- No raw purple / generic “dashboard” gradients in new work.

### States

- **Empty**: Rencana (day with no meals), Belanja (no lines), Prep (no session) show title + body + CTA where applicable.
- **Loading**: First paint shows skeleton, not a blank main area.
- **Error**: Load failure shows banner with **Muat ulang**; finalize errors still in finalize card.
- **Toast + Urungkan**: Toggling grocery item shows toast; undo restores prior checked state.
- **Conflict (demo)**: On QA page, 409-style banner reads clearly and recovery is obvious.

### Motion & a11y

- With **prefers-reduced-motion: reduce**, skeleton does not animate; toast animation class is inert.
- Toasts use `**aria-live="polite"`** on the host.
- Focus order: primary actions before destructive; FAB / + buttons have `aria-label`.

### Content (Bahasa Indonesia)

- No mixed EN/ID in primary tab chrome (new strings reviewed).
- Error copy explains **what happened** and **what to do next** (bukan hanya “Error”).

---

## 3. User tests (moderated script)

**Goal:** validate task success, comprehension, and trust — not pixel perfection.


| #   | Task                                                                           | Success criteria                                                     | Notes                                           |
| --- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------- |
| 1   | *“Minggu ini kamu mau isi makan hari Jumat untuk siang. Tambahkan satu menu.”* | User finds Rencana, picks day, submits meal form.                    | Time-to-complete; any hesitation on week strip. |
| 2   | *“Cek apakah belanjaan punya item — kalau belum, tambah satu barang manual.”*  | Reaches Belanja, sees empty CTA or list; can add item.               | Observe empty state comprehension.              |
| 3   | *“Tandai satu barang seolah sudah masuk keranjang, lalu urung.”*               | Toggle works; user notices toast and successfully uses **Urungkan**. | **Undo** discoverability.                       |
| 4   | *“Buka prep: mulai sesi kalau belum, atau pahami layar jika belum mulai.”*     | User understands “belum ada sesi” vs active session.                 | Clarity of **empty** vs **active** prep.        |
| 5   | *“Dari Hari ini, pahami stok prep minggu (tanpa bantuan).”*                    | User can paraphrase ring + alert meaning.                            | Trust / nutrition-adjacent clarity.             |


**Synthesis template (per session):** 3 bullets “what worked”, 1 “biggest confusion”, 1 “must fix before ship”.

---

## 4. Where to look in code


| Concern                     | Location                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| ApiError + HTTP mapping     | `app/web/src/api/ApiError.ts`, `api/client.ts`                                              |
| Toasts                      | `app/web/src/context/ToastContext.tsx`                                                      |
| Empty / skeleton / conflict | `app/web/src/components/NutriaEmptyState.tsx`, `PageLoadSkeleton.tsx`, `ConflictBanner.tsx` |
| Styles                      | `app/web/src/styles/global.css` (toast, skeleton, `ux-banner`, `nutria-empty`, motion)      |
| Design QA page              | `app/web/src/pages/DesignQAPage.tsx` — open with `**?designqa=1`**                          |
| App routing for QA          | `app/web/src/App.tsx`                                                                       |


---

*This file is a living audit; update when shipped patterns change or after user-test rounds.*