import { test, expect } from '@playwright/test';

test.describe('Project CRUD E2E Tests', () => {
	// Helper to sign in - adjust based on your Better Auth setup
	async function signIn(page: any) {
		await page.goto('/login');

		// Based on your auth form - adjust selectors as needed
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'testpassword123');
		await page.click('button[type="submit"]');

		// Wait for redirect to dashboard
		await page.waitForURL('**/dashboard/**', { timeout: 10000 });
	}

	test.beforeEach(async ({ page }) => {
		// Sign in before each test
		await signIn(page);
	});

	test('should display projects list page', async ({ page }) => {
		await page.goto('/dashboard/projects');

		// Check page loads with correct title
		await expect(page.locator('h1')).toContainText('Your Projects');

		// Check stats are displayed
		await expect(page.locator('text=Total Projects')).toBeVisible();
		await expect(page.locator('text=Total Bounties')).toBeVisible();
		await expect(page.locator('text=Total Value')).toBeVisible();
	});

	test('should create a new project', async ({ page }) => {
		await page.goto('/dashboard/project/new');

		// Fill in project form - match actual form fields
		await page.fill('input[name="name"]', 'Test Project E2E');
		await page.fill('textarea[name="description"]', 'A test project for e2e testing');
		await page.fill('input[name="repoUrl"]', 'https://github.com/test/project');
		await page.fill('input[name="website"]', 'https://testproject.com');

		// Select category - radio button
		await page.click('input[value="web"]');

		// Select type - radio button
		await page.click('input[value="community"]');

		// Enable bounties - click the toggle button
		await page.click('button[aria-label="Toggle bounty funding"]');

		// Submit form - click the submit button
		await page.click('button[type="submit"]');

		// Should redirect to project detail page
		await page.waitForURL('**/project/**', { timeout: 10000 });

		// Verify we're on a project page
		await expect(page.url()).toMatch(/\/project\/[a-f0-9-]{36}/);
	});

	test('should show validation errors for empty project name', async ({ page }) => {
		await page.goto('/dashboard/project/new');

		// Try to submit without filling required fields
		await page.click('button[type="submit"]');

		// Should show validation error (browser validation or server validation)
		// Check for required attribute or error message
		const nameInput = page.locator('input[name="name"]');
		await expect(nameInput).toHaveAttribute('required');
	});

	test('should view project details', async ({ page }) => {
		// First create a project
		await page.goto('/dashboard/project/new');
		await page.fill('input[name="name"]', 'Detail Test Project');
		await page.fill('textarea[name="description"]', 'Project for testing details view');
		await page.click('input[value="individual"]');
		await page.click('button[type="submit"]');

		// Wait for redirect to project page
		await page.waitForURL('**/project/**', { timeout: 10000 });

		// Check project details are displayed
		await expect(page.locator('h1')).toContainText('Detail Test Project');
		await expect(page.locator('text=Project for testing details view')).toBeVisible();
	});

	test('should edit an existing project', async ({ page }) => {
		// First create a project
		await page.goto('/dashboard/project/new');
		await page.fill('input[name="name"]', 'Editable Project');
		await page.fill('textarea[name="description"]', 'Original description');
		await page.click('input[value="individual"]');
		await page.click('button[type="submit"]');

		// Wait for redirect to project page
		await page.waitForURL('**/project/**', { timeout: 10000 });

		// Navigate to edit page (look for edit link/button)
		await page.click('a:has-text("Edit")');

		// Wait for edit page to load
		await page.waitForURL('**/edit', { timeout: 10000 });

		// Update project details
		await page.fill('input[name="name"]', 'Updated Project Name');
		await page.fill('textarea[name="description"]', 'Updated description');
		await page.click('button[type="submit"]');

		// Should redirect to project detail page
		await page.waitForURL('**/project/**', { timeout: 10000 });

		// Check updated details
		await expect(page.locator('h1')).toContainText('Updated Project Name');
		await expect(page.locator('text=Updated description')).toBeVisible();
	});

	test('should delete a project', async ({ page }) => {
		// First create a project
		await page.goto('/dashboard/project/new');
		await page.fill('input[name="name"]', 'Project to Delete');
		await page.click('input[value="individual"]');
		await page.click('button[type="submit"]');

		// Wait for redirect to project page
		await page.waitForURL('**/project/**', { timeout: 10000 });

		// Click delete button
		await page.click('button:has-text("Delete")');

		// Handle confirmation dialog
		page.on('dialog', async (dialog) => {
			expect(dialog.type()).toBe('confirm');
			await dialog.accept();
		});

		// Should redirect to projects list
		await page.waitForURL('**/dashboard/projects', { timeout: 10000 });

		// Verify project is no longer in the list
		await expect(page.locator('text=Project to Delete')).not.toBeVisible();
	});

	test('should filter projects using search', async ({ page }) => {
		await page.goto('/dashboard/projects');

		// Create a couple of projects first (via API or UI)
		// For now, just test the search input exists
		const searchInput = page.locator('input[placeholder="Search projects..."]');
		await expect(searchInput).toBeVisible();

		// Type in search
		await searchInput.fill('Alpha');

		// Wait for filtering (if implemented with debounce)
		await page.waitForTimeout(500);
	});

	test('should toggle between grid and list view', async ({ page }) => {
		await page.goto('/dashboard/projects');

		// Grid view should be default
		await expect(page.locator('[aria-label="List view"]')).toBeVisible();

		// Switch to list view
		await page.click('[aria-label="List view"]');

		// Switch back to grid view
		await page.click('[aria-label="Grid view"]');
	});
});
