import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { User } from '../../domain/models/user.model';
import { ConfigService } from './config.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  favoriteSpot: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Servicio para la gestión de autenticación
 * 
 * Proporciona métodos para:
 * - Iniciar sesión
 * - Registrar nuevos usuarios
 * - Gestionar el estado de autenticación
 * - Manejar tokens de sesión
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-01-06
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Cliente HTTP para realizar peticiones a la API */
  private http = inject(HttpClient);
  /** Router para navegación */
  private router = inject(Router);
  /** Servicio de configuración */
  private configService = inject(ConfigService);
  
  /** Subject para el estado de autenticación */
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  /** Observable público del usuario actual */
  public currentUser$ = this.currentUserSubject.asObservable();
  
  /** Signal para el estado de carga */
  isLoading = signal<boolean>(false);
  /** Signal para errores de autenticación */
  authError = signal<string | null>(null);

  constructor() {
    // Verificar si hay un usuario guardado en localStorage al inicializar
    this.checkStoredUser();
    
    // Auto-login en desarrollo si no hay usuario
    if (!this.configService.isProductionMode() && !this.isAuthenticated) {
      this.autoLoginForDevelopment();
    }
  }

  /**
   * Verifica si hay un usuario guardado en localStorage
   */
  private checkStoredUser(): void {
    const storedUser = localStorage.getItem('playmatch_user');
    const storedToken = localStorage.getItem('playmatch_token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        // Verificar que el token no haya expirado (opcional)
        const tokenExpiry = localStorage.getItem('playmatch_token_expiry');
        if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
          this.logout();
          return;
        }
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearStoredAuth();
      }
    }
  }

  /**
   * Limpia datos de autenticación del localStorage
   */
  private clearStoredAuth(): void {
    localStorage.removeItem('playmatch_user');
    localStorage.removeItem('playmatch_token');
    localStorage.removeItem('playmatch_token_expiry');
  }

  /**
   * Guarda datos de autenticación en localStorage
   */
  private saveAuthData(user: User, token: string): void {
    localStorage.setItem('playmatch_user', JSON.stringify(user));
    localStorage.setItem('playmatch_token', token);
    // Token expira en 7 días
    const expiry = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('playmatch_token_expiry', expiry.toString());
  }

  /**
   * Obtiene el usuario actual
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Inicia sesión con email y contraseña
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.authError.set(null);

    return this.http.get<User[]>(`${this.configService.getApiUrl('users')}`).pipe(
      map(users => {
        const user = users.find(u => 
          u.email === credentials.email && 
          (u as any).password === credentials.password
        );
        
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Simular token JWT
        const token = this.generateFakeToken(user);
        
        return { user, token };
      }),
      tap(response => {
        // Guardar usuario en localStorage usando el nuevo método
        this.saveAuthData(response.user, response.token);
        
        // Actualizar el subject
        this.currentUserSubject.next(response.user);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.authError.set('Credenciales inválidas');
        return throwError(() => error);
      })
    );
  }

  /**
   * Registra un nuevo usuario
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.authError.set(null);

    return this.http.get<User[]>(`${this.configService.getApiUrl('users')}`).pipe(
      switchMap(users => {
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
          throw new Error('Email already exists');
        }
        
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          favoriteSpot: userData.favoriteSpot,
          avatar: this.generateDefaultAvatar(userData.name)
        };

        return this.http.post<User>(`${this.configService.getApiUrl('users')}`, {
          ...newUser,
          password: userData.password
        }).pipe(
          map(createdUser => {
            const token = this.generateFakeToken(createdUser);
            return { user: createdUser, token };
          })
        );
      }),
      tap(response => {
        // Guardar usuario en localStorage usando el nuevo método
        this.saveAuthData(response.user, response.token);
        
        // Actualizar el subject
        this.currentUserSubject.next(response.user);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        if (error.message === 'Email already exists') {
          this.authError.set('El email ya está registrado');
        } else {
          this.authError.set('Error al registrar usuario');
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    this.clearStoredAuth();
    this.currentUserSubject.next(null);
    this.authError.set(null);
    
    // Redirigir al login después del logout
    this.router.navigate(['/login']);
  }

  /**
   * Genera un token falso para simular JWT
   */
  private generateFakeToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      sub: user.id, 
      email: user.email, 
      exp: Date.now() + 86400000 
    }));
    const signature = btoa('fake-signature');
    
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Genera un avatar por defecto basado en el nombre
   */
  private generateDefaultAvatar(name: string): string {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=0d47a1&color=fff`;
  }

  /**
   * Limpia los errores de autenticación
   */
  clearError(): void {
    this.authError.set(null);
  }

  /**
   * Auto-login para desarrollo con usuario mock
   */
  private autoLoginForDevelopment(): void {
    const mockUser: User = {
      id: '1',
      name: 'Juan Carlos',
      email: 'juan@example.com',
      phone: '+51 999 999 999',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKUsllfarh1Vz5TMSY9tQXvaO4PjgZQST2UfndXEB4asm1lrMgH1AOBj8iel5YRr8sjK-udLwcYVv87B65GOQBuCO06VCZgauA33eetg72EetdFnv3sJj_X3FrK4V-wNkU6_MjPGh-WdWq5ZaVRzZ9OkovDPzgEskotSpWMv8d6HkCUKvQCp7K',
      favoriteSpot: 'tennis'
    };
    
    const mockToken = 'dev-token-' + Date.now();
    this.saveAuthData(mockUser, mockToken);
    this.currentUserSubject.next(mockUser);
  }
}