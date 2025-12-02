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
    
    // No auto-login by default; rely on real auth API
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
    // Call real authentication endpoint
    const payload: any = {
      // backend may accept username or email; try both (frontend uses email field)
      username: credentials.email,
      password: credentials.password
    };

    return this.http.post<any>(`${this.configService.getApiUrl('authentication/sign-in')}`, payload, { withCredentials: true }).pipe(
      map(resp => {
        const token = resp.token || resp.accessToken || '';
        if (!token) throw new Error('No token returned from authentication endpoint');

        const user: User = {
          id: resp.id ? String(resp.id) : (resp.user?.id ? String(resp.user.id) : ''),
          name: resp.username || resp.user?.name || credentials.email,
          email: resp.email || credentials.email,
          phone: resp.phone || '',
          avatar: resp.avatar || this.generateDefaultAvatar(resp.username || credentials.email),
          favoriteSpot: resp.favoriteSpot || ''
        };

        return { user, token } as AuthResponse;
      }),
      tap(response => {
        this.saveAuthData(response.user, response.token);
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
    // Use backend sign-up endpoint
    const payload: any = {
      username: userData.name || userData.email,
      password: userData.password,
      email: userData.email
    };

    return this.http.post<any>(`${this.configService.getApiUrl('authentication/sign-up')}`, payload, { withCredentials: true }).pipe(
      map(resp => {
        const token = resp.token || resp.accessToken || '';
        const user: User = {
          id: resp.id ? String(resp.id) : (resp.user?.id ? String(resp.user.id) : ''),
          name: resp.username || resp.user?.name || payload.username,
          email: resp.email || payload.email,
          phone: resp.phone || '',
          avatar: resp.avatar || this.generateDefaultAvatar(payload.username),
          favoriteSpot: ''
        };
        return { user, token };
      }),
      tap(response => {
        this.saveAuthData(response.user, response.token);
        this.currentUserSubject.next(response.user);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.authError.set('Error al registrar usuario');
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
    // Deprecated: tokens now come from backend
    return '';
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
    // removed auto-login for development; rely on real authentication
  }
}