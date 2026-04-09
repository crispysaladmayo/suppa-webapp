(function () {
  "use strict";

  function initDisclaimer(root) {
    var el = (root || document).querySelector("[data-disclaimer]");
    if (!el) return;
    var btn = el.querySelector("[data-disclaimer-expand]");
    var full = el.querySelector("[data-disclaimer-full]");
    if (!btn || !full) return;
    btn.addEventListener("click", function () {
      var open = full.hidden === false;
      full.hidden = open;
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      btn.textContent = open ? "Baca selengkapnya" : "Sembunyikan";
    });
  }

  function showToast(message, ms) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = message;
    t.classList.add("toast--show");
    t.setAttribute("role", "status");
    setTimeout(function () {
      t.classList.remove("toast--show");
    }, ms || 2200);
  }

  function initTodayGreeting() {
    var el = document.getElementById("today-greeting");
    if (!el) return;
    var name = el.getAttribute("data-child-first") || "si kecil";
    var h = new Date().getHours();
    // Indonesian time-of-day: pagi <11, siang 11–14, sore 15–18, malam otherwise
    var salam;
    if (h < 11) salam = "Selamat pagi";
    else if (h < 15) salam = "Selamat siang";
    else if (h < 19) salam = "Selamat sore";
    else salam = "Selamat malam";
    el.textContent = salam + ", Mama " + name;
  }

  // ── Version bar ──────────────────────────────────────────
  // Injected into every .app-frame so all pages show the version
  // without editing each HTML file. Change PROTO_VERSION here to update everywhere.
  var PROTO_VERSION = "M1 · v0.2 · 2026-04-09";

  function injectVersionBar() {
    var frame = document.querySelector(".app-frame");
    if (!frame) return;
    var bar = document.createElement("p");
    bar.className = "version-bar";
    bar.setAttribute("aria-hidden", "true");
    bar.textContent = "Suppa Prototype · " + PROTO_VERSION;
    frame.appendChild(bar);
  }

  // ── Mode contextual hint banner ──────────────────────────
  // Shows at 17:00–19:00 on Log Harian; dismissed per session (sessionStorage).
  function initModeHint() {
    var hint = document.getElementById("mode-hint");
    if (!hint) return;
    var dismissed = sessionStorage.getItem("mode-hint-dismissed");
    if (dismissed) return;
    var h = new Date().getHours();
    if (h >= 17 && h < 19) {
      hint.hidden = false;
    }
    var btn = document.getElementById("mode-hint-dismiss");
    if (btn) {
      btn.addEventListener("click", function () {
        hint.hidden = true;
        sessionStorage.setItem("mode-hint-dismissed", "1");
      });
    }
  }

  // ── Gap hint card dismiss (hides for 24 hours via localStorage) ──
  function initGapHints() {
    document.querySelectorAll("[data-dismiss]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-dismiss");
        var card = document.getElementById(targetId);
        if (!card) return;
        card.hidden = true;
        try {
          localStorage.setItem("gap-hint-dismissed-" + targetId, String(Date.now()));
        } catch (e) {}
      });
    });
    // Restore hidden state if dismissed within 24h
    document.querySelectorAll(".gap-hint[id]").forEach(function (card) {
      try {
        var ts = localStorage.getItem("gap-hint-dismissed-" + card.id);
        if (ts && Date.now() - Number(ts) < 86400000) {
          card.hidden = true;
        }
      } catch (e) {}
    });
  }

  // ── Pelangi makan tooltip toggle ─────────────────────────
  function initPelangiTooltip() {
    var btn = document.getElementById("pelangi-info-btn");
    var tip = document.getElementById("pelangi-tooltip");
    if (!btn || !tip) return;
    btn.addEventListener("click", function () {
      var open = tip.classList.contains("pelangi-tooltip--visible");
      tip.classList.toggle("pelangi-tooltip--visible", !open);
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
  }

  // ── Topic chip toggle (Edukasi browse) ───────────────────
  function initTopicChips() {
    var chips = document.querySelectorAll(".topic-chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("topic-chip--active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("topic-chip--active");
        chip.setAttribute("aria-pressed", "true");
      });
    });
  }

  // ── Inline article quiz ──────────────────────────────────
  // Questions are shown one at a time; correct answer highlighted;
  // explanation shown after any answer; shame-free framing.
  function initArticleQuiz() {
    var quiz = document.getElementById("article-quiz");
    if (!quiz) return;
    var progress = document.getElementById("quiz-progress");
    var done = document.getElementById("quiz-done");
    var totalQ = quiz.querySelectorAll(".quiz-q").length;

    function activateQuestion(n) {
      quiz.querySelectorAll(".quiz-q").forEach(function (q) {
        q.classList.remove("quiz-q--active");
      });
      var target = document.getElementById("qq-" + n);
      if (target) target.classList.add("quiz-q--active");
      if (progress) progress.textContent = n + " / " + totalQ;
    }

    quiz.querySelectorAll(".quiz-q").forEach(function (q) {
      var correct = q.getAttribute("data-correct");
      var explainId = q.id + "-explain";
      var explain = document.getElementById(explainId);
      var nextBtn = q.querySelector(".quiz-q__next");
      var options = q.querySelectorAll(".quiz-q__option");

      options.forEach(function (opt) {
        opt.addEventListener("click", function () {
          // Lock all options after first pick
          options.forEach(function (o) {
            o.disabled = true;
          });
          var chosen = opt.getAttribute("data-option");
          if (chosen === correct) {
            opt.classList.add("quiz-q__option--correct");
          } else {
            opt.classList.add("quiz-q__option--wrong");
            // Also highlight the correct answer
            options.forEach(function (o) {
              if (o.getAttribute("data-option") === correct) {
                o.classList.add("quiz-q__option--correct");
              }
            });
          }
          // Show explanation (no shame language regardless of right/wrong)
          if (explain) explain.classList.add("quiz-q__explain--visible");
          // Show next/finish button
          if (nextBtn) nextBtn.classList.add("quiz-q__next--visible");
        });
      });
    });

    // Next question buttons
    quiz.querySelectorAll("[data-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var n = parseInt(btn.getAttribute("data-next"), 10);
        activateQuestion(n);
      });
    });

    // Finish button — show completion state
    var finishBtn = quiz.querySelector("[data-finish]");
    if (finishBtn) {
      finishBtn.addEventListener("click", function () {
        quiz.querySelectorAll(".quiz-q").forEach(function (q) {
          q.classList.remove("quiz-q--active");
        });
        if (done) done.classList.add("quiz-block__done--visible");
        if (progress) progress.textContent = "Selesai ✓";
      });
    }
  }

  // ── Child profile quick-switch stub (DQ-5) ───────────────
  function initChildSwitch() {
    var btn = document.getElementById("child-switch-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      showToast("Ganti profil anak — segera hadir", 1800);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectVersionBar();
    initTodayGreeting();
    initDisclaimer(document);
    initModeHint();
    initGapHints();
    initPelangiTooltip();
    initTopicChips();
    initArticleQuiz();
    initChildSwitch();

    document.querySelectorAll("[data-chip-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pressed = btn.getAttribute("aria-pressed") === "true";
        btn.setAttribute("aria-pressed", pressed ? "false" : "true");
      });
    });
    var saveMeal = document.querySelector("[data-save-meal]");
    if (saveMeal) {
      saveMeal.addEventListener("click", function (e) {
        e.preventDefault();
        var groups = document.querySelectorAll(
          '.chip-grid [data-food-group][aria-pressed="true"]'
        );
        var err = document.getElementById("food-group-error");
        if (groups.length === 0) {
          if (err) err.hidden = false;
          return;
        }
        if (err) err.hidden = true;
        showToast("Tersimpan", 1800);
        setTimeout(function () {
          window.location.href = "today.html";
        }, 600);
      });
    }

    var findRecipes = document.querySelector("[data-find-recipes]");
    if (findRecipes) {
      findRecipes.addEventListener("click", function (e) {
        var input = document.getElementById("fridge-ingredients");
        var err = document.getElementById("fridge-error");
        if (!input || input.value.trim() === "") {
          e.preventDefault();
          if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
          if (err) err.hidden = false;
          return;
        }
        if (err) err.hidden = true;
      });
    }

    var saveRecipe = document.querySelector("[data-save-recipe]");
    if (saveRecipe) {
      saveRecipe.addEventListener("click", function (e) {
        e.preventDefault();
        var title = document.getElementById("recipe-title");
        var ing = document.getElementById("recipe-ingredients");
        var steps = document.getElementById("recipe-steps");
        var ok = true;
        function mark(field, show) {
          var er = document.getElementById(field.id + "-error");
          if (er) er.hidden = !show;
          if (show) ok = false;
        }
        if (title && !title.value.trim()) mark(title, true);
        else if (title) mark(title, false);
        if (ing && !ing.value.trim()) mark(ing, true);
        else if (ing) mark(ing, false);
        if (steps && !steps.value.trim()) mark(steps, true);
        else if (steps) mark(steps, false);
        if (!ok) return;
        showToast("Resep tersimpan", 1800);
        setTimeout(function () {
          window.location.href = "recipe-detail.html?mine=1";
        }, 500);
      });
    }
  });

  window.M1Proto = { initDisclaimer: initDisclaimer, showToast: showToast };
})();
