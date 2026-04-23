/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full API origin, e.g. `https://your-api.fly.dev` (no trailing slash). Omit for same-origin. */
  readonly VITE_API_BASE?: string;
  /** Set at build for GitHub Pages: skip /api session probe so login UI appears immediately. */
  readonly VITE_GITHUB_PAGES?: string;
}
