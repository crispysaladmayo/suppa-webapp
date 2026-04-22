import { z } from 'zod';

export const HomeLayoutSchema = z.enum(['depletion', 'planner', 'compact']);
export type HomeLayout = z.infer<typeof HomeLayoutSchema>;

export const SettingsPayloadSchema = z.object({
  lowThresholdPct: z.number().min(0.05).max(0.95),
  criticalThresholdPct: z.number().min(0.01).max(0.5),
  homeLayout: HomeLayoutSchema,
});

export type SettingsPayload = z.infer<typeof SettingsPayloadSchema>;

export const defaultSettings: SettingsPayload = {
  lowThresholdPct: 0.2,
  criticalThresholdPct: 0.1,
  homeLayout: 'depletion',
};
