import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../db/client.js';
import * as schema from '../db/schema/index.js';
import type { Env } from '../env.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { jsonError } from '../lib/jsonError.js';
import { log } from '../logger.js';
import { hashSessionToken, newSessionToken } from '../lib/token.js';
import { rateLimitLogin } from '../lib/rateLimit.js';
import { LoginBody, RegisterBody } from '../validation/auth.js';
import { SESSION_COOKIE_NAME, parseCookies } from '../middleware/auth.js';
import type { HonoEnv } from '../types/hono.js';

const SESSION_DAYS = 30;

function sessionCookieValue(token: string, env: Env): string {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const same = env.SESSION_SAMESITE;
  const needsSecure = same === 'None' || env.NODE_ENV === 'production';
  const secure = needsSecure ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=${same}; Max-Age=${maxAge}${secure}`;
}

export function createAuthApp(db: Db, env: Env) {
  const app = new Hono<HonoEnv>();

  app.post('/register', async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = RegisterBody.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const { email, password, householdName } = parsed.data;
    const householdId = randomUUID();
    const userId = randomUUID();
    const hhName = householdName?.trim() || 'Rumah kami';
    try {
      await db.insert(schema.household).values({
        id: householdId,
        name: hhName,
      });
      await db.insert(schema.user).values({
        id: userId,
        householdId,
        email: email.toLowerCase(),
        passwordHash: await hashPassword(password),
      });
    } catch (e) {
      log.warn('register_conflict', { email });
      return jsonError('conflict', 'Email may already be registered', 409);
    }
    log.info('user_registered', { userId, householdId });
    return c.json({ ok: true, householdId, userId });
  });

  app.post('/login', async (c) => {
    const ip = c.req.header('x-forwarded-for') ?? c.req.header('cf-connecting-ip') ?? 'local';
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = LoginBody.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const email = parsed.data.email.toLowerCase();
    const rl = rateLimitLogin(`${ip}:${email}`);
    if (!rl.ok) {
      return jsonError('rate_limited', 'Too many attempts', 429, { retryAfterSec: rl.retryAfterSec });
    }
    const [u] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);
    if (!u || !(await verifyPassword(parsed.data.password, u.passwordHash))) {
      return jsonError('unauthorized', 'Invalid credentials', 401);
    }
    const token = newSessionToken();
    const tokenHash = hashSessionToken(token);
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    await db.insert(schema.session).values({
      id: sessionId,
      userId: u.id,
      tokenHash,
      expiresAt,
    });
    log.info('session_created', { userId: u.id });
    c.header('Set-Cookie', sessionCookieValue(token, env));
    return c.json({ ok: true, user: { id: u.id, email: u.email, householdId: u.householdId } });
  });

  app.post('/logout', async (c) => {
    const raw = parseCookies(c.req.header('cookie'))[SESSION_COOKIE_NAME];
    if (raw) {
      const tokenHash = hashSessionToken(raw);
      await db.delete(schema.session).where(eq(schema.session.tokenHash, tokenHash));
    }
    const same = env.SESSION_SAMESITE;
    const needsSecure = same === 'None' || env.NODE_ENV === 'production';
    const secure = needsSecure ? '; Secure' : '';
    c.header(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=${same}; Max-Age=0${secure}`,
    );
    return c.json({ ok: true });
  });

  app.get('/me', async (c) => {
    const raw = parseCookies(c.req.header('cookie'))[SESSION_COOKIE_NAME];
    if (!raw) {
      return c.json({ user: null });
    }
    const tokenHash = hashSessionToken(raw);
    const [row] = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.tokenHash, tokenHash))
      .limit(1);
    if (!row || row.expiresAt.getTime() < Date.now()) {
      return c.json({ user: null });
    }
    const [u] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, row.userId))
      .limit(1);
    if (!u) return c.json({ user: null });
    return c.json({
      user: { id: u.id, email: u.email, householdId: u.householdId },
    });
  });

  return app;
}
