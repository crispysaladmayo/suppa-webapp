import type { SQLiteDatabase } from 'expo-sqlite';
import { SettingsPayloadSchema, defaultSettings, type SettingsPayload } from '../schemas/settings';

export async function loadSettings(db: SQLiteDatabase): Promise<SettingsPayload> {
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_setting WHERE key = 'settings_json'",
  );
  if (!row?.value) return defaultSettings;
  try {
    const parsed = JSON.parse(row.value) as unknown;
    return SettingsPayloadSchema.parse(parsed);
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(db: SQLiteDatabase, s: SettingsPayload): Promise<void> {
  const validated = SettingsPayloadSchema.parse(s);
  await db.runAsync(
    "INSERT OR REPLACE INTO app_setting (key, value) VALUES ('settings_json', ?)",
    [JSON.stringify(validated)],
  );
}
