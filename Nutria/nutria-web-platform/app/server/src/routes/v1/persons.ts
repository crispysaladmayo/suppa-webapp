import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';
import { PersonPatch } from '../../validation/entities.js';

export function personsRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/', async (c) => {
    const { householdId } = c.get('auth');
    const rows = await db
      .select()
      .from(schema.person)
      .where(eq(schema.person.householdId, householdId))
      .orderBy(schema.person.sortOrder);
    return c.json({ persons: rows });
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
    const parsed = PersonPatch.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const [existing] = await db
      .select()
      .from(schema.person)
      .where(and(eq(schema.person.id, id), eq(schema.person.householdId, householdId)))
      .limit(1);
    if (!existing) {
      return jsonError('not_found', 'Person not found', 404);
    }
    const patch = parsed.data;
    await db
      .update(schema.person)
      .set({
        displayName: patch.displayName ?? existing.displayName,
        role: patch.role ?? existing.role,
        sortOrder: patch.sortOrder ?? existing.sortOrder,
      })
      .where(eq(schema.person.id, id));
    const [row] = await db.select().from(schema.person).where(eq(schema.person.id, id)).limit(1);
    return c.json({ person: row });
  });

  return r;
}
