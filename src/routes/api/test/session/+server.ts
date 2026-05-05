/**
 * Working Auth Test Helper
 * 
 * Creates a test session by directly using Better Auth's API
 * and returns the session cookie for Playwright.
 */

import { auth } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	// Only allow in development/test
	if (env.NODE_ENV === 'production') {
		return json({ error: 'Not available in production' }, { status: 403 });
	}

	try {
		const body = await request.json();
		const { email, password, name, apiKey } = body;

		// Check security key
		if (apiKey !== env.TEST_API_KEY) {
			return json({ error: 'Invalid API key' }, { status: 401 });
		}

		// 1. Sign up user (ignore if exists)
		try {
			await auth.api.signUpEmail({
				body: { email, password, name: name || 'Test User', roles: ['dev'] }
			});
		} catch (e) {
			// Ignore - user might exist
		}

		// 2. Sign in
		const result = await auth.api.signInEmail({
			body: { email, password }
		});

		if (!result?.session?.token) {
			return json({ error: 'Sign in failed', hasSession: !!result?.session }, { status: 401 });
		}

		// 3. Return session token
		return json({
			success: true,
			sessionToken: result.session.token,
			user: result.user
		});

	} catch (error: any) {
		console.error('Test session error:', error);
		return json({ error: error?.message || 'Internal error' }, { status: 500 });
	}
}
