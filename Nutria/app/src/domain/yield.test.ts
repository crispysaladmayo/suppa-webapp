import { cookedFromRaw, rawNeededForCooked } from './yield';

describe('yield', () => {
  it('cookedFromRaw ~27.5% loss', () => {
    expect(cookedFromRaw(1000, 27.5)).toBeCloseTo(725);
  });

  it('rawNeededForCooked inverts', () => {
    const raw = rawNeededForCooked(725, 27.5);
    expect(cookedFromRaw(raw, 27.5)).toBeCloseTo(725);
  });
});
