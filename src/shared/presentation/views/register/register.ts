import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService, RegisterRequest } from '../../../infrastructure/services/auth.service';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  
  isLoading = this.authService.isLoading;
  authError = this.authService.authError;
  
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  sportsOptions = [
    { value: 'tennis', label: 'auth.register.tennis' },
    { value: 'padel', label: 'auth.register.padel' }
  ];

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      favoriteSpot: ['tennis', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData: RegisterRequest = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone,
        favoriteSpot: this.registerForm.value.favoriteSpot
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.successMessage.set('auth.register.success');
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasPasswordMismatchError(): boolean {
    return !!(this.registerForm.errors?.['passwordMismatch'] && 
             this.registerForm.get('confirmPassword')?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        switch (fieldName) {
          case 'name': return 'auth.register.error.name-required';
          case 'email': return 'auth.register.error.email-required';
          case 'password': return 'auth.register.error.password-required';
          case 'confirmPassword': return 'auth.register.error.confirm-password-required';
          case 'phone': return 'auth.register.error.phone-required';
          case 'favoriteSpot': return 'auth.register.error.favorite-sport-required';
          default: return '';
        }
      }
      if (field.errors['email']) {
        return 'auth.register.error.email-invalid';
      }
      if (field.errors['minlength']) {
        return fieldName === 'name' ? 'auth.register.error.name-required' : 'auth.register.error.password-required';
      }
      if (field.errors['pattern'] && fieldName === 'phone') {
        return 'auth.register.error.phone-invalid';
      }
      if (field.errors['requiredTrue'] && fieldName === 'acceptTerms') {
        return 'auth.register.error.terms-required';
      }
    }
    return '';
  }

  clearError(): void {
    this.authService.clearError();
  }

  clearSuccess(): void {
    this.successMessage.set(null);
  }
}