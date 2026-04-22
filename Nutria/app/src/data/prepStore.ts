import type { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export type PrepRunRow = {
  id: string;
  name: string;
  started_at: string;
  status: string;
};

export type PrepItemRow = {
  id: string;
  prep_run_id: string;
  name: string;
  total_cooked_grams: number;
  remaining_grams: number;
  cook_yield_pct: number;
};

export async function getActivePrepRun(db: SQLiteDatabase): Promise<PrepRunRow | null> {
  return (
    (await db.getFirstAsync<PrepRunRow>(
      "SELECT * FROM prep_run WHERE status = 'active' ORDER BY started_at DESC LIMIT 1",
    )) ?? null
  );
}

export async function getPrepItems(db: SQLiteDatabase, runId: string): Promise<PrepItemRow[]> {
  return await db.getAllAsync<PrepItemRow>(
    'SELECT * FROM prep_item WHERE prep_run_id = ? ORDER BY name',
    [runId],
  );
}

export async function addConsumption(
  db: SQLiteDatabase,
  prepItemId: string,
  personId: string,
  grams: number,
): Promise<void> {
  const id = Crypto.randomUUID();
  const loggedAt = new Date().toISOString();
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO consumption_log (id, prep_item_id, person_id, grams, logged_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, prepItemId, personId, grams, loggedAt],
    );
    const row = await db.getFirstAsync<{ remaining_grams: number }>(
      'SELECT remaining_grams FROM prep_item WHERE id = ?',
      [prepItemId],
    );
    const cur = row?.remaining_grams ?? 0;
    const next = Math.max(0, cur - grams);
    await db.runAsync('UPDATE prep_item SET remaining_grams = ? WHERE id = ?', [next, prepItemId]);
  });
}

export async function createPrepRun(
  db: SQLiteDatabase,
  name: string,
  items: { name: string; totalCookedGrams: number; cookYieldPct: number }[],
): Promise<void> {
  const runId = Crypto.randomUUID();
  await db.withTransactionAsync(async () => {
    await db.runAsync("UPDATE prep_run SET status = 'archived' WHERE status = 'active'");
    await db.runAsync(
      `INSERT INTO prep_run (id, name, started_at, status) VALUES (?, ?, ?, 'active')`,
      [runId, name, new Date().toISOString()],
    );
    for (const it of items) {
      const iid = Crypto.randomUUID();
      await db.runAsync(
        `INSERT INTO prep_item (id, prep_run_id, name, total_cooked_grams, remaining_grams, cook_yield_pct)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [iid, runId, it.name, it.totalCookedGrams, it.totalCookedGrams, it.cookYieldPct],
      );
    }
  });
}
