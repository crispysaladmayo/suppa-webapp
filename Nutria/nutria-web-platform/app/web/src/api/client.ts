import { z } from 'zod';
import { getApiOrigin } from './apiBase.js';
import { createApiError } from './ApiError.js';
import { log } from '../logger.js';

function withApiOrigin(path: string): string {
  if (!path.startsWith('/')) return path;
  const origin = getApiOrigin();
  return origin ? `${origin}${path}` : path;
}
import {
  ConsumptionLogsResponse,
  ErrorResponse,
  GroceryResponse,
  MealsResponse,
  MeResponse,
  PantryResponse,
  PersonsResponse,
  PrepItemsResponse,
  PrepRunsResponse,
  PrepSessionsResponse,
  PrepSessionIngredientsResponse,
  PrepSessionStepsResponse,
  SummaryResponse,
  UserSchema,
  RecipesListResponse,
  RecipeDetailResponse,
  CloneWeekResponse,
  GroceryFromPlanResponse,
  RecipeCreateResponse,
} from './schemas.js';

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(
      res.ok
        ? 'Invalid JSON from server'
        : `Server returned non-JSON (${res.status}). Is the API running on port 3001?`,
    );
  }
}

const REQUEST_TIMEOUT_MS = 12_000;

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const hasBody = init?.body !== undefined && init?.body !== null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(withApiOrigin(path), {
      ...init,
      signal: controller.signal,
      credentials: 'include',
      headers: {
        ...(hasBody ? { 'content-type': 'application/json' } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timeoutId);
  }
  const raw = await parseJson(res);
  if (!res.ok) {
    const err = ErrorResponse.safeParse(raw);
    log.warn('api_error', { path, status: res.status, body: raw });
    const msg = err.success ? err.data.error.message : 'Request failed';
    throw createApiError(msg, res.status);
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    log.error('api_parse_failed', { path, issues: parsed.error.flatten() });
    throw new Error('Invalid response shape');
  }
  return parsed.data;
}

export const api = {
  me: () => request('/api/auth/me', MeResponse, { method: 'GET' }),
  login: (email: string, password: string) =>
    request(
      '/api/auth/login',
      z.object({ ok: z.literal(true), user: UserSchema }),
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
    ),
  register: (email: string, password: string, householdName?: string) =>
    request(
      '/api/auth/register',
      z.object({ ok: z.literal(true), householdId: z.string(), userId: z.string() }),
      {
        method: 'POST',
        body: JSON.stringify({ email, password, householdName }),
      },
    ),
  logout: () =>
    request('/api/auth/logout', z.object({ ok: z.literal(true) }), { method: 'POST' }),
  summary: (weekStart?: string) => {
    const q = weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : '';
    return request(`/api/v1/summary${q}`, SummaryResponse, { method: 'GET' });
  },
  persons: () => request('/api/v1/persons', PersonsResponse, { method: 'GET' }),
  prepRuns: () => request('/api/v1/prep/runs', PrepRunsResponse, { method: 'GET' }),
  prepItems: (runId: string) =>
    request(`/api/v1/prep/runs/${encodeURIComponent(runId)}/items`, PrepItemsResponse, {
      method: 'GET',
    }),
  consumptionLogs: () =>
    request('/api/v1/prep/consumption?limit=20', ConsumptionLogsResponse, { method: 'GET' }),
  logConsumption: (body: {
    prepItemId: string;
    personId: string;
    grams: number;
    loggedAt: string;
  }) =>
    request('/api/v1/prep/consumption', z.record(z.string(), z.unknown()), {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  meals: (weekStart: string) =>
    request(`/api/v1/meals?weekStart=${encodeURIComponent(weekStart)}`, MealsResponse, {
      method: 'GET',
    }),
  createMeal: (body: Record<string, unknown>) =>
    request('/api/v1/meals', z.record(z.string(), z.unknown()), {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  cloneWeekMeals: (body: { fromWeekStart: string; toWeekStart: string; replaceExisting?: boolean }) =>
    request('/api/v1/meals/clone-week', CloneWeekResponse, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  recipeSearch: (q: string, limit = 12) =>
    request(
      `/api/v1/recipes?q=${encodeURIComponent(q)}&limit=${limit}`,
      RecipesListResponse,
      { method: 'GET' },
    ),
  recipeDetail: (id: string) =>
    request(`/api/v1/recipes/${encodeURIComponent(id)}`, RecipeDetailResponse, { method: 'GET' }),
  createRecipe: (body: Record<string, unknown>) =>
    request('/api/v1/recipes', RecipeCreateResponse, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  groceryFromPlan: (body: { weekStart: string; replaceGenerated?: boolean }) =>
    request('/api/v1/grocery/from-plan', GroceryFromPlanResponse, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  grocery: (weekStart: string) =>
    request(`/api/v1/grocery?weekStart=${encodeURIComponent(weekStart)}`, GroceryResponse, {
      method: 'GET',
    }),
  createGrocery: (body: Record<string, unknown>) =>
    request('/api/v1/grocery', z.record(z.string(), z.unknown()), {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  patchGrocery: (id: string, body: Record<string, unknown>) =>
    request(`/api/v1/grocery/${encodeURIComponent(id)}`, z.record(z.string(), z.unknown()), {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  pantry: () => request('/api/v1/pantry', PantryResponse, { method: 'GET' }),
  prepSessions: () =>
    request('/api/v1/prep-sessions', PrepSessionsResponse, { method: 'GET' }),
  createPrepSession: (body: Record<string, unknown>) =>
    request('/api/v1/prep-sessions', z.record(z.string(), z.unknown()), {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  patchPrepSession: (id: string, body: Record<string, unknown>) =>
    request(`/api/v1/prep-sessions/${encodeURIComponent(id)}`, z.record(z.string(), z.unknown()), {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  prepSessionIngredients: (sessionId: string) =>
    request(
      `/api/v1/prep-sessions/${encodeURIComponent(sessionId)}/ingredients`,
      PrepSessionIngredientsResponse,
      { method: 'GET' },
    ),
  addPrepSessionIngredient: (sessionId: string, body: Record<string, unknown>) =>
    request(
      `/api/v1/prep-sessions/${encodeURIComponent(sessionId)}/ingredients`,
      z.record(z.string(), z.unknown()),
      { method: 'POST', body: JSON.stringify(body) },
    ),
  prepSessionSteps: (sessionId: string) =>
    request(
      `/api/v1/prep-sessions/${encodeURIComponent(sessionId)}/steps`,
      PrepSessionStepsResponse,
      { method: 'GET' },
    ),
  addPrepSessionStep: (sessionId: string, body: Record<string, unknown>) =>
    request(
      `/api/v1/prep-sessions/${encodeURIComponent(sessionId)}/steps`,
      z.record(z.string(), z.unknown()),
      { method: 'POST', body: JSON.stringify(body) },
    ),
  mealIdeas: () =>
    request('/api/v1/ai/meal-ideas', z.record(z.string(), z.unknown()), {
      method: 'POST',
      body: JSON.stringify({}),
    }),
};
