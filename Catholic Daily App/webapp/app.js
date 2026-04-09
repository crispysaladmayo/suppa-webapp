/**
 * Catholic Daily webapp — loads seed JSON aligned with Android pipeline schemas:
 * - data/readings_bundle.seed.json  → readings-import.v1
 * - data/homily_latest.seed.json    → homily DTO (see JsonHomilyFeedDataSource)
 * - data/editorial.seed.json        → editorial piece (see EditorialPieceDto)
 */

const DATA = {
  readings: "data/readings_bundle.seed.json",
  homily: "data/homily_latest.seed.json",
  editorial: "data/editorial.seed.json",
};

const LITURGY_FALLBACK = "Liturgi hari ini";
const ZONE_LABEL = "KWI · Asia/Jakarta";

const BLOCK_LABEL = {
  FIRST: "Bacaan I",
  PSALM: "Mazmur tanggapan",
  SECOND: "Bacaan II",
  GOSPEL: "Injil",
};

const LANG_LABEL = {
  id: "Bahasa Indonesia",
  en: "English",
  it: "Italiano",
  la: "Latin",
};

const LITURGY_NAME_KEYS = [
  "liturgy_name",
  "liturgyName",
  "liturgical_day_name",
  "liturgicalDayName",
  "liturgical_day",
  "liturgicalDay",
  "title",
  "name",
];

function $(sel, root = document) {
  return root.querySelector(sel);
}

function jakartaTodayIso() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

function parseQueryDate() {
  const q = new URLSearchParams(window.location.search).get("date");
  if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
  return null;
}

function formatHeaderDate(isoDate) {
  try {
    const [y, m, d] = isoDate.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return (
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(dt) +
      " · " +
      ZONE_LABEL
    );
  } catch {
    return isoDate + " · " + ZONE_LABEL;
  }
}

function decodeHtmlEntities(str) {
  if (!str) return "";
  const t = document.createElement("textarea");
  t.innerHTML = str;
  return t.value;
}

