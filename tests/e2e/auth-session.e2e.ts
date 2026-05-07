/**
 * Auth Session Tests
 * 
 * TDD Cycle: Use test API endpoint to create sessions
 */
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const TEST_API_KEY = 'test-api-key-123456789';
const TEST_EMAIL = 'test-session@example.com';
const TEST_PASSWORD = 'testpassword123';

test.describe('Auth Session Tests', () => {
	test.beforeAll(async ({ request }) => {
		// Create test user via signup API
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: {
				email: TEST_EMAIL,
				password: TEST_PASSWORD,
				name: 'Test User',
				role: 'dev'
			}
		});
	});

	test('should be able to sign in and access protected route', async ({ page, request }) => {
		// Sign in via login API
		const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
			data: {
				email: TEST_EMAIL,
				password: TEST_PASSWORD
			}
		});

		// Parse session token from Set-Cookie header
		const setCookie = loginResponse.headers()['set-cookie'];
		const match = setCookie?.match(/bountyforge\.session_token=([^;]+)/);
		if (match?.[1]) {
			await page.context().addCookies([{
				name: 'bountyforge.session_token',
				value: decodeURIComponent(match[1]),
				domain: 'localhost',
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'Lax'
			}]);
		}

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
