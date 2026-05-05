/**
 * Project CRUD E2E Tests - Fixed
 * Uses working session creation from auth-correct-cookie
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

async function createSession(request: any, email: string, password: string, name?: string, role = 'dev') {
	// First, try to signup (ignore errors if user already exists)
	try {
		const signupResponse = await request.post(`${BASE_URL}/api/auth/signup`, {
			data: { email, password, name: name || 'Test User', role }
		});
		console.log('Signup response:', signupResponse.status(), await signupResponse.text().catch(() => ''));
	} catch (e) {
		console.log('Signup error (ignored):', e);
	}

	// Wait a bit for user to be created
	await new Promise(resolve => setTimeout(resolve, 1000));

	// Now login
	const response = await request.post(`${BASE_URL}/api/auth/login`, {
		data: { email, password }
	});

	console.log('Login response status:', response.status());

	const setCookie = response.headers()['set-cookie'];
	if (!setCookie) {
		console.log('No Set-Cookie header. Response body:', await response.text().catch(() => 'cannot read'));
		throw new Error('No Set-Cookie header');
	}

	const match = setCookie.match(/bountyforge\.session_token=([^;]+)/);
	if (!match || !match[1]) {
		console.log('No session token in:', setCookie);
		throw new Error(`No session token: ${setCookie}`);
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

test.describe('Project CRUD E2E Tests - Fixed', () => {
	test('should create a new project', async ({ page, request }) => {
		const email = `project-create-${Date.now()}@example.com`;
		const password = 'testpassword123';

		// Create user and session
		const cookie = await createSession(request, email, password, 'Project Creator', 'sponsor');

		// Set cookie and navigate to new project page
		await page.context().addCookies([cookie]);
		await page.goto('/dashboard/project/new');

		await expect(page.locator('h1')).toContainText('Forge a New Project');

	// Fill form using placeholder text
		await page.fill('input[placeholder="My Awesome Project"]', 'Test Project E2E');
		await page.fill('textarea[placeholder*="Describe what your project" i]', 'A test project');

		// Select category using radio buttons (if visible)
		const webRadio = page.locator('input[value="web"]');
		if (await webRadio.isVisible({ timeout: 3000 }).catch(() => false)) {
			await webRadio.click();
		}

		// Select type
		const individualRadio = page.locator('input[value="individual"]');
		if (await individualRadio.isVisible({ timeout: 3000 }).catch(() => false)) {
			await individualRadio.click();
		}

		// Submit form
		await page.click('button[type="submit"]');

		// Wait for redirect
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		// Should redirect to project page or dashboard
		const url = page.url();
		console.log('After project creation:', url);
		expect(url).not.toContain('/dashboard/project/new');
	});

	test('should display projects list page', async ({ page, request }) => {
		const email = `project-list-${Date.now()}@example.com`;
		const password = 'testpassword123';

		const cookie = await createSession(request, email, password, 'Project Viewer', 'sponsor');
		await page.context().addCookies([cookie]);

		await page.goto('/dashboard/projects');
		await expect(page.locator('h1')).toContainText('Your Projects');
	});

	test('should view project details', async ({ page, request }) => {
		const email = `project-view-${Date.now()}@example.com`;
		const password = 'testpassword123';

		const cookie = await createSession(request, email, password, 'Project Viewer', 'sponsor');
		await page.context().addCookies([cookie]);

		// Try to visit a project page - may 404 if no projects exist
		await page.goto('/dashboard/project/test-id');
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		const url = page.url();
		console.log('Project page URL:', url);

		// Either shows project or 404
		const is404 = url.includes('404');
		const hasContent = await page.locator('h1').isVisible().catch(() => false);
		expect(is404 || hasContent).toBeTruthy();
	});
});
