import { Hono } from 'hono';
import { asc, eq, ilike, or } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import { normalizeRecipeNameKey } from '../../lib/recipeKey.js';
import type { HonoEnv } from '../../types/hono.js';
import { RecipeCreate } from '../../validation/entities.js';

export function recipesRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/', async (c) => {
    const q = (c.req.query('q') ?? '').trim();
    const limit = Math.min(40, Math.max(1, Number(c.req.query('limit')) || 20));
    const pattern = `%${q.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;
    const base = db.select().from(schema.recipe);
    const rows =
      q.length >= 1
        ? await base
            .where(or(ilike(schema.recipe.title, pattern), ilike(schema.recipe.nameKey, pattern)))
            .limit(limit)
        : await base.limit(limit);
    return c.json({ recipes: rows });
  });

  r.get('/:id', async (c) => {
    const id = c.req.param('id');
    const [recipe] = await db.select().from(schema.recipe).where(eq(schema.recipe.id, id)).limit(1);
    if (!recipe) return jsonError('not_found', 'Recipe not found', 404);
    const ingredients = await db
      .select()
      .from(schema.recipeIngredient)
      .where(eq(schema.recipeIngredient.recipeId, id))
      .orderBy(asc(schema.recipeIngredient.sortOrder));
    let micros: Record<string, number> | null = null;
    if (recipe.microJson) {
      try {
        const raw = JSON.parse(recipe.microJson) as unknown;
        if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
          micros = raw as Record<string, number>;
        }
      } catch {
        micros = null;
      }
    }
    return c.json({ recipe, ingredients, micros });
  });

  r.post('/', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return jsonError('bad_request', 'Invalid JSON', 400);
    }
    const parsed = RecipeCreate.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const data = parsed.data;
    const nameKey = normalizeRecipeNameKey(data.title);
    if (!nameKey) {
      return jsonError('validation_error', 'Invalid title', 400);
    }
    const [dup] = await db
      .select({ id: schema.recipe.id })
      .from(schema.recipe)
      .where(eq(schema.recipe.nameKey, nameKey))
      .limit(1);
    if (dup) {
      return jsonError('conflict', 'Resep dengan nama ini sudah ada di Nutria — pilih dari pencarian.', 409);
    }
    const id = randomUUID();
    const now = new Date().toISOString();
    const microJson =
      data.micros && Object.keys(data.micros).length > 0 ? JSON.stringify(data.micros) : null;
    await db.insert(schema.recipe).values({
      id,
      nameKey,
      title: data.title.trim(),
      createdByHouseholdId: householdId,
      createdAt: now,
      kcal: data.kcal ?? null,
      proteinG: data.proteinG ?? null,
      carbsG: data.carbsG ?? null,
      fatG: data.fatG ?? null,
      fiberG: data.fiberG ?? null,
      ironMg: data.ironMg ?? null,
      calciumMg: data.calciumMg ?? null,
      microJson,
    });
    for (let i = 0; i < data.ingredients.length; i++) {
      const ing = data.ingredients[i]!;
      await db.insert(schema.recipeIngredient).values({
        id: randomUUID(),
        recipeId: id,
        name: ing.name.trim(),
        grams: ing.grams,
        sortOrder: ing.sortOrder ?? i,
      });
    }
    const [row] = await db.select().from(schema.recipe).where(eq(schema.recipe.id, id)).limit(1);
    const ingredients = await db
      .select()
      .from(schema.recipeIngredient)
      .where(eq(schema.recipeIngredient.recipeId, id))
      .orderBy(asc(schema.recipeIngredient.sortOrder));
    return c.json({ recipe: row, ingredients }, 201);
  });

  return r;
}
