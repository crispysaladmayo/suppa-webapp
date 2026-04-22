import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';
import { PantryCreate, PantryPatch } from '../../validation/entities.js';

export function pantryRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/', async (c) => {
    const { householdId } = c.get('auth');
    const rows = await db
      .select()
      .from(schema.pantryItem)
      .where(eq(schema.pantryItem.householdId, householdId));
    return c.json({ items: rows });
  });

  r.post('/', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = PantryCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const p = parsed.data;
    const id = randomUUID();
    await db.insert(schema.pantryItem).values({
      id,
      householdId,
      name: p.name,
      section: p.section,
      qtyGuess: p.qtyGuess ?? null,
      unitNote: p.unitNote ?? null,
      priceIdrPerUnit: p.priceIdrPerUnit ?? null,
    });
    const [row] = await db.select().from(schema.pantryItem).where(eq(schema.pantryItem.id, id)).limit(1);
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
    const parsed = PantryPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [existing] = await db
      .select()
      .from(schema.pantryItem)
      .where(and(eq(schema.pantryItem.id, id), eq(schema.pantryItem.householdId, householdId)))
      .limit(1);
    if (!existing) return jsonError('not_found', 'Item not found', 404);
    const p = parsed.data;
    await db
      .update(schema.pantryItem)
      .set({
        name: p.name ?? existing.name,
        section: p.section ?? existing.section,
        qtyGuess: p.qtyGuess === undefined ? existing.qtyGuess : p.qtyGuess,
        unitNote: p.unitNote === undefined ? existing.unitNote : p.unitNote,
        priceIdrPerUnit:
          p.priceIdrPerUnit === undefined ? existing.priceIdrPerUnit : p.priceIdrPerUnit,
      })
      .where(eq(schema.pantryItem.id, id));
    const [row] = await db.select().from(schema.pantryItem).where(eq(schema.pantryItem.id, id)).limit(1);
    return c.json({ item: row });
  });

  r.delete('/:id', async (c) => {
    const { householdId } = c.get('auth');
    const id = c.req.param('id');
    const res = await db
      .delete(schema.pantryItem)
      .where(and(eq(schema.pantryItem.id, id), eq(schema.pantryItem.householdId, householdId)))
      .returning({ id: schema.pantryItem.id });
    if (res.length === 0) return jsonError('not_found', 'Item not found', 404);
    return c.json({ ok: true });
  });

  return r;
}
