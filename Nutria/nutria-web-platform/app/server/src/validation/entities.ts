import { z } from 'zod';

export const PersonPatch = z.object({
  displayName: z.string().min(1).max(120).optional(),
  role: z.enum(['adult', 'child']).optional(),
  sortOrder: z.number().int().min(0).max(100).optional(),
});

export const PrepRunCreate = z.object({
  name: z.string().min(1).max(200),
  startedAt: z.string().min(1),
  status: z.enum(['active', 'archived']).default('active'),
});

export const PrepRunPatch = PrepRunCreate.partial();

export const PrepItemCreate = z.object({
  prepRunId: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  totalCookedGrams: z.number().positive(),
  remainingGrams: z.number().min(0),
  cookYieldPct: z.number().min(0).max(90).optional(),
});

export const PrepItemPatch = z.object({
  name: z.string().min(1).max(200).optional(),
  totalCookedGrams: z.number().positive().optional(),
  remainingGrams: z.number().min(0).optional(),
  cookYieldPct: z.number().min(0).max(90).optional(),
});

export const ConsumptionCreate = z.object({
  prepItemId: z.string().min(1).max(64),
  personId: z.string().min(1).max(64),
  grams: z.number().positive(),
  loggedAt: z.string().min(1),
});

export const MealCreate = z.object({
  weekStart: z.string().min(1),
  dayIndex: z.number().int().min(0).max(6),
  slot: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  personId: z.string().min(1).max(64),
  title: z.string().min(1).max(400),
  isFresh: z.boolean().optional(),
  prepItemId: z.string().min(1).max(64).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  kcal: z.number().nullable().optional(),
  proteinG: z.number().nullable().optional(),
  carbsG: z.number().nullable().optional(),
  fatG: z.number().nullable().optional(),
  fiberG: z.number().nullable().optional(),
  ironMg: z.number().nullable().optional(),
  calciumMg: z.number().nullable().optional(),
});

export const MealPatch = MealCreate.partial();

export const GroceryCreate = z.object({
  weekStart: z.string().min(1),
  name: z.string().min(1).max(200),
  section: z.string().min(1).max(64),
  qtyText: z.string().max(120).nullable().optional(),
  priceIdrPerUnit: z.number().min(0).nullable().optional(),
  checked: z.boolean().optional(),
  source: z.string().max(64).optional(),
});

export const GroceryPatch = GroceryCreate.partial();

export const PantryCreate = z.object({
  name: z.string().min(1).max(200),
  section: z.string().min(1).max(64),
  qtyGuess: z.number().nullable().optional(),
  unitNote: z.string().max(120).nullable().optional(),
  priceIdrPerUnit: z.number().min(0).nullable().optional(),
});

export const PantryPatch = PantryCreate.partial();

export const PrepSessionCreate = z.object({
  prepRunId: z.string().uuid().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const PrepSessionPatch = z.object({
  endedAt: z.string().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  prepRunId: z.string().min(1).max(64).nullable().optional(),
});

export const PrepSessionIngredientCreate = z.object({
  name: z.string().min(1).max(200),
  rawKg: z.number().min(0).default(0),
  shrinkPct: z.number().min(0).max(90).default(27.5),
  sortOrder: z.number().int().min(0).default(0),
});

export const PrepSessionIngredientPatch = PrepSessionIngredientCreate.partial();

export const PrepSessionStepCreate = z.object({
  title: z.string().min(1).max(400),
  sortOrder: z.number().int().min(0).default(0),
});

export const PrepSessionStepPatch = PrepSessionStepCreate.partial();
