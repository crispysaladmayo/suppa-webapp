import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import type { Db } from '../../db/client.js';
import * as schema from '../../db/schema/index.js';
import { depletionState, remainingRatio } from '../../lib/depletion.js';
import { startOfWeekSunday, toYmd } from '../../lib/week.js';
import type { HonoEnv } from '../../types/hono.js';
import { SettingsJson } from '../../validation/settings.js';

export function summaryRouter(db: Db) {
  const r = new Hono<HonoEnv>();

  r.get('/', async (c) => {
    const { householdId } = c.get('auth');
    const weekStart = c.req.query('weekStart') ?? startOfWeekSunday();

    const [settingsRow] = await db
      .select()
      .from(schema.appSetting)
      .where(
        and(eq(schema.appSetting.householdId, householdId), eq(schema.appSetting.key, 'settings_json')),
      )
      .limit(1);
    let settings = SettingsJson.parse({});
    if (settingsRow) {
      try {
        const raw = JSON.parse(settingsRow.value);
        const s = SettingsJson.safeParse(raw);
        if (s.success) settings = s.data;
      } catch {
        settings = SettingsJson.parse({});
      }
    }

    const runs = await db
      .select()
      .from(schema.prepRun)
      .where(
        and(eq(schema.prepRun.householdId, householdId), eq(schema.prepRun.status, 'active')),
      );
    const itemsOut: Array<{
      prepItem: typeof schema.prepItem.$inferSelect;
      prepRun: typeof schema.prepRun.$inferSelect;
      ratio: number;
      state: ReturnType<typeof depletionState>;
    }> = [];
    for (const run of runs) {
      const items = await db
        .select()
        .from(schema.prepItem)
        .where(eq(schema.prepItem.prepRunId, run.id));
      for (const it of items) {
        const ratio = remainingRatio(it.remainingGrams, it.totalCookedGrams);
        const state = depletionState(
          it.remainingGrams,
          it.totalCookedGrams,
          settings.lowThresholdPct,
          settings.criticalThresholdPct,
        );
        itemsOut.push({ prepItem: it, prepRun: run, ratio, state });
      }
    }

    const today = toYmd(new Date());
    const mealsWeek = await db
      .select()
      .from(schema.mealEntry)
      .where(
        and(eq(schema.mealEntry.householdId, householdId), eq(schema.mealEntry.weekStart, weekStart)),
      );
    const dayIndex = new Date().getDay();
    const mealsForToday = mealsWeek.filter((m) => m.dayIndex === dayIndex);
    const mealCountByDay = [0, 0, 0, 0, 0, 0, 0];
    for (const m of mealsWeek) {
      if (m.dayIndex >= 0 && m.dayIndex <= 6) mealCountByDay[m.dayIndex] += 1;
    }
    const daysWithMeals = mealCountByDay.filter((c) => c > 0).length;
    const recipeBackedMeals = mealsWeek.filter((m) => m.recipeId != null).length;

    const pantry = await db
      .select({ name: schema.pantryItem.name })
      .from(schema.pantryItem)
      .where(eq(schema.pantryItem.householdId, householdId));

    const grocery = await db
      .select({ name: schema.groceryItem.name, checked: schema.groceryItem.checked })
      .from(schema.groceryItem)
      .where(
        and(
          eq(schema.groceryItem.householdId, householdId),
          eq(schema.groceryItem.weekStart, weekStart),
        ),
      );
    const openGrocery = grocery.filter((g) => !g.checked);

    return c.json({
      weekStart,
      todayYmd: today,
      settings,
      prep: { activeRuns: runs, items: itemsOut },
      mealsToday: mealsForToday,
      weekPlan: {
        totalMeals: mealsWeek.length,
        daysWithMeals,
        recipeBackedMeals,
        mealCountByDay,
      },
      hints: {
        pantryNames: pantry.map((p) => p.name),
        openGroceryCount: openGrocery.length,
      },
    });
  });

  return r;
}
