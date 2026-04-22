export type DepletionState = 'comfortable' | 'low' | 'critical';

export function depletionState(
  remainingGrams: number,
  totalCookedGrams: number,
  lowThresholdPct: number,
  criticalThresholdPct: number,
): DepletionState {
  if (totalCookedGrams <= 0) return 'critical';
  const ratio = remainingGrams / totalCookedGrams;
  if (ratio <= criticalThresholdPct) return 'critical';
  if (ratio <= lowThresholdPct) return 'low';
  return 'comfortable';
}

export function remainingRatio(remainingGrams: number, totalCookedGrams: number): number {
  if (totalCookedGrams <= 0) return 0;
  return Math.max(0, Math.min(1, remainingGrams / totalCookedGrams));
}
