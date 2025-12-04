import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
    test('should redirect unauthenticated user to login when accessing dashboard', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL('/login');
    });

    test('should allow access to public pages', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveURL('/login');

        await page.goto('/register');
        await expect(page).toHaveURL('/register');
    });

    test('should navigate to search courts from dashboard', async ({ page }) => {
        // Login first
        await page.route('**/api/auth/login', async route => {
            await route.fulfill({ json: { user: { id: '1' }, token: 'token' } });
        });
        // Mock dashboard dependencies
        await page.route('**/api/users/1', async route => { await route.fulfill({ json: { id: '1', name: 'User' } }); });
        await page.route('**/api/users/1/stats', async route => { await route.fulfill({ json: {} }); });
        await page.route('**/api/users/1/activities', async route => { await route.fulfill({ json: [] }); });
        await page.route('**/api/bookings', async route => { await route.fulfill({ json: [] }); });

        await page.goto('/login');
        await page.fill('input[formControlName="email"]', 'test@example.com');
        await page.fill('input[formControlName="password"]', 'password');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');

        // Click on Find Court (assuming there's a button or link)
        // Adjust selector based on actual UI
        await page.click('text=Find a Court');
        await expect(page).toHaveURL('/search-courts');
    });
});
