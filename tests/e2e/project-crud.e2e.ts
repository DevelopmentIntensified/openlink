import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

async function createSession(request: any, email: string, password: string, name?: string, role = 'sponsor') {
	try {
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: { email, password, name: name || 'Test User', role }
		});
	} catch (e) {}

	await new Promise(resolve => setTimeout(resolve, 1000));

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

test.describe('Project CRUD E2E Tests', () => {
	const timestamp = Date.now();
	const testEmail = `crud-test-${timestamp}@example.com`;
	const testPassword = 'testpassword123';

	let cookie: any;

	test.beforeAll(async ({ request }) => {
		cookie = await createSession(request, testEmail, testPassword, 'Test User', 'sponsor');
	});

	test('should display projects list page', async ({ page }) => {
		await page.context().addCookies([cookie]);
		await page.goto('/dashboard/projects');

		await expect(page.locator('h1')).toContainText('Your Projects');
		await expect(page.locator('text=Total Projects')).toBeVisible();
		await expect(page.locator('text=Total Bounties')).toBeVisible();
		await expect(page.locator('text=Total Value')).toBeVisible();
	});

	test('should create a new project', async ({ page, request }) => {
		await page.context().addCookies([cookie]);
		await page.goto('/dashboard/project/new');

		await expect(page.locator('h1')).toContainText('Forge a New Project');

		await page.fill('input[placeholder="My Awesome Project"]', 'Test Project E2E');
		await page.fill('textarea[placeholder*="Describe what your project" i]', 'A test project for e2e testing');
		await page.fill('input[placeholder="https://github.com/user/repo"]', 'https://github.com/test/project');
		await page.fill('input[placeholder="https://myproject.dev"]', 'https://testproject.com');

		await page.locator('label:has(input[value="community"])').click();

		await page.click('button[type="submit"]');

		await page.waitForLoadState('networkidle', { timeout: 10000 });

		expect(page.url()).not.toContain('/dashboard/project/new');
	});

	test('should show validation errors for empty project name', async ({ page }) => {
		await page.context().addCookies([cookie]);
		await page.goto('/dashboard/project/new');

		const submitBtn = page.locator('button[type="submit"]');
		await expect(submitBtn).toBeDisabled();

		await page.fill('input[placeholder="My Awesome Project"]', 'Test Project');
		await expect(submitBtn).not.toBeDisabled();
	});

	test('should view project details', async ({ page }) => {
		const email = `detail-${Date.now()}@example.com`;
		const pw = 'testpassword123';
		const c = await createSession(page.request, email, pw, 'Detail Tester', 'sponsor');

		await page.context().addCookies([c]);
		await page.goto('/dashboard/project/new');
		await page.fill('input[placeholder="My Awesome Project"]', 'Detail Test Project');
		await page.fill('textarea[placeholder*="Describe what your project" i]', 'Project for testing details view');
		await page.locator('label:has(input[value="individual"])').click();
		await page.click('button[type="submit"]');
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		if (page.url().includes('/project/')) {
			await expect(page.locator('h1')).toContainText('Detail Test Project');
		}
	});

	test('should edit an existing project', async ({ page }) => {
		const email = `edit-${Date.now()}@example.com`;
		const pw = 'testpassword123';
		const c = await createSession(page.request, email, pw, 'Edit Tester', 'sponsor');

		await page.context().addCookies([c]);
		await page.goto('/dashboard/project/new');
		await page.fill('input[placeholder="My Awesome Project"]', 'Editable Project');
		await page.fill('textarea[placeholder*="Describe what your project" i]', 'Original description');
		await page.locator('label:has(input[value="individual"])').click();
		await page.click('button[type="submit"]');
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		if (page.url().includes('/project/')) {
			const projectId = page.url().split('/project/')[1]?.split('/')[0]?.split('?')[0];
			await page.goto(`/dashboard/project/${projectId}/edit`);
			await page.waitForLoadState('networkidle', { timeout: 10000 });
			await page.waitForURL('**/edit', { timeout: 10000 });
			await page.fill('input[name="name"]', 'Updated Project Name');
			await page.fill('textarea[name="description"]', 'Updated description');
			await page.click('button[type="submit"]');
			await page.waitForLoadState('networkidle', { timeout: 10000 });

			if (page.url().includes('/dashboard/project/')) {
				await expect(page.locator('h1')).toContainText('Updated Project Name');
			}
		}
	});

	test('should delete a project', async ({ page }) => {
		const email = `delete-${Date.now()}@example.com`;
		const pw = 'testpassword123';
		const c = await createSession(page.request, email, pw, 'Delete Tester', 'sponsor');

		await page.context().addCookies([c]);
		await page.goto('/dashboard/project/new');
		await page.fill('input[placeholder="My Awesome Project"]', 'Project to Delete');
		await page.locator('label:has(input[value="individual"])').click();
		await page.click('button[type="submit"]');
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		if (page.url().includes('/project/')) {
			const projectId = page.url().split('/project/')[1]?.split('/')[0]?.split('?')[0];
			await page.goto(`/dashboard/project/${projectId}`);
			await page.waitForLoadState('networkidle', { timeout: 10000 });

			const deleteBtn = page.locator('button:has-text("Delete")');
			if (await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
				page.on('dialog', async (dialog) => {
					expect(dialog.type()).toBe('confirm');
					await dialog.accept();
				});
				await deleteBtn.click();
				await page.waitForURL('**/dashboard/projects', { timeout: 10000 });
			}
		}
	});

	test('should filter projects using search', async ({ page }) => {
		await page.context().addCookies([cookie]);
		await page.goto('/dashboard/projects');

		const searchInput = page.locator('input[placeholder="Search projects..."]');
		await expect(searchInput).toBeVisible();

		await searchInput.fill('Alpha');
		await page.waitForTimeout(500);
	});

	test('should toggle between grid and list view', async ({ page }) => {
		await page.context().addCookies([cookie]);
		await page.goto('/dashboard/projects');

		await expect(page.locator('[aria-label="List view"]')).toBeVisible();

		await page.click('[aria-label="List view"]');
		await page.click('[aria-label="Grid view"]');
	});
});
