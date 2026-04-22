import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';
import { MealCreate, MealPatch } from '../../validation/entities.js';

export function mealsRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/', async (c) => {
    const { householdId } = c.get('auth');
    const weekStart = c.req.query('weekStart');
    if (!weekStart) {
      return jsonError('validation_error', 'weekStart required', 400);
    }
    const rows = await db
      .select()
      .from(schema.mealEntry)
      .where(
        and(eq(schema.mealEntry.householdId, householdId), eq(schema.mealEntry.weekStart, weekStart)),
      );
    return c.json({ meals: rows });
  });

  r.post('/', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = MealCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const m = parsed.data;
    const [person] = await db
      .select()
      .from(schema.person)
      .where(and(eq(schema.person.id, m.personId), eq(schema.person.householdId, householdId)))
      .limit(1);
    if (!person) return jsonError('not_found', 'Person not found', 404);
    if (m.prepItemId) {
      const [link] = await db
        .select({ item: schema.prepItem, run: schema.prepRun })
        .from(schema.prepItem)
        .innerJoin(schema.prepRun, eq(schema.prepItem.prepRunId, schema.prepRun.id))
        .where(and(eq(schema.prepItem.id, m.prepItemId), eq(schema.prepRun.householdId, householdId)))
        .limit(1);
      if (!link) return jsonError('not_found', 'Prep item not found', 404);
    }
    const id = randomUUID();
    await db.insert(schema.mealEntry).values({
      id,
      householdId,
      weekStart: m.weekStart,
      dayIndex: m.dayIndex,
      slot: m.slot,
      personId: m.personId,
      title: m.title,
      isFresh: m.isFresh ?? true,
      prepItemId: m.prepItemId ?? null,
      notes: m.notes ?? null,
      kcal: m.kcal ?? null,
      proteinG: m.proteinG ?? null,
      carbsG: m.carbsG ?? null,
      fatG: m.fatG ?? null,
      fiberG: m.fiberG ?? null,
      ironMg: m.ironMg ?? null,
      calciumMg: m.calciumMg ?? null,
    });
    const [row] = await db.select().from(schema.mealEntry).where(eq(schema.mealEntry.id, id)).limit(1);
    return c.json({ meal: row }, 201);
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
    const parsed = MealPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [existing] = await db
      .select()
      .from(schema.mealEntry)
      .where(and(eq(schema.mealEntry.id, id), eq(schema.mealEntry.householdId, householdId)))
      .limit(1);
    if (!existing) return jsonError('not_found', 'Meal not found', 404);
    const p = parsed.data;
    await db
      .update(schema.mealEntry)
      .set({
        weekStart: p.weekStart ?? existing.weekStart,
        dayIndex: p.dayIndex ?? existing.dayIndex,
        slot: p.slot ?? existing.slot,
        personId: p.personId ?? existing.personId,
        title: p.title ?? existing.title,
        isFresh: p.isFresh ?? existing.isFresh,
        prepItemId: p.prepItemId === undefined ? existing.prepItemId : p.prepItemId,
        notes: p.notes === undefined ? existing.notes : p.notes,
        kcal: p.kcal === undefined ? existing.kcal : p.kcal,
        proteinG: p.proteinG === undefined ? existing.proteinG : p.proteinG,
        carbsG: p.carbsG === undefined ? existing.carbsG : p.carbsG,
        fatG: p.fatG === undefined ? existing.fatG : p.fatG,
        fiberG: p.fiberG === undefined ? existing.fiberG : p.fiberG,
        ironMg: p.ironMg === undefined ? existing.ironMg : p.ironMg,
        calciumMg: p.calciumMg === undefined ? existing.calciumMg : p.calciumMg,
      })
      .where(eq(schema.mealEntry.id, id));
    const [row] = await db.select().from(schema.mealEntry).where(eq(schema.mealEntry.id, id)).limit(1);
    return c.json({ meal: row });
  });

  r.delete('/:id', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const res = await db
      .delete(schema.mealEntry)
      .where(and(eq(schema.mealEntry.id, id), eq(schema.mealEntry.householdId, householdId)))
      .returning({ id: schema.mealEntry.id });
    if (res.length === 0) return jsonError('not_found', 'Meal not found', 404);
    return c.json({ ok: true });
  });

  return r;
}
