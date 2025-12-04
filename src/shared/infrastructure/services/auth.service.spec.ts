import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerSpy: jasmine.SpyObj<Router>;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    beforeEach(() => {
        const rSpy = jasmine.createSpyObj('Router', ['navigate']);
        const cSpy = jasmine.createSpyObj('ConfigService', ['getApiUrl', 'isProductionMode']);
        cSpy.getApiUrl.and.returnValue('http://localhost:3000/api');
        cSpy.isProductionMode.and.returnValue(false);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: Router, useValue: rSpy },
                { provide: ConfigService, useValue: cSpy }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login successfully', () => {
        const mockResponse = {
            user: { id: '1', name: 'Test User', email: 'test@example.com', phone: '123', favoriteSpot: 'tennis' },
            token: 'fake-jwt-token'
        };

        service.login({ email: 'test@example.com', password: 'password' }).subscribe(response => {
            expect(response.user.email).toBe('test@example.com');
            expect(response.token).toBe('fake-jwt-token');
            expect(service.currentUser).toEqual(mockResponse.user);
        });

        const req = httpMock.expectOne('http://localhost:3000/api/login');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('should handle login error', () => {
        service.login({ email: 'wrong@example.com', password: 'wrong' }).subscribe({
            error: (error) => {
                expect(service.authError()).toBe('Credenciales inválidas');
            }
        });

        const req = httpMock.expectOne('http://localhost:3000/api/login');
        req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should register successfully', () => {
        const mockResponse = {
            user: { id: '1', name: 'New User', email: 'new@example.com', phone: '123', favoriteSpot: 'padel' },
            token: 'new-token'
        };

        service.register({
            name: 'New User',
            email: 'new@example.com',
            password: 'password',
            phone: '123',
            favoriteSpot: 'padel'
        }).subscribe(response => {
            expect(response.user.name).toBe('New User');
        });

        const req = httpMock.expectOne('http://localhost:3000/api/register');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('should logout and navigate to login', () => {
        service.logout();
        expect(service.currentUser).toBeNull();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        expect(localStorage.getItem('playmatch_token')).toBeNull();
    });
});
