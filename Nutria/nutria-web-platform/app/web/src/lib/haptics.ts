/**
 * Best-effort haptic feedback. Android Chrome often supports Vibration API;
 * iOS WebKit support is very limited. Never throw — failures are silent.
 */
export function hapticNudge(kind: 'light' | 'success' | 'warning' = 'light'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    if (kind === 'light') navigator.vibrate(12);
    else if (kind === 'success') navigator.vibrate([10, 40, 15]);
    else navigator.vibrate([20, 30, 20]);
  } catch {
    /* ignore */
  }
}
