import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { User } from '../../domain/models/user.model';

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
  /** URL base de la API para operaciones de autenticación */
  private readonly apiUrl = 'http://localhost:3001';
  
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
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
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

    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
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
        // Guardar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        
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

    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
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

        return this.http.post<User>(`${this.apiUrl}/users`, {
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
        // Guardar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        
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
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
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
}