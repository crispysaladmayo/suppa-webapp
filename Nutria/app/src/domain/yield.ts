import { z } from 'zod';

export const YieldInputSchema = z.object({
  rawGrams: z.number().positive(),
  cookLossPct: z.number().min(0).max(60),
});

export function cookedFromRaw(rawGrams: number, cookLossPct: number): number {
  return rawGrams * (1 - cookLossPct / 100);
}

export function rawNeededForCooked(cookedGrams: number, cookLossPct: number): number {
  const factor = 1 - cookLossPct / 100;
  if (factor <= 0) return cookedGrams;
  return cookedGrams / factor;
}
