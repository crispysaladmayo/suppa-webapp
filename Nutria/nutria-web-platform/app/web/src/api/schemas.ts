import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  householdId: z.string(),
});

export const LooseObj = z.record(z.string(), z.unknown());

export const MeResponse = z.object({
  user: UserSchema.nullable(),
});

export const SummaryResponse = z.object({
  weekStart: z.string(),
  todayYmd: z.string(),
  settings: z.object({
    lowThresholdPct: z.number(),
    criticalThresholdPct: z.number(),
    homeLayout: z.enum(['depletion', 'planner', 'compact']),
    locale: z.literal('id'),
  }),
  prep: z.object({
    activeRuns: z.array(z.record(z.string(), z.unknown())),
    items: z.array(
      z.object({
        prepItem: z.record(z.string(), z.unknown()),
        prepRun: z.record(z.string(), z.unknown()),
        ratio: z.number(),
        state: z.enum(['comfortable', 'low', 'critical']),
      }),
    ),
  }),
  mealsToday: z.array(z.record(z.string(), z.unknown())),
  hints: z.object({
    pantryNames: z.array(z.string()),
    openGroceryCount: z.number(),
  }),
});

export const PersonsResponse = z.object({
  persons: z.array(z.record(z.string(), z.unknown())),
});

export const MealsResponse = z.object({
  meals: z.array(z.record(z.string(), z.unknown())),
});

export const GroceryResponse = z.object({
  items: z.array(z.record(z.string(), z.unknown())),
  totalIdrUnchecked: z.number(),
});

export const PantryResponse = z.object({
  items: z.array(z.record(z.string(), z.unknown())),
});

export const PrepRunsResponse = z.object({
  prepRuns: z.array(z.record(z.string(), z.unknown())),
});

export const PrepItemsResponse = z.object({
  prepItems: z.array(z.record(z.string(), z.unknown())),
});

export const ConsumptionLogsResponse = z.object({
  logs: z.array(z.record(z.string(), z.unknown())),
});

export const PrepSessionsResponse = z.object({
  sessions: z.array(z.record(z.string(), z.unknown())),
});

export const PrepSessionIngredientsResponse = z.object({
  ingredients: z.array(z.record(z.string(), z.unknown())),
});

export const PrepSessionStepsResponse = z.object({
  steps: z.array(z.record(z.string(), z.unknown())),
});

export const ErrorResponse = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
