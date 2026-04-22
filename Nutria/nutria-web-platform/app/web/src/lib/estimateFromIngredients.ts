import table from '../data/id-ingredient-nutrition.json';

export type IngredientLineInput = { name: string; grams: string };

type Row = {
  aliases: string[];
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  ironMg: number;
  calciumMg: number;
  vitaminCMg: number;
};

const NUTRITION_TABLE = table as Row[];

export type NutritionTotals = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  ironMg: number;
  calciumMg: number;
  vitaminCMg: number;
};

const EMPTY: NutritionTotals = {
  kcal: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  fiberG: 0,
  ironMg: 0,
  calciumMg: 0,
  vitaminCMg: 0,
};

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

function parseGrams(s: string): number | null {
  const t = s.trim().replace(',', '.');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Match user ingredient name to seed row (Indonesian aliases). */
function findRow(name: string): { row: Row; matchedAlias: string } | null {
  const n = normalize(name);
  if (!n) return null;
  for (const row of NUTRITION_TABLE) {
    for (const a of row.aliases) {
      if (normalize(a) === n) return { row, matchedAlias: a };
    }
  }
  let best: { row: Row; matchedAlias: string; len: number } | null = null;
  for (const row of NUTRITION_TABLE) {
    for (const a of row.aliases) {
      const an = normalize(a);
      if (an.length < 3) continue;
      if (n.includes(an)) {
        if (!best || an.length > best.len) best = { row, matchedAlias: a, len: an.length };
      }
    }
  }
  if (best) return { row: best.row, matchedAlias: best.matchedAlias };
  for (const row of NUTRITION_TABLE) {
    for (const a of row.aliases) {
      const an = normalize(a);
      if (an.length < 4 || n.length < 4) continue;
      if (an.includes(n)) return { row, matchedAlias: a };
    }
  }
  return null;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Sum nutrients for listed ingredients (amounts in grams); per-100g from seed table. */
export function estimateNutritionFromIngredients(lines: IngredientLineInput[]): {
  total: NutritionTotals;
  matched: Array<{ inputName: string; matchedAlias: string }>;
  unmatched: string[];
} {
  const matched: Array<{ inputName: string; matchedAlias: string }> = [];
  const unmatched: string[] = [];
  const total: NutritionTotals = { ...EMPTY };

  for (const line of lines) {
    const name = line.name.trim();
    const grams = parseGrams(line.grams);
    if (!name || grams == null) continue;
    const hit = findRow(name);
    if (!hit) {
      unmatched.push(name);
      continue;
    }
    matched.push({ inputName: name, matchedAlias: hit.matchedAlias });
    const f = grams / 100;
    total.kcal += hit.row.kcal * f;
    total.proteinG += hit.row.proteinG * f;
    total.carbsG += hit.row.carbsG * f;
    total.fatG += hit.row.fatG * f;
    total.fiberG += hit.row.fiberG * f;
    total.ironMg += hit.row.ironMg * f;
    total.calciumMg += hit.row.calciumMg * f;
    total.vitaminCMg += hit.row.vitaminCMg * f;
  }

  return {
    total: {
      kcal: Math.round(total.kcal),
      proteinG: round1(total.proteinG),
      carbsG: round1(total.carbsG),
      fatG: round1(total.fatG),
      fiberG: round1(total.fiberG),
      ironMg: round1(total.ironMg),
      calciumMg: round1(total.calciumMg),
      vitaminCMg: round1(total.vitaminCMg),
    },
    matched,
    unmatched,
  };
}

export function scaleNutrition(n: NutritionTotals, factor: number): NutritionTotals {
  if (!Number.isFinite(factor) || factor <= 0) return { ...EMPTY };
  return {
    kcal: Math.round(n.kcal * factor),
    proteinG: round1(n.proteinG * factor),
    carbsG: round1(n.carbsG * factor),
    fatG: round1(n.fatG * factor),
    fiberG: round1(n.fiberG * factor),
    ironMg: round1(n.ironMg * factor),
    calciumMg: round1(n.calciumMg * factor),
    vitaminCMg: round1(n.vitaminCMg * factor),
  };
}
