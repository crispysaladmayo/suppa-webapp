import { z } from 'zod';

export const MacroRowSchema = z.object({
  kcal: z.number().optional(),
  protein_g: z.number().optional(),
  carbs_g: z.number().optional(),
  fat_g: z.number().optional(),
  fiber_g: z.number().optional(),
  iron_mg: z.number().optional(),
  calcium_mg: z.number().optional(),
});

export type MacroRow = z.infer<typeof MacroRowSchema>;

export type MacroTotals = {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  iron_mg: number;
  calcium_mg: number;
};

const zeroTotals: MacroTotals = {
  kcal: 0,
  protein_g: 0,
  carbs_g: 0,
  fat_g: 0,
  fiber_g: 0,
  iron_mg: 0,
  calcium_mg: 0,
};

export function sumMacros(rows: MacroRow[]): MacroTotals {
  const z = (n: number | undefined) => n ?? 0;
  return rows.reduce<MacroTotals>(
    (acc, r) => ({
      kcal: acc.kcal + z(r.kcal),
      protein_g: acc.protein_g + z(r.protein_g),
      carbs_g: acc.carbs_g + z(r.carbs_g),
      fat_g: acc.fat_g + z(r.fat_g),
      fiber_g: acc.fiber_g + z(r.fiber_g),
      iron_mg: acc.iron_mg + z(r.iron_mg),
      calcium_mg: acc.calcium_mg + z(r.calcium_mg),
    }),
    { ...zeroTotals },
  );
}
