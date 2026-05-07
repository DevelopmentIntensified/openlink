import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

async function loginViaForm(page: any, email: string, password: string) {
	await page.goto('/login');
	await page.fill('input[name="email"]', email);
	await page.fill('input[name="password"]', password);
	await page.click('button[type="submit"]');
	await page.waitForLoadState('networkidle', { timeout: 10000 });
}

test.describe('Developer Journey - Simplified', () => {
	const timestamp = Date.now();
	const devEmail = `dev-simple-${timestamp}@example.com`;
	const devPassword = 'devpassword123';

	test.beforeAll(async ({ request }) => {
		// Create test user via API
		await request.post(`${BASE_URL}/api/auth/signup`, {
			data: { email: devEmail, password: devPassword, name: 'Dev Simple', role: 'dev' }
		});
	});

	test('1. should access developer dashboard with session', async ({ page }) => {
		await loginViaForm(page, devEmail, devPassword);

		const url = page.url();
		console.log('Dashboard URL:', url);
		expect(url).toMatch(/dashboard|onboarding/);
	});

	test('2. should view explore page', async ({ page }) => {
		await page.goto('/explore');
		await expect(page.locator('h1')).toContainText('Explore Projects');
	});
});
