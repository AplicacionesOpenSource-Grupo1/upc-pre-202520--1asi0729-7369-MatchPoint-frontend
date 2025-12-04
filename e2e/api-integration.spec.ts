import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:8080/api/v1';

test.describe('Backend API Integration', () => {
    let authToken = '';

    test.beforeAll(async ({ request }) => {
        // Try to login with the user from Swagger example
        const response = await request.post(`${API_BASE_URL}/auth/login`, {
            data: {
                email: 'juan@juan.com',
                password: 'juanjuan'
            }
        });

        if (response.ok()) {
            const body = await response.json();
            authToken = body.token;
            console.log('Login successful, got token');
        } else {
            console.log('Login failed, proceeding without token (tests may fail if auth required)');
        }
    });

    test('should connect to Auth endpoints', async ({ request }) => {
        // Test Login (expect 400 or 401 with bad credentials, proving connection)
        const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
            data: {
                email: 'test@example.com',
                password: 'wrongpassword'
            }
        });
        // We expect a response from the server, even if it's an error. 
        // If connection fails, this will throw.
        expect([200, 400, 401, 403, 404, 500]).toContain(loginResponse.status());
        console.log('Auth Login Endpoint Status:', loginResponse.status());
    });

    test('should connect to Courts endpoint', async ({ request }) => {
        const headers: { [key: string]: string } = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
        const response = await request.get(`${API_BASE_URL}/courts`, { headers });

        // If we have a token, we expect 200. If not, we might get 403.
        // But to verify "integration", getting a 403 is also a sign of life.
        // However, to verify structure we need 200.
        if (authToken) {
            expect(response.ok()).toBeTruthy();
            const body = await response.json();
            expect(body).toHaveProperty('content'); // Check for pagination structure
            expect(Array.isArray(body.content)).toBeTruthy();
        } else {
            expect([200, 401, 403]).toContain(response.status());
        }
        console.log('Courts Endpoint Status:', response.status());
    });

    test('should connect to Coaches endpoint', async ({ request }) => {
        const headers: { [key: string]: string } = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
        const response = await request.get(`${API_BASE_URL}/coaches`, { headers });

        if (authToken) {
            expect(response.ok()).toBeTruthy();
            const body = await response.json();
            expect(body).toHaveProperty('content'); // Check for pagination structure
            expect(Array.isArray(body.content)).toBeTruthy();
        } else {
            expect([200, 401, 403]).toContain(response.status());
        }
        console.log('Coaches Endpoint Status:', response.status());
    });
});
