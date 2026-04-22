import type { SQLiteDatabase } from 'expo-sqlite';
import { log } from '../logger';

export async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const row = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM schema_migrations ORDER BY id DESC LIMIT 1',
  );
  const v = row?.id ?? 0;
  if (v < 1) {
    await db.execAsync(`
      CREATE TABLE person (
        id TEXT PRIMARY KEY NOT NULL,
        display_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('adult','child')),
        sort_order INTEGER NOT NULL
      );
      CREATE TABLE prep_run (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        started_at TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('active','archived'))
      );
      CREATE TABLE prep_item (
        id TEXT PRIMARY KEY NOT NULL,
        prep_run_id TEXT NOT NULL,
        name TEXT NOT NULL,
        total_cooked_grams REAL NOT NULL,
        remaining_grams REAL NOT NULL,
        cook_yield_pct REAL NOT NULL DEFAULT 27.5,
        FOREIGN KEY (prep_run_id) REFERENCES prep_run(id) ON DELETE CASCADE
      );
      CREATE TABLE consumption_log (
        id TEXT PRIMARY KEY NOT NULL,
        prep_item_id TEXT NOT NULL,
        person_id TEXT NOT NULL,
        grams REAL NOT NULL,
        logged_at TEXT NOT NULL,
        FOREIGN KEY (prep_item_id) REFERENCES prep_item(id) ON DELETE CASCADE,
        FOREIGN KEY (person_id) REFERENCES person(id)
      );
      CREATE TABLE meal_entry (
        id TEXT PRIMARY KEY NOT NULL,
        week_start TEXT NOT NULL,
        day_index INTEGER NOT NULL CHECK(day_index >= 0 AND day_index <= 6),
        slot TEXT NOT NULL CHECK(slot IN ('breakfast','lunch','dinner','snack')),
        person_id TEXT NOT NULL,
        title TEXT NOT NULL,
        is_fresh INTEGER NOT NULL DEFAULT 1,
        prep_item_id TEXT,
        notes TEXT,
        kcal REAL,
        protein_g REAL,
        carbs_g REAL,
        fat_g REAL,
        fiber_g REAL,
        iron_mg REAL,
        calcium_mg REAL,
        FOREIGN KEY (person_id) REFERENCES person(id),
        FOREIGN KEY (prep_item_id) REFERENCES prep_item(id)
      );
      CREATE TABLE grocery_item (
        id TEXT PRIMARY KEY NOT NULL,
        week_start TEXT NOT NULL,
        name TEXT NOT NULL,
        section TEXT NOT NULL,
        qty_text TEXT,
        price_idr_per_unit REAL,
        checked INTEGER NOT NULL DEFAULT 0,
        source TEXT DEFAULT 'manual'
      );
      CREATE TABLE pantry_item (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        section TEXT NOT NULL,
        qty_guess REAL,
        unit_note TEXT,
        price_idr_per_unit REAL
      );
      CREATE TABLE app_setting (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
      INSERT INTO schema_migrations (id, applied_at) VALUES (1, datetime('now'));
    `);
    await seed(db);
    log.info('db_migration_applied', { version: 1 });
  }
}

async function seed(db: SQLiteDatabase): Promise<void> {
  const pc = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM person');
  if ((pc?.c ?? 0) > 0) return;

  await db.execAsync(`
    INSERT INTO person (id, display_name, role, sort_order) VALUES
      ('wife', 'Wife', 'adult', 0),
      ('husband', 'Husband', 'adult', 1),
      ('daughter', 'Daughter', 'child', 2);
    INSERT INTO app_setting (key, value) VALUES
      ('settings_json', '{"lowThresholdPct":0.2,"criticalThresholdPct":0.1,"homeLayout":"depletion"}');
    INSERT INTO prep_run (id, name, started_at, status) VALUES
      ('seed-run-1', 'Latest batch', datetime('now'), 'active');
    INSERT INTO prep_item (id, prep_run_id, name, total_cooked_grams, remaining_grams, cook_yield_pct) VALUES
      ('seed-chicken', 'seed-run-1', 'Chicken (prepped)', 1000, 320, 27.5),
      ('seed-beef', 'seed-run-1', 'Minced beef (prepped)', 800, 400, 25);
    INSERT INTO pantry_item (id, name, section, qty_guess, unit_note, price_idr_per_unit) VALUES
      ('p1', 'Egg white', 'dairy', 500, 'g', 12000),
      ('p2', 'Oats', 'pantry', 1, 'kg', 45000),
      ('p3', 'Corn kernels', 'frozen', 400, 'g', 18000),
      ('p4', 'Green beans', 'produce', 300, 'g', 22000);
  `);
}
