import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have default config values', () => {
        const config = service.get();
        expect(config).toBeDefined();
        expect(config.appName).toBe('PlayMatch');
        expect(config.appVersion).toBe('1.0.0');
    });

    it('should return correct API URL', () => {
        // Mock window location or env vars if needed, but for now test default behavior
        const url = service.getApiUrl();
        expect(url).toBeDefined();
        expect(url).toContain('http'); // Should be http in test environment (localhost)
    });

    it('should append endpoint to API URL', () => {
        const url = service.getApiUrl('users');
        expect(url).toMatch(/\/users$/);
    });

    it('should handle leading slash in endpoint', () => {
        const url = service.getApiUrl('/users');
        expect(url).toMatch(/\/users$/);
        expect(url).not.toContain('//users');
    });
});
