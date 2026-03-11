import { defineConfig } from 'drizzle-kit';
require("dotenv").config();

console.log(process.env.TURSO_DATABASE_URL!)
export default defineConfig({
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN
	}
});
