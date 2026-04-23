# Nutria — source of truth (design & IA)

**Location:** This file and `design-preview.html` live in `Nutria/product/`. **`Nutria/nutria-web-platform/app/web`** should implement this hi-fi, not the legacy Expo five-tab English UI.

## Order of precedence (highest → lowest)

1. **Hi-fi screens (authoritative)** — Mobile-first Nutria: warm cream canvas, serif headlines, large rounded cards, Indonesian copy. Four tabs only: **Hari ini**, **Rencana**, **Belanja**, **Prep**. Reference mockups: Rencana (weekly planner + insight + date strip + meal cards), Hari ini (stok prep + ring progress + alert + kartu belanja/prep + makan hari ini), Belanja (dark total hero + progress + grouped list), Prep (gold summary + grid bahan + urutan masak).
2. **This document** — Structure, labels, and visual rules below.
3. **`Nutria/product/design-preview.html`** — Should be updated to match §2 when the HTML is next edited.
4. **`Nutria/app/` (Expo)** — Legacy until migrated; **not** the visual source of truth.

## Global visual language

| Token | Role |
|-------|------|
| **Canvas** | Off-white / cream `#F9F6F0`–`#FDFBF7` (not stark white). |
| **Primary text** | Deep warm brown `#2E2824`–`#2B2620`. |
| **Secondary text** | Muted brown-grey `#6B6358`. |
| **Accent / active nav** | Terracotta `#C44D34`–`#C65D3C` (primary CTA, active tab). |
| **Prep / highlights** | Orange–gold gradient card `#D49547` / `#E8B86D` (summary hero on Prep). |
| **Grocery hero** | Dark brown panel `#2E2824`–`#1E1B16`, light text, serif price. |
| **Tags** | **Segar** = soft green pill; **Prep** = soft tan / sage pill. |
| **Typography** | **Lora** (or equivalent serif) for titles, prices, meal names; **system UI** for meta, lists, nav. |
| **Shape** | Large radius (≈20–28px) on cards; soft shadow; generous vertical rhythm. |
| **Bottom nav** | Four items: thin-line icons + label; active state terracotta (not emoji-only). |

## Tab: Hari ini

- **Header:** Uppercase weekday · day + month (e.g. `KAMIS · 23 APRIL`), then title **Stok meal prep** (serif, large).
- **Alert strip** (when depletion low/critical): warm warning surface, e.g. `⚠️ {item} menipis — perlu restock/prep`.
- **Hero card (stok minggu):** Label `TERSISA DARI PREP MINGGU`; **donut or ring** showing % tersisa; subline `% sudah dimakan · hari ke-{n} dari 7`.
- **Per-item rows:** Name, `g · perkiraan porsi` if derivable; **horizontal progress** bar; bar color may vary per item (terracotta, green, amber).
- **Primary CTA:** Terracotta full-width **Jadwalkan prep lebih awal** (or equivalent).
- **Two compact cards (row):** (1) Belanja: cart motif, jumlah item terbuka, total IDR; (2) Prep: waktu / durasi / tugas dari sesi aktif jika ada.
- **Makan hari ini:** Section title + optional link to week; rows like checklist: slot label (e.g. `SARAPAN`), meal title (serif), strikethrough optional when “done” is modeled later.
- **Log konsumsi** may sit in a secondary collapsible or bottom of screen — must not dominate; hi-fi emphasizes stok + jadwal.

## Tab: Rencana

- **Eyebrow:** Date range caps, e.g. `20 – 26 APRIL` (from week start + 6 days).
- **Title:** **Rencana minggu** + **FAB** `+` (terracotta square, top-right) to add meal / scroll to form.
- **Insight card:** Icon tile + optional badge count; headline + subline (e.g. nutrition / gap hints); chevron expand affordance.
- **Week strip:** Horizontal chips: `SEN 20` … active = filled dark/brown pill + white type; inactive = light card; small dot under days with meals optional.
- **Day content:** Title day name (`Senin`, …).
- **Grouped by slot:** `SARAPAN · n`, `MAKAN SIANG · n`, `CAMILAN · n` (uppercase meta).
- **Meal card:** Rounded white card; leading icon/illustration; **title** (serif); ingredient line (gram text); **segar** / **prep** pill; kcal + protein line; trailing **avatar** initials for assigned person(s).

## Tab: Belanja

- **Eyebrow:** `BELANJA MINGGUAN` (small caps grey).
- **Title:** **Belanja** (serif) + filter affordance (optional).
- **Dark hero:** `PERKIRAAN TOTAL`, large `Rp…` (serif), subline `n item belanja · m sudah ada di dapur` (pantry count), **progress bar** (e.g. checked / total), caption `x dari y sudah masuk keranjang`.
- **Categories:** Collapsible; header = colored icon tile + category title + `checked/total · Rp…` + chevron.
- **Rows:** Checkbox / check circle; name + detail line; price right; strikethrough when checked.
- Map common `section` keys to Indonesian labels (e.g. `produce` → Sayur & buah, `meat` → Protein).

## Tab: Prep

- **Header:** `HARI · TANGGAL · WAKTU` when session has time; title **Prep hari {day}** (serif).
- **Gold summary card:** `TOTAL WAKTU` + range; `HASIL` + porsi / scope line; **progress** bar `% selesai` + `menit` if tracked.
- **Bahan utama:** Subtitle `7 hari · n orang` or session scope; **2×2 grid** of ingredient tiles: icon, NAME caps, kg bold, subline `(→ kg matang (susut %))` or notes.
- **Urutan masak:** Section title + small pill `paralel · pintar` (optional); list items with time, duration, checkbox, title, description.
- **Sesi baru** / edit flows use same palette; avoid raw form chrome dominating.

## What is not canonical

- Expo **Home / Planner / Grocery / Log / Settings** as final IA or English chrome for new web work.
- Purple gradients, generic dashboard cards, or emoji-only bottom navigation without labels.

## Change process

Hi-fi PNG/Figma → update **this file** → align `design-preview.html` → implement **`nutria-web-platform/app/web`**.
