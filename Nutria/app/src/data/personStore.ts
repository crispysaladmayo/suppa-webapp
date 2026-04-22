import type { SQLiteDatabase } from 'expo-sqlite';

export type PersonRow = {
  id: string;
  display_name: string;
  role: string;
  sort_order: number;
};

export async function listPersons(db: SQLiteDatabase): Promise<PersonRow[]> {
  return await db.getAllAsync<PersonRow>('SELECT * FROM person ORDER BY sort_order');
}
