import { db } from './db';
import { sessions, users } from './schema';
import { eq, gt } from 'drizzle-orm';
import type { User, Session } from './schema';

const SESSION_EXPIRY_DAYS = 30;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export function generateSessionToken(): string {
	const bytes = new Uint8Array(25);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(userId: string): Promise<Session> {
	const token = generateSessionToken();
	const sessionId = token.slice(0, 25);
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);

	const [session] = await db.insert(sessions).values({
		id: sessionId,
		userId,
		expiresAt
	}).returning();

	return session;
}

export async function validateSessionToken(token: string): Promise<{ session: Session; user: User } | { session: null; user: null }> {
	const sessionId = token.slice(0, 25);
	const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);

	if (!session) {
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return { session: null, user: null };
	}

	const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);

	if (!user) {
		return { session: null, user: null };
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function getUserById(userId: string): Promise<User | null> {
	const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
	return user || null;
}

export async function deleteExpiredSessions(): Promise<void> {
	await db.delete(sessions).where(gt(sessions.expiresAt, new Date()));
}
