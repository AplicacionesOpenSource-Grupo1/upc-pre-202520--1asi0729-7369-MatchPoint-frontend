import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../../infrastructure/services/auth.service';
import { SeoService } from '../../../infrastructure/services/seo.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';

describe('LoginComponent', () => {
    let component: Login;
    let fixture: ComponentFixture<Login>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let seoServiceSpy: jasmine.SpyObj<SeoService>;

    beforeEach(async () => {
        const aSpy = jasmine.createSpyObj('AuthService', ['login', 'clearError'], {
            isLoading: signal(false),
            authError: signal(null)
        });
        const rSpy = jasmine.createSpyObj('Router', ['navigate']);
        const sSpy = jasmine.createSpyObj('SeoService', ['updateSeoTags']);

        await TestBed.configureTestingModule({
            imports: [Login, TranslateModule.forRoot(), ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: aSpy },
                { provide: Router, useValue: rSpy },
                { provide: SeoService, useValue: sSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        seoServiceSpy = TestBed.inject(SeoService) as jasmine.SpyObj<SeoService>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form', () => {
        expect(component.loginForm).toBeDefined();
        expect(component.loginForm.get('email')).toBeDefined();
        expect(component.loginForm.get('password')).toBeDefined();
    });

    it('should mark form as invalid when empty', () => {
        expect(component.loginForm.valid).toBeFalsy();
    });

    it('should call authService.login when form is valid', () => {
        component.loginForm.controls['email'].setValue('test@example.com');
        component.loginForm.controls['password'].setValue('password123');

        const mockResponse = { user: { id: '1', name: 'Test', email: 'test@example.com' } as any, token: 'token' };
        authServiceSpy.login.and.returnValue(of(mockResponse));

        component.onSubmit();

        expect(authServiceSpy.login).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should not call authService.login when form is invalid', () => {
        component.onSubmit();
        expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should toggle password visibility', () => {
        expect(component.showPassword()).toBeFalse();
        component.togglePasswordVisibility();
        expect(component.showPassword()).toBeTrue();
    });
});
