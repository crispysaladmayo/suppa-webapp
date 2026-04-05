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

  document.addEventListener("DOMContentLoaded", function () {
    initTodayGreeting();
    initDisclaimer(document);

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
