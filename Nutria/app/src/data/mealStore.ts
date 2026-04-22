import type { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

export type MealRow = {
  id: string;
  week_start: string;
  day_index: number;
  slot: string;
  person_id: string;
  title: string;
  is_fresh: number;
  prep_item_id: string | null;
  notes: string | null;
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  iron_mg: number | null;
  calcium_mg: number | null;
};

export async function listMealsForWeek(
  db: SQLiteDatabase,
  weekStart: string,
): Promise<MealRow[]> {
  return await db.getAllAsync<MealRow>(
    'SELECT * FROM meal_entry WHERE week_start = ? ORDER BY day_index, slot, person_id',
    [weekStart],
  );
}

export async function insertMeal(
  db: SQLiteDatabase,
  m: Omit<MealRow, 'id'> & { id?: string },
): Promise<void> {
  const id = m.id ?? Crypto.randomUUID();
  await db.runAsync(
    `INSERT INTO meal_entry (
      id, week_start, day_index, slot, person_id, title, is_fresh, prep_item_id, notes,
      kcal, protein_g, carbs_g, fat_g, fiber_g, iron_mg, calcium_mg
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      m.week_start,
      m.day_index,
      m.slot,
      m.person_id,
      m.title,
      m.is_fresh,
      m.prep_item_id,
      m.notes,
      m.kcal,
      m.protein_g,
      m.carbs_g,
      m.fat_g,
      m.fiber_g,
      m.iron_mg,
      m.calcium_mg,
    ],
  );
}

export async function deleteMeal(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM meal_entry WHERE id = ?', [id]);
}
