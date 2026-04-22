import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import type { Env } from '../env.js';
import * as schema from './schema/index.js';

export function createDb(env: Env) {
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  return drizzle(pool, { schema });
}

export type Db = ReturnType<typeof createDb>;
