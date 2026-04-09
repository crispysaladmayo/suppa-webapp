/**
 * Catholic Daily App — V1 hi-fi prototype interactions
 */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  const readings = {
    bacaan1: {
      title: "Bagikan Bacaan I",
      label: "Bacaan I",
      ref: "Kis 2:14.22–33",
      getText: () => $("#text-bacaan1")?.textContent?.trim() || "",
    },
    bacaan2: {
      title: "Bagikan Bacaan II",
      label: "Bacaan II",
      ref: "1Ptr 1:17–21",
      getText: () => $("#text-bacaan2")?.textContent?.trim() || "",
    },
    injil: {
      title: "Bagikan Injil",
      label: "Injil",
      ref: "Yoh 20:19–31",
      getText: () => $("#text-injil")?.textContent?.trim() || "",
    },
  };

  let currentShareKey = "injil";
  let shareTrim = false;

  const els = {
    mainScroll: $("#main-scroll"),
    blockBacaan2: $("#block-bacaan2"),
    headerLiturgy: $("#header-liturgy"),
    headerDate: $("#header-date"),
    homilySection: $("#homily-section"),
    homilyChip: $("#homily-chip"),
    homilyMeta: $("#homily-meta"),
    homilyLangNote: $("#homily-lang-note"),
    homilySourceLabel: $("#homily-source-label"),
    homilySourceLink: $("#homily-source-link"),
    thresholdCaption: $("#threshold-caption"),
    shareSheet: $("#share-sheet"),
    shareBackdrop: $("#share-backdrop"),
    shareTitle: $("#share-title"),
    shareSubtitle: $("#share-subtitle"),
    sharePreview: $("#share-preview"),
    shareTrimNotice: $("#share-trim-notice"),
    aboutSheet: $("#about-sheet"),
    aboutBackdrop: $("#about-backdrop"),
    settingsSheet: $("#settings-sheet"),
    settingsBackdrop: $("#settings-backdrop"),
    readingMenuSheet: $("#reading-menu-sheet"),
    readingMenuBackdrop: $("#reading-menu-backdrop"),
    readingMenuTitle: $("#reading-menu-title"),
    readingMenuSubtitle: $("#reading-menu-subtitle"),
    offlineBanner: $("#offline-banner"),
  };

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

  function buildSharePayload(key) {
    const r = readings[key];
    if (!r) return "";
    let body = r.getText();
    const max = 560;
    if (shareTrim && body.length > max) {
      body = body.slice(0, max - 1) + "…";
    }
    const parts = [
      `${r.label} — ${r.ref}`,
      "",
      body,
      "",
      "—",
      "Sumber bacaan: [mitra resmi — placeholder]",
      "Aplikasi: Catholic Daily (prototipe hi-fi)",
      "Terakhir diperbarui: 6 April 2026, 06.00 WIB",
    ];
    return parts.join("\n");
  }

  function openShare(key) {
    currentShareKey = key;
    const r = readings[key];
    els.shareTitle.textContent = r.title;
    els.shareSubtitle.textContent = $("#header-date")?.textContent?.trim() || "";
    els.shareTrimNotice.hidden = !shareTrim;
    els.sharePreview.textContent = buildSharePayload(key);
    openSheet(els.shareSheet, els.shareBackdrop);
  }

  function setDayType(type) {
    const isWeekday = type === "weekday";
    els.blockBacaan2.hidden = isWeekday;
    if (isWeekday) {
      els.headerLiturgy.textContent = "Selasa Paskah II";
      els.headerDate.textContent = "Selasa, 8 April 2026 · KWI";
    } else {
      els.headerLiturgy.textContent = "Minggu Paskah II";
      els.headerDate.textContent = "Minggu, 6 April 2026 · KWI";
    }
  }

  function setHomilyState(state) {
    els.homilySection.dataset.homilyState = state;
    ["h1", "h2", "h3", "h4", "h5"].forEach((s) => {
      const el = $(`#homily-${s}`);
      if (el) el.hidden = s !== state;
    });

    els.homilyLangNote.hidden = state !== "h2";

    const link = els.homilySourceLink;
    const label = els.homilySourceLabel;
    if (label) label.textContent = state === "h5" ? "Periksa sumber resmi:" : "Sumber:";
    if (!link) return;

    switch (state) {
      case "h1":
        els.homilyChip.textContent = "Bahasa Indonesia";
        els.homilyMeta.textContent = "5 April 2026 · Vatican News";
        link.textContent = "Vatican News Bahasa Indonesia";
        link.href = "https://www.vaticannews.va/id/pope.html";
        break;
      case "h2":
        els.homilyChip.textContent = "Bahasa resmi: IT";
        els.homilyMeta.textContent = "5 April 2026 · Sala Stampa";
        link.textContent = "Vatican.va / Sala Stampa (sumber resmi)";
        link.href = "https://www.vaticannews.va/en/pope.html";
        break;
      case "h3":
        els.homilyChip.textContent = "Varian demo";
        els.homilyMeta.textContent = "5 April 2026 · Vatican News";
        link.textContent = "Vatican News Bahasa Indonesia";
        link.href = "https://www.vaticannews.va/id/pope.html";
        break;
      case "h4":
        els.homilyChip.textContent = "Catatan sumber";
        els.homilyMeta.textContent = "5 April 2026";
        link.textContent = "Tahta Suci — saluran resmi";
        link.href = "https://www.vaticannews.va/id/pope.html";
        break;
      case "h5":
        els.homilyChip.textContent = "Belum tersedia";
        els.homilyMeta.textContent = "Pembaruan terakhir dicek: 6 April 2026";
        link.textContent = "Vatican News Bahasa Indonesia";
        link.href = "https://www.vaticannews.va/id/pope.html";
        break;
      default:
        break;
    }
  }

  /* Reading overflow → menu → share */
  let pendingReadingKey = "injil";

  function openReadingMenu(key) {
    pendingReadingKey = key;
    const r = readings[key];
    els.readingMenuTitle.textContent = r.label;
    els.readingMenuSubtitle.textContent = r.ref;
    openSheet(els.readingMenuSheet, els.readingMenuBackdrop);
  }

  document.querySelectorAll(".reading-menu").forEach((btn) => {
    btn.addEventListener("click", () => openReadingMenu(btn.dataset.reading));
  });

  $("#reading-menu-share")?.addEventListener("click", () => {
    closeSheet(els.readingMenuSheet, els.readingMenuBackdrop);
    openShare(pendingReadingKey);
  });

  $("#reading-menu-close")?.addEventListener("click", () => {
    closeSheet(els.readingMenuSheet, els.readingMenuBackdrop);
  });

  $("#reading-menu-backdrop")?.addEventListener("click", () => {
    closeSheet(els.readingMenuSheet, els.readingMenuBackdrop);
  });

  /* Header */
  $("#btn-about")?.addEventListener("click", () => openSheet(els.aboutSheet, els.aboutBackdrop));
  $("#about-close")?.addEventListener("click", () => closeSheet(els.aboutSheet, els.aboutBackdrop));
  $("#about-backdrop")?.addEventListener("click", () => closeSheet(els.aboutSheet, els.aboutBackdrop));

  $("#btn-settings")?.addEventListener("click", () => openSheet(els.settingsSheet, els.settingsBackdrop));
  $("#settings-close")?.addEventListener("click", () => closeSheet(els.settingsSheet, els.settingsBackdrop));
  $("#settings-backdrop")?.addEventListener("click", () => closeSheet(els.settingsSheet, els.settingsBackdrop));

  /* Share sheet */
  $("#share-close")?.addEventListener("click", () => closeSheet(els.shareSheet, els.shareBackdrop));
  $("#share-backdrop")?.addEventListener("click", () => closeSheet(els.shareSheet, els.shareBackdrop));

  $("#share-copy")?.addEventListener("click", async () => {
    const text = els.sharePreview.textContent;
    try {
      await navigator.clipboard.writeText(text);
      $("#share-copy").textContent = "Disalin";
      setTimeout(() => {
        $("#share-copy").textContent = "Salin teks";
      }, 2000);
    } catch {
      alert("Salin manual dari pratinjau.");
    }
  });

  $("#share-native")?.addEventListener("click", async () => {
    const text = els.sharePreview.textContent;
    const r = readings[currentShareKey];
    const title = r?.title || "Bagikan";
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch (e) {
        if (e.name !== "AbortError") console.warn(e);
      }
    } else {
      alert("Perangkat tidak mendukung dialog bagikan — gunakan Salin teks.");
    }
  });

  /* Prototype controls */
  $("#day-type")?.addEventListener("change", (e) => setDayType(e.target.value));

  $("#homily-state")?.addEventListener("change", (e) => setHomilyState(e.target.value));

  $("#toggle-bridge")?.addEventListener("change", (e) => {
    els.thresholdCaption.hidden = !e.target.checked;
  });

  $("#toggle-trim")?.addEventListener("change", (e) => {
    shareTrim = e.target.checked;
    if (!els.shareSheet.hidden) els.sharePreview.textContent = buildSharePayload(currentShareKey);
    els.shareTrimNotice.hidden = !shareTrim;
  });

  $("#toggle-offline")?.addEventListener("change", (e) => {
    els.offlineBanner.classList.toggle("is-visible", e.target.checked);
  });

  $("#btn-retry")?.addEventListener("click", () => {
    $("#toggle-offline").checked = false;
    els.offlineBanner.classList.remove("is-visible");
  });

  $("#toggle-skeleton")?.addEventListener("change", (e) => {
    els.mainScroll.classList.toggle("is-skeleton", e.target.checked);
  });

  $("#font-scale")?.addEventListener("input", (e) => {
    const v = Number(e.target.value) / 100;
    document.documentElement.style.setProperty("--text-scale", String(v));
  });

  /* Init */
  setDayType($("#day-type").value);
  setHomilyState($("#homily-state").value);
})();
