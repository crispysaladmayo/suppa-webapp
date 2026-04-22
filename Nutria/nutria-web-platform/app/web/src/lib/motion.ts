import { useEffect, useState } from 'react';

export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Subscribe to `prefers-reduced-motion` for motion-safe UI. */
export function usePrefersReducedMotion(): boolean {
  const [v, setV] = useState(getPrefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setV(mq.matches);
    mq.addEventListener('change', on);
    setV(mq.matches);
    return () => mq.removeEventListener('change', on);
  }, []);
  return v;
}
