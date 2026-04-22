import { describe, expect, it } from 'vitest';
import { createApiError, isApiError } from '../api/ApiError.js';
import { hapticNudge } from '../lib/haptics.js';
import { getPrefersReducedMotion } from '../lib/motion.js';

describe('ApiError', () => {
  it('maps 409 to conflict', () => {
    const e = createApiError('dup', 409);
    expect(isApiError(e)).toBe(true);
    expect(e.code).toBe('conflict');
    expect(e.status).toBe(409);
  });
  it('maps 404 to not_found', () => {
    const e = createApiError('nope', 404);
    expect(e.code).toBe('not_found');
  });
});

describe('haptics', () => {
  it('does not throw in environments without vibrate', () => {
    expect(() => hapticNudge('light')).not.toThrow();
  });
});

describe('motion', () => {
  it('exposes getPrefersReducedMotion', () => {
    expect(typeof getPrefersReducedMotion()).toBe('boolean');
  });
});
