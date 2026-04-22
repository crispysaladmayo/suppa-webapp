import { createMiddleware } from 'hono/factory';
import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import * as schema from '../db/schema/index.js';
import { hashSessionToken } from '../lib/token.js';
import type { HonoEnv } from '../types/hono.js';
import { jsonError } from '../lib/jsonError.js';

const COOKIE = 'nutria_session';

export function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join('='));
  }
  return out;
}

export function requireAuth(db: Db) {
  return createMiddleware<HonoEnv>(async (c, next) => {
    const raw = parseCookies(c.req.header('cookie'))[COOKIE];
    if (!raw) {
      return jsonError('unauthorized', 'Login required', 401);
    }
    const tokenHash = hashSessionToken(raw);
    const [row] = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.tokenHash, tokenHash))
      .limit(1);
    if (!row || row.expiresAt.getTime() < Date.now()) {
      return jsonError('unauthorized', 'Session expired', 401);
    }
    const [u] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, row.userId))
      .limit(1);
    if (!u) {
      return jsonError('unauthorized', 'User missing', 401);
    }
    c.set('auth', { id: u.id, householdId: u.householdId, email: u.email });
    await next();
  });
}

export const SESSION_COOKIE_NAME = COOKIE;
