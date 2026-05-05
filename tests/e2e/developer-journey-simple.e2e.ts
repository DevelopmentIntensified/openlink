/**
 * Developer Journey E2E Test - Simplified
 * Tests core developer flows
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Developer Journey - Simplified', () => {
	test('1. should access developer dashboard with session', async ({ page, request }) => {
		const email = `dev-${Date.now()}@example.com`;
		const password = 'devpassword123';

		// Create user and session
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: { email, password, name: 'Dev Test', role: 'dev' }
		});

		const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
			data: { email, password }
		});

		const setCookie = loginResponse.headers()['set-cookie'];
		const match = setCookie?.match(/bountyforge\.session_token=([^;]+)/);
		
		if (match && match[1]) {
			await page.context().addCookies([{
				name: 'bountyforge.session_token',
				value: decodeURIComponent(match[1]),
				domain: 'localhost',
				path: '/'
			}]);
		}

		await page.goto('/dev/dashboard');
		await page.waitForLoadState('networkidle', { timeout: 10000 });
		
		const url = page.url();
		console.log('Dashboard URL:', url);
		
		// Should be on dashboard or redirected to onboarding
		expect(url).toMatch(/dashboard|onboarding/);
	});

	test('2. should view explore page', async ({ page }) => {
		await page.goto('/explore');
		await page.waitForLoadState('networkidle', { timeout: 10000 });
		
		// Should show explore page
		const url = page.url();
		expect(url).toContain('/explore');
	});
});
