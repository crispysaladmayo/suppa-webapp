import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';

const Body = z.object({
  preferFish: z.boolean().optional(),
});

export function aiRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.post('/meal-ideas', async (c) => {
    const { householdId } = c.get('auth');
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      body = {};
    }
    const parsed = Body.safeParse(body);
    if (!parsed.success) {
      return jsonError('validation_error', 'Invalid body', 400, parsed.error.flatten());
    }
    const pantry = await db
      .select()
      .from(schema.pantryItem)
      .where(eq(schema.pantryItem.householdId, householdId));
    const names = pantry.map((p) => p.name.toLowerCase());
    const suggestions: string[] = [];
    if (names.some((n) => n.includes('oat'))) {
      suggestions.push('Bubur oat dengan pisang untuk sarapan anak.');
    }
    if (names.some((n) => n.includes('telur') || n.includes('egg'))) {
      suggestions.push('Telur rebus + sayur kukus untuk camilan bergizi.');
    }
    if (parsed.data.preferFish || names.some((n) => n.includes('ikan'))) {
      suggestions.push('Ikan kukus dengan brokoli (fresh hari ini).');
    }
    if (suggestions.length === 0) {
      suggestions.push('Tumis bayam + tahu untuk makan siang sederhana.');
      suggestions.push('Sup ayam dengan jagung manis.');
    }
    return c.json({
      suggestions,
      disclaimer: 'Saran tidak otomatis ditambahkan ke Rencana — konfirmasi manual di UI.',
    });
  });

  return r;
}
