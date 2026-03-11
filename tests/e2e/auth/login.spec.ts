import { test, expect } from '@playwright/test';
import { createTestUser } from '../../utils/test-user';

test.describe('Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'OpenLink' })).toBeVisible();
  });

  test('login page has GitHub and Google buttons', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /github/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /google/i })).toBeVisible();
  });

  test('redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /openlink/i })).toBeVisible();
  });

  test('explore page loads', async ({ page }) => {
    await page.goto('/explore');
    await expect(page.locator('h1')).toContainText('Explore');
  });
});
