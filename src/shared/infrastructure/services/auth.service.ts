import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { User } from '../../domain/models/user.model';
import { ConfigService } from './config.service';
import { UserService } from './user.service';

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
  token: string;
  type: string;
  userId: string;
  email: string;
  name: string;
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
  /** Servicio de usuarios para obtener detalles completos */
  private userService = inject(UserService);

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
  }

  /**
   * Verifica si hay un usuario guardado en localStorage
   */
  private checkStoredUser(): void {
    const storedUser = localStorage.getItem('playmatch_user');
    const storedToken = localStorage.getItem('playmatch_token');

    if (storedUser && storedToken) {
      // Limpiar tokens de desarrollo antiguos
      if (storedToken.startsWith('dev-token-')) {
        this.clearStoredAuth();
        return;
      }

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

    return this.http.post<AuthResponse>(`${this.configService.getApiUrl('auth')}/login`, credentials).pipe(
      tap(response => {
        // Guardar token temporalmente para permitir la llamada a getUserById
        localStorage.setItem('playmatch_token', response.token);
      }),
      switchMap(response => {
        // Obtener perfil completo del usuario
        return this.userService.getUserById(response.userId).pipe(
          map(user => ({ authResponse: response, user }))
        );
      }),
      tap(({ authResponse, user }) => {
        this.saveAuthData(user, authResponse.token);
        this.currentUserSubject.next(user);
        this.isLoading.set(false);
      }),
      map(({ authResponse }) => authResponse),
      catchError(error => {
        this.isLoading.set(false);
        this.authError.set('Credenciales inválidas');
        // Limpiar token si falló la obtención del usuario
        localStorage.removeItem('playmatch_token');
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

    return this.http.post<AuthResponse>(`${this.configService.getApiUrl('auth')}/register`, userData).pipe(
      tap(response => {
        localStorage.setItem('playmatch_token', response.token);
      }),
      switchMap(response => {
        return this.userService.getUserById(response.userId).pipe(
          map(user => ({ authResponse: response, user }))
        );
      }),
      tap(({ authResponse, user }) => {
        this.saveAuthData(user, authResponse.token);
        this.currentUserSubject.next(user);
        this.isLoading.set(false);
      }),
      map(({ authResponse }) => authResponse),
      catchError(error => {
        this.isLoading.set(false);
        localStorage.removeItem('playmatch_token');
        if (error.status === 409) {
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
   * Limpia los errores de autenticación
   */
  clearError(): void {
    this.authError.set(null);
  }
}