import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z
    .string()
    .default('postgres://nutria:nutria@127.0.0.1:5433/nutria'),
  SESSION_SECRET: z.string().min(16).default('dev-session-secret-change-me'),
  /**
   * `Lax` = same-site requests (dev: Vite to localhost API).
   * `None` = cross-site (e.g. GitHub Pages to Railway) — must use with HTTPS + Secure; set for production web + separate API host.
   */
  SESSION_SAMESITE: z.enum(['Lax', 'None']).default('Lax'),
  /** Comma-separated list (dev Vite may fall back from :5173 to :5174 if busy). */
  CORS_ORIGIN: z
    .string()
    .default('http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174'),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid env: ${parsed.error.message}`);
  }
  return parsed.data;
}
