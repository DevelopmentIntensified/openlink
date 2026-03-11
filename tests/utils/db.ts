import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../../src/lib/server/schema';
import { randomUUID } from 'crypto';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

export const testDb = drizzle(client, { schema });

export async function cleanDb() {
  await testDb.delete(schema.bountyContributions).run();
  await testDb.delete(schema.bounties).run();
  await testDb.delete(schema.projects).run();
  await testDb.delete(schema.sessions).run();
  await testDb.delete(schema.users).run();
}

export function generateId(): string {
  return randomUUID();
}
