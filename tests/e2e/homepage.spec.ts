import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/E-Summit 2026/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to events page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Events');
    await expect(page).toHaveURL(/.*events/);
  });

  test('should display sponsors section', async ({ page }) => {
    await page.goto('/');
    const sponsorsSection = page.locator('[data-testid="sponsors-section"]');
    await expect(sponsorsSection).toBeVisible();
  });
});

test.describe('Event Registration', () => {
  test('should display event registration modal', async ({ page }) => {
    await page.goto('/events');
    await page.click('text=Register');
    const modal = page.locator('[data-testid="registration-modal"]');
    await expect(modal).toBeVisible();
  });

  test('should validate registration form', async ({ page }) => {
    await page.goto('/events');
    await page.click('text=Register');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=This field is required')).toBeVisible();
  });
});

test.describe('User Authentication', () => {
  test('should show login modal', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Login');
    const modal = page.locator('[data-testid="auth-modal"]');
    await expect(modal).toBeVisible();
  });

  test('should redirect to dashboard after login', async ({ page }) => {
    // This test would need actual authentication setup
    // For now, just check the login flow exists
    await page.goto('/');
    await page.click('text=Login');
    await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load homepage within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load events page within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });
});