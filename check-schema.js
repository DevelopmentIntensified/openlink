import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config();

const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

async function check(table, label) {
  console.log(`\n${label}:`);
  const cols = await client.execute(`PRAGMA table_info(${table})`);
  cols.rows.forEach(c => console.log(`  ${c.name} (${c.type})`));
}

await check('bounties', 'Bounties');
await check('projects', 'Projects');
await check('user', 'User');

client.close();
