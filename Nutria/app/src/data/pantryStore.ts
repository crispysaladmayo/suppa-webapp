import type { SQLiteDatabase } from 'expo-sqlite';

export type PantryRow = {
  id: string;
  name: string;
  section: string;
  qty_guess: number | null;
  unit_note: string | null;
  price_idr_per_unit: number | null;
};

export async function listPantry(db: SQLiteDatabase): Promise<PantryRow[]> {
  return await db.getAllAsync<PantryRow>('SELECT * FROM pantry_item ORDER BY section, name');
}
