/**
 * Simple Auth Test Helper
 * 
 * Creates sessions by calling the working login API directly
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

/**
 * Create a session and return cookies for Playwright
 */
export async function createSession(request: any, email: string, password: string, name?: string, role?: string) {
	// Sign up first (ignore errors if user exists)
	try {
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: {
				email,
				password,
				name: name || 'Test User',
				role: role || 'dev'
			}
		});
	} catch (e) {
		// Ignore signup errors
	}

	// Sign in using the working login API
	const response = await request.post(`${BASE_URL}/api/auth/login`, {
		data: { email, password }
	});

	// Parse session token from Set-Cookie header
	const setCookie = response.headers()['set-cookie'];
	if (!setCookie) {
		const data = await response.json();
		throw new Error(`No Set-Cookie header: ${JSON.stringify(data)}`);
	}

	const match = setCookie.match(/bountyforge\.session_token=([^;]+)/);
	if (!match?.[1]) {
		throw new Error(`No session token in cookie: ${setCookie}`);
	}

	return {
		name: 'bountyforge.session_token',
		value: decodeURIComponent(match[1]),
		domain: 'localhost',
		path: '/',
		httpOnly: true,
		secure: false,
		sameSite: 'Lax' as const
	};
}

/**
 * Auth Session Tests
 */
test.describe('Auth Session Tests', () => {
	const TEST_EMAIL = 'test-simple@example.com';
	const TEST_PASSWORD = 'testpassword123';

	test('should create session and access protected route', async ({ page, request }) => {
		// Create session
		const cookie = await createSession(request, TEST_EMAIL, TEST_PASSWORD);

		// Set cookie in page context
		await page.context().addCookies([cookie]);

		// Navigate to protected route
		await page.goto('/dashboard/projects');

		// Verify we can access protected route
		await expect(page.locator('h1')).toContainText('Your Projects');
	});

	test('should reject access to protected route without session', async ({ page }) => {
		// Try to access protected route without signing in
		await page.goto('/dashboard/projects');

		// Should redirect to login
		await page.waitForURL('**/login', { timeout: 10000 });

		// Verify we're on login page
		await expect(page.url()).toContain('/login');
	});
});
