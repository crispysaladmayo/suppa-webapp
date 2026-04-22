import type { SQLiteDatabase } from 'expo-sqlite';
import { z } from 'zod';

const StateSchema = z.object({
  prepRunId: z.string().nullable(),
  tone: z.enum(['ok', 'warn', 'crit']),
});

export type DepletionNotifyState = z.infer<typeof StateSchema>;

const KEY = 'depletion_notify_state';

export async function loadDepletionNotifyState(
  db: SQLiteDatabase,
): Promise<DepletionNotifyState | null> {
  const row = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_setting WHERE key = ?`,
    [KEY],
  );
  if (!row?.value) return null;
  try {
    return StateSchema.parse(JSON.parse(row.value));
  } catch {
    return null;
  }
}

export async function saveDepletionNotifyState(
  db: SQLiteDatabase,
  s: DepletionNotifyState,
): Promise<void> {
  const v = StateSchema.parse(s);
  await db.runAsync(`INSERT OR REPLACE INTO app_setting (key, value) VALUES (?, ?)`, [
    KEY,
    JSON.stringify(v),
  ]);
}
