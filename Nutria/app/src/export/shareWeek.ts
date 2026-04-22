import { Share } from 'react-native';
import { log } from '../logger';
import { estimatedTotalIdr, type GroceryRow } from '../data/groceryStore';
import type { MealRow } from '../data/mealStore';
import { dayLabel } from '../utils/date';
import { formatIDR } from '../utils/money';

function mealLines(meals: MealRow[]): string {
  return meals
    .map(
      (m) =>
        `${dayLabel(m.day_index)} ${m.slot} · ${m.title} (${m.person_id})` +
        (m.is_fresh ? '' : ' [prepped]'),
    )
    .join('\n');
}

function groceryLines(rows: GroceryRow[]): string {
  return rows
    .filter((r) => !r.checked)
    .map((r) => {
      const p = r.price_idr_per_unit != null ? ` · ${formatIDR(r.price_idr_per_unit)}` : '';
      const q = r.qty_text ? ` ${r.qty_text}` : '';
      return `- [ ] ${r.name}${q} (${r.section})${p}`;
    })
    .join('\n');
}

export async function shareWeekPlan(weekStart: string, meals: MealRow[], grocery: GroceryRow[]) {
  const total = estimatedTotalIdr(grocery);
  const body = [
    `Nutria — week of ${weekStart}`,
    '',
    'Meals',
    mealLines(meals) || '(none yet)',
    '',
    'Grocery (unchecked)',
    groceryLines(grocery) || '(none)',
    '',
    `Est. grocery (unchecked w/ price): ${formatIDR(total)}`,
  ].join('\n');

  try {
    await Share.share({ message: body, title: 'Nutria week' });
  } catch (e) {
    log.warn('share_failed', { err: String(e) });
  }
}
