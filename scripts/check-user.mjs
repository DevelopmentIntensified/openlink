import { createClient } from '@libsql/client';
import 'dotenv/config';

const c = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const r = await c.execute("PRAGMA table_info(user)");
console.log('user columns:');
for (const row of r.rows) {
  console.log(`  ${row.name} (${row.type})`);
}

const tables = await c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
console.log('\ntables:', tables.rows.map(r => r.name).join(', '));

c.close();
