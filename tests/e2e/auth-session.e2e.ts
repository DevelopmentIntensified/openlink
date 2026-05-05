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
		// Get session token via test API
		const response = await request.post(`${BASE_URL}/api/test/session`, {
			data: {
				email: TEST_EMAIL,
				password: TEST_PASSWORD,
				apiKey: TEST_API_KEY
			}
		});

		const data = await response.json();
		
		// If session creation fails, try direct login
		if (!data.success) {
			// Use the working login API
			const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
				data: {
					email: TEST_EMAIL,
					password: TEST_PASSWORD
				}
			});
			
			const loginData = await loginResponse.json();
			
			if (loginData.sessionToken) {
				// Set cookie in page context
				await page.context().addCookies([{
					name: 'bountyforge_session_token',
					value: loginData.sessionToken,
					domain: 'localhost',
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'Lax'
				}]);
			}
		} else {
			// Set cookie from test API
			await page.context().addCookies([{
				name: 'bountyforge_session_token',
				value: data.sessionToken,
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
