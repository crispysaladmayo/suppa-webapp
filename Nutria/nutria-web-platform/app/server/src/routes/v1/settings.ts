import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';
import { PatchSettingsBody, SettingsJson } from '../../validation/settings.js';

const KEY = 'settings_json';

export function settingsRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/', async (c) => {
    const { householdId } = c.get('auth');
    const [row] = await db
      .select()
      .from(schema.appSetting)
      .where(and(eq(schema.appSetting.householdId, householdId), eq(schema.appSetting.key, KEY)))
      .limit(1);
    if (!row) {
      const defaults = SettingsJson.parse({});
      return c.json({ settings: defaults });
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(row.value);
    } catch {
      return jsonError('server_error', 'Corrupt settings', 500);
    }
    const s = SettingsJson.safeParse(parsed);
    if (!s.success) {
      return c.json({ settings: SettingsJson.parse({}) });
    }
    return c.json({ settings: s.data });
  });

  r.patch('/', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PatchSettingsBody.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [row] = await db
      .select()
      .from(schema.appSetting)
      .where(and(eq(schema.appSetting.householdId, householdId), eq(schema.appSetting.key, KEY)))
      .limit(1);
    let base = SettingsJson.parse({});
    if (row) {
      try {
        const raw = JSON.parse(row.value);
        const cur = SettingsJson.safeParse(raw);
        if (cur.success) base = cur.data;
      } catch {
        base = SettingsJson.parse({});
      }
    }
    const next = SettingsJson.parse({ ...base, ...parsed.data.settings });
    const value = JSON.stringify(next);
    if (row) {
      await db
        .update(schema.appSetting)
        .set({ value })
        .where(and(eq(schema.appSetting.householdId, householdId), eq(schema.appSetting.key, KEY)));
    } else {
      await db.insert(schema.appSetting).values({ householdId, key: KEY, value });
    }
    return c.json({ settings: next });
  });

  return r;
}
