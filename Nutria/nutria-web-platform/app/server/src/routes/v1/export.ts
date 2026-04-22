import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { jsonError } from '../../lib/jsonError.js';
import type { HonoEnv } from '../../types/hono.js';

const SLOT_LABEL: Record<string, string> = {
  breakfast: 'Sarapan',
  lunch: 'Makan siang',
  dinner: 'Makan malam',
  snack: 'Camilan',
};

export function exportRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/week.md', async (c) => {
    const { householdId } = c.get('auth');
    const weekStart = c.req.query('weekStart');
    if (!weekStart) {
      return jsonError('validation_error', 'weekStart required', 400);
    }
    const meals = await db
      .select()
      .from(schema.mealEntry)
      .where(
        and(eq(schema.mealEntry.householdId, householdId), eq(schema.mealEntry.weekStart, weekStart)),
      );
    const grocery = await db
      .select()
      .from(schema.groceryItem)
      .where(
        and(
          eq(schema.groceryItem.householdId, householdId),
          eq(schema.groceryItem.weekStart, weekStart),
        ),
      );

    const lines: string[] = [];
    lines.push(`# Nutria — Minggu ${weekStart}`);
    lines.push('');
    lines.push('## Rencana');
    const byDay = [...meals].sort((a, b) => a.dayIndex - b.dayIndex || a.slot.localeCompare(b.slot));
    for (const m of byDay) {
      const slot = SLOT_LABEL[m.slot] ?? m.slot;
      lines.push(`- Hari ${m.dayIndex + 1} · ${slot} · ${m.title}`);
    }
    lines.push('');
    lines.push('## Belanja');
    for (const g of grocery) {
      const mark = g.checked ? '[x]' : '[ ]';
      const price = g.priceIdrPerUnit != null ? ` — Rp ${g.priceIdrPerUnit}` : '';
      lines.push(`${mark} ${g.name} (${g.section})${price}`);
    }
    const body = lines.join('\n');
    return new Response(body, {
      status: 200,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'content-disposition': `attachment; filename="nutria-${weekStart}.md"`,
      },
    });
  });

  return r;
}
