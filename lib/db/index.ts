import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured. Add it to .env.local.');
  if (!database) database = drizzle(neon(databaseUrl), { schema });
  return database;
}
