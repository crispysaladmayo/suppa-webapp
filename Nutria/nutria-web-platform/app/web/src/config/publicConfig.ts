import { setResolvedApiBase } from '../api/apiBase.js';

/**
 * Merges `public/api-config.json` with build-time VITE_API_BASE.
 * On GitHub Pages, edit `docs/api-config.json` only (no new JS build).
 */
export async function loadApiConfigForApp(): Promise<void> {
  const fromBuild = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

  if (typeof window === 'undefined') {
    setResolvedApiBase(fromBuild);
    return;
  }

  try {
    const url = new URL('api-config.json', window.location.origin + import.meta.env.BASE_URL).href;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      setResolvedApiBase(fromBuild);
      return;
    }
    const raw: unknown = await res.json();
    const r = typeof (raw as { apiBase?: unknown })?.apiBase === 'string' ? (raw as { apiBase: string }).apiBase : '';
    const fromFile = r.trim();
    setResolvedApiBase(fromFile.length > 0 ? fromFile : fromBuild);
  } catch {
    setResolvedApiBase(fromBuild);
  }
}
