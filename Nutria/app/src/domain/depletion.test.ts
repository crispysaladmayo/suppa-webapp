import { averageRemainingRatio, depletionBand, homeAlertTone, remainingRatio } from './depletion';

describe('depletion', () => {
  it('remainingRatio clamps', () => {
    expect(remainingRatio(50, 100)).toBe(0.5);
    expect(remainingRatio(150, 100)).toBe(1);
    expect(remainingRatio(-1, 100)).toBe(0);
  });

  it('depletionBand uses thresholds', () => {
    expect(depletionBand(5, 100, { lowPct: 0.2, criticalPct: 0.1 })).toBe('critical');
    expect(depletionBand(15, 100, { lowPct: 0.2, criticalPct: 0.1 })).toBe('low');
    expect(depletionBand(50, 100, { lowPct: 0.2, criticalPct: 0.1 })).toBe('comfortable');
  });

  it('averageRemainingRatio', () => {
    expect(
      averageRemainingRatio([
        { remaining: 50, total: 100 },
        { remaining: 25, total: 100 },
      ]),
    ).toBeCloseTo(0.375);
  });

  it('homeAlertTone', () => {
    expect(homeAlertTone(0.05, 0.2, 0.1)).toBe('crit');
    expect(homeAlertTone(0.15, 0.2, 0.1)).toBe('warn');
    expect(homeAlertTone(0.5, 0.2, 0.1)).toBe('ok');
  });
});
