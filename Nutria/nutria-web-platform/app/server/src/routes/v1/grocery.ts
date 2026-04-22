import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';
import { GroceryCreate, GroceryPatch } from '../../validation/entities.js';

export function groceryRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/', async (c) => {
    const { householdId } = c.get('auth');
    const weekStart = c.req.query('weekStart');
    if (!weekStart) {
      return jsonError('validation_error', 'weekStart required', 400);
    }
    const rows = await db
      .select()
      .from(schema.groceryItem)
      .where(
        and(
          eq(schema.groceryItem.householdId, householdId),
          eq(schema.groceryItem.weekStart, weekStart),
        ),
      );
    const unchecked = rows.filter((x) => !x.checked);
    const totalIdr = unchecked.reduce((s, x) => s + (x.priceIdrPerUnit ?? 0), 0);
    return c.json({ items: rows, totalIdrUnchecked: totalIdr });
  });

  r.post('/', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = GroceryCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const g = parsed.data;
    const id = randomUUID();
    await db.insert(schema.groceryItem).values({
      id,
      householdId,
      weekStart: g.weekStart,
      name: g.name,
      section: g.section,
      qtyText: g.qtyText ?? null,
      priceIdrPerUnit: g.priceIdrPerUnit ?? null,
      checked: g.checked ?? false,
      source: g.source ?? 'manual',
    });
    const [row] = await db.select().from(schema.groceryItem).where(eq(schema.groceryItem.id, id)).limit(1);
    return c.json({ item: row }, 201);
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
    const parsed = GroceryPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [existing] = await db
      .select()
      .from(schema.groceryItem)
      .where(and(eq(schema.groceryItem.id, id), eq(schema.groceryItem.householdId, householdId)))
      .limit(1);
    if (!existing) return jsonError('not_found', 'Item not found', 404);
    const p = parsed.data;
    await db
      .update(schema.groceryItem)
      .set({
        weekStart: p.weekStart ?? existing.weekStart,
        name: p.name ?? existing.name,
        section: p.section ?? existing.section,
        qtyText: p.qtyText === undefined ? existing.qtyText : p.qtyText,
        priceIdrPerUnit:
          p.priceIdrPerUnit === undefined ? existing.priceIdrPerUnit : p.priceIdrPerUnit,
        checked: p.checked ?? existing.checked,
        source: p.source ?? existing.source,
      })
      .where(eq(schema.groceryItem.id, id));
    const [row] = await db.select().from(schema.groceryItem).where(eq(schema.groceryItem.id, id)).limit(1);
    return c.json({ item: row });
  });

  r.delete('/:id', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const res = await db
      .delete(schema.groceryItem)
      .where(and(eq(schema.groceryItem.id, id), eq(schema.groceryItem.householdId, householdId)))
      .returning({ id: schema.groceryItem.id });
    if (res.length === 0) return jsonError('not_found', 'Item not found', 404);
    return c.json({ ok: true });
  });

  return r;
}
