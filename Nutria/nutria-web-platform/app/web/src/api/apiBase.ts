/**
 * Resolves the API origin: runtime `api-config.json` (edit on GitHub) wins,
 * else `VITE_API_BASE` at build time, else same-origin.
 */
let resolved: string | null = null;

export function getApiOrigin(): string {
  if (resolved !== null) return resolved;
  return (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';
}

export function setResolvedApiBase(absoluteOrEmpty: string): void {
  resolved = String(absoluteOrEmpty ?? '')
    .trim()
    .replace(/\/$/, '');
}
