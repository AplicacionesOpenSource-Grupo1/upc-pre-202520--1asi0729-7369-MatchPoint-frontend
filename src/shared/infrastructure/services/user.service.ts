import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserStats, Activity } from '../../domain/models/user.model';

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
  /** URL base de la API para operaciones de usuarios */
  private readonly apiUrl = 'http://localhost:3001';

  /**
   * Obtiene la información del usuario actual
   * @returns {Observable<User>} Observable con los datos del usuario
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/1`);
  }

  /**
   * Actualiza los datos de un usuario específico
   * @param {string} userId - ID del usuario a actualizar
   * @param {Partial<User>} userData - Datos parciales del usuario a actualizar
   * @returns {Observable<User>} Observable con los datos actualizados del usuario
   */
  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData);
  }

  /**
   * Obtiene las estadísticas de un usuario específico
   * @param {string} userId - ID del usuario
   * @returns {Observable<UserStats>} Observable con las estadísticas del usuario
   * @todo Implementar endpoint real en la API
   */
  getUserStats(userId: string): Observable<UserStats> {
    // For now, return mock stats since we don't have a dedicated endpoint
    return new Observable(observer => {
      observer.next({
        totalBookings: 25,
        hoursPlayed: 32,
        favoriteSport: 'Tennis'
      });
      observer.complete();
    });
  }

  /**
   * Obtiene las actividades recientes de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Observable<Activity[]>} Observable con el array de actividades
   * @todo Implementar endpoint real en la API
   */
  getUserActivities(userId: string): Observable<Activity[]> {
    // For now, return mock activities since we don't have a dedicated endpoint
    return new Observable(observer => {
      observer.next([
        {
          id: '1',
          type: 'booking',
          title: 'Booking Confirmation',
          description: 'Booked a tennis court at Central Park Courts',
          date: new Date(),
          icon: 'check'
        },
        {
          id: '2',
          type: 'match',
          title: 'Match Completed',
          description: 'Played a tennis match at Central Park Courts',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          icon: 'play'
        }
      ]);
      observer.complete();
    });
  }
}