function liturgyTitleFromDay(day) {
  const meta = day?.cycle_metadata;
  if (!meta || typeof meta !== "object") return LITURGY_FALLBACK;
  for (const k of LITURGY_NAME_KEYS) {
    const v = meta[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return LITURGY_FALLBACK;
}

/**
 * Match DefaultContentRepository / ReadingsDao resolution.
 */
function resolveReadingsDay(days, requestedIso) {
  if (!days?.length) return { day: null, mode: "none" };
  const byDate = new Map(days.map((d) => [d.liturgical_date, d]));
  const exact = byDate.get(requestedIso);
  if (exact) return { day: exact, mode: "exact" };
  let best = null;
  for (const d of days) {
    if (d.liturgical_date <= requestedIso && (!best || d.liturgical_date > best.liturgical_date)) {
      best = d;
    }
  }
  if (best) return { day: best, mode: "fallback_before" };
  const latest = days.reduce((a, b) => (a.liturgical_date > b.liturgical_date ? a : b));
  return { day: latest, mode: "latest" };
}

function blockLabel(kind) {
  return BLOCK_LABEL[kind] || kind.replace(/_/g, " ");
}

function blockArticleClass(kind) {
  if (kind === "GOSPEL") return "reading-block reading-block--gospel";
  if (kind === "PSALM") return "reading-block reading-block--psalm";
  return "reading-block";
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

function openSheet(sheet, backdrop) {
  sheet.hidden = false;
  backdrop.classList.add("is-open");
  requestAnimationFrame(() => sheet.classList.add("is-open"));
}

function closeSheet(sheet, backdrop) {
  sheet.classList.remove("is-open");
  backdrop.classList.remove("is-open");
  const onEnd = () => {
    sheet.hidden = true;
    sheet.removeEventListener("transitionend", onEnd);
  };
  sheet.addEventListener("transitionend", onEnd);
  setTimeout(onEnd, 320);
}

function main() {
  if (window.location.protocol === "file:") {
    const err = $("#load-error");
    err.hidden = false;
    err.innerHTML =
      "Buka aplikasi ini melalui server HTTP lokal (bukan <code>file://</code>), agar berkas JSON di folder <code>data/</code> dapat dimuat. Contoh: dari folder <code>webapp</code> jalankan <code>python3 -m http.server 8080</code> lalu buka <code>http://localhost:8080</code>.";
    $("#main-scroll").classList.remove("is-skeleton");
    return;
  }

  const els = {
    mainScroll: $("#main-scroll"),
    loadError: $("#load-error"),
    readingsRoot: $("#readings-root"),
    readingsMeta: $("#readings-meta"),
    readingsFallback: $("#readings-fallback"),
    headerLiturgy: $("#header-liturgy"),
    headerDate: $("#header-date"),
    dateInput: $("#liturgical-date"),
    thresholdWrap: $("#threshold-wrap"),
    homilyChip: $("#homily-chip"),
    homilyMeta: $("#homily-meta"),
    homilyBody: $("#homily-body"),
    homilyLangNote: $("#homily-lang-note"),
    homilySourceLink: $("#homily-source-link"),
    renunganRoot: $("#renungan-root"),
    offlineBanner: $("#offline-banner"),
    aboutReadingsSource: $("#about-readings-source"),
    aboutBundleVersion: $("#about-bundle-version"),
    shareSheet: $("#share-sheet"),
    shareBackdrop: $("#share-backdrop"),
    shareTitle: $("#share-title"),
    shareSubtitle: $("#share-subtitle"),
    sharePreview: $("#share-preview"),
    shareTrimNotice: $("#share-trim-notice"),
    readingMenuSheet: $("#reading-menu-sheet"),
    readingMenuBackdrop: $("#reading-menu-backdrop"),
    readingMenuTitle: $("#reading-menu-title"),
    readingMenuSubtitle: $("#reading-menu-subtitle"),
    aboutSheet: $("#about-sheet"),
    aboutBackdrop: $("#about-backdrop"),
    settingsSheet: $("#settings-sheet"),
    settingsBackdrop: $("#settings-backdrop"),
    fontScale: $("#font-scale"),
  };

  let bundleDoc = null;
  let homilyDoc = null;
  let editorialDoc = null;
  let requestedDate = parseQueryDate() || jakartaTodayIso();
  let shareTargets = [];
  let currentShareIndex = 0;
  let menuShareIndex = 0;
  let shareTrim = localStorage.getItem("catholicDailyShareTrim") === "1";

  const toggleTrim = $("#toggle-share-trim");
  if (toggleTrim) {
    toggleTrim.checked = shareTrim;
    toggleTrim.addEventListener("change", () => {
      shareTrim = toggleTrim.checked;
      localStorage.setItem("catholicDailyShareTrim", shareTrim ? "1" : "0");
    });
  }

  els.dateInput.value = requestedDate;
  els.dateInput.addEventListener("change", () => {
    const v = els.dateInput.value;
    if (!v) return;
    requestedDate = v;
    const u = new URL(window.location.href);
    u.searchParams.set("date", v);
    window.history.replaceState({}, "", u);
    renderAll();
  });

  function updateOnlineBanner() {
    els.offlineBanner.hidden = navigator.onLine;
  }
  window.addEventListener("online", updateOnlineBanner);
  window.addEventListener("offline", updateOnlineBanner);
  updateOnlineBanner();
  $("#btn-retry")?.addEventListener("click", () => loadAll());

  function buildSharePayload(target) {
    let body = target.body;
    const max = 560;
    if (shareTrim && body.length > max) {
      body = body.slice(0, max - 1) + "…";
    }
    const parts = [
      `${target.label} — ${target.ref}`,
      "",
      body,
      "",
      "—",
      target.sourceLine ? `Sumber bacaan: ${target.sourceLine}` : `Sumber bacaan: ${target.globalSource}`,
      "Aplikasi: Catholic Daily (web seed)",
      `Tanggal liturgi: ${target.liturgicalDate}`,
    ];
    return parts.join("\n");
  }

  function openShareForIndex(i) {
    currentShareIndex = i;
    const t = shareTargets[i];
    if (!t) return;
    els.shareTitle.textContent = `Bagikan ${t.label}`;
    els.shareSubtitle.textContent = formatHeaderDate(t.liturgicalDate);
    els.shareTrimNotice.hidden = !shareTrim;
    els.sharePreview.textContent = buildSharePayload(t);
    openSheet(els.shareSheet, els.shareBackdrop);
  }

  function renderReadings(dayContent, bundle) {
    els.readingsRoot.innerHTML = "";
    shareTargets = [];

    if (!dayContent) {
      els.readingsMeta.hidden = true;
      els.readingsFallback.hidden = true;
      const p = document.createElement("p");
      p.className = "reading-block__body";
      p.textContent =
        "Belum ada bacaan lokal. Salin readings_bundle.db ke app Android atau generate data/readings_bundle.seed.json (lihat pipeline/scripts/export_readings_bundle_sqlite_to_json.py).";
      els.readingsRoot.appendChild(p);
      els.thresholdWrap.hidden = true;
      return;
    }

    const globalSource = bundle.source_attribution || "";
    els.readingsMeta.hidden = false;
    els.readingsMeta.textContent = `Bundel ${bundle.bundle_version} · ${globalSource}`;

    const blocks = [...dayContent.blocks].sort((a, b) => a.sort_order - b.sort_order);
    blocks.forEach((block, idx) => {
      const label = blockLabel(block.kind);
      const refLine = (block.title && block.title.trim()) || block.reference || "";
      const art = document.createElement("article");
      art.className = blockArticleClass(block.kind);
      art.dataset.shareIndex = String(idx);
      art.innerHTML = `
        <div class="reading-block__head">
          <div>
            <p class="reading-block__label"></p>
            <p class="reading-block__ref"></p>
          </div>
          <button type="button" class="icon-btn reading-menu" aria-label="Menu ${label}">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
              <circle cx="12" cy="6" r="1.75" />
              <circle cx="12" cy="12" r="1.75" />
              <circle cx="12" cy="18" r="1.75" />
            </svg>
          </button>
        </div>
        <p class="reading-block__body"></p>
      `;
      art.querySelector(".reading-block__label").textContent = label;
      art.querySelector(".reading-block__ref").textContent = refLine;
      art.querySelector(".reading-block__body").textContent = block.body;
      const src = block.source_line?.trim();
      if (src) {
        const sp = document.createElement("p");
        sp.className = "reading-block__source";
        sp.textContent = src;
        art.appendChild(sp);
      }
      const btn = art.querySelector(".reading-menu");
      btn.addEventListener("click", () => {
        menuShareIndex = idx;
        els.readingMenuTitle.textContent = label;
        els.readingMenuSubtitle.textContent = refLine;
        openSheet(els.readingMenuSheet, els.readingMenuBackdrop);
      });
      els.readingsRoot.appendChild(art);

      shareTargets.push({
        label,
        ref: refLine || "—",
        body: block.body.trim(),
        sourceLine: src || "",
        globalSource,
        liturgicalDate: dayContent.liturgical_date,
      });
    });

    const hasGospel = blocks.some((b) => b.kind === "GOSPEL");
    els.thresholdWrap.hidden = !hasGospel;
  }

  function renderHomily(h) {
    els.homilyLangNote.hidden = true;
    els.homilyBody.innerHTML = "";
    if (!h) {
      els.homilyChip.textContent = "—";
      els.homilyMeta.textContent = "Belum ada homili di seed.";
      els.homilyBody.textContent =
        "Tambahkan data/homily_latest.seed.json atau sambungkan API seperti pada aplikasi Android.";
      els.homilySourceLink.href = "https://www.vaticannews.va/id/pope.html";
      els.homilySourceLink.textContent = "Vatican News";
      return;
    }

    const lang = (h.language || "en").toLowerCase();
    els.homilyChip.textContent = LANG_LABEL[lang] || lang.toUpperCase();
    els.homilyMeta.textContent = [h.homily_date, h.source_name].filter(Boolean).join(" · ");
    els.homilyLangNote.hidden = lang === "id";

    if (h.title) {
      const ht = document.createElement("h3");
      ht.className = "homily-section__title";
      ht.style.marginTop = "0.5rem";
      ht.style.fontSize = "1rem";
      ht.textContent = decodeHtmlEntities(h.title);
      els.homilyBody.appendChild(ht);
    }

    if (h.body && h.body.trim()) {
      const pb = document.createElement("p");
      pb.style.marginTop = "0.75rem";
      pb.style.fontFamily = "var(--font-reading)";
      pb.style.lineHeight = "1.65";
      pb.textContent = h.body;
      els.homilyBody.appendChild(pb);
    } else {
      const pb = document.createElement("p");
      pb.style.marginTop = "0.75rem";
      pb.style.fontStyle = "italic";
      pb.style.color = "var(--color-ink-muted)";
      pb.textContent =
        "Teks penuh tidak ditampilkan di aplikasi sesuai izin konten. Buka sumber resmi untuk membaca selengkapnya.";
      els.homilyBody.appendChild(pb);
    }

    els.homilySourceLink.href = h.source_url || "#";
    els.homilySourceLink.textContent = h.source_name || "Sumber";
  }

  function renderEditorial(editorial, resolvedLiturgicalDate) {
    els.renunganRoot.innerHTML = "";
    if (!editorial) {
      const p = document.createElement("p");
      p.className = "renungan__body";
      p.textContent = "Belum ada renungan. Atur seed editorial atau CDN seperti pada aplikasi Android.";
      els.renunganRoot.appendChild(p);
      return;
    }
    if (editorial.liturgical_date !== resolvedLiturgicalDate) {
      const p = document.createElement("p");
      p.className = "renungan__body";
      p.textContent = `Renungan seed tersedia untuk tanggal ${editorial.liturgical_date}; yang dipilih adalah ${resolvedLiturgicalDate}. Sesuaikan tanggal atau tambahkan berkas editorial untuk hari tersebut.`;
      els.renunganRoot.appendChild(p);
      return;
    }

    if (editorial.title) {
      const h = document.createElement("h2");
      h.className = "renungan__headline";
      h.textContent = editorial.title;
      els.renunganRoot.appendChild(h);
    }
    const by = document.createElement("p");
    by.className = "renungan__byline";
    by.textContent = editorial.byline || "";
    els.renunganRoot.appendChild(by);
    if (editorial.ai_assisted) {
      const disc = document.createElement("p");
      disc.className = "renungan__body";
      disc.style.fontSize = "0.875rem";
      disc.style.color = "var(--color-primary)";
      disc.textContent =
        "Renungan ini melibatkan bantuan kecerdasan buatan dan telah ditinjau manusia sebelum tayang. Bukan pengganti ajaran Magisterium atau bimbingan pastoral pribadi.";
      els.renunganRoot.appendChild(disc);
    }
    const body = document.createElement("p");
    body.className = "renungan__body";
    body.textContent = editorial.body || "";
    els.renunganRoot.appendChild(body);
  }

  function renderAll() {
    if (!bundleDoc) return;
    const { day, mode } = resolveReadingsDay(bundleDoc.days, requestedDate);
    const liturgicalDate = day?.liturgical_date || requestedDate;

    els.headerLiturgy.textContent = day ? liturgyTitleFromDay(day) : LITURGY_FALLBACK;
    els.headerDate.textContent = formatHeaderDate(requestedDate);

    els.readingsFallback.hidden = mode === "exact" || mode === "none";
    if (mode === "fallback_before") {
      els.readingsFallback.textContent = `Bacaan untuk ${requestedDate} tidak ada di bundel; menampilkan hari terdekat sebelum tanggal tersebut (${liturgicalDate}).`;
    } else if (mode === "latest") {
      els.readingsFallback.textContent = `Tidak ada bacaan pada atau sebelum ${requestedDate}; menampilkan hari terakhir di bundel (${liturgicalDate}).`;
    }

    const dayContent = day
      ? {
          liturgical_date: day.liturgical_date,
          blocks: day.blocks,
        }
      : null;

    renderReadings(dayContent, bundleDoc);
    renderHomily(homilyDoc);
    renderEditorial(editorialDoc, liturgicalDate);

    els.aboutReadingsSource.textContent = bundleDoc.source_attribution || "—";
    els.aboutBundleVersion.textContent = bundleDoc.bundle_version || "—";
  }

  async function loadAll() {
    els.loadError.hidden = true;
    els.mainScroll.classList.add("is-skeleton");
    try {
      const [b, h, e] = await Promise.all([
        fetchJson(DATA.readings),
        fetchJson(DATA.homily),
        fetchJson(DATA.editorial),
      ]);
      bundleDoc = b;
      homilyDoc = h;
      editorialDoc = e;
      renderAll();
    } catch (err) {
      console.error(err);
      els.loadError.hidden = false;
      els.loadError.textContent = `Gagal memuat data: ${err.message || err}`;
    } finally {
      els.mainScroll.classList.remove("is-skeleton");
    }
  }

  $("#reading-menu-share")?.addEventListener("click", () => {
    closeSheet(els.readingMenuSheet, els.readingMenuBackdrop);
    openShareForIndex(menuShareIndex);
  });
  $("#reading-menu-close")?.addEventListener("click", () => {
    closeSheet(els.readingMenuSheet, els.readingMenuBackdrop);
  });
  $("#reading-menu-backdrop")?.addEventListener("click", () => {
    closeSheet(els.readingMenuSheet, els.readingMenuBackdrop);
  });

  $("#share-copy")?.addEventListener("click", async () => {
    const t = shareTargets[currentShareIndex];
    if (!t) return;
    try {
      await navigator.clipboard.writeText(buildSharePayload(t));
    } catch {
      /* ignore */
    }
  });
  $("#share-native")?.addEventListener("click", async () => {
    const t = shareTargets[currentShareIndex];
    if (!t || !navigator.share) return;
    try {
      await navigator.share({
        title: `${t.label} — ${t.ref}`,
        text: buildSharePayload(t),
      });
    } catch {
      /* user cancel */
    }
  });
  $("#share-close")?.addEventListener("click", () => closeSheet(els.shareSheet, els.shareBackdrop));
  $("#share-backdrop")?.addEventListener("click", () => closeSheet(els.shareSheet, els.shareBackdrop));

  $("#btn-about")?.addEventListener("click", () => openSheet(els.aboutSheet, els.aboutBackdrop));
  $("#about-close")?.addEventListener("click", () => closeSheet(els.aboutSheet, els.aboutBackdrop));
  $("#about-backdrop")?.addEventListener("click", () => closeSheet(els.aboutSheet, els.aboutBackdrop));

  $("#btn-settings")?.addEventListener("click", () => openSheet(els.settingsSheet, els.settingsBackdrop));
  $("#settings-close")?.addEventListener("click", () => closeSheet(els.settingsSheet, els.settingsBackdrop));
  $("#settings-backdrop")?.addEventListener("click", () => closeSheet(els.settingsSheet, els.settingsBackdrop));

  const savedScale = localStorage.getItem("catholicDailyFontScale");
  if (savedScale) {
    els.fontScale.value = savedScale;
    document.documentElement.style.setProperty("--text-scale", String(Number(savedScale) / 100));
  }
  els.fontScale?.addEventListener("input", () => {
    const v = els.fontScale.value;
    localStorage.setItem("catholicDailyFontScale", v);
    document.documentElement.style.setProperty("--text-scale", String(Number(v) / 100));
  });

  loadAll();
}

main();
