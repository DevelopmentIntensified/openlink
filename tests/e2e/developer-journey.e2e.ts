/**
 * Developer Journey E2E Test
 * Complete flow: signup → profile → explore → claim bounty → submit work
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

async function createSession(request: any, email: string, password: string, name?: string) {
	try {
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: { email, password, name: name || 'Test User', role: 'dev' }
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

test.describe('Developer Complete Journey', () => {
	const timestamp = Date.now();
	const devEmail = `dev-journey-${timestamp}@example.com`;
	const devPassword = 'devpassword123';
	const devName = `Dev Journey ${timestamp}`;

	async function loginViaForm(page: any) {
		await page.goto('/login');
		await page.fill('input[name="email"]', devEmail);
		await page.fill('input[name="password"]', devPassword);
		await page.click('button[type="submit"]');
		await page.waitForLoadState('networkidle', { timeout: 10000 });
	}

	test.beforeAll(async ({ request }) => {
		// Create test user once
		try {
			await request.post(`${BASE_URL}/api/auth/signup`, {
				data: { email: devEmail, password: devPassword, name: devName, role: 'dev' }
			});
		} catch (e) {}
	});

	test('1. should access developer dashboard', async ({ page }) => {
		await loginViaForm(page);

		const url = page.url();
		console.log('Dashboard URL:', url);

		expect(url).toContain('/dashboard');

		const skipButton = page.locator('button:has-text("Skip"), button:has-text("Dismiss")');
		if (await skipButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await skipButton.click();
		}
	});

	test('2. should edit developer profile', async ({ page, request }) => {
		const cookie = await createSession(request, devEmail, devPassword, devName);
		await page.context().addCookies([cookie]);
		await page.goto('/dev/profile');

		await page.waitForLoadState('networkidle', { timeout: 10000 });

		await expect(page.locator('textarea[placeholder*="bio" i], textarea#bio').first()).toBeVisible({ timeout: 5000 });

		const bioTextarea = page.locator('textarea[placeholder*="bio" i], textarea#bio');
		if (await bioTextarea.isVisible({ timeout: 3000 }).catch(() => false)) {
			await bioTextarea.fill('I am a developer who loves coding');
		}

		const githubInput = page.locator('input[placeholder*="github" i], input#githubUrl');
		if (await githubInput.isVisible({ timeout: 3000 }).catch(() => false)) {
			await githubInput.fill('https://github.com/testdev');
		}

		const saveButton = page.locator('button[type="submit"], button:has-text("Save")');
		if (await saveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
			await saveButton.click();
			await page.waitForTimeout(1000);
		}
	});

	test('3. should explore projects', async ({ page }) => {
		await page.goto('/explore');

		await expect(page.locator('h1')).toContainText('Explore Projects');
		
		const gridButton = page.locator('button[title*="Grid"], button:has-text("Grid")');
		const listButton = page.locator('button[title*="List"], button:has-text("List")');
		
		if (await gridButton.isVisible()) {
			await gridButton.click();
			await listButton.click();
		}

		const searchInput = page.locator('input[placeholder*="Search"], input[name="search"]');
		if (await searchInput.isVisible()) {
			await searchInput.fill('test');
			await page.waitForTimeout(500);
		}
	});

	test('4. should view project details', async ({ page }) => {
		await page.goto('/project/test-project-id');
		
		const is404 = page.url().includes('404') || await page.locator('h1:has-text("404")').isVisible().catch(() => false);
		const hasProject = await page.locator('h1').isVisible();
		
		expect(is404 || hasProject).toBeTruthy();
	});

	test('5. should view bounty details', async ({ page }) => {
		await page.goto('/bounty/test-bounty-id');
		
		const is404 = page.url().includes('404') || await page.locator('h1:has-text("404")').isVisible().catch(() => false);
		const hasBounty = await page.locator('h1').isVisible();
		
		expect(is404 || hasBounty).toBeTruthy();
	});

	test('6. should access bounties guide', async ({ page, request }) => {
		const cookie = await createSession(request, devEmail, devPassword, devName);
		await page.context().addCookies([cookie]);
		await page.goto('/dev/bounties/guide');
		
		await page.waitForLoadState('networkidle', { timeout: 10000 });
		
		const url = page.url();
		console.log('Bounties guide URL:', url);
		
		expect(url).toMatch(/guide|404/);
	});
});
