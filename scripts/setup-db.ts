import { createClient } from '@libsql/client';

const client = createClient({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN
});

const tables = [
	`CREATE TABLE IF NOT EXISTS user (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    email_verified integer DEFAULT false NOT NULL,
    image text,
    created_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    updated_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
  )`,
	`CREATE TABLE IF NOT EXISTS account (
    id text PRIMARY KEY NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at integer,
    refresh_token_expires_at integer,
    scope text,
    password text,
    created_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    updated_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
  )`,
	`CREATE TABLE IF NOT EXISTS session (
    id text PRIMARY KEY NOT NULL,
    expires_at integer NOT NULL,
    token text NOT NULL UNIQUE,
    created_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    updated_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    ip_address text,
    user_agent text,
    user_id text NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
  )`,
	`CREATE TABLE IF NOT EXISTS verification (
    id text PRIMARY KEY NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at integer NOT NULL,
    created_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
    updated_at integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
  )`,
	`CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY NOT NULL,
    username text NOT NULL UNIQUE,
    email text,
    avatarUrl text,
    bio text,
    skills text,
    provider text NOT NULL,
    providerId text NOT NULL,
    createdAt integer NOT NULL
  )`,
	`CREATE TABLE IF NOT EXISTS sessions (
    id text PRIMARY KEY NOT NULL,
    userId text NOT NULL,
    expiresAt integer NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`,
	`CREATE TABLE IF NOT EXISTS projects (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    description text,
    repoUrl text,
    website text,
    category text DEFAULT 'other',
    ownerId text NOT NULL,
    type text DEFAULT 'individual' NOT NULL,
    isBountyEnabled integer DEFAULT false NOT NULL,
    createdAt integer NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES users(id)
  )`,
	`CREATE TABLE IF NOT EXISTS bounties (
    id text PRIMARY KEY NOT NULL,
    projectId text NOT NULL,
    title text NOT NULL,
    description text,
    skills text,
    amount integer NOT NULL,
    priority text DEFAULT 'medium',
    deadline integer,
    status text DEFAULT 'open' NOT NULL,
    createdBy text NOT NULL,
    assignedTo text,
    submissionPR text,
    submissionNotes text,
    salableCheckoutId text,
    salablePaymentId text,
    createdAt integer NOT NULL,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (createdBy) REFERENCES users(id)
  )`,
	`CREATE TABLE IF NOT EXISTS bounty_contributions (
    id text PRIMARY KEY NOT NULL,
    bountyId text NOT NULL,
    userId text NOT NULL,
    amount integer NOT NULL,
    salablePaymentId text,
    createdAt integer NOT NULL,
    FOREIGN KEY (bountyId) REFERENCES bounties(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id)
  )`
];

for (const sql of tables) {
	try {
		await client.execute(sql);
		console.log('Created table');
	} catch (e) {
		console.log('Error:', e.message);
	}
}

console.log('Done!');
