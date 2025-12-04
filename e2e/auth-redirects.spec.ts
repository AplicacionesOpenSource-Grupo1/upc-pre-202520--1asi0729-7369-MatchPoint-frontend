import { test, expect } from '@playwright/test';

test.describe('Authentication Redirects', () => {

    test('should redirect to login if no token is present when accessing dashboard', async ({ page }) => {
        // 1. Clear any existing state
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());

        // 2. Try to access protected route
        await page.goto('/dashboard');

        // 3. Verify redirect to login
        await expect(page).toHaveURL(/\/login/);
        console.log('Redirected to login as expected');
    });

    test('should redirect to dashboard if valid token is present when accessing login', async ({ page }) => {
        // 1. Simulate authenticated state
        await page.goto('/'); // Go to base url first to set localstorage
        await page.evaluate(() => {
            const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
            const futureDate = new Date().getTime() + 1000000;
            localStorage.setItem('playmatch_user', JSON.stringify(mockUser));
            localStorage.setItem('playmatch_token', 'valid-token');
            localStorage.setItem('playmatch_token_expiry', futureDate.toString());
        });

        // 2. Try to access public guest route
        await page.goto('/login');

        // 3. Verify redirect to dashboard
        await expect(page).toHaveURL(/\/dashboard/);
        console.log('Redirected to dashboard as expected');
    });

    test('should redirect to login if token is expired', async ({ page }) => {
        // 1. Simulate expired state
        await page.goto('/');
        await page.evaluate(() => {
            const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
            const pastDate = new Date().getTime() - 1000000; // Past date
            localStorage.setItem('playmatch_user', JSON.stringify(mockUser));
            localStorage.setItem('playmatch_token', 'expired-token');
            localStorage.setItem('playmatch_token_expiry', pastDate.toString());
        });

        // 2. Try to access protected route
        await page.goto('/dashboard');

        // 3. Verify redirect to login (AuthService should catch expiry and logout)
        await expect(page).toHaveURL(/\/login/);
        console.log('Redirected to login due to expired token');
    });

});
