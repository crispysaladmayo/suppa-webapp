import { Hono } from 'hono';
import { and, asc, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';
import {
  PrepSessionCreate,
  PrepSessionIngredientCreate,
  PrepSessionIngredientPatch,
  PrepSessionPatch,
  PrepSessionStepCreate,
  PrepSessionStepPatch,
} from '../../validation/entities.js';

export function prepSessionsRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/', async (c) => {
    const { householdId } = c.get('auth');
    const rows = await db
      .select()
      .from(schema.prepSession)
      .where(eq(schema.prepSession.householdId, householdId));
    return c.json({ sessions: rows });
  });

  r.post('/', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepSessionCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    if (parsed.data.prepRunId) {
      const [run] = await db
        .select()
        .from(schema.prepRun)
        .where(
          and(eq(schema.prepRun.id, parsed.data.prepRunId), eq(schema.prepRun.householdId, householdId)),
        )
        .limit(1);
      if (!run) return jsonError('not_found', 'Prep run not found', 404);
    }
    const id = randomUUID();
    const startedAt = new Date().toISOString();
    await db.insert(schema.prepSession).values({
      id,
      householdId,
      prepRunId: parsed.data.prepRunId ?? null,
      startedAt,
      endedAt: null,
      notes: parsed.data.notes ?? null,
    });
    const [row] = await db.select().from(schema.prepSession).where(eq(schema.prepSession.id, id)).limit(1);
    return c.json({ session: row }, 201);
  });

  r.patch('/:id', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepSessionPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [existing] = await db
      .select()
      .from(schema.prepSession)
      .where(and(eq(schema.prepSession.id, id), eq(schema.prepSession.householdId, householdId)))
      .limit(1);
    if (!existing) return jsonError('not_found', 'Session not found', 404);
    const p = parsed.data;
    if (p.prepRunId) {
      const [run] = await db
        .select()
        .from(schema.prepRun)
        .where(and(eq(schema.prepRun.id, p.prepRunId), eq(schema.prepRun.householdId, householdId)))
        .limit(1);
      if (!run) return jsonError('not_found', 'Prep run not found', 404);
    }
    await db
      .update(schema.prepSession)
      .set({
        endedAt: p.endedAt === undefined ? existing.endedAt : p.endedAt,
        notes: p.notes === undefined ? existing.notes : p.notes,
        prepRunId: p.prepRunId === undefined ? existing.prepRunId : p.prepRunId,
      })
      .where(eq(schema.prepSession.id, id));
    const [row] = await db.select().from(schema.prepSession).where(eq(schema.prepSession.id, id)).limit(1);
    return c.json({ session: row });
  });

  r.get('/:id/ingredients', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const [s] = await db
      .select()
      .from(schema.prepSession)
      .where(and(eq(schema.prepSession.id, id), eq(schema.prepSession.householdId, householdId)))
      .limit(1);
    if (!s) return jsonError('not_found', 'Session not found', 404);
    const rows = await db
      .select()
      .from(schema.prepSessionIngredient)
      .where(eq(schema.prepSessionIngredient.prepSessionId, id))
      .orderBy(asc(schema.prepSessionIngredient.sortOrder));
    return c.json({ ingredients: rows });
  });

  r.post('/:id/ingredients', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const [s] = await db
      .select()
      .from(schema.prepSession)
      .where(and(eq(schema.prepSession.id, id), eq(schema.prepSession.householdId, householdId)))
      .limit(1);
    if (!s) return jsonError('not_found', 'Session not found', 404);
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepSessionIngredientCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const ingId = randomUUID();
    await db.insert(schema.prepSessionIngredient).values({
      id: ingId,
      prepSessionId: id,
      name: parsed.data.name,
      rawKg: parsed.data.rawKg,
      shrinkPct: parsed.data.shrinkPct,
      sortOrder: parsed.data.sortOrder,
    });
    const [row] = await db
      .select()
      .from(schema.prepSessionIngredient)
      .where(eq(schema.prepSessionIngredient.id, ingId))
      .limit(1);
    return c.json({ ingredient: row }, 201);
  });

  r.patch('/ingredients/:ingId', async (c) => {
    const { householdId } = c.get('auth');
    const ingId = c.req.param('ingId');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepSessionIngredientPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [ctx] = await db
      .select({ ing: schema.prepSessionIngredient, sess: schema.prepSession })
      .from(schema.prepSessionIngredient)
      .innerJoin(schema.prepSession, eq(schema.prepSessionIngredient.prepSessionId, schema.prepSession.id))
      .where(
        and(eq(schema.prepSessionIngredient.id, ingId), eq(schema.prepSession.householdId, householdId)),
      )
      .limit(1);
    if (!ctx) return jsonError('not_found', 'Ingredient not found', 404);
    const p = parsed.data;
    await db
      .update(schema.prepSessionIngredient)
      .set({
        name: p.name ?? ctx.ing.name,
        rawKg: p.rawKg ?? ctx.ing.rawKg,
        shrinkPct: p.shrinkPct ?? ctx.ing.shrinkPct,
        sortOrder: p.sortOrder ?? ctx.ing.sortOrder,
      })
      .where(eq(schema.prepSessionIngredient.id, ingId));
    const [row] = await db
      .select()
      .from(schema.prepSessionIngredient)
      .where(eq(schema.prepSessionIngredient.id, ingId))
      .limit(1);
    return c.json({ ingredient: row });
  });

  r.delete('/ingredients/:ingId', async (c) => {
    const { householdId } = c.get('auth');
    const ingId = c.req.param('ingId');
    const [ctx] = await db
      .select({ ing: schema.prepSessionIngredient, sess: schema.prepSession })
      .from(schema.prepSessionIngredient)
      .innerJoin(schema.prepSession, eq(schema.prepSessionIngredient.prepSessionId, schema.prepSession.id))
      .where(
        and(eq(schema.prepSessionIngredient.id, ingId), eq(schema.prepSession.householdId, householdId)),
      )
      .limit(1);
    if (!ctx) return jsonError('not_found', 'Ingredient not found', 404);
    await db.delete(schema.prepSessionIngredient).where(eq(schema.prepSessionIngredient.id, ingId));
    return c.json({ ok: true });
  });

  r.get('/:id/steps', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const [s] = await db
      .select()
      .from(schema.prepSession)
      .where(and(eq(schema.prepSession.id, id), eq(schema.prepSession.householdId, householdId)))
      .limit(1);
    if (!s) return jsonError('not_found', 'Session not found', 404);
    const rows = await db
      .select()
      .from(schema.prepSessionStep)
      .where(eq(schema.prepSessionStep.prepSessionId, id))
      .orderBy(asc(schema.prepSessionStep.sortOrder));
    return c.json({ steps: rows });
  });

  r.post('/:id/steps', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const [s] = await db
      .select()
      .from(schema.prepSession)
      .where(and(eq(schema.prepSession.id, id), eq(schema.prepSession.householdId, householdId)))
      .limit(1);
    if (!s) return jsonError('not_found', 'Session not found', 404);
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepSessionStepCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const stepId = randomUUID();
    await db.insert(schema.prepSessionStep).values({
      id: stepId,
      prepSessionId: id,
      title: parsed.data.title,
      sortOrder: parsed.data.sortOrder,
    });
    const [row] = await db
      .select()
      .from(schema.prepSessionStep)
      .where(eq(schema.prepSessionStep.id, stepId))
      .limit(1);
    return c.json({ step: row }, 201);
  });

  r.patch('/steps/:stepId', async (c) => {
    const { householdId } = c.get('auth');
    const stepId = c.req.param('stepId');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PrepSessionStepPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [ctx] = await db
      .select({ step: schema.prepSessionStep, sess: schema.prepSession })
      .from(schema.prepSessionStep)
      .innerJoin(schema.prepSession, eq(schema.prepSessionStep.prepSessionId, schema.prepSession.id))
      .where(
        and(eq(schema.prepSessionStep.id, stepId), eq(schema.prepSession.householdId, householdId)),
      )
      .limit(1);
    if (!ctx) return jsonError('not_found', 'Step not found', 404);
    const p = parsed.data;
    await db
      .update(schema.prepSessionStep)
      .set({
        title: p.title ?? ctx.step.title,
        sortOrder: p.sortOrder ?? ctx.step.sortOrder,
      })
      .where(eq(schema.prepSessionStep.id, stepId));
    const [row] = await db
      .select()
      .from(schema.prepSessionStep)
      .where(eq(schema.prepSessionStep.id, stepId))
      .limit(1);
    return c.json({ step: row });
  });

  r.delete('/steps/:stepId', async (c) => {
    const { householdId } = c.get('auth');
    const stepId = c.req.param('stepId');
    const [ctx] = await db
      .select({ step: schema.prepSessionStep, sess: schema.prepSession })
      .from(schema.prepSessionStep)
      .innerJoin(schema.prepSession, eq(schema.prepSessionStep.prepSessionId, schema.prepSession.id))
      .where(
        and(eq(schema.prepSessionStep.id, stepId), eq(schema.prepSession.householdId, householdId)),
      )
      .limit(1);
    if (!ctx) return jsonError('not_found', 'Step not found', 404);
    await db.delete(schema.prepSessionStep).where(eq(schema.prepSessionStep.id, stepId));
    return c.json({ ok: true });
  });

  return r;
}
