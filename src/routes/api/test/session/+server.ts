/**
 * Test Session API Endpoint - Fixed Version
 * 
 * Uses Better Auth API directly to create sessions for e2e tests.
 * ONLY available in development/test mode.
 * Requires API key for security.
 */

import { auth } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { user, session } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

		if (!email || !password) {
			return json({ error: 'Email and password required' }, { status: 400 });
		}

		// 1. Sign up user (ignore if exists)
		try {
			await auth.api.signUpEmail({
				body: { email, password, name: name || 'Test User', roles: ['dev'] }
			});
		} catch (e) {
			// Ignore signup errors (user might exist)
		}

		// 2. Sign in using Better Auth API
		try {
			const result = await auth.api.signInEmail({
				body: { email, password }
			});

			console.log('SignIn result:', JSON.stringify({
				hasResult: !!result,
				hasSession: !!result?.session,
				hasToken: !!result?.session?.token,
				hasUser: !!result?.user
			}));

			if (!result?.session?.token) {
				return json({ 
					error: 'Invalid credentials', 
					debug: { 
						hasResult: !!result,
						hasSession: !!result?.session,
						sessionKeys: result?.session ? Object.keys(result.session) : null
					}
				}, { status: 401 });
			}

			// Return session token and user info
			return json({
				success: true,
				sessionToken: result.session.token,
				user: result.user
			});
		} catch (signInError: any) {
			return json({ error: 'Sign in failed', details: signInError?.message }, { status: 401 });
		}
	} catch (error: any) {
		console.error('Test session creation error:', error);
		return json({ error: 'Internal error', details: error?.message }, { status: 500 });
	}
}
