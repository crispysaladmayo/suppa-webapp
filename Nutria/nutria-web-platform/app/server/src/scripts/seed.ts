import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { createDb } from '../db/client.js';
import { loadEnv } from '../env.js';
import { hashPassword } from '../lib/password.js';
import { log } from '../logger.js';
import * as schema from '../db/schema/index.js';

function startOfWeekSunday(d = new Date()): string {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function main() {
  const env = loadEnv();
  const db = createDb(env);
  const email = 'demo@nutria.local';
  const password = 'nutria-demo-12';

  const [existing] = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1);
  if (existing) {
    log.info('seed_skip', { reason: 'demo user exists', email });
    process.exit(0);
    return;
  }

  const householdId = randomUUID();
  const userId = randomUUID();
  await db.insert(schema.household).values({ id: householdId, name: 'Rumah demo' });
  await db.insert(schema.user).values({
    id: userId,
    householdId,
    email,
    passwordHash: await hashPassword(password),
  });

  await db.insert(schema.person).values([
    {
      id: 'wife',
      householdId,
      displayName: 'Istri',
      role: 'adult',
      sortOrder: 0,
    },
    {
      id: 'husband',
      householdId,
      displayName: 'Suami',
      role: 'adult',
      sortOrder: 1,
    },
    {
      id: 'daughter',
      householdId,
      displayName: 'Anak',
      role: 'child',
      sortOrder: 2,
    },
  ]);

  const runId = randomUUID();
  await db.insert(schema.prepRun).values({
    id: runId,
    householdId,
    name: 'Batch terakhir',
    startedAt: new Date().toISOString(),
    status: 'active',
  });
  await db.insert(schema.prepItem).values([
    {
      id: randomUUID(),
      prepRunId: runId,
      name: 'Ayam (matang)',
      totalCookedGrams: 1000,
      remainingGrams: 320,
      cookYieldPct: 27.5,
    },
    {
      id: randomUUID(),
      prepRunId: runId,
      name: 'Daging cincang (matang)',
      totalCookedGrams: 800,
      remainingGrams: 400,
      cookYieldPct: 25,
    },
  ]);

  await db.insert(schema.appSetting).values({
    householdId,
    key: 'settings_json',
    value: JSON.stringify({
      lowThresholdPct: 0.2,
      criticalThresholdPct: 0.1,
      homeLayout: 'depletion',
      locale: 'id',
    }),
  });

  await db.insert(schema.pantryItem).values([
    {
      id: randomUUID(),
      householdId,
      name: 'Putih telur',
      section: 'dairy',
      qtyGuess: 500,
      unitNote: 'g',
      priceIdrPerUnit: 12000,
    },
    {
      id: randomUUID(),
      householdId,
      name: 'Oat',
      section: 'pantry',
      qtyGuess: 1,
      unitNote: 'kg',
      priceIdrPerUnit: 45000,
    },
  ]);

  const weekStart = startOfWeekSunday();
  await db.insert(schema.groceryItem).values([
    {
      id: randomUUID(),
      householdId,
      weekStart,
      name: 'Jagung manis',
      section: 'frozen',
      qtyText: '400 g',
      priceIdrPerUnit: 18000,
      checked: false,
      source: 'seed',
    },
    {
      id: randomUUID(),
      householdId,
      weekStart,
      name: 'Bayam',
      section: 'produce',
      qtyText: '1 ikat',
      priceIdrPerUnit: 8000,
      checked: false,
      source: 'seed',
    },
  ]);

  log.info('seed_complete', { email });
}

main().catch((e) => {
  log.error('seed_failed', { err: String(e) });
  process.exit(1);
});
