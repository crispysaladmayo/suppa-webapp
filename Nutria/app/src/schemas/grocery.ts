import { z } from 'zod';

export const GroceryFormSchema = z.object({
  name: z.string().min(1).max(120),
  section: z.string().min(1),
  qty_text: z.string().max(40).optional(),
  price_idr_per_unit: z.number().nonnegative().optional(),
});

export type GroceryForm = z.infer<typeof GroceryFormSchema>;
