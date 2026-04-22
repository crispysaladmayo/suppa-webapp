import { normalizeIngredientKey } from './recipeKey.js';

export type AggregatedIngredient = {
  key: string;
  displayName: string;
  totalGrams: number;
};

export function guessGrocerySection(name: string): string {
  const n = name.toLowerCase();
  if (
    /sayur|bayam|kangkung|tomat|wortel|selada|sawi|kubis|brokoli|buncis|kentang|jamur|timun|paprika|daun/i.test(
      n,
    )
  ) {
    return 'produce';
  }
  if (/ayam|daging|ikan|sapi|kambing|udang|cumi|telur|tahu|tempe|protein|fillet|beef|pork/i.test(n)) {
    return 'meat';
  }
  if (/susu|keju|yogurt|mentega|cream|dairy/i.test(n)) {
    return 'dairy';
  }
  if (/beku|frozen|es|peas|mixed vegetable/i.test(n)) {
    return 'frozen';
  }
  if (/beras|minyak|gula|garam|kecap|saus|tepung|pasta|oat|bumbu|merica|bawang putih|bawang bombay/i.test(n)) {
    return 'pantry';
  }
  return 'other';
}

/** Rough IDR estimate for a line (total for `grams`, not per kg in DB — matches “perkiraan” UX). */
export function estimateIngredientIdr(displayName: string, grams: number): number {
  const n = displayName.toLowerCase();
  const kg = grams / 1000;
  let perKg = 28000;
  if (/ayam|daging|sapi|ikan|udang|cumi|beef|fillet/i.test(n)) perKg = 72000;
  else if (/telur/i.test(n)) perKg = 32000;
  else if (/sayur|bayam|kangkung|sawi|tomat|wortel/i.test(n)) perKg = 16000;
  else if (/beras|oat|pasta|tepung/i.test(n)) perKg = 22000;
  else if (/susu|keju|yogurt/i.test(n)) perKg = 38000;
  else if (/minyak|goreng/i.test(n)) perKg = 26000;
  return Math.max(0, Math.round(perKg * kg));
}

export function aggregateIngredients(
  lines: Array<{ name: string; grams: number }>,
): AggregatedIngredient[] {
  const map = new Map<string, { displayName: string; totalGrams: number }>();
  for (const row of lines) {
    const key = normalizeIngredientKey(row.name);
    if (!key) continue;
    const g = row.grams;
    if (!Number.isFinite(g) || g <= 0) continue;
    const prev = map.get(key);
    if (prev) {
      prev.totalGrams += g;
    } else {
      map.set(key, { displayName: row.name.trim(), totalGrams: g });
    }
  }
  return [...map.entries()]
    .map(([key, v]) => ({
      key,
      displayName: v.displayName,
      totalGrams: Math.round(v.totalGrams * 10) / 10,
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'id'));
}
