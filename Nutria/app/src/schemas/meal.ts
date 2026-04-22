import { z } from 'zod';

export const MealFormSchema = z.object({
  week_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  day_index: z.number().int().min(0).max(6),
  slot: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  person_id: z.string().min(1),
  title: z.string().min(1).max(200),
  is_fresh: z.boolean(),
  kcal: z.number().optional(),
  protein_g: z.number().optional(),
  carbs_g: z.number().optional(),
  fat_g: z.number().optional(),
  fiber_g: z.number().optional(),
  iron_mg: z.number().optional(),
  calcium_mg: z.number().optional(),
});

export type MealForm = z.infer<typeof MealFormSchema>;
