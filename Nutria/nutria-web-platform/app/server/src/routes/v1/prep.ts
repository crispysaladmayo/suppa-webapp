import { Hono } from 'hono';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import { depletionState } from '../../lib/depletion.js';
import { log } from '../../logger.js';
import { SettingsJson } from '../../validation/settings.js';
import type { HonoEnv } from '../../types/hono.js';
import {
  ConsumptionCreate,
  PrepItemCreate,
  PrepItemPatch,
  PrepRunCreate,
  PrepRunPatch,
} from '../../validation/entities.js';

export function prepRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/runs', async (c) => {
    const { householdId } = c.get('auth');
    const rows = await db
      .select()
      .from(schema.prepRun)
      .where(eq(schema.prepRun.householdId, householdId))
      .orderBy(desc(schema.prepRun.startedAt));
    return c.json({ prepRuns: rows });
  });

  r.post('/runs', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepRunCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const id = randomUUID();
    await db.insert(schema.prepRun).values({
      id,
      householdId,
      name: parsed.data.name,
      startedAt: parsed.data.startedAt,
      status: parsed.data.status,
    });
    const [row] = await db.select().from(schema.prepRun).where(eq(schema.prepRun.id, id)).limit(1);
    return c.json({ prepRun: row }, 201);
  });

  r.patch('/runs/:id', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepRunPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [existing] = await db
      .select()
      .from(schema.prepRun)
      .where(and(eq(schema.prepRun.id, id), eq(schema.prepRun.householdId, householdId)))
      .limit(1);
    if (!existing) return jsonError('not_found', 'Prep run not found', 404);
    const p = parsed.data;
    await db
      .update(schema.prepRun)
      .set({
        name: p.name ?? existing.name,
        startedAt: p.startedAt ?? existing.startedAt,
        status: p.status ?? existing.status,
      })
      .where(eq(schema.prepRun.id, id));
    const [row] = await db.select().from(schema.prepRun).where(eq(schema.prepRun.id, id)).limit(1);
    return c.json({ prepRun: row });
  });

  r.get('/runs/:id/items', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const [run] = await db
      .select()
      .from(schema.prepRun)
      .where(and(eq(schema.prepRun.id, id), eq(schema.prepRun.householdId, householdId)))
      .limit(1);
    if (!run) return jsonError('not_found', 'Prep run not found', 404);
    const items = await db
      .select()
      .from(schema.prepItem)
      .where(eq(schema.prepItem.prepRunId, id));
    return c.json({ prepItems: items });
  });

  r.post('/items', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepItemCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [run] = await db
      .select()
      .from(schema.prepRun)
      .where(
        and(
          eq(schema.prepRun.id, parsed.data.prepRunId),
          eq(schema.prepRun.householdId, householdId),
        ),
      )
      .limit(1);
    if (!run) return jsonError('not_found', 'Prep run not found', 404);
    if (parsed.data.remainingGrams > parsed.data.totalCookedGrams) {
      return jsonError('validation_error', 'remainingGrams exceeds total', 400);
    }
    const id = randomUUID();
    await db.insert(schema.prepItem).values({
      id,
      prepRunId: parsed.data.prepRunId,
      name: parsed.data.name,
      totalCookedGrams: parsed.data.totalCookedGrams,
      remainingGrams: parsed.data.remainingGrams,
      cookYieldPct: parsed.data.cookYieldPct ?? 27.5,
    });
    const [row] = await db.select().from(schema.prepItem).where(eq(schema.prepItem.id, id)).limit(1);
    return c.json({ prepItem: row }, 201);
  });

  r.patch('/items/:id', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepItemPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [existing] = await db
      .select({ item: schema.prepItem, run: schema.prepRun })
      .from(schema.prepItem)
      .innerJoin(schema.prepRun, eq(schema.prepItem.prepRunId, schema.prepRun.id))
      .where(and(eq(schema.prepItem.id, id), eq(schema.prepRun.householdId, householdId)))
      .limit(1);
    if (!existing) return jsonError('not_found', 'Prep item not found', 404);
    const p = parsed.data;
    const total = p.totalCookedGrams ?? existing.item.totalCookedGrams;
    const remaining = p.remainingGrams ?? existing.item.remainingGrams;
    if (remaining > total) {
      return jsonError('validation_error', 'remainingGrams exceeds total', 400);
    }
    await db
      .update(schema.prepItem)
      .set({
        name: p.name ?? existing.item.name,
        totalCookedGrams: total,
        remainingGrams: remaining,
        cookYieldPct: p.cookYieldPct ?? existing.item.cookYieldPct,
      })
      .where(eq(schema.prepItem.id, id));
    const [row] = await db.select().from(schema.prepItem).where(eq(schema.prepItem.id, id)).limit(1);
    return c.json({ prepItem: row });
  });

  r.get('/consumption', async (c) => {
    const { householdId } = c.get('auth');
    const limit = Math.min(100, Math.max(1, Number(c.req.query('limit') ?? '30')));
    const itemRows = await db
      .select({ id: schema.prepItem.id })
      .from(schema.prepItem)
      .innerJoin(schema.prepRun, eq(schema.prepItem.prepRunId, schema.prepRun.id))
      .where(eq(schema.prepRun.householdId, householdId));
    const itemIds = itemRows.map((i) => i.id);
    if (itemIds.length === 0) return c.json({ logs: [] });
    const logs = await db
      .select()
      .from(schema.consumptionLog)
      .where(inArray(schema.consumptionLog.prepItemId, itemIds))
      .orderBy(desc(schema.consumptionLog.loggedAt))
      .limit(limit);
    return c.json({ logs });
  });

  r.post('/consumption', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = ConsumptionCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const { prepItemId, personId, grams, loggedAt } = parsed.data;
    const [ctx] = await db
      .select({ item: schema.prepItem, run: schema.prepRun, person: schema.person })
      .from(schema.prepItem)
      .innerJoin(schema.prepRun, eq(schema.prepItem.prepRunId, schema.prepRun.id))
      .innerJoin(schema.person, eq(schema.person.id, personId))
      .where(
        and(
          eq(schema.prepItem.id, prepItemId),
          eq(schema.prepRun.householdId, householdId),
          eq(schema.person.householdId, householdId),
        ),
      )
      .limit(1);
    if (!ctx) return jsonError('not_found', 'Prep item or person not found', 404);
    if (grams > ctx.item.remainingGrams) {
      return jsonError('validation_error', 'Not enough remaining grams', 400);
    }
    const logId = randomUUID();
    let newRemaining = ctx.item.remainingGrams - grams;
    await db.transaction(async (tx) => {
      await tx.insert(schema.consumptionLog).values({
        id: logId,
        prepItemId,
        personId,
        grams,
        loggedAt,
      });
      await tx
        .update(schema.prepItem)
        .set({ remainingGrams: newRemaining })
        .where(eq(schema.prepItem.id, prepItemId));
    });
    const [settingsRow] = await db
      .select()
      .from(schema.appSetting)
      .where(
        and(
          eq(schema.appSetting.householdId, householdId),
          eq(schema.appSetting.key, 'settings_json'),
        ),
      )
      .limit(1);
    let settings = SettingsJson.parse({});
    if (settingsRow) {
      try {
        const s = SettingsJson.safeParse(JSON.parse(settingsRow.value));
        if (s.success) settings = s.data;
      } catch {
        settings = SettingsJson.parse({});
      }
    }
    const before = depletionState(
      ctx.item.remainingGrams,
      ctx.item.totalCookedGrams,
      settings.lowThresholdPct,
      settings.criticalThresholdPct,
    );
    const after = depletionState(
      newRemaining,
      ctx.item.totalCookedGrams,
      settings.lowThresholdPct,
      settings.criticalThresholdPct,
    );
    if (before !== after) {
      log.info('prep_depletion_transition', {
        prepItemId,
        before,
        after,
        householdId,
      });
    }
    const [row] = await db
      .select()
      .from(schema.consumptionLog)
      .where(eq(schema.consumptionLog.id, logId))
      .limit(1);
    const [item] = await db
      .select()
      .from(schema.prepItem)
      .where(eq(schema.prepItem.id, prepItemId))
      .limit(1);
    return c.json({ log: row, prepItem: item }, 201);
  });

  r.delete('/consumption/:id', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const [log] = await db.select().from(schema.consumptionLog).where(eq(schema.consumptionLog.id, id)).limit(1);
    if (!log) return jsonError('not_found', 'Log not found', 404);
    const [ctx] = await db
      .select({ item: schema.prepItem, run: schema.prepRun })
      .from(schema.prepItem)
      .innerJoin(schema.prepRun, eq(schema.prepItem.prepRunId, schema.prepRun.id))
      .where(and(eq(schema.prepItem.id, log.prepItemId), eq(schema.prepRun.householdId, householdId)))
      .limit(1);
    if (!ctx) return jsonError('forbidden', 'Not your household', 403);
    await db.transaction(async (tx) => {
      await tx.delete(schema.consumptionLog).where(eq(schema.consumptionLog.id, id));
      await tx
        .update(schema.prepItem)
        .set({ remainingGrams: ctx.item.remainingGrams + log.grams })
        .where(eq(schema.prepItem.id, log.prepItemId));
    });
    return c.json({ ok: true });
  });

  return r;
}
