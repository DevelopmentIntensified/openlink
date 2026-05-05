/**
 * Auth Test Helper for Better Auth
 *
 * This module provides utilities to programmatically create sessions
 * for testing authenticated routes in Playwright.
 *
 * Usage in e2e tests:
 *   const helper = new AuthTestHelper();
 *   const sessionCookie = await helper.createSessionAndGetCookie('test@example.com', 'password123');
 *   await page.context().addCookies([sessionCookie]);
 */

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user, session } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class AuthTestHelper {
	/**
	 * Create a test user (or get existing one)
	 */
	async createUser(
		email: string,
		password: string,
		name = 'Test User'
	): Promise<{ id: string; email: string; name: string }> {
		try {
			// Try to sign up
			const result = await auth.api.signUpEmail({
				body: { email, password, name }
			});

			if (result?.user) {
				return {
					id: result.user.id,
					email: result.user.email,
					name: result.user.name || name
				};
			}
		} catch (error) {
			// User might already exist
		}

		// Check if user exists
		const existing = await db.select().from(user).where(eq(user.email, email)).limit(1);

		if (existing.length > 0) {
			return {
				id: existing[0].id,
				email: existing[0].email,
				name: existing[0].name
			};
		}

		throw new Error(`Failed to create or find user: ${email}`);
	}

	/**
	 * Sign in and get session token
	 */
	async signIn(email: string, password: string): Promise<string | null> {
		try {
			const result = await auth.api.signInEmail({
				body: { email, password }
			});

			return result?.session?.token || null;
		} catch (error) {
			console.error('Sign in error:', error);
			return null;
		}
	}

	/**
	 * Create a session and return cookie string for Playwright
	 */
	async createSessionAndGetCookie(email: string, password: string): Promise<string> {
		// Ensure user exists
		await this.createUser(email, password);

		// Sign in to get session
		const token = await this.signIn(email, password);

		if (!token) {
			throw new Error('Failed to sign in and get session token');
		}

		// Return cookie string in format for Playwright
		return `bountyforge_session_token=${token}`;
	}

	/**
	 * Get session data for setting cookies in Playwright
	 */
	async getSessionCookieForPlaywright(email: string, password: string): Promise<{
		name: string;
		value: string;
		domain: string;
		path: string;
		httpOnly: boolean;
		secure: boolean;
		sameSite: 'Lax' | 'Strict' | 'None';
	}> {
		await this.createUser(email, password);
		const token = await this.signIn(email, password);

		if (!token) {
			throw new Error('Failed to get session token');
		}

		return {
			name: 'bountyforge_session_token',
			value: token,
			domain: 'localhost',
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'Lax'
		};
	}

	/**
	 * Clean up test user and sessions
	 */
	async cleanup(email: string) {
		const userRecord = await db.select().from(user).where(eq(user.email, email)).limit(1);

		if (userRecord.length > 0) {
			const userId = userRecord[0].id;

			// Delete sessions
			await db.delete(session).where(eq(session.userId, userId));

			// Delete user
			await db.delete(user).where(eq(user.id, userId));
		}
	}
}

/**
 * Helper function to set session cookie in Playwright page
 */
export async function setSessionCookie(page: any, email: string, password: string) {
	const helper = new AuthTestHelper();
	const cookie = await helper.getSessionCookieForPlaywright(email, password);
	await page.context().addCookies([cookie]);
	return helper;
}

/**
 * Create a test user and return credentials
 */
export async function createTestUser(email?: string, password?: string) {
	const helper = new AuthTestHelper();
	const testEmail = email || `test-${Date.now()}@example.com`;
	const testPassword = password || 'testpassword123';

	const userData = await helper.createUser(testEmail, testPassword);
	return { ...userData, password: testPassword, helper };
}
