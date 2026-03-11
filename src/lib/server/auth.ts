import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import { GitHub, Google } from 'arctic';
import { generateSessionToken, createSession, validateSessionToken, invalidateSession, getUserById } from './session';
import type { User, Session } from './schema';

export const github = new GitHub(
	process.env.GITHUB_CLIENT_ID!,
	process.env.GITHUB_CLIENT_SECRET!,
	null
);

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	`${process.env.PUBLIC_URL}/auth/google/callback`
);

export interface SessionUser {
	id: string;
	username: string;
	email: string | null;
	avatarUrl: string | null;
}

export async function authenticateUser(provider: 'github' | 'google', providerId: string, profile: {
	username: string;
	email?: string;
	avatarUrl?: string;
}): Promise<User> {
	const existingUser = await db.query.users.findFirst({
		where: eq(users.providerId, providerId)
	});

	if (existingUser) {
		return existingUser;
	}

	const newUser = await db.insert(users).values({
		id: crypto.randomUUID(),
		username: profile.username,
		email: profile.email || null,
		avatarUrl: profile.avatarUrl || null,
		provider,
		providerId
	}).returning();

	return newUser[0];
}

export async function createUserSession(userId: string) {
	const session = await createSession(userId);
	return session;
}

export { generateSessionToken, validateSessionToken, invalidateSession, getUserById };
export type { User, Session };
