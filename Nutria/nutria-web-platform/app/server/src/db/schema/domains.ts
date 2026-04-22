import {
  pgTable,
  text,
  real,
  integer,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { household } from './core.js';

export const person = pgTable('person', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => household.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  role: text('role').notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const prepRun = pgTable('prep_run', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => household.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  startedAt: text('started_at').notNull(),
  status: text('status').notNull(),
});

export const prepItem = pgTable('prep_item', {
  id: text('id').primaryKey(),
  prepRunId: text('prep_run_id')
    .notNull()
    .references(() => prepRun.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  totalCookedGrams: real('total_cooked_grams').notNull(),
  remainingGrams: real('remaining_grams').notNull(),
  cookYieldPct: real('cook_yield_pct').notNull().default(27.5),
});

export const consumptionLog = pgTable('consumption_log', {
  id: text('id').primaryKey(),
  prepItemId: text('prep_item_id')
    .notNull()
    .references(() => prepItem.id, { onDelete: 'cascade' }),
  personId: text('person_id')
    .notNull()
    .references(() => person.id),
  grams: real('grams').notNull(),
  loggedAt: text('logged_at').notNull(),
});

export const mealEntry = pgTable('meal_entry', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => household.id, { onDelete: 'cascade' }),
  weekStart: text('week_start').notNull(),
  dayIndex: integer('day_index').notNull(),
  slot: text('slot').notNull(),
  personId: text('person_id')
    .notNull()
    .references(() => person.id),
  title: text('title').notNull(),
  isFresh: boolean('is_fresh').notNull().default(true),
  prepItemId: text('prep_item_id').references(() => prepItem.id),
  notes: text('notes'),
  kcal: real('kcal'),
  proteinG: real('protein_g'),
  carbsG: real('carbs_g'),
  fatG: real('fat_g'),
  fiberG: real('fiber_g'),
  ironMg: real('iron_mg'),
  calciumMg: real('calcium_mg'),
});

export const groceryItem = pgTable('grocery_item', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => household.id, { onDelete: 'cascade' }),
  weekStart: text('week_start').notNull(),
  name: text('name').notNull(),
  section: text('section').notNull(),
  qtyText: text('qty_text'),
  priceIdrPerUnit: real('price_idr_per_unit'),
  checked: boolean('checked').notNull().default(false),
  source: text('source').default('manual'),
});

export const pantryItem = pgTable('pantry_item', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => household.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  section: text('section').notNull(),
  qtyGuess: real('qty_guess'),
  unitNote: text('unit_note'),
  priceIdrPerUnit: real('price_idr_per_unit'),
});

export const appSetting = pgTable(
  'app_setting',
  {
    householdId: text('household_id')
      .notNull()
      .references(() => household.id, { onDelete: 'cascade' }),
    key: text('key').notNull(),
    value: text('value').notNull(),
  },
  (t) => [primaryKey({ columns: [t.householdId, t.key] })],
);

export const prepSession = pgTable('prep_session', {
  id: text('id').primaryKey(),
  householdId: text('household_id')
    .notNull()
    .references(() => household.id, { onDelete: 'cascade' }),
  prepRunId: text('prep_run_id').references(() => prepRun.id),
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at'),
  notes: text('notes'),
});

export const prepSessionIngredient = pgTable('prep_session_ingredient', {
  id: text('id').primaryKey(),
  prepSessionId: text('prep_session_id')
    .notNull()
    .references(() => prepSession.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  rawKg: real('raw_kg').notNull().default(0),
  shrinkPct: real('shrink_pct').notNull().default(27.5),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const prepSessionStep = pgTable('prep_session_step', {
  id: text('id').primaryKey(),
  prepSessionId: text('prep_session_id')
    .notNull()
    .references(() => prepSession.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});
