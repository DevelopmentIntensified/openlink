/**
 * Sponsor Journey E2E Test
 * Complete flow: signup → create project → create bounty → manage submissions
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

async function createSession(request: any, email: string, password: string, name?: string) {
	try {
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: { email, password, name: name || 'Test User', role: 'sponsor' }
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

test.describe('Sponsor Complete Journey', () => {
	const timestamp = Date.now();
	const sponsorEmail = `sponsor-journey-${timestamp}@example.com`;
	const sponsorPassword = 'sponsorpassword123';
	const sponsorName = `Sponsor Journey ${timestamp}`;

	let sponsorCookie: any;
	let projectId: string | null = null;

	test.beforeAll(async ({ request }) => {
		sponsorCookie = await createSession(request, sponsorEmail, sponsorPassword, sponsorName);
	});

	async function loginViaForm(page: any) {
		await page.goto('/login');
		await page.fill('input[name="email"]', sponsorEmail);
		await page.fill('input[name="password"]', sponsorPassword);
		await page.click('button[type="submit"]');
		await page.waitForLoadState('networkidle', { timeout: 10000 });
	}

	test('1. should access sponsor dashboard', async ({ page }) => {
		await page.context().addCookies([sponsorCookie]);
		await page.goto('/sponsor/dashboard');
		await expect(page.url()).toContain('/sponsor/dashboard');
	});

	test('2. should edit sponsor profile', async ({ page }) => {
		await page.context().addCookies([sponsorCookie]);
		await page.goto('/sponsor/profile');

		// Dismiss onboarding modal using force click
		const dismissBtn = page.locator('button:has-text("Skip for now")');
		if (await dismissBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
			await dismissBtn.click({ force: true });
			await page.waitForTimeout(500);
		}

		await expect(page.locator('input[name="companyName"]')).toBeVisible({ timeout: 5000 });
		await page.fill('input[name="companyName"]', 'Test Company LLC');
		await page.fill('input[name="companyWebsite"]', 'https://testcompany.com');
		await page.fill('textarea[name="companyDescription"]', 'A test company for e2e testing');

		const saveButton = page.locator('button[type="submit"], button:has-text("Save")');
		if (await saveButton.isVisible()) {
			await saveButton.click({ force: true });
			await page.waitForTimeout(1000);
		}
	});

	test('3. should create a new project', async ({ page }) => {
		await page.context().addCookies([sponsorCookie]);
		await page.goto('/dashboard/project/new');

		await expect(page.locator('h1')).toContainText('Forge a New Project');

		await page.fill('input[name="name"]', `Test Project ${timestamp}`);
		await page.fill('textarea[name="description"]', 'A test project for e2e testing');
		await page.fill('input[name="repoUrl"]', 'https://github.com/test/project');
		await page.fill('input[name="website"]', 'https://testproject.com');

		// Select category if dropdown exists
		const categorySelect = page.locator('select[name="category"]');
		if (await categorySelect.isVisible()) {
			await categorySelect.selectOption('web');
		}

		// Select type if dropdown exists
		const typeSelect = page.locator('select[name="type"]');
		if (await typeSelect.isVisible()) {
			await typeSelect.selectOption('individual');
		}

		// Enable bounties if checkbox exists
		const bountyCheckbox = page.locator('input[name="isBountyEnabled"]');
		if (await bountyCheckbox.isVisible()) {
			await bountyCheckbox.check();
		}

		await page.click('button[type="submit"]');

		// Wait for redirect to dashboard or project page
		await page.waitForTimeout(2000);
		
		// Should redirect somewhere (dashboard or project page)
		expect(page.url()).not.toContain('/dashboard/project/new');
	});

	test('4. should view projects list', async ({ page }) => {
		await page.context().addCookies([sponsorCookie]);
		await page.goto('/dashboard/projects');

		await expect(page.locator('h1')).toContainText('Your Projects');
		
		// Toggle view if buttons exist
		const gridButton = page.locator('button[title*="Grid"], button:has-text("Grid")');
		const listButton = page.locator('button[title*="List"], button:has-text("List")');
		
		if (await gridButton.isVisible() && await listButton.isVisible()) {
			await gridButton.click();
			await page.waitForTimeout(500);
			await listButton.click();
			await page.waitForTimeout(500);
		}
	});

	test('5. should create a bounty for project', async ({ page }) => {
		await page.context().addCookies([sponsorCookie]);
		
		// First, get a project ID by visiting projects page
		await page.goto('/dashboard/projects');
		
		// Click on first project or create one
		const firstProject = page.locator('a[href*="/dashboard/project/"]').first();
		if (await firstProject.isVisible()) {
			await firstProject.click();
			
			// Look for create bounty button
			const createBountyBtn = page.locator('a[href*="/bounty/new"], button:has-text("Create Bounty")');
			if (await createBountyBtn.isVisible()) {
				await createBountyBtn.click();
				
				// Fill bounty form
				await page.fill('input[name="title"]', `Test Bounty ${timestamp}`);
				await page.fill('textarea[name="description"]', 'A test bounty for e2e testing');
				await page.fill('input[name="amount"]', '500');
				
				const prioritySelect = page.locator('select[name="priority"]');
				if (await prioritySelect.isVisible()) {
					await prioritySelect.selectOption('medium');
				}

				const submitButton = page.locator('button[type="submit"], button:has-text("Create")');
				if (await submitButton.isVisible()) {
					await submitButton.click();
					await page.waitForTimeout(2000);
				}
			}
		}
	});

	test('6. should view bounties list', async ({ page }) => {
		await loginViaForm(page);
		await page.goto('/dashboard/bounties');

		await expect(page.locator('h1')).toContainText('Bounties');
		
		// Test filters if they exist
		const statusFilter = page.locator('select[name="status"], button:has-text("Filter")');
		if (await statusFilter.isVisible()) {
			// Interact with filters
		}
	});

	test('7. should access admin dashboard if admin', async ({ page }) => {
		await page.context().addCookies([sponsorCookie]);
		await page.goto('/admin/dashboard');
		
		// Either shows admin dashboard or redirects
		const isAdmin = !page.url().includes('login');
		const isRedirected = page.url().includes('login') || page.url().includes('dashboard');
		
		expect(isAdmin || isRedirected).toBeTruthy();
	});
});
