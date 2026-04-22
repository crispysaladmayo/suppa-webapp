import { describe, expect, it } from 'vitest';
import { depletionState, remainingRatio } from './depletion.js';

describe('depletionState', () => {
  it('returns critical when total is zero', () => {
    expect(depletionState(10, 0, 0.2, 0.1)).toBe('critical');
  });
  it('returns critical at or below critical threshold', () => {
    expect(depletionState(9, 100, 0.2, 0.1)).toBe('critical');
    expect(depletionState(10, 100, 0.2, 0.1)).toBe('critical');
  });
  it('returns low between critical and low', () => {
    expect(depletionState(15, 100, 0.2, 0.1)).toBe('low');
  });
  it('returns comfortable above low', () => {
    expect(depletionState(50, 100, 0.2, 0.1)).toBe('comfortable');
  });
});

describe('remainingRatio', () => {
  it('clamps to 0..1', () => {
    expect(remainingRatio(-1, 100)).toBe(0);
    expect(remainingRatio(150, 100)).toBe(1);
    expect(remainingRatio(25, 100)).toBe(0.25);
  });
});
