import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import 'dotenv/config';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

const sql = readFileSync(new URL('./full-schema.sql', import.meta.url), 'utf-8');
const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

console.log(`Executing ${statements.length} statements...`);
for (const stmt of statements) {
  try {
    await client.execute(stmt + ';');
    console.log(`  OK: ${stmt.substring(0, 60)}...`);
  } catch (e) {
    console.error(`  FAIL: ${stmt.substring(0, 60)}...`);
    console.error(`  Error: ${e.message}`);
    throw e;
  }
}

const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
console.log('\nTables:', tables.rows.map(r => r.name).join(', '));

const userCols = await client.execute("PRAGMA table_info(user)");
console.log('\nuser columns:');
for (const r of userCols.rows) console.log(`  ${r.name} (${r.type})`);

client.close();
console.log('\nDone!');
