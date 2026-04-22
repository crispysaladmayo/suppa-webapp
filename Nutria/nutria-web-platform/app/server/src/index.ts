import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sql } from 'drizzle-orm';
import { createDb } from './db/client.js';
import { loadEnv } from './env.js';
import { log } from './logger.js';
import { createAuthApp } from './routes/auth.js';
import { createV1App } from './routes/v1/index.js';

const env = loadEnv();
const db = createDb(env);

const app = new Hono();

app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    allowHeaders: ['Content-Type', 'Cookie'],
    exposeHeaders: ['Set-Cookie'],
  }),
);

app.get('/health', (c) => c.json({ ok: true }));

app.get('/health/db', async (c) => {
  try {
    await db.execute(sql`select 1`);
    return c.json({ ok: true, database: true });
  } catch (e) {
    const detail = env.NODE_ENV === 'development' ? String(e) : undefined;
    log.error('health_db_failed', { err: String(e) });
    return c.json(
      {
        ok: false,
        database: false,
        error: detail ?? 'database_unavailable',
        hint: 'Start Postgres (docker compose up -d), set DATABASE_URL, then npm run db:migrate && npm run db:seed in app/server.',
      },
      503,
    );
  }
});

app.route('/api/auth', createAuthApp(db, env));
app.route('/api/v1', createV1App(db));

app.onError((err, c) => {
  const stack = err instanceof Error ? err.stack : undefined;
  log.error('unhandled_error', { err: String(err), stack });
  const safeMessage = 'Internal error';
  const message =
    env.NODE_ENV === 'development' && err instanceof Error && err.message
      ? err.message
      : safeMessage;
  return c.json({ error: { code: 'internal_error', message } }, 500);
});

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  log.info('server_listen', { port: info.port, env: env.NODE_ENV });
});
