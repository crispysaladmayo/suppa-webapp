import { z } from 'zod';

export const ThresholdSchema = z.object({
  lowPct: z.number().min(0).max(1),
  criticalPct: z.number().min(0).max(1),
});

export type Thresholds = z.infer<typeof ThresholdSchema>;

const defaultThresholds: Thresholds = { lowPct: 0.2, criticalPct: 0.1 };

export function remainingRatio(remaining: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, remaining / total));
}

export type DepletionBand = 'comfortable' | 'low' | 'critical';

export function depletionBand(
  remaining: number,
  total: number,
  t: Partial<Thresholds> = {},
): DepletionBand {
  const th = { ...defaultThresholds, ...t };
  const r = remainingRatio(remaining, total);
  if (r <= th.criticalPct) return 'critical';
  if (r <= th.lowPct) return 'low';
  return 'comfortable';
}

export function averageRemainingRatio(items: { remaining: number; total: number }[]): number {
  if (items.length === 0) return 1;
  const sum = items.reduce((acc, it) => acc + remainingRatio(it.remaining, it.total), 0);
  return sum / items.length;
}

export type HomeAlertTone = 'ok' | 'warn' | 'crit';

/** Remaining fraction (0–1): lower = more depleted. */
export function homeAlertTone(
  avgRemaining: number,
  lowPct: number,
  critPct: number,
): HomeAlertTone {
  if (avgRemaining <= critPct) return 'crit';
  if (avgRemaining <= lowPct) return 'warn';
  return 'ok';
}
