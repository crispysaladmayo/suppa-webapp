import { z } from 'zod';

export const ConsumptionFormSchema = z.object({
  prep_item_id: z.string().min(1),
  person_id: z.string().min(1),
  grams: z.number().positive().max(5000),
});

export type ConsumptionForm = z.infer<typeof ConsumptionFormSchema>;
