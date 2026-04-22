import { Hono } from 'hono';
import { and, eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import {
  aggregateIngredients,
  estimateIngredientIdr,
  guessGrocerySection,
} from '../../lib/groceryFromPlan.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';
import { GroceryCreate, GroceryFromPlan, GroceryPatch } from '../../validation/entities.js';

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

  r.post('/from-plan', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = GroceryFromPlan.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const { weekStart, replaceGenerated } = parsed.data;
    const meals = await db
      .select()
      .from(schema.mealEntry)
      .where(
        and(
          eq(schema.mealEntry.householdId, householdId),
          eq(schema.mealEntry.weekStart, weekStart),
        ),
      );
    const recipeIds = [
      ...new Set(meals.map((m) => m.recipeId).filter((x): x is string => Boolean(x))),
    ];
    if (recipeIds.length === 0) {
      return jsonError(
        'validation_error',
        'Belum ada menu yang terhubung ke resep Nutria untuk minggu ini. Tambah menu dan pilih/simpan resep dulu.',
        400,
      );
    }
    const ingRows = await db
      .select()
      .from(schema.recipeIngredient)
      .where(inArray(schema.recipeIngredient.recipeId, recipeIds));
    const byRecipe = new Map<string, typeof ingRows>();
    for (const ing of ingRows) {
      if (!byRecipe.has(ing.recipeId)) byRecipe.set(ing.recipeId, []);
      byRecipe.get(ing.recipeId)!.push(ing);
    }
    const lines: Array<{ name: string; grams: number }> = [];
    for (const m of meals) {
      if (!m.recipeId) continue;
      const list = byRecipe.get(m.recipeId) ?? [];
      for (const ing of list) {
        lines.push({ name: ing.name, grams: ing.grams });
      }
    }
    const agg = aggregateIngredients(lines);
    if (agg.length === 0) {
      return jsonError('validation_error', 'Resep tidak punya bahan tercatat', 400);
    }
    if (replaceGenerated) {
      await db
        .delete(schema.groceryItem)
        .where(
          and(
            eq(schema.groceryItem.householdId, householdId),
            eq(schema.groceryItem.weekStart, weekStart),
            eq(schema.groceryItem.source, 'from_plan'),
          ),
        );
    }
    let n = 0;
    for (const row of agg) {
      const section = guessGrocerySection(row.displayName);
      const qtyText =
        row.totalGrams >= 1000
          ? `~${(row.totalGrams / 1000).toFixed(2)} kg total`
          : `~${Math.round(row.totalGrams)} g total`;
      const priceIdrPerUnit = estimateIngredientIdr(row.displayName, row.totalGrams);
      const id = randomUUID();
      await db.insert(schema.groceryItem).values({
        id,
        householdId,
        weekStart,
        name: row.displayName,
        section,
        qtyText,
        priceIdrPerUnit,
        checked: false,
        source: 'from_plan',
      });
      n += 1;
    }
    return c.json({ ok: true, itemsAdded: n });
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
