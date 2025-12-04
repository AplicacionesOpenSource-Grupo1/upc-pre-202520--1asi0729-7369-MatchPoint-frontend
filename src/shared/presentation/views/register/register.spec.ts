import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../../../infrastructure/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';

describe('RegisterComponent', () => {
    let component: Register;
    let fixture: ComponentFixture<Register>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const aSpy = jasmine.createSpyObj('AuthService', ['register', 'clearError'], {
            isLoading: signal(false),
            authError: signal(null)
        });
        const rSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [Register, TranslateModule.forRoot(), ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: aSpy },
                { provide: Router, useValue: rSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Register);
        component = fixture.componentInstance;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form', () => {
        expect(component.registerForm).toBeDefined();
        expect(component.registerForm.get('name')).toBeDefined();
        expect(component.registerForm.get('email')).toBeDefined();
    });

    it('should validate password mismatch', () => {
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue('password456');
        expect(component.registerForm.errors?.['passwordMismatch']).toBeTruthy();

        component.registerForm.controls['confirmPassword'].setValue('password123');
        expect(component.registerForm.errors).toBeNull();
    });

    it('should call authService.register when form is valid', fakeAsync(() => {
        component.registerForm.controls['name'].setValue('Test User');
        component.registerForm.controls['email'].setValue('test@example.com');
        component.registerForm.controls['password'].setValue('password123');
        component.registerForm.controls['confirmPassword'].setValue('password123');
        component.registerForm.controls['phone'].setValue('1234567890');
        component.registerForm.controls['favoriteSpot'].setValue('tennis');
        component.registerForm.controls['acceptTerms'].setValue(true);

        const mockResponse = { user: { id: '1', name: 'Test', email: 'test@example.com' } as any, token: 'token' };
        authServiceSpy.register.and.returnValue(of(mockResponse));

        component.onSubmit();

        expect(authServiceSpy.register).toHaveBeenCalled();

        tick(2000); // Wait for setTimeout
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));
});
