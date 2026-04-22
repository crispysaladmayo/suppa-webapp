import { sumMacros } from './nutrition';

describe('sumMacros', () => {
  it('sums optional fields', () => {
    expect(
      sumMacros([
        { kcal: 100, protein_g: 10 },
        { kcal: 50, fiber_g: 3 },
      ]),
    ).toEqual({
      kcal: 150,
      protein_g: 10,
      carbs_g: 0,
      fat_g: 0,
      fiber_g: 3,
      iron_mg: 0,
      calcium_mg: 0,
    });
  });
});
