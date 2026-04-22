# Nutria — source of truth (design & IA)

**Location:** This file and `design-preview.html` live in `Nutria/product/` inside the repo. Keep them updated when hi-fi changes. An initiative copy may also exist under `~/Projects/nutria-household-angle/` — if both exist, reconcile so **preview HTML + this document** match.

## Order of precedence (highest → lowest)

1. **Hi-fi reference** — Four tabs: **Hari ini**, **Rencana**, **Belanja**, **Prep**; Indonesian UI; gram/porsi detail; dark grocery hero; gold prep card; week strip; insight cards. **Mockups beat legacy code** for intent.
2. **`Nutria/product/design-preview.html`** — Interactive consolidation; open locally before building UI.
3. **`DESIGN.md`** / **`SPEC.md`** in `~/Projects/nutria-household-angle/` (or copied here later) — detailed behavior.
4. **Shipped `Nutria/app/`** — Legacy 5-tab English app until migrated; **not** the design target.

## What is not canonical

- `MainTabs`: Home, Planner, Grocery, Log, Settings as **final** IA — treat as **legacy**.
- Any UI work that does not check `design-preview.html` first.

## Target tabs (summary)

| Tab | Role |
|-----|------|
| **Hari ini** | Stok prep, alerts, donut/summary consumption, CTA prep, kartu belanja & jadwal, makan hari ini. |
| **Rencana** | Minggu strip, insight, meal cards (bahan g, segar/prep, avatars). |
| **Belanja** | Total gelap, keranjang/dapur, kategori + item + harga. |
| **Prep** | Sesi: waktu, porsi, bahan (kg + susut), urutan masak. |

## Change process

Hi-fi → `design-preview.html` → markdown specs → `Nutria/app` implementation.
