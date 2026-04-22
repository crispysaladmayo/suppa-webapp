import { z } from 'zod';

export const SettingsJson = z.object({
  lowThresholdPct: z.number().min(0).max(1).default(0.2),
  criticalThresholdPct: z.number().min(0).max(1).default(0.1),
  homeLayout: z.enum(['depletion', 'planner', 'compact']).default('depletion'),
  locale: z.literal('id').default('id'),
});

export type SettingsJson = z.infer<typeof SettingsJson>;

export const PatchSettingsBody = z.object({
  settings: SettingsJson.partial(),
});
