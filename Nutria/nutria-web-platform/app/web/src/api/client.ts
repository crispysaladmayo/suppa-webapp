import { z } from 'zod';
import { log } from '../logger.js';
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
} from './schemas.js';

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const hasBody = init?.body !== undefined && init?.body !== null;
  const res = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      ...(hasBody ? { 'content-type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const raw = await parseJson(res);
  if (!res.ok) {
    const err = ErrorResponse.safeParse(raw);
    log.warn('api_error', { path, status: res.status, body: raw });
    const msg = err.success ? err.data.error.message : 'Request failed';
    throw new Error(msg);
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
