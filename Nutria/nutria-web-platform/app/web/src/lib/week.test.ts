import { describe, expect, it } from 'vitest';
import { startOfWeekSunday, toYmd } from './week.js';

describe('week', () => {
  it('formats local ymd', () => {
    const d = new Date(2026, 3, 22);
    expect(toYmd(d)).toBe('2026-04-22');
  });
  it('sunday start', () => {
    const d = new Date(2026, 3, 22);
    expect(startOfWeekSunday(d)).toBe('2026-04-19');
  });
});
