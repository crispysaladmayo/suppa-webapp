import { averageRemainingRatio } from './depletion';

export type Nudge = { id: string; text: string };

export function buildPrepNudges(items: { remaining: number; total: number }[]): Nudge[] {
  const out: Nudge[] = [];
  const avg = averageRemainingRatio(items);
  if (items.length > 0 && avg < 0.25) {
    out.push({
      id: 'low-stock',
      text: 'Prepped food is running low — review groceries or schedule the next prep run.',
    });
  }
  if (items.length === 0) {
    out.push({
      id: 'no-run',
      text: 'No active prep run yet — start one when you cook the next batch.',
    });
  }
  return out;
}
