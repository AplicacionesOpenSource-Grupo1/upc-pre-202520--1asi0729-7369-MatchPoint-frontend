import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserStats, Activity } from '../../domain/models/user.model';
import { ConfigService } from './config.service';

/**
 * Servicio para la gestión de usuarios y operaciones relacionadas
 * 
 * Proporciona métodos para:
 * - Obtener información del usuario actual
 * - Actualizar datos del usuario
 * - Gestionar estadísticas y actividades
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** Cliente HTTP para realizar peticiones a la API */
  private http = inject(HttpClient);
  /** Servicio de configuración */
  private configService = inject(ConfigService);

  /**
   * Obtiene la información del usuario actual
   * @returns {Observable<User>} Observable con los datos del usuario
   */
  getCurrentUser(): Observable<User> {
    const storedUser = localStorage.getItem('playmatch_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return this.http.get<User>(`${this.configService.getApiUrl('users')}/${user.id}`);
    }
    // Fallback or error if no user is logged in (though AuthGuard should prevent this)
    return new Observable(observer => {
      observer.error('No user logged in');
      observer.complete();
    });
  }

  /**
   * Obtiene la información de un usuario por su ID
   * @param {string} userId - ID del usuario
   * @returns {Observable<User>} Observable con los datos del usuario
   */
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.configService.getApiUrl('users')}/${userId}`);
  }

  /**
   * Actualiza los datos de un usuario específico
   * @param {string} userId - ID del usuario a actualizar
   * @param {Partial<User>} userData - Datos parciales del usuario a actualizar
   * @returns {Observable<User>} Observable con los datos actualizados del usuario
   */
  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.configService.getApiUrl('users')}/${userId}`, userData);
  }

  /**
   * Obtiene las estadísticas de un usuario específico
   * @param {string} userId - ID del usuario
   * @returns {Observable<UserStats>} Observable con las estadísticas del usuario
   * @todo Implementar endpoint real en la API
   */
  getUserStats(userId: string): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.configService.getApiUrl('users')}/${userId}/stats`);
  }

  /**
   * Obtiene las actividades recientes de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Observable<Activity[]>} Observable con el array de actividades
   * @todo Implementar endpoint real en la API
   */
  getUserActivities(userId: string): Observable<Activity[]> {
    // Mock activities since backend endpoint might not be ready
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'booking',
        title: 'activity.booking_created',
        description: 'activity.booking_desc_tennis',
        date: new Date(),
        icon: 'calendar'
      },
      {
        id: '2',
        type: 'match',
        title: 'activity.match_played',
        description: 'activity.match_desc_padel',
        date: new Date(Date.now() - 86400000),
        icon: 'trophy'
      },
      {
        id: '3',
        type: 'booking',
        title: 'activity.booking_created',
        description: 'activity.booking_desc_coach',
        date: new Date(Date.now() - 172800000),
        icon: 'user'
      }
    ];

    return new Observable(observer => {
      observer.next(mockActivities);
      observer.complete();
    });
    // return this.http.get<Activity[]>(`${this.configService.getApiUrl('users')}/${userId}/activities`);
  }
}
