import { Hono } from 'hono';
import type { Db } from '../../db/client.js';
import { requireAuth } from '../../middleware/auth.js';
import type { HonoEnv } from '../../types/hono.js';
import { exportRouter } from './export.js';
import { groceryRouter } from './grocery.js';
import { mealsRouter } from './meals.js';
import { pantryRouter } from './pantry.js';
import { personsRouter } from './persons.js';
import { prepRouter } from './prep.js';
import { prepSessionsRouter } from './prepSessions.js';
import { settingsRouter } from './settings.js';
import { summaryRouter } from './summary.js';
import { aiRouter } from './ai.js';
import { recipesRouter } from './recipes.js';

export function createV1App(db: Db) {
  const app = new Hono<HonoEnv>();
  app.use('*', requireAuth(db));
  app.route('/ai', aiRouter(db));
  app.route('/persons', personsRouter(db));
  app.route('/prep', prepRouter(db));
  app.route('/meals', mealsRouter(db));
  app.route('/recipes', recipesRouter(db));
  app.route('/grocery', groceryRouter(db));
  app.route('/pantry', pantryRouter(db));
  app.route('/settings', settingsRouter(db));
  app.route('/prep-sessions', prepSessionsRouter(db));
  app.route('/summary', summaryRouter(db));
  app.route('/export', exportRouter(db));
  return app;
}
