import { connect } from '@tursodatabase/serverless';
import 'dotenv/config';

const conn = connect({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const r = await conn.execute('SELECT count(*) as cnt FROM sqlite_master');
console.log('execute keys:', Object.keys(r));
console.log('execute.rows type:', Array.isArray(r.rows), 'length:', r.rows.length);
console.log('execute.rows[0]:', r.rows[0]);
console.log('execute.columns:', r.columns);

// Check if conn has 'all' method directly
const allRows = await conn.all('SELECT name FROM sqlite_master WHERE type = ?', 'table');
console.log('conn.all:', allRows);
console.log('conn.all[0]:', JSON.stringify(allRows[0]));

const oneRow = await conn.get('SELECT name FROM sqlite_master WHERE type = ?', 'table');
console.log('conn.get:', oneRow);

// Check transaction API
console.log('conn.transaction type:', typeof conn.transaction);
console.log('conn.batch type:', typeof conn.batch);

conn.close();
