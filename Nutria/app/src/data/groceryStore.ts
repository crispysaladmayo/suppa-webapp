import type { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export type GroceryRow = {
  id: string;
  week_start: string;
  name: string;
  section: string;
  qty_text: string | null;
  price_idr_per_unit: number | null;
  checked: number;
  source: string | null;
};

const SECTIONS = ['produce', 'meat', 'dairy', 'pantry', 'frozen', 'other'] as const;

export function normalizeSection(s: string): string {
  const x = s.toLowerCase().trim();
  return (SECTIONS as readonly string[]).includes(x) ? x : 'other';
}

export async function listGrocery(db: SQLiteDatabase, weekStart: string): Promise<GroceryRow[]> {
  return await db.getAllAsync<GroceryRow>(
    'SELECT * FROM grocery_item WHERE week_start = ? ORDER BY section, name',
    [weekStart],
  );
}

export async function insertGrocery(
  db: SQLiteDatabase,
  weekStart: string,
  name: string,
  section: string,
  qtyText: string | null,
  priceIdr: number | null,
): Promise<void> {
  const id = Crypto.randomUUID();
  await db.runAsync(
    `INSERT INTO grocery_item (id, week_start, name, section, qty_text, price_idr_per_unit, checked, source)
     VALUES (?, ?, ?, ?, ?, ?, 0, 'manual')`,
    [id, weekStart, name, normalizeSection(section), qtyText, priceIdr],
  );
}

export async function toggleGrocery(db: SQLiteDatabase, id: string, checked: boolean): Promise<void> {
  await db.runAsync('UPDATE grocery_item SET checked = ? WHERE id = ?', [
    checked ? 1 : 0,
    id,
  ]);
}

export function estimatedTotalIdr(rows: GroceryRow[]): number {
  let sum = 0;
  for (const r of rows) {
    if (r.checked) continue;
    const p = r.price_idr_per_unit;
    if (p == null) continue;
    sum += p;
  }
  return Math.round(sum);
}
