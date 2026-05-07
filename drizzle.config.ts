import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL!,
		authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN
	},
	verbose: true,
	strict: false
});
