-- Subset of catholic-daily-app-data-architecture.md §3: readings only.
-- Used by build_readings_bundle.py and as reference for Room.

CREATE TABLE readings_bundle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bundle_version TEXT NOT NULL UNIQUE,
  conference_code TEXT NOT NULL DEFAULT 'KWI',
  effective_from TEXT NOT NULL,
  source_attribution TEXT NOT NULL,
  content_license_tag TEXT,
  sha256 TEXT NOT NULL,
  installed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE readings_day (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bundle_id INTEGER NOT NULL REFERENCES readings_bundle(id) ON DELETE CASCADE,
  liturgical_date TEXT NOT NULL,
  cycle_metadata TEXT,
  UNIQUE (bundle_id, liturgical_date)
);

CREATE TABLE reading_block (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  readings_day_id INTEGER NOT NULL REFERENCES readings_day(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('FIRST','PSALM','SECOND','GOSPEL')),
  reference TEXT,
  title TEXT,
  body TEXT NOT NULL,
  source_line TEXT,
  UNIQUE (readings_day_id, kind, sort_order)
);

CREATE INDEX idx_readings_day_lookup ON readings_day (liturgical_date);
CREATE INDEX idx_readings_day_bundle ON readings_day (bundle_id, liturgical_date);
