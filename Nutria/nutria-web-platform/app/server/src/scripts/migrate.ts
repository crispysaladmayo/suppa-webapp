import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from '../env.js';
import { log } from '../logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const env = loadEnv();
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  const db = drizzle(pool);
  const folder = path.join(__dirname, '../../drizzle');
  await migrate(db, { migrationsFolder: folder });
  log.info('db_migrate_complete', { folder });
  await pool.end();
}

main().catch((e) => {
  log.error('db_migrate_failed', { err: String(e) });
  process.exit(1);
});
