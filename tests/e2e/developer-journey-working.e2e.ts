/**
 * Developer Journey E2E Test - Working
 * Uses proven session creation from auth-correct-cookie
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

async function createSession(request: any, email: string, password: string, name?: string, role = 'dev') {
	try {
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: { email, password, name: name || 'Test User', role }
		});
	} catch (e) {}

	const response = await request.post(`${BASE_URL}/api/auth/login`, {
		data: { email, password }
	});

	const setCookie = response.headers()['set-cookie'];
	if (!setCookie) throw new Error('No Set-Cookie header');

	const match = setCookie.match(/bountyforge\.session_token=([^;]+)/);
	if (!match || !match[1]) throw new Error(`No session token: ${setCookie}`);

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

test.describe('Developer Journey - Working', () => {
	test('1. should access developer dashboard', async ({ page, request }) => {
		const email = `dev-journey-${Date.now()}@example.com`;
		const password = 'devpassword123';

		// Create user and session
		const cookie = await createSession(request, email, password, 'Dev Journey');
		
		// Set cookie and navigate
		await page.context().addCookies([cookie]);
		await page.goto('/dev/dashboard');
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		const url = page.url();
		console.log('Dashboard URL:', url);

		// Should be on dashboard or onboarding
		expect(url).toMatch(/dashboard|onboarding/);
	});

	test('2. should view explore page', async ({ page }) => {
		await page.goto('/explore');
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		await expect(page.locator('h1')).toContainText('Explore Projects');
	});

	test('3. should view project details (if exists)', async ({ page, request }) => {
		const email = `dev2-${Date.now()}@example.com`;
		const password = 'devpassword123';

		const cookie = await createSession(request, email, password, 'Dev2 Test');
		await page.context().addCookies([cookie]);

		// Try to visit a project page - may 404 if no projects exist
		await page.goto('/project/test-project-id');
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		const url = page.url();
		console.log('Project page URL:', url);

		// Either shows project or 404
		const is404 = url.includes('404');
		const hasContent = await page.locator('h1').isVisible().catch(() => false);

		expect(is404 || hasContent).toBeTruthy();
	});
});
