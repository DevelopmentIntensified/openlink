import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL!,
		authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN
	},
	verbose: true,
	strict: false
});
