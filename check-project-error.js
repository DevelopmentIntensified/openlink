import { createClient } from '@libsql/client';
import { config } from 'dotenv';
config();

const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

// Check bounties table
const bountiesCols = await client.execute('PRAGMA table_info(bounties)');
console.log('Bounties columns:', JSON.stringify(bountiesCols.rows, null, 2));

// Check projects table
const projectsCols = await client.execute('PRAGMA table_info(projects)');
console.log('\nProjects columns:', JSON.stringify(projectsCols.rows, null, 2));

// Test query
const testQuery = await client.execute({
  sql: 'SELECT id, projectId FROM bounties WHERE projectId = ?',
  args: ['3f120dfe-d859-41e1-9b84-628a2d665501']
});
console.log('\nTest query result:', testQuery.rows);

// Check user for owner
const ownerCheck = await client.execute({
  sql: 'SELECT id, name FROM user WHERE id = ?',
  args: ['O63NT5laZ4wWsZtu2iYfN4I2fUmudXs1']
});
console.log('Owner user:', ownerCheck.rows);

client.close();
