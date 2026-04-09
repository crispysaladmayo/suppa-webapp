"use strict";

const API_BASE = window.INTERNAL_TOOLING_API_BASE || "http://localhost:8787/api";

const schema = {
  households: {
    description: "Household account-level metadata",
    fields: ["id", "name", "country", "city", "created_at"]
  },
  children: {
    description: "Primary child profile and nutrition settings",
    fields: ["id", "household_id", "name", "age_band", "sex", "allergies_csv"]
  },
  recipes: {
    description: "Seeded and user recipes with optional nutrition metadata",
    fields: ["id", "household_id", "title", "ingredients_csv", "macro_emphasis", "total_minutes"]
  },
  meal_logs: {
    description: "Meal/snack log records used for daily rollups",
    fields: ["id", "child_id", "meal_name", "food_groups_csv", "portion", "logged_at"]
  },
  growth_entries: {
    description: "Growth check-ins for charting references",
    fields: ["id", "child_id", "recorded_on", "weight_kg", "height_cm", "measurement_type"]
  }
};

let activeEntity = "households";
let editingId = null;
let rowsByEntity = {};

function generateId(entity) {
  const prefix = entity.replace(/[^a-z]/g, "").slice(0, 2) || "id";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${stamp}${rand}`;
}

async function fetchEntityRows(entity) {
  const response = await fetch(`${API_BASE}/${entity}`);
  if (!response.ok) throw new Error(`Failed to load ${entity}`);
  const payload = await response.json();
  return payload.data || [];
}

async function refreshActiveEntityRows() {
  rowsByEntity[activeEntity] = await fetchEntityRows(activeEntity);
}

function renderSchemaCards() {
  const mount = document.getElementById("schemaGrid");
  const tpl = document.getElementById("schemaTemplate");
  mount.innerHTML = "";

  Object.entries(schema).forEach(([entity, def]) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector("h3").textContent = entity;
    node.querySelector("p").textContent = `${def.description}. Fields: ${def.fields.join(", ")}`;
    mount.appendChild(node);
  });
}

function renderTabs() {
  const tabs = document.getElementById("entityTabs");
  const tpl = document.getElementById("tabTemplate");
  tabs.innerHTML = "";

  Object.keys(schema).forEach((entity) => {
    const node = tpl.content.cloneNode(true);
    const button = node.querySelector("button");
    button.textContent = entity;
    button.setAttribute("aria-selected", entity === activeEntity ? "true" : "false");
    button.addEventListener("click", async () => {
      activeEntity = entity;
      editingId = null;
      await renderAll();
    });
    tabs.appendChild(node);
  });
}

function renderTable() {
  const fields = schema[activeEntity].fields;
  const rows = rowsByEntity[activeEntity] || [];
  const head = document.getElementById("tableHead");
  const body = document.getElementById("tableBody");

  head.innerHTML = `<tr>${fields.map((f) => `<th>${f}</th>`).join("")}<th>actions</th></tr>`;

  body.innerHTML = rows
    .map((row) => {
      return `<tr>
        ${fields.map((f) => `<td><code>${escapeHtml(String(row[f] ?? ""))}</code></td>`).join("")}
        <td>
          <div class="actions">
            <button class="button button-secondary" data-action="edit" data-id="${row.id}" type="button">Edit</button>
            <button class="button button-danger" data-action="delete" data-id="${row.id}" type="button">Delete</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");

  body.querySelectorAll("button[data-action]").forEach((btn) => {
    const id = btn.dataset.id;
    if (btn.dataset.action === "edit") {
      btn.addEventListener("click", () => startEdit(id));
    } else if (btn.dataset.action === "delete") {
      btn.addEventListener("click", () => deleteRecord(id));
    }
  });
}

function renderForm() {
  const form = document.getElementById("recordForm");
  const title = document.getElementById("formTitle");
  const fields = schema[activeEntity].fields;
  const existing = editingId ? (rowsByEntity[activeEntity] || []).find((r) => r.id === editingId) : null;
  title.textContent = editingId ? `Edit ${activeEntity} record` : `Create ${activeEntity} record`;

  form.innerHTML = "";
  fields.forEach((field) => {
    const wrapper = document.createElement("div");
    wrapper.className = `field ${field.includes("csv") ? "span-2" : ""}`;
    const label = document.createElement("label");
    label.setAttribute("for", `field_${field}`);
    label.textContent = field;
    const input = field.includes("csv") ? document.createElement("textarea") : document.createElement("input");
    input.id = `field_${field}`;
    input.name = field;
    input.value = existing ? String(existing[field] ?? "") : "";
    if (!editingId && field === "id") input.placeholder = `${activeEntity.slice(0, 2)}_${Date.now().toString(36)}`;
    wrapper.append(label, input);
    form.appendChild(wrapper);
  });

  const actionWrap = document.createElement("div");
  actionWrap.className = "field span-2";
  actionWrap.innerHTML = `
    <div class="actions">
      <button class="button button-primary" type="submit">${editingId ? "Update" : "Create"}</button>
      ${editingId ? '<button class="button button-secondary" type="button" id="cancelEdit">Cancel</button>' : ""}
    </div>
  `;
  form.appendChild(actionWrap);

  form.onsubmit = async (event) => {
    await onSubmitRecord(event);
  };
  const cancel = document.getElementById("cancelEdit");
  if (cancel) {
    cancel.onclick = () => {
      editingId = null;
      renderForm();
    };
  }
}

async function onSubmitRecord(event) {
  event.preventDefault();
  const fields = schema[activeEntity].fields;
  const payload = {};
  fields.forEach((f) => {
    payload[f] = event.target.elements[f].value.trim();
  });
  if (!payload.id && !editingId) payload.id = generateId(activeEntity);
  if (!payload.id) {
    alert("id is required");
    return;
  }

  if (editingId) {
    const response = await fetch(`${API_BASE}/${activeEntity}/${encodeURIComponent(editingId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      alert("Failed to update record");
      return;
    }
  } else {
    const response = await fetch(`${API_BASE}/${activeEntity}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.status === 409) {
      alert("id must be unique");
      return;
    }
    if (!response.ok) {
      alert("Failed to create record");
      return;
    }
  }
  editingId = null;
  await renderAll();
}

function startEdit(id) {
  editingId = id;
  renderForm();
}

async function deleteRecord(id) {
  const response = await fetch(`${API_BASE}/${activeEntity}/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!response.ok) {
    alert("Failed to delete record");
    return;
  }
  if (editingId === id) editingId = null;
  await renderAll();
}

async function resetData() {
  const response = await fetch(`${API_BASE}/reset`, { method: "POST" });
  if (!response.ok) {
    alert("Failed to reset data");
    return;
  }
  editingId = null;
  await renderAll();
}

async function renderAll() {
  await refreshActiveEntityRows();
  renderSchemaCards();
  renderTabs();
  renderTable();
  renderForm();
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

document.getElementById("seedButton").addEventListener("click", async () => {
  await resetData();
});

renderAll().catch(() => {
  alert("Cannot reach backend API. Start server: node Child Nutrition App/internal-tooling-api/server.js");
});
