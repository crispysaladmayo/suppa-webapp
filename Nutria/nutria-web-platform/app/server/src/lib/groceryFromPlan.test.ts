import { describe, expect, it } from 'vitest';
import {
  aggregateIngredients,
  estimateIngredientIdr,
  guessGrocerySection,
} from './groceryFromPlan.js';
import { normalizeRecipeNameKey } from './recipeKey.js';

describe('recipeKey', () => {
  it('normalizes keys', () => {
    expect(normalizeRecipeNameKey('  Nasi   Goreng  ')).toBe('nasi goreng');
  });
});

describe('groceryFromPlan', () => {
  it('aggregates duplicate ingredients', () => {
    const r = aggregateIngredients([
      { name: 'Bawang merah', grams: 50 },
      { name: 'bawang merah', grams: 30 },
      { name: 'Dada ayam', grams: 200 },
    ]);
    expect(r.find((x) => x.displayName === 'Bawang merah')?.totalGrams).toBe(80);
    expect(
      r.find((x) => x.key === normalizeRecipeNameKey('Dada ayam'))?.totalGrams,
    ).toBe(200);
  });

  it('guesses sections', () => {
    expect(guessGrocerySection('Bayam')).toBe('produce');
    expect(guessGrocerySection('Dada ayam')).toBe('meat');
  });

  it('estimates non-negative IDR', () => {
    expect(estimateIngredientIdr('Beras', 1000)).toBeGreaterThan(0);
  });
});
