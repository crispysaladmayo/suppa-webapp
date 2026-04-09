"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 8787);
const DATA_PATH = path.join(__dirname, "db.json");
const STATIC_DIR = path.join(__dirname, "..", "internal-tooling-crud");

const schema = {
  households: ["id", "name", "country", "city", "created_at"],
  children: ["id", "household_id", "name", "age_band", "sex", "allergies_csv"],
  recipes: ["id", "household_id", "title", "ingredients_csv", "macro_emphasis", "total_minutes"],
  meal_logs: ["id", "child_id", "meal_name", "food_groups_csv", "portion", "logged_at"],
  growth_entries: ["id", "child_id", "recorded_on", "weight_kg", "height_cm", "measurement_type"]
};

function generateId(entity) {
  const prefix = entity.replace(/[^a-z]/g, "").slice(0, 2) || "id";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${stamp}${rand}`;
}

function seedData() {
  return {
    households: [{ id: "hh_1", name: "Keluarga Nanda", country: "ID", city: "Bandung", created_at: "2026-04-01" }],
    children: [{ id: "ch_1", household_id: "hh_1", name: "Nara", age_band: "1-2", sex: "female", allergies_csv: "peanut,egg" }],
    recipes: [{ id: "rc_1", household_id: "hh_1", title: "Chicken Rice Bowl", ingredients_csv: "chicken,rice,carrot", macro_emphasis: "protein", total_minutes: "25" }],
    meal_logs: [{ id: "ml_1", child_id: "ch_1", meal_name: "Sarapan bubur", food_groups_csv: "grains,protein", portion: "medium", logged_at: "2026-04-07T08:00:00Z" }],
    growth_entries: [{ id: "gr_1", child_id: "ch_1", recorded_on: "2026-04-03", weight_kg: "10.2", height_cm: "78.1", measurement_type: "standing_height" }]
  };
}

function ensureDb() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(seedData(), null, 2), "utf8");
  }
}

function readDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return { ...seedData(), ...parsed };
  } catch {
    const seeded = seedData();
    fs.writeFileSync(DATA_PATH, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
}

function writeDb(db) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2), "utf8");
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function isEntityName(value) {
  return Object.prototype.hasOwnProperty.call(schema, value);
}

function serveStatic(reqPath, res) {
  const target = reqPath === "/" ? "/index.html" : reqPath;
  const filePath = path.normalize(path.join(STATIC_DIR, target));
  if (!filePath.startsWith(STATIC_DIR)) return sendJson(res, 403, { error: "Forbidden" });
  if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: "Not found" });

  const ext = path.extname(filePath).toLowerCase();
  const typeMap = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8"
  };
  const contentType = typeMap[ext] || "application/octet-stream";
  const body = fs.readFileSync(filePath);
  res.writeHead(200, { "Content-Type": contentType });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const method = req.method || "GET";
  const requestUrl = new URL(req.url || "/", `http://localhost:${PORT}`);
  const pathname = requestUrl.pathname;

  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  if (pathname === "/api/schema" && method === "GET") {
    return sendJson(res, 200, { schema });
  }

  if (pathname === "/api/reset" && method === "POST") {
    const seeded = seedData();
    writeDb(seeded);
    return sendJson(res, 200, { ok: true });
  }

  if (pathname.startsWith("/api/")) {
    const parts = pathname.split("/").filter(Boolean);
    const entity = parts[1];
    const id = parts[2];

    if (!isEntityName(entity)) {
      return sendJson(res, 404, { error: "Unknown entity" });
    }

    const db = readDb();
    const rows = db[entity] || [];

    if (method === "GET" && !id) {
      return sendJson(res, 200, { data: rows });
    }

    if (method === "POST" && !id) {
      let payload;
      try {
        payload = await parseBody(req);
      } catch {
        return sendJson(res, 400, { error: "Invalid JSON body" });
      }
      if (!payload.id) payload.id = generateId(entity);
      if (rows.some((r) => r.id === payload.id)) return sendJson(res, 409, { error: "id already exists" });
      rows.push(payload);
      db[entity] = rows;
      writeDb(db);
      return sendJson(res, 201, { data: payload });
    }

    if (method === "PUT" && id) {
      let payload;
      try {
        payload = await parseBody(req);
      } catch {
        return sendJson(res, 400, { error: "Invalid JSON body" });
      }
      const index = rows.findIndex((r) => r.id === id);
      if (index < 0) return sendJson(res, 404, { error: "record not found" });
      rows[index] = { ...payload, id };
      db[entity] = rows;
      writeDb(db);
      return sendJson(res, 200, { data: rows[index] });
    }

    if (method === "DELETE" && id) {
      const nextRows = rows.filter((r) => r.id !== id);
      if (nextRows.length === rows.length) return sendJson(res, 404, { error: "record not found" });
      db[entity] = nextRows;
      writeDb(db);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  }

  return serveStatic(pathname, res);
});

server.listen(PORT, () => {
  ensureDb();
  console.log(`Internal tooling server running on http://localhost:${PORT}`);
});
