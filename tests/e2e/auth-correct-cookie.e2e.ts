/**
 * Working Auth Test - Correct Cookie Name
 * Uses correct cookie name: bountyforge.session_token
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

/**
 * Create session by calling login API and extracting token from Set-Cookie header
 */
async function createSession(request: any, email: string, password: string, name?: string) {
	// Sign up first (ignore errors)
	try {
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: {
				email,
				password,
				name: name || 'Test User',
				role: 'dev'
			}
		});
	} catch (e) {}

	// Sign in using login API
	const response = await request.post(`${BASE_URL}/api/auth/login`, {
		data: { email, password }
	});

	// Get the Set-Cookie header
	const setCookie = response.headers()['set-cookie'];
	
	if (!setCookie) {
		const data = await response.json();
		throw new Error(`No Set-Cookie header: ${JSON.stringify(data)}`);
	}

	// Extract token from cookie string
	// Format: bountyforge.session_token=<token>; ...
	const match = setCookie.match(/bountyforge\.session_token=([^;]+)/);
	
	if (!match || !match[1]) {
		throw new Error(`No session token in cookie: ${setCookie}`);
	}

	// URL-decode the token value
	const tokenValue = decodeURIComponent(match[1]);

	return {
		name: 'bountyforge.session_token',
		value: tokenValue,
		domain: 'localhost',
		path: '/',
		httpOnly: true,
		secure: false,
		sameSite: 'Lax' as const
	};
}

test.describe('Auth Session Tests - Working', () => {
	const TEST_EMAIL = 'test-correct-cookie@example.com';
	const TEST_PASSWORD = 'testpassword123';

	test.beforeAll(async ({ request }) => {
		// Create test user
		try {
			await request.post(`${BASE_URL}/api/auth/signup`, {
				data: {
					email: TEST_EMAIL,
					password: TEST_PASSWORD,
					name: 'Test User',
					role: 'dev'
				}
			});
		} catch (e) {}
	});

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

	test('should access multiple protected routes with same session', async ({ page, request }) => {
		// Create session
		const cookie = await createSession(request, TEST_EMAIL, TEST_PASSWORD);

		// Set cookie
		await page.context().addCookies([cookie]);

		// Navigate to projects page
		await page.goto('/dashboard/projects');
		await expect(page.locator('h1')).toContainText('Your Projects');

		// Navigate to new project page
		await page.goto('/dashboard/project/new');
		await expect(page.locator('h1')).toContainText('Forge a New Project');
	});
});
