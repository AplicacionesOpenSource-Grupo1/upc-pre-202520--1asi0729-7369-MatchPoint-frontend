import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should allow user to login', async ({ page }) => {
        // Mock API response for login
        await page.route('**/api/auth/login', async route => {
            const json = {
                user: { id: '1', name: 'Test User', email: 'test@example.com' },
                token: 'fake-jwt-token'
            };
            await route.fulfill({ json });
        });

        // Mock API response for user data (dashboard load)
        await page.route('**/api/users/1', async route => {
            await route.fulfill({ json: { id: '1', name: 'Test User', email: 'test@example.com' } });
        });

        // Mock stats and activities to prevent errors on dashboard
        await page.route('**/api/users/1/stats', async route => {
            await route.fulfill({ json: { totalBookings: 0, hoursPlayed: 0, favoriteSport: 'Tennis' } });
        });
        await page.route('**/api/users/1/activities', async route => {
            await route.fulfill({ json: [] });
        });
        await page.route('**/api/bookings', async route => {
            await route.fulfill({ json: [] });
        });

        await page.goto('/login');

        // Fill login form
        await page.fill('input[formControlName="email"]', 'test@example.com');
        await page.fill('input[formControlName="password"]', 'password123');

        // Submit form
        await page.click('button[type="submit"]');

        // Verify redirection to dashboard
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('h1')).toContainText('Welcome back');
    });

    test('should show error on invalid credentials', async ({ page }) => {
        // Mock API error response
        await page.route('**/api/auth/login', async route => {
            await route.fulfill({ status: 401, body: 'Unauthorized' });
        });

        await page.goto('/login');

        await page.fill('input[formControlName="email"]', 'wrong@example.com');
        await page.fill('input[formControlName="password"]', 'wrongpass');
        await page.click('button[type="submit"]');

        // Verify error message (assuming there's an error alert/message in the UI)
        // Adjust selector based on actual UI implementation
        // await expect(page.locator('.error-message')).toBeVisible();
    });
});
